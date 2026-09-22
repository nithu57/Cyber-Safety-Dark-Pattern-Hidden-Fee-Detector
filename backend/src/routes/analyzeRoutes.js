const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { analyzeWebsite } = require('../controllers/analyzeController');

router.post('/', upload.single('screenshot'), analyzeWebsite);

module.exports = router;
