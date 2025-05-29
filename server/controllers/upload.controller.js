const path = require('path');
const { validateFileType } = require('../utils/fileValidation');
const FormData = require('form-data');
const fetch = require('node-fetch');

const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const fileValidation = validateFileType(req.file);
        if (!fileValidation.isValid) {
            return res.status(400).json({ message: fileValidation.message });
        }

        // Determine if it's an audio or video file
        const isVideo = req.file.mimetype.startsWith('video/');
        const endpoint = isVideo ? 'video' : 'audio';

        // Create form data for FastAPI request
        const formData = new FormData();
        formData.append('file', req.file.buffer, {
            filename: req.file.originalname,
            contentType: req.file.mimetype
        });

        // Send to FastAPI service
        const response = await fetch(`http://localhost:8000/analyze/${endpoint}/transcribe`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to process file');
        }

        const result = await response.json();
        res.status(200).json({
            message: 'File processed successfully',
            data: result.data
        });

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ 
            message: 'Error processing file', 
            error: error.message 
        });
    }
};

module.exports = {
    uploadFile
};