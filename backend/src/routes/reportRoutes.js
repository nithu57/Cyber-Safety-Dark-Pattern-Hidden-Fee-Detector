const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect, optionalAuth } = require('../middleware/auth');
const {
  getReports,
  searchReports,
  getReportById,
  createReport,
  updateReport,
  deleteReport,
  voteReport,
  getComments,
  addComment
} = require('../controllers/reportController');

router.get('/search', searchReports);
router.get('/', getReports);
router.post('/', upload.single('screenshot'), optionalAuth, createReport);

router.get('/:id', optionalAuth, getReportById);
router.put('/:id', protect, updateReport);
router.delete('/:id', protect, deleteReport);

router.post('/:id/vote', protect, voteReport);
router.get('/:id/comments', getComments);
router.post('/:id/comments', protect, addComment);

module.exports = router;
