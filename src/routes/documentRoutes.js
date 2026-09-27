const express = require('express');
const { uploadDocument, listDocuments, getDocument, deleteDocument, searchUploadedDocuments, analyzeUploadedDocument } = require('../controllers/documentController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();
router.use(protect);
router.post('/', upload.single('file'), uploadDocument);
router.get('/', listDocuments);
router.get('/search', searchUploadedDocuments);
router.post('/:id/analyze', analyzeUploadedDocument);
router.get('/:id', getDocument);
router.delete('/:id', deleteDocument);
module.exports = router;