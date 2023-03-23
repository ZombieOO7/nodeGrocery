const express = require('express');
const router = express.Router();
const Multer = require('multer');
const categoryRoutes = require('./category.route');
const subCategoryRoutes = require('./subcategory.route');
const GlobalAuthClass = require('../../../modules/middleware/auth');
const AdminController = require('../controllers/admin.controller');

router.post('/logIn',GlobalAuthClass.initialAuthenticate,AdminController.logIn)
// router.post('/changePassword',GlobalAuthClass.adminAuthenticate,AdminController.changePassword)
/* CATEGORY MANAGEMENT */
router.use('/',categoryRoutes);
/* SUB CATEGORY MANAGEMENT */
router.use('/subcategory',subCategoryRoutes);

module.exports = router;
