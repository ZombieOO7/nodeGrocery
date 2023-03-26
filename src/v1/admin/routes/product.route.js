const express = require('express');
const router = express.Router();
const GlobalAuthClass = require('../../../modules/middleware/auth');
const ProudctController = require('../controllers/ProductController');

const Multer = require('multer')
const storage = Multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "storage/product");
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
router.post('/list', GlobalAuthClass.adminAuthenticate, ProudctController.index);
router.post('/create', GlobalAuthClass.adminAuthenticate, upload.array('image'), ProudctController.store);
router.post('/detail', GlobalAuthClass.adminAuthenticate, ProudctController.detail);
router.post('/delete', GlobalAuthClass.adminAuthenticate, ProudctController.delete);
module.exports = router;