const express = require('express');
const { getWorkoutRecommendation, getFitnessInsights, chat, semanticSearch, summarize, generateContent, getChats, deleteChat } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);
router.post('/workout-recommendation', getWorkoutRecommendation);
router.post('/fitness-insights', getFitnessInsights);
router.post('/chat', chat);
router.post('/semantic-search', semanticSearch);
router.post('/summarize', summarize);
router.post('/content-generator', generateContent);
router.get('/chats', getChats);
router.delete('/chats/:id', deleteChat);
module.exports = router;