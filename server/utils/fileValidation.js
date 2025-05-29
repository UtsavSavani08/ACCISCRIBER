const validateFileType = (file) => {
    const allowedTypes = [
        'audio/mpeg',        // MP3
        'audio/wav',         // WAV
        'audio/m4a',         // M4A
        'video/mp4',         // MP4
        'video/quicktime',   // MOV
        'video/x-msvideo'    // AVI
    ];

    if (!allowedTypes.includes(file.mimetype)) {
        return {
            isValid: false,
            message: 'Invalid file type. Only MP3, WAV, M4A, MP4, MOV, and AVI files are allowed.'
        };
    }

    return { isValid: true };
};

module.exports = {
    validateFileType
};