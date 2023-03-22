const promise = require('bluebird');
const jwt = require('jsonwebtoken');
const Helper = require('../../../utills/helper');
const {Admin} = require('../../../data/models');
class AdminService {
  async signIn(body) {
    try {
      // const user = await Admin.create({email:body.email,password:'testadmin'});
      // console.log('admin ======>',user);
      const admin = await Admin.findOne({
        where: {
          email: body.email,
        },
      });
      if (admin === null) {
        throw 'ADMIN_EMAIL_DOES_NOT_EXIST';
      }
      let passwordValidation = await Helper.passwordManager(body, admin.password, 1);
      if (passwordValidation) return admin;
    } catch (error) {
      console.log('error ======>',error);
      return promise.reject(error);
    }
  }
  async getJwtToken(admin_id, for_admin) {
    try {
      let
        sign = {
          admin_id: admin_id,  
        };
      if (for_admin) {
        sign.is_admin = true;
      }
      let token = jwt.sign(sign, process.env.APP_KEY);
      return token;
    } catch (error) {
      return promise.reject(error);
    }
  }
}
module.exports = new AdminService();