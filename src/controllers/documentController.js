const Document = require('../models/Document');
const { createDocumentEmbeddings, searchDocuments, removeDocumentData } = require('../services/retrievalService');
const { analyzeDocument } = require('../services/geminiService');
const { logActivity } = require('../services/activityService');

const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: 'Please attach a supported text file' });
    const title = String(req.body.title || req.file.originalname).trim();
    const content = req.file.buffer.toString('utf8');
    if (!content.trim()) return res.status(400).json({ success: false, error: 'The uploaded file must contain text' });
    const document = await Document.create({ title, content, originalName: req.file.originalname, mimeType: req.file.mimetype, size: req.file.size, uploadedBy: req.user._id, embeddingStatus: 'pending' });
    let embeddingCount = 0;
    try { embeddingCount = await createDocumentEmbeddings(document, req.user._id); } catch (error) { document.embeddingStatus = 'failed'; await document.save(); console.error('Embedding creation failed:', error.message); }
    await logActivity({ user: req.user, action: 'document_upload', resourceType: 'document', resourceId: document._id, metadata: { embeddingCount, embeddingStatus: document.embeddingStatus } });
    res.status(201).json({ success: true, data: document, embeddingCount, embeddingStatus: document.embeddingStatus });
  } catch (error) { next(error); }
};

const listDocuments = async (req, res, next) => {
  try { const filter = req.user.role === 'admin' ? {} : { uploadedBy: req.user._id }; const documents = await Document.find(filter).select('-content').sort({ createdAt: -1 }); res.status(200).json({ success: true, count: documents.length, data: documents }); } catch (error) { next(error); }
};

const getDocument = async (req, res, next) => {
  try { const document = await Document.findById(req.params.id); if (!document || (req.user.role !== 'admin' && document.uploadedBy.toString() !== req.user._id.toString())) return res.status(404).json({ success: false, error: 'Document not found' }); res.status(200).json({ success: true, data: document }); } catch (error) { next(error); }
};

const deleteDocument = async (req, res, next) => {
  try { const document = await Document.findById(req.params.id); if (!document || (req.user.role !== 'admin' && document.uploadedBy.toString() !== req.user._id.toString())) return res.status(404).json({ success: false, error: 'Document not found' }); await removeDocumentData(document._id); await logActivity({ user: req.user, action: 'document_delete', resourceType: 'document', resourceId: document._id }); res.status(200).json({ success: true, message: 'Document removed successfully' }); } catch (error) { next(error); }
};

const searchUploadedDocuments = async (req, res, next) => {
  try { const query = String(req.query.q || '').trim(); if (!query) return res.status(400).json({ success: false, error: 'Please provide a search term using q' }); const result = await searchDocuments(query, req.user._id, 20); res.status(200).json({ success: true, mode: result.mode, count: result.results.length, data: result.results }); } catch (error) { next(error); }
};

const analyzeUploadedDocument = async (req, res, next) => {
  try { const document = await Document.findById(req.params.id); if (!document || (req.user.role !== 'admin' && document.uploadedBy.toString() !== req.user._id.toString())) return res.status(404).json({ success: false, error: 'Document not found' }); const analysis = await analyzeDocument(document.title, document.content); await logActivity({ user: req.user, action: 'document_analysis', resourceType: 'document', resourceId: document._id }); res.status(200).json({ success: true, documentId: document._id, analysis }); } catch (error) { next(error); }
};

module.exports = { uploadDocument, listDocuments, getDocument, deleteDocument, searchUploadedDocuments, analyzeUploadedDocument };