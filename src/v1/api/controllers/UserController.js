const validator = require('../../../modules/validators/api/index')
const CommonController = require('./CommonController')
const UserService = require('../services/UserService')
const responseHelper = require('../../api/resources/response');
const { UserDeviceToken } = require('../../../data/models')
const expiresIn = 86400 * 30;
const jwt = require('jsonwebtoken');
const passport = require('passport');
require('../../../../config/passport')(passport);
class UserController {
  /* mother || user signup */
  async signup(req, res) {
    const body = await CommonController.removeEmptyParams(req.body);
    req.body = body;
    try {
      const body = req.body;
      await validator.validateSignUpForm(body);
      let user = await UserService.signupWithEmail(req);
      return responseHelper.success(res, 'SUCCESS', user);
    } catch (error) {
      console.log('error=======>', error)
      return responseHelper.error(res, error.message || '', error.code || 500);
    }
  }
  /* user login api */
  async signin(req, res) {
    const body = await CommonController.removeEmptyParams(req.body);
    req.body = body;
    try {
      await validator.validateSignIn(req.body);
      // email
      let user = await UserService.validateEmailLogin(req);
      user.comparePassword(req.body.password, async (err, isMatch) => {
        if (isMatch != undefined && !err) {
          var token = jwt.sign(JSON.parse(JSON.stringify(user)), process.env.SECRET_KEY, {
            expiresIn: expiresIn
          });
          let tokenData = await UserDeviceToken.create({
            fk_user_id: user._id,
            device_id: req.headers.device_id || '',
            device_token: token,
            device_type: req.headers.device_type || '',
          })
          await user.updateOne({$push:{tokens:tokenData._id}},{ new: true, useFindAndModify: false });
          user = user.toJSON();
          user.auth_token = 'Bearer '+token;
          return responseHelper.success(res, 'LOGIN_SUCCESS', user);
        } else {
          return responseHelper.error(res, 'INVALID_PASSWORD', 400);
        }
      })
    } catch (error) {
      return responseHelper.error(res, error.message || '', error.code || 500);
    }
  }
}
module.exports = new UserController();