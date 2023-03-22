const {User,conn,UserDeviceToken} = require('../../../data/models/index')
const promise = require('bluebird')
const ejs = require('ejs')
const path = require('path')
const helper = require('../../../utills/helper')
// const BaseService = require('./BaseService');
const {
    resolve
} = require('path')

class UserService {
    async signupWithEmail(req) {
        const session = conn.startSession();
        try {
            const body = req.body
            var existUser = await this.findUserByEmail(body)
            const subject = 'Email Verification'
            if (existUser) {
                const url = process.env.APP_URL + `verify-email/` + existUser._id
                const imgUrl = process.env.APP_URL + `images/logo.png`
                const file = path.join(__dirname, '../../../views/html/backend/verification_email.ejs')
                const htmlData = await ejs.renderFile(file, {
                    url: url,
                    user: existUser,
                    imgUrl: imgUrl
                })
                if (existUser.status == 0 && existUser.email_verified_at == null) {
                    const sendMail = await helper.sendMail(existUser, subject, htmlData)
                    const error = new Error('EMAIL_NOT_VERIFIED')
                    error.code = 400
                    throw error
                } else if (existUser.status == 0) {
                    const error = new Error('USER_BANNED')
                    error.code = 403
                    throw error
                }
                const error = new Error('EMAIL_EXISTS')
                error.code = 402
                throw error
            }
            await session.startTransaction();
            body.register_type = 1
            const user = await User.create(body, {
                transaction: t
            });
            const url = process.env.APP_URL + `verify-email/` + user.user_id;
            const imgUrl = process.env.APP_URL + `images/logo.png`;
            const file = path.join(__dirname, '../../views/html/backend/verification_email.ejs');
            const htmlData = await ejs.renderFile(file, {
                url: url,
                user: user,
                imgUrl: imgUrl
            });
            const sendMail = await helper.sendMail(user, subject, htmlData);
            await session.commitTransaction();
            session.endSession();
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            return promise.reject(error)
        }
    }
    async findUserByEmail(body) {
        try {
            let user = await User.findOne({
                email: body.email.trim().toLowerCase(),
                register_type: 1
            })
            return user
        } catch (error) {
            return promise.reject(error)
        }
    }

    /* verify email address api */
    async verifyMail(req) {
        const t= await sequelize.transaction();
        try {
            const user = await User.findOne({
                where: {
                    user_id: req.params.uuid
                }
            }, {
                transaction : t
            });
            if (!user) {
                var error = new Error('USER_NOT_FOUND')
                error.code = 400
                throw error
            } else if (user.email_verified_at != null || user.status == 1) {
                var error = new Error('VERIFIED')
                error.code = 400
                throw error
            } else {
                // update user
                await user.updateOne({
                    email_verified_at: new Date(),
                    status: 1
                }, {
                    transaction :t
                })
            }
            await t.commit();
        } catch (error) {
            await t.rollback();
            return promise.reject(error)
        }
    }

    async otherSigninMethod(req) {
        const t = await sequelize.transaction();
        try {
            var attributes = ['user_id', 'name', 'email', 'password', 'google_id', 'register_type', 'facebook_id', 'email_verified_at', 'status', 'createdAt', 'updatedAt'];
            var find, user, registerType;
            // google
            if (req.body.register_type == 2) {
                var google_id = req.body.google_id
                find = {
                    google_id: google_id
                }
            }
            // facebook
            if (req.body.register_type == 3) {
                var facebook_id = req.body.facebook_id
                find = {
                    facebook_id: facebook_id
                }
            }
            // apple
            if (req.body.register_type == 4) {
                var apple_id = req.body.apple_id
                find = {
                    apple_id: apple_id
                }
            }
            req.body.email_verified_at = new Date();
            req.body.status = 1;
            if (req.body.register_type != 1) {
                var attributes = ['user_id', 'name', 'email', 'google_id', 'password', 'register_type', 'email_verified_at', 'facebook_id', 'status', 'createdAt', 'updatedAt'];
                const orderBy = [
                    ['Token', 'updatedAt', 'DESC']
                ];
                const includes = [{
                    as: 'Token',
                    model: UserDeviceToken,
                    attributes: {
                        exclude: ['device_token']
                    }
                }];
                const [user, created] = await User.findOrCreate({
                    where: find,
                    attributes: attributes,
                    defaults: req.body,
                    include: includes,
                    order: orderBy,
                    transaction: t
                });
                user.new_record = created;
                if (created == false) {
                    if (user.status == 0) {
                        const error = new Error('USER_BANNED');
                        error.code = 403;
                        throw error;
                    }
                }
                if (user.UserNotifications != undefined && user.UserNotifications.length > 0) {
                    await UserNotification.destroy({
                        where: {
                            type: 3,
                            fk_user_id: user.user_id
                        }
                    }, {
                        transaction: t
                    })
                }
                await user.update({
                    last_active_at: new Date()
                }, {
                    transaction: t
                });
                var token = jwt.sign(JSON.parse(JSON.stringify(user)), process.env.AUTHORIZATION_SECRET_KEY, {
                    expiresIn: expiresIn
                });
                await user.createToken({
                    fk_user_id: user.user_id,
                    device_id: req.headers.device_id || '',
                    device_token: token,
                    device_type: req.headers.device_type || '',
                }, {
                    transaction: t
                })
                await t.commit();
                user.token = token;
                return user;
            }
        } catch (error) {
            console.log('error =========>', error);
            if(t) await t.rollback();
            return promise.reject(error);
        }
    }
    async validateEmailLogin (req){
        try {
            var email = req.body.email.trim().toLowerCase();
            var attributes = ['user_id','name','email','google_id','password','register_type','email_verified_at','facebook_id','status','createdAt','updatedAt'];
            var findBy = {where:{email:email, register_type:1},attributes:attributes}
            var user = await User.findOne({
                                            where:{
                                                email:email,
                                                register_type:1
                                            },
                                            include:[
                                                {as:'Token',model:UserDeviceToken,attributes:{exclude: ['device_token']}},
                                            ]
                                        });
            if (!user) {
                const error = new Error('EMAIL_NOT_EXIST');
                error.code = 400;
                throw error;
            }else if(user.email_verified_at == null){
                const subject = 'Email Verification';
                const url = process.env.APP_URL+ `verify-email/` + user.user_id;
                const imgUrl = process.env.APP_URL + `images/logo.png`;
                const file = path.join(__dirname, '../../views/html/backend/verification_email.ejs');
                const htmlData = await ejs.renderFile(file, {url:  url, user:user, imgUrl:imgUrl});
                const sendMail = await helper.sendMail(user, subject, htmlData);
                const error = new Error('EMAIL_NOT_VERIFIED');
                error.code = 400;
                throw error;
            }else if(user.status == 0){
                const error = new Error('USER_BANNED');
                error.code = 403;
                throw error;
            }
            if(user.UserNotifications.length > 0){
                await UserNotification.destroy({where:{
                    type:3,
                    fk_user_id:user.user_id
                }})
            }
            await user.update({last_active_at:new Date()});
            return user;
        } catch (error) {
            console.log(error);
            return promise.reject(error);
        }
    }
}
module.exports = new UserService()