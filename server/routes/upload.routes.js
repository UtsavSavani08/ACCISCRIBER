const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload.controller');
const upload = require('../utils/multer.config');

// Handle file upload
router.post('/', upload.single('file'), uploadController.uploadFile);

module.exports = router;