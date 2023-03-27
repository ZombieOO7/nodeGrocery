const AdminValidator = require('../../../modules/validators/admin');
const CategoryService = require('../../services/CategoryService')
const responseHelper = require('../resources/response');

class CategoryController {
  async index(req, res) {
    try {
      let list = await CategoryService.list(req.body);
      responseHelper.success(res, 'SUCCESS', list)
    } catch (error) {
      console.log('error ======>', error)
      responseHelper.error(res, error.message, error.code || 500);
    }
  }
  async store(req, res) {
    try {
      await AdminValidator.validateCategoryManagement(req.body);
      let category = await CategoryService.store(req);
      responseHelper.success(res, 'SUCCESS', category)
    } catch (error) {
      console.log('error ======>', error)
      responseHelper.error(res, error.message, error.code || 500);
    }
  }
  async detail(req, res) {
    try {
      await AdminValidator.validateGetDetail(req.body);
      let category = await CategoryService.detail(req.body._id);
      responseHelper.success(res, 'SUCCESS', category)
    } catch (error) {
      console.log('error ======>', error)
      responseHelper.error(res, error.message, error.code || 500);
    }
  }
  async delete(req,res){
    try {
      await AdminValidator.validateGetDetail(req.body);
      let category = await CategoryService.delete(req.body._id);
      responseHelper.success(res, 'SUCCESS', category)
    } catch (error) {
      console.log('error ======>', error)
      responseHelper.error(res, error.message, error.code || 500);
    }
  }
}
module.exports = new CategoryController();