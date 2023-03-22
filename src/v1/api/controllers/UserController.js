const validator = require('../../../modules/validators/api/index')
const CommonController = require('./CommonController')
const UserService = require('../services/UserService')
const responseHelper = require('../../api/resources/response');

class UserController {
    /* mother || user signup */
    async signup(req, res) {
        const body = await CommonController.removeEmptyParams(req.body);
        req.body = body;
        try {
            const body = req.body;
            await validator.validateMotherSignUpForm(body);
            if (req.body.register_type == 1) {
                delete req.body.google_id
                delete req.body.facebook_id
                delete req.body.apple_id
                await UserService.signupWithEmail(req);
                return responseHelper.success(res, 'EMAIL_VERIFICATION', {});
            } else {
                const user = await UserService.otherSigninMethod(req);
                return responseHelper.success(res, 'LOGIN_SUCCESS', user);
            }
        } catch (error) {
            console.log('error=======>', error)
            return responseHelper.error(res, error.message || '', error.code || 500);
        }
    }
    /* verify email address api */
    async verifyMail(req, res) {
        try {
            await UserService.verifyMail(req)
            res.render(base_path+'/src/views/html/backend/verify-status', {
                status: true
            });
        } catch (error) {
            console.log('error =======>',error)
            var message = error;
            res.render(base_path+'/src/views/html/backend/verify-status', {
                message: message,
                status: false
            });
        }
    }
    /* user login api */
    async signin(req, res) {
        let t;
        const body = await CommonController.removeEmptyParams(req.body);
        req.body = body;
        try {
            const message = getMessages(req.headers);
            await validator.validateSignIn(req.body);
            // email
            if (req.body.register_type == 1) {
                const user = await UserService.validateEmailLogin(req);
                delete req.body.google_id
                delete req.body.facebook_id
                delete req.body.apple_id
                user.comparePassword(req.body.password, async (err, isMatch) => {
                    t = await sequelize.transaction();
                    if (isMatch != undefined && !err) {
                        var token = jwt.sign(JSON.parse(JSON.stringify(user)), process.env.AUTHORIZATION_SECRET_KEY, {
                            expiresIn: expiresIn
                        });
                        const userData = await userResponse.userResponse(user);
                        userData.token = token;
                        await user.createToken({
                            fk_user_id: user.user_id,
                            device_id: req.headers.device_id || '',
                            device_token: token,
                            device_type: req.headers.device_type || '',
                        }, {
                            transaction: t
                        })
                        await t.commit();
                        return responseHelper.success(res, 'LOGIN_SUCCESS', userData);
                    } else {
                        return responseHelper.error(res, 'INVALID_PASSWORD', 400);
                    }
                })
            }
            if (req.body.register_type != 1) {
                const user = await UserService.otherSigninMethod(req);
                return responseHelper.success(res, 'LOGIN_SUCCESS', user);
            }
        } catch (error) {
            if (t) { await t.rollback();}
            console.log(error);
            return responseHelper.error(res, error.message || '', error.code || 500);
        }
    }
}
module.exports = new UserController();