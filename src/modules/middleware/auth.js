const jwt = require('jsonwebtoken');
const env = require('dotenv');
env.config();
const validate = require('../validators/admin/index');
const crypto = require("crypto");
const passport = require("passport");
const { User, UserDeviceToken } = require('../../data/models/index');
const responseHelper = require('../../v1/api/resources/response');

const getToken = headers => {
  if (!headers.authorization) {
    return null;
  }
  const parted = headers.authorization.split(' ');
  if (parted[0] === 'Bearer') {
    return parted[1];
  }
  return null;
};
class GlobalAuthClass {
  async authenticate(req, res, next) {
    try {
      await validate.validateHeaders(req.headers);
      const token = await getToken(req.headers);

      if (!token) {
        var error = new Error("CAN'T GET TOKEN")
        error.code = 400;
        throw error;
      };

      const verified = jwt.verify(token, process.env.APP_KEY);
      if (!verified) throw 'TOKEN_MALFORMED';

      const customer = await User.findOne({
        where: {
          id: verified.id
        },
        raw: true,
      });

      if (!customer) throw 'UNAUTHORIZED';
      next();
    } catch (error) {
      responseHelper.error(res, error, req.headers.language);
    }
  }

  async adminAuthenticate(req, res, next) {
    try {
      await validate.validateHeaders(req.headers);
      const token = await getToken(req.headers);
      const verified = jwt.verify(token, process.env.APP_KEY);
      if (!verified) throw 'TOKEN_MALFORMED';
      console.log("verify::", verified);
      if (verified.is_admin === true) {
        req.body.admin_id = verified.admin_id
        next();
      }
    } catch (error) {
      console.log(error);
      responseHelper.error(res, error, req.headers.language);
    }
  }

  async initialAuthenticate(req, res, next) {
    try {
      await validate.validateHeaders(req.headers);
      if (req.headers.authorization == process.env.APP_TOKEN) {
        next();
      } else {
        var error = new Error('AUTHORIZED_DENIED');
        error.code = 400;
        throw error;
      }
    } catch (error) {
      responseHelper.error(res, error.message || '', error.code || 500);
    }
  }

  // async getToken(headers) {}
  async passportAuthenticate(req, res, next) {
    try {
      await validate.validateHeaders(req.headers);
      const token = await getToken(req.headers);
      if (!token) {
        var error = new Error("TOKEN_NOT_PRESENT");
        error.code = 403;
        throw error;
      };
      // check that token is available or not
      const userDeviceToken = await UserDeviceToken.findOne({
        where: {
          device_token: token
        }
      })
      if (!userDeviceToken) {
        var error = new Error("TOKEN_NOT_PRESENT");
        error.code = 403;
        throw error;
      }
      const userData = await passport.authenticate("Bearer", {session: false,failureMessage: true}, async (userData) => {
        if (userData == null) {
          return responseHelper.error(res, 'TOKEN_EXPIRED' || '', 401);
        } else if (userData.status == false) {
          return responseHelper.error(res, userData.error || '', 405);
        } else {
          req.authUser = userData.user;
          req.auth_token = token;
          req.authId = userData.user._id;
          if (userData.user.status == 'inactive' || userData.user.status == 0) {
            return responseHelper.error(res, 'USER_BANNED' || '', 403);
          }
        }
        next()
      })(req, res, next);
    } catch (error) {
      return responseHelper.error(res, error.message || '', error.code || 500);
    }
  }
}

module.exports = new GlobalAuthClass();