const mongoose = require('mongoose');

const embeddingSchema = new mongoose.Schema(
  {
    document: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', required: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    chunkIndex: { type: Number, required: true },
    text: { type: String, required: true },
    vector: { type: [Number], required: true },
    model: { type: String, required: true },
  },
  { timestamps: true }
);

embeddingSchema.index({ document: 1, chunkIndex: 1 }, { unique: true });
module.exports = mongoose.model('Embedding', embeddingSchema, 'embeddings');