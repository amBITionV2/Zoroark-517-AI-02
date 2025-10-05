import express from 'express';
import * as transcriptController from '../controllers/transcriptController.js';

const router = express.Router();

// @route   POST /api/transcript/save
// @desc    Save interview transcript to MongoDB
// @access  Public
router.post('/save', transcriptController.saveTranscript);

// @route   GET /api/transcript/all
// @desc    Get all transcripts (without full conversation data)
// @access  Public
router.get('/all', transcriptController.getAllTranscripts);

// @route   GET /api/transcript/:id
// @desc    Get single transcript by ID (with full data)
// @access  Public
router.get('/:id', transcriptController.getTranscriptById);

// @route   PUT /api/transcript/:id
// @desc    Update existing transcript (for real-time updates)
// @access  Public
router.put('/:id', transcriptController.updateTranscript);

// @route   DELETE /api/transcript/:id
// @desc    Delete transcript by ID
// @access  Public
router.delete('/:id', transcriptController.deleteTranscript);

export default router;