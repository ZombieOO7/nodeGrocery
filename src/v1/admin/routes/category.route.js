const express = require('express');
const router = express.Router();
const GlobalAuthClass = require('../../../modules/middleware/auth');
const CategoryController = require('../controllers/CategoryController');

const Multer = require('multer')
const storage = Multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "storage/category");
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split("/")[1];
        cb(null, `${Date.now()}.${ext}`);
    },
    limits: {
        fileSize: 2 * 1024 * 1024 // 1000000 Bytes = 1 MB
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg)$/)) {
            // upload only png and jpg format
            const error = new Error('Please upload valid jpg or png file.')
            error.code = 400;
            return cb(error)
        }
        cb(undefined, true)
    }
});

var upload = Multer({
    storage: storage,
});
router.post('/getCategoryListings', GlobalAuthClass.adminAuthenticate, CategoryController.index);
router.post('/categoryManagement', GlobalAuthClass.adminAuthenticate, upload.single('image'), CategoryController.store);
router.post('/getCategorybyId', GlobalAuthClass.adminAuthenticate, CategoryController.detail);
router.post('/deleteCategory', GlobalAuthClass.adminAuthenticate, CategoryController.delete);
module.exports = router;