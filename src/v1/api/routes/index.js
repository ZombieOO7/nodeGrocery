const express = require('express');
const router = express.Router()
const GlobalAuthClass = require('../../../modules/middleware/auth');
const userRoutes = require('../../api/routes/user');
const CommonController = require('../controllers/CommonController');

/* user routes */
router.use('/user', userRoutes);
/* banner list */
router.post('/banner-list',GlobalAuthClass.passportAuthenticate,CommonController.getBannerList);
/* category list */
router.post('/category-list',GlobalAuthClass.passportAuthenticate,CommonController.getCategoryList);
/* sub category list */
router.post('/sub-category-list',CommonController.getSubCategoryList);
/* product list */
router.post('/product-list',CommonController.getProductList);

module.exports = router