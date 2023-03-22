const express = require('express');
const router = express.Router();
const Multer = require('multer');
const categoryRoutes = require('./category.route');
const GlobalAuthClass = require('../../../modules/middleware/auth');
const AdminController = require('../controllers/admin.controller');

router.post('/logIn',GlobalAuthClass.initialAuthenticate,AdminController.logIn)
// router.post('/changePassword',GlobalAuthClass.adminAuthenticate,AdminController.changePassword)
/* CATEGORY MANAGEMENT */
router.use('/',categoryRoutes);

module.exports = router;
