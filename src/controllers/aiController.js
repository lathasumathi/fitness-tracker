const geminiService = require('../services/geminiService');
const retrievalService = require('../services/retrievalService');
const Chat = require('../models/Chat');
const { logActivity } = require('../services/activityService');

const getWorkoutRecommendation = async (req, res, next) => {
  try {
    const { age, fitnessGoal, experience } = req.body;
    if (age === undefined || !fitnessGoal || !experience) return res.status(400).json({ success: false, error: 'Please provide age, fitnessGoal, and experience' });
    const recommendation = await geminiService.generateWorkoutRecommendation(age, fitnessGoal, experience);
    await logActivity({ user: req.user, action: 'ai_recommendation', resourceType: 'ai' });
    res.status(200).json({ recommendation });
  } catch (error) { next(error); }
};

const getFitnessInsights = async (req, res, next) => {
  try {
    const { totalWorkouts, averageDuration, totalCaloriesBurned } = req.body;
    if (totalWorkouts === undefined || averageDuration === undefined || totalCaloriesBurned === undefined) return res.status(400).json({ success: false, error: 'Please provide totalWorkouts, averageDuration, and totalCaloriesBurned' });
    const insight = await geminiService.generateFitnessInsights(totalWorkouts, averageDuration, totalCaloriesBurned);
    await logActivity({ user: req.user, action: 'ai_insights', resourceType: 'ai' });
    res.status(200).json({ insight });
  } catch (error) { next(error); }
};

const chat = async (req, res, next) => {
  try {
    const message = String(req.body.message || '').trim();
    if (!message) return res.status(400).json({ success: false, error: 'Please provide a message' });
    const search = await retrievalService.semanticSearch(message, req.user._id, 5);
    const context = search.results.map((item) => `[${item.title || 'Uploaded document'} - chunk ${item.chunkIndex}]\n${item.text}`).join('\n\n');
    const response = context ? await geminiService.answerWithContext(message, context) : await geminiService.generateText(message);
    const saved = await Chat.create({ user: req.user._id, message, response, mode: context ? 'rag' : 'general', sources: search.results.map((item) => ({ document: item.documentId, chunkIndex: item.chunkIndex, score: item.score })) });
    await logActivity({ user: req.user, action: 'ai_chat', resourceType: 'chat', resourceId: saved._id, metadata: { retrievalMode: search.mode } });
    res.status(200).json({ answer: response, mode: saved.mode, sources: search.results, chatId: saved._id });
  } catch (error) { next(error); }
};

const semanticSearch = async (req, res, next) => {
  try {
    const query = String(req.body.query || '').trim();
    if (!query) return res.status(400).json({ success: false, error: 'Please provide a search query' });
    const result = await retrievalService.semanticSearch(query, req.user._id, Math.min(Number(req.body.limit) || 6, 20));
    await logActivity({ user: req.user, action: 'semantic_search', resourceType: 'search', metadata: { mode: result.mode } });
    res.status(200).json({ ...result, count: result.results.length });
  } catch (error) { next(error); }
};

const summarize = async (req, res, next) => {
  try {
    const text = String(req.body.text || '').trim();
    if (!text) return res.status(400).json({ success: false, error: 'Please provide text to summarize' });
    const summary = await geminiService.summarizeText(text);
    await logActivity({ user: req.user, action: 'ai_summarize', resourceType: 'ai' });
    res.status(200).json({ summary });
  } catch (error) { next(error); }
};

const generateContent = async (req, res, next) => {
  try {
    const { topic, contentType, tone } = req.body;
    if (!topic) return res.status(400).json({ success: false, error: 'Please provide a topic' });
    const content = await geminiService.generateContent({ topic, contentType, tone });
    await logActivity({ user: req.user, action: 'ai_content_generation', resourceType: 'ai' });
    res.status(200).json({ content });
  } catch (error) { next(error); }
};

const getChats = async (req, res, next) => {
  try {
    const chats = await Chat.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50);
    res.status(200).json({ success: true, count: chats.length, data: chats });
  } catch (error) { next(error); }
};

const deleteChat = async (req, res, next) => {
  try {
    const chat = await Chat.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!chat) return res.status(404).json({ success: false, error: 'Chat not found' });
    res.status(200).json({ success: true, message: 'Chat removed successfully' });
  } catch (error) { next(error); }
};

module.exports = { getWorkoutRecommendation, getFitnessInsights, chat, semanticSearch, summarize, generateContent, getChats, deleteChat };