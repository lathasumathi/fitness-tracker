const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const embeddingModel = process.env.GEMINI_EMBEDDING_MODEL || 'gemini-embedding-001';

const clip = (text, max = 12000) => {
  const value = String(text || '');
  return value.length > max ? `${value.slice(0, max)}...` : value;
};

const responseText = (response) => {
  if (typeof response?.text === 'string' && response.text.trim()) return response.text.trim();
  const parts = response?.candidates?.[0]?.content?.parts || [];
  return parts.map((part) => part.text || '').join('').trim();
};

const generateText = async (prompt) => {
  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL,
    contents: prompt,
  });
  const text = responseText(response);
  if (!text) throw new Error('Gemini returned an empty response');
  return text;
};

const generateEmbedding = async (text, taskType) => {
  if (!String(text || '').trim()) throw new Error('Cannot create an embedding for empty text');
  const config = {};
  if (embeddingModel === 'gemini-embedding-001' && taskType) config.taskType = taskType;
  const response = await ai.models.embedContent({
    model: embeddingModel,
    contents: String(text),
    ...(Object.keys(config).length ? { config } : {}),
  });
  const values = response?.embeddings?.[0]?.values || response?.embedding?.values;
  if (!Array.isArray(values) || values.length === 0) throw new Error('Gemini returned an empty embedding');
  return values;
};

const generateWorkoutRecommendation = async (age, fitnessGoal, experience) => {
  try {
    return await generateText(`Generate a personalized workout recommendation for a person with the following details:
- Age: ${age}
- Fitness Goal: ${fitnessGoal}
- Experience Level: ${experience}

Keep the recommendation practical, safe, direct, and concise. Do not include greetings, markdown bold, or bullet points.`);
  } catch (error) {
    console.error('Gemini Recommendation Error:', error.message);
    throw new Error('Failed to generate workout recommendation from Gemini AI');
  }
};

const generateFitnessInsights = async (totalWorkouts, averageDuration, totalCaloriesBurned) => {
  try {
    return await generateText(`Analyze this user's fitness progress and generate a highly personalized, encouraging fitness insight:
- Total Workouts Logged: ${totalWorkouts}
- Average Workout Duration: ${averageDuration} minutes
- Total Calories Burned: ${totalCaloriesBurned} kcal

Keep the insight actionable and concise. Do not include greetings, markdown bold, or bullet points.`);
  } catch (error) {
    console.error('Gemini Insights Error:', error.message);
    throw new Error('Failed to generate fitness insights from Gemini AI');
  }
};

const answerWithContext = async (question, context) => generateText(`Answer the user's question using only the context below when it is relevant. If the context does not contain the answer, say so clearly.

Context:
${clip(context, 10000)}

Question: ${clip(question, 4000)}`);

const summarizeText = async (text) => {
  try {
    return await generateText(`Summarize the following content in clear, concise language. Preserve important facts and fitness guidance.

Content:
${clip(text)}`);
  } catch (error) {
    console.error('Gemini Summary Error:', error.message);
    throw new Error('Failed to generate summary from Gemini AI');
  }
};

const generateContent = async ({ topic, contentType, tone }) => {
  try {
    return await generateText(`Create a ${tone || 'clear and practical'} ${contentType || 'fitness'} piece of content about ${topic || 'general fitness'}. Keep it useful, safe, and easy to follow.`);
  } catch (error) {
    console.error('Gemini Content Error:', error.message);
    throw new Error('Failed to generate content from Gemini AI');
  }
};

const analyzeDocument = async (title, content) => {
  try {
    return await generateText(`Analyze the uploaded document "${clip(title, 200)}". Provide a concise summary, key fitness topics, and practical recommendations. Do not invent information that is not supported by the document.

Document:
${clip(content)}`);
  } catch (error) {
    console.error('Gemini Document Analysis Error:', error.message);
    throw new Error('Failed to analyze document with Gemini AI');
  }
};

module.exports = {
  generateText,
  generateEmbedding,
  generateWorkoutRecommendation,
  generateFitnessInsights,
  answerWithContext,
  summarizeText,
  generateContent,
  analyzeDocument,
  embeddingModel,
};