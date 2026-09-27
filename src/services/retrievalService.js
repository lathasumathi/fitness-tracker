const mongoose = require('mongoose');
const Document = require('../models/Document');
const Embedding = require('../models/Embedding');
const { generateEmbedding, embeddingModel } = require('./geminiService');

const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const clip = (value, max = 12000) => (value.length > max ? `${value.slice(0, max)}...` : value);
const objectId = (value) => new mongoose.Types.ObjectId(String(value));

const chunkText = (text, size = 1200) => {
  const paragraphs = String(text || '').replace(/\r\n/g, '\n').split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean);
  const chunks = [];
  let current = '';
  for (const paragraph of paragraphs.length ? paragraphs : [String(text || '')]) {
    if (!current) current = paragraph;
    else if (`${current}\n\n${paragraph}`.length <= size) current += `\n\n${paragraph}`;
    else { chunks.push(current); current = paragraph; }
  }
  if (current) chunks.push(current);
  return chunks.length ? chunks : [' '];
};

const cosineSimilarity = (a, b) => {
  const length = Math.min(a.length, b.length);
  let dot = 0; let left = 0; let right = 0;
  for (let i = 0; i < length; i += 1) { dot += a[i] * b[i]; left += a[i] * a[i]; right += b[i] * b[i]; }
  return left && right ? dot / (Math.sqrt(left) * Math.sqrt(right)) : 0;
};

const createDocumentEmbeddings = async (document, userId) => {
  const chunks = chunkText(document.content);
  const records = [];
  for (let index = 0; index < chunks.length; index += 1) {
    const vector = await generateEmbedding(chunks[index], 'RETRIEVAL_DOCUMENT');
    records.push({ document: document._id, user: userId, chunkIndex: index, text: chunks[index], vector, model: embeddingModel });
  }
  await Embedding.deleteMany({ document: document._id });
  await Embedding.insertMany(records);
  document.embeddingStatus = 'completed';
  await document.save();
  return records.length;
};

const keywordSearch = async (query, userId, limit = 10) => {
  const results = await Embedding.find({ user: userId, text: { $regex: escapeRegex(query), $options: 'i' } })
    .sort({ createdAt: -1 }).limit(limit).populate('document', 'title originalName mimeType');
  return results.map((item) => ({ documentId: item.document?._id, title: item.document?.title, originalName: item.document?.originalName, chunkIndex: item.chunkIndex, text: item.text, score: null }));
};

const localVectorSearch = async (queryVector, userId, limit) => {
  const records = await Embedding.find({ user: userId }).populate('document', 'title originalName mimeType');
  return records.map((item) => ({ documentId: item.document?._id, title: item.document?.title, originalName: item.document?.originalName, chunkIndex: item.chunkIndex, text: item.text, score: cosineSimilarity(queryVector, item.vector) }))
    .sort((a, b) => b.score - a.score).slice(0, limit);
};

const semanticSearch = async (query, userId, limit = 6) => {
  const queryVector = await generateEmbedding(query, 'RETRIEVAL_QUERY');
  const index = process.env.MONGO_VECTOR_INDEX || 'document_vector_index';
  try {
    const results = await Embedding.aggregate([
      { $vectorSearch: { index, path: 'vector', queryVector, numCandidates: 100, limit, filter: { user: objectId(userId) } } },
      { $addFields: { score: { $meta: 'vectorSearchScore' } } },
      { $lookup: { from: 'documents', localField: 'document', foreignField: '_id', as: 'document' } },
      { $unwind: '$document' },
      { $project: { documentId: '$document._id', title: '$document.title', originalName: '$document.originalName', chunkIndex: 1, text: 1, score: 1 } },
    ]);
    if (results.length) return { mode: 'atlas-vector-search', results };
  } catch (error) {
    console.warn('Atlas Vector Search unavailable; using local fallback:', error.message);
  }
  return { mode: 'local-cosine-fallback', results: await localVectorSearch(queryVector, userId, limit) };
};

const atlasSearch = async (query, userId, limit = 10) => {
  const index = process.env.MONGO_SEARCH_INDEX || 'document_search_index';
  try {
    const results = await Document.aggregate([
      { $search: { index, text: { query, path: ['title', 'content'] }, filter: { uploadedBy: objectId(userId) } } },
      { $limit: limit },
      { $project: { documentId: '$_id', title: 1, originalName: 1, mimeType: 1, score: { $meta: 'searchScore' }, text: { $substrBytes: ['$content', 0, 800] }, chunkIndex: null } },
    ]);
    if (results.length) return { mode: 'atlas-search', results };
  } catch (error) {
    console.warn('Atlas Search unavailable; using keyword fallback:', error.message);
  }
  return { mode: 'keyword-fallback', results: await keywordSearch(query, userId, limit) };
};

const searchDocuments = async (query, userId, limit = 10) => atlasSearch(query, userId, limit);
const removeDocumentData = async (documentId) => { await Embedding.deleteMany({ document: documentId }); await Document.deleteOne({ _id: documentId }); };

module.exports = { chunkText, cosineSimilarity, createDocumentEmbeddings, keywordSearch, semanticSearch, atlasSearch, searchDocuments, removeDocumentData, clip };