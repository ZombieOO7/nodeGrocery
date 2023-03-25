const express = require('express');
const router = express.Router();
const GlobalAuthClass = require('../../../modules/middleware/auth');
const BannerController = require('../controllers/BannerController');

const Multer = require('multer')
const storage = Multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "storage/banner");
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
router.post('/list', GlobalAuthClass.adminAuthenticate, BannerController.index);
router.post('/create', GlobalAuthClass.adminAuthenticate, upload.single('image'), BannerController.store);
router.post('/detail', GlobalAuthClass.adminAuthenticate, BannerController.detail);
router.post('/delete', GlobalAuthClass.adminAuthenticate, BannerController.delete);
module.exports = router;