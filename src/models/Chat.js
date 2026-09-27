const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    message: { type: String, required: true },
    response: { type: String, required: true },
    mode: { type: String, enum: ['rag', 'general'], default: 'rag' },
    sources: [
      {
        document: { type: mongoose.Schema.Types.ObjectId, ref: 'Document' },
        chunkIndex: Number,
        score: Number,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Chat', chatSchema, 'chats');