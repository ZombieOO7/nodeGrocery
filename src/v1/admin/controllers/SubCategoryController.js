const AdminValidator = require('../../../modules/validators/admin');
const SubCategoryService = require('../../services/SubCategoryService');
const responseHelper = require('../resources/response');

class SubCategoryController {
  async index(req, res) {
    try {
      let list = await SubCategoryService.list(req.body);
      responseHelper.success(res, 'SUCCESS', list)
    } catch (error) {
      console.log('error ======>', error)
      responseHelper.error(res, error.message, error.code || 500);
    }
  }
  async store(req, res) {
    try {
      console.log('body =====>',req.body)
      await AdminValidator.subCategoryValidation(req.body);
      let category = await SubCategoryService.store(req);
      responseHelper.success(res, 'SUCCESS', category)
    } catch (error) {
      console.log('error ======>', error)
      responseHelper.error(res, error.message, error.code || 500);
    }
  }
  async detail(req, res) {
    try {
      await AdminValidator.validateGetDetail(req.body);
      let category = await SubCategoryService.detail(req.body._id);
      responseHelper.success(res, 'SUCCESS', category)
    } catch (error) {
      console.log('error ======>', error)
      responseHelper.error(res, error.message, error.code || 500);
    }
  }
  async delete(req,res){
    try {
      await AdminValidator.validateGetDetail(req.body);
      let category = await SubCategoryService.delete(req.body._id);
      responseHelper.success(res, 'SUCCESS', category)
    } catch (error) {
      console.log('error ======>', error)
      responseHelper.error(res, error.message, error.code || 500);
    }
  }
}
module.exports = new SubCategoryController();