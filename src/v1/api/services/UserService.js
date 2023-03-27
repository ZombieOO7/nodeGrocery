const {User,conn,UserDeviceToken} = require('../../../data/models/index')
const promise = require('bluebird');
const ejs = require('ejs');
const path = require('path');
const helper = require('../../../utills/helper');
const expiresIn = 86400 * 30;
const jwt = require('jsonwebtoken');

class UserService {
    async signupWithEmail(req) {
        // const session = conn.startSession();
        try {
            const body = req.body
            var existUser = await this.findUserByEmail(body)
            if (existUser) {
                if (existUser.status == 0) {
                    const error = new Error('USER_BANNED')
                    error.code = 403
                    throw error
                }
                const error = new Error('EMAIL_EXISTS')
                error.code = 400
                throw error
            }
            let user = await User.create(body);
            var token = jwt.sign(JSON.parse(JSON.stringify(user)), process.env.SECRET_KEY, {
                expiresIn: expiresIn
            });
            const tokenData = await UserDeviceToken.create({
                user: user._id,
                device_id: req.headers.device_id || '',
                token: token,
                device_type: req.headers.device_type || '',
            })
            await user.updateOne({$push:{tokens:tokenData._id}},{ new: true, useFindAndModify: false });
            user = user.toJSON(); 
            user.auth_token = 'Bearer '+token;
            return user;
        } catch (error) {
            return promise.reject(error)
        }
    }
    async findUserByEmail(body) {
        try {
            let user = await User.findOne({
                email: body.email.trim().toLowerCase(),
            })
            return user
        } catch (error) {
            return promise.reject(error)
        }
    }

    async validateEmailLogin (req){
        try {
            var email = req.body.email.trim().toLowerCase();
            var attributes = ['name email password status createdAt updatedAt'];
            var user = await User.findOne({ where:{ email:email}});
            if (!user) {
                const error = new Error('EMAIL_NOT_EXIST');
                error.code = 400;
                throw error;
            }else if(user.status == 0){
                const error = new Error('USER_BANNED');
                error.code = 403;
                throw error;
            }
            return user;
        } catch (error) {
            console.log(error);
            return promise.reject(error);
        }
    }
}
module.exports = new UserService()