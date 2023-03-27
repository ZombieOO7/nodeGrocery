const AdminValidator = require('../../../modules/validators/admin');
const ProductService = require('../../services/ProductService')
const responseHelper = require('../resources/response');

class ProductController {
  async index(req, res) {
    try {
      let list = await ProductService.list(req.body);
      responseHelper.success(res, 'SUCCESS', list)
    } catch (error) {
      console.log('error ======>', error)
      responseHelper.error(res, error.message, error.code || 500);
    }
  }
  async store(req, res) {
    try {
      await AdminValidator.productStoreValidation(req.body);
      let product = await ProductService.store(req);
      responseHelper.success(res, 'SUCCESS', product);
    } catch (error) {
      console.log('error ======>', error)
      responseHelper.error(res, error.message, error.code || 500);
    }
  }
  async detail(req, res) {
    try {
      await AdminValidator.validateGetDetail(req.body);
      let category = await ProductService.detail(req.body._id);
      responseHelper.success(res, 'SUCCESS', category)
    } catch (error) {
      console.log('error ======>', error)
      responseHelper.error(res, error.message, error.code || 500);
    }
  }
  async delete(req,res){
    try {
      await AdminValidator.validateGetDetail(req.body);
      let category = await ProductService.delete(req.body._id);
      responseHelper.success(res, 'SUCCESS', category)
    } catch (error) {
      console.log('error ======>', error)
      responseHelper.error(res, error.message, error.code || 500);
    }
  }
}
module.exports = new ProductController();