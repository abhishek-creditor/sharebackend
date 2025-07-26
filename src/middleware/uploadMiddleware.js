const multer = require('multer');
const cloudinary = require('../config/cloudinaryConfig');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { errorResponse } = require('../utils/apiResponse');
const messages = require('../utils/messages');

// Create Cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'profile_images',
        allowed_formats: ['jpg', 'jpeg', 'png'],
        transformation: [
            { width: 500, height: 500, crop: 'limit' },
            { quality: 'auto' }
        ]
    }
});

// Create file filter
const fileFilter = (req, file, cb) => {
    // Accept only images
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

// Create upload middleware
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
}).single('file'); // Changed from 'image' to 'file'

// Error handling middleware
const handleError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return errorResponse(req, res, 400, messages.FILE_SIZE_TOO_LARGE);
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return errorResponse(req, res, 400, messages.PLEASE_UPLOAD_IMAGE_FILE);
        }
        return errorResponse(req, res, 400, messages.FILE_UPLOAD_ERROR);
    }
    return errorResponse(req, res, 400, err.message);
};

// Wrapper middleware to handle file upload
const uploadMiddleware = (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            return handleError(err, req, res, next);
        }
        // Only check for file if type is 'image'
        if (req.body.type === 'image' && !req.file) {
            return errorResponse(req, res, 400, 'Please provide an image file');
        }
        next();
    });
};

module.exports = {
    uploadMiddleware,
    handleError
};
