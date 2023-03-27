const CategoryService = require('../../services/CategoryService');
const SubCategoryService = require('../../services/SubCategoryService');
const ProductService = require('../../services/ProductService');
const BannerService = require('../../services/BannerService');
const responseHelper = require('../resources/response');
const validator = require('../../../modules/validators/api');

class CommonController {
	async removeEmptyParams(body, type = null) {
		Object.keys(body).forEach(function (key) {
			var val = body[key];
			if (val == "") {
				if (type != null) {
					body[key] = null;
				} else {
					delete body[key];
				}
			}
		});
		return body;
	}
	async getCategoryList(req, res) {
		try {
			let list = await CategoryService.list(req.body);
			responseHelper.success(res, 'SUCCESS', list)
		} catch (error) {
			console.log('error ======>', error)
			responseHelper.error(res, error.message, error.code || 500);
		}
	}
	async getSubCategoryList(req,res){
		try {
			await validator.subCategoryValidation(req.body);
      let list = await SubCategoryService.list(req.body);
      responseHelper.success(res, 'SUCCESS', list)
    } catch (error) {
      console.log('error ======>', error)
      responseHelper.error(res, error.message, error.code || 500);
    }
	}
	async getProductList(req,res){
		try {
			await validator.productListValidation(req.body);
      let list = await ProductService.list(req.body);
      responseHelper.success(res, 'SUCCESS', list)
    } catch (error) {
      console.log('error ======>', error)
      responseHelper.error(res, error.message, error.code || 500);
    }
	}
	async getBannerList(req,res){
		try {
			// await validator.productListValidation(req.body);
      let list = await BannerService.list(req.body);
      responseHelper.success(res, 'SUCCESS', list)
    } catch (error) {
      console.log('error ======>', error)
      responseHelper.error(res, error.message, error.code || 500);
    }
	}
}

module.exports = new CommonController();
