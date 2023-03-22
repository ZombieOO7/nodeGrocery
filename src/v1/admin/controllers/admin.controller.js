const AdminValidator = require('../../../modules/validators/admin');
const adminService = require('../../admin/services/admin.service');
const responseHelper = require('../resources/response');
class AdminController {
	async logIn(req, res) {
		try {
			console.log(req.body)
			await AdminValidator.validateAdminLogin(req.body);
			const result = await adminService.signIn(req.body);
			let token = await adminService.getJwtToken(result._id, true)
			responseHelper.success(res, 'LOGIN_SUCCESS', { auth_token: token })
		}catch (error) {
			console.log('error ======>',error)
			responseHelper.error(res, error.message, error.code||500);
		}
	}
}
module.exports = new AdminController();