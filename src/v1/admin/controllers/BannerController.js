const AdminValidator = require('../../../modules/validators/admin');
const BannerService = require('../../services/BannerService');
const responseHelper = require('../resources/response');

class BannerController {
  async index(req, res) {
    try {
      let list = await BannerService.list(req.body);
      responseHelper.success(res, 'SUCCESS', list)
    } catch (error) {
      console.log('error ======>', error)
      responseHelper.error(res, error.message, error.code || 500);
    }
  }
  async store(req, res) {
    try {
      console.log('body =====>',req.body)
      await AdminValidator.bannerValidation(req.body);
      let category = await BannerService.store(req);
      responseHelper.success(res, 'SUCCESS', category)
    } catch (error) {
      console.log('error ======>', error)
      responseHelper.error(res, error.message, error.code || 500);
    }
  }
  async detail(req, res) {
    try {
      await AdminValidator.validateGetDetail(req.body);
      let category = await BannerService.detail(req.body._id);
      responseHelper.success(res, 'SUCCESS', category)
    } catch (error) {
      console.log('error ======>', error)
      responseHelper.error(res, error.message, error.code || 500);
    }
  }
  async delete(req,res){
    try {
      await AdminValidator.validateGetDetail(req.body);
      let category = await BannerService.delete(req.body._id);
      responseHelper.success(res, 'SUCCESS', category)
    } catch (error) {
      console.log('error ======>', error)
      responseHelper.error(res, error.message, error.code || 500);
    }
  }
}
module.exports = new BannerController();