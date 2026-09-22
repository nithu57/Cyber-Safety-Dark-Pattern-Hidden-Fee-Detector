const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');
const {
  getAdminReports,
  verifyReport,
  rejectReport,
  deleteSpamReport,
  deleteComment
} = require('../controllers/adminController');

router.use(protect);
router.use(adminOnly);

router.get('/reports', getAdminReports);
router.put('/reports/:id/verify', verifyReport);
router.put('/reports/:id/reject', rejectReport);
router.delete('/reports/:id', deleteSpamReport);
router.delete('/comments/:id', deleteComment);

module.exports = router;
