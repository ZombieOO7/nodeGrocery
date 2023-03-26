const express = require('express');
const router = express.Router();
const Multer = require('multer');
const categoryRoutes = require('./category.route');
const BannerRoutes = require('./banner.route');
const ProductRoutes = require('./product.route');
const subCategoryRoutes = require('./subcategory.route');
const GlobalAuthClass = require('../../../modules/middleware/auth');
const AdminController = require('../controllers/admin.controller');

router.post('/logIn',GlobalAuthClass.initialAuthenticate,AdminController.logIn)
// router.post('/changePassword',GlobalAuthClass.adminAuthenticate,AdminController.changePassword)
/* CATEGORY MANAGEMENT */
router.use('/',categoryRoutes);
/* SUB CATEGORY MANAGEMENT */
router.use('/subcategory',subCategoryRoutes);
/* Banner routes */
router.use('/banner',BannerRoutes);
/* Prouduct routes */
router.use('/product',ProductRoutes);

module.exports = router;
