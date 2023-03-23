const joiBase = require('joi');
const joiDate = require("@joi/date");
const joi = joiBase.extend(joiDate);
const custMessages = require('../../../../config/constant.json');
const promise = require('bluebird');
const lang = 'en';

const options = {
  errors: {
    wrap: {
      label: ''
    }
  }
};
class Validator {
  async validateHeaders(headers) {
    try {
      const schema = joi.object({
        language: joi.string().required(),
        authorization: joi.string().required(),
        device_token: joi.string().optional(),
        device_id: headers.app_version ? joi.string().required() : joi.string().optional(),
        device_type: headers.app_version ? joi.number().required() : joi.string().optional(),
        web_app_version: headers.web_app_version ? joi.any().required() : joi.any().optional(),
        app_version: headers.app_version ? joi.any().required() : joi.any().optional(),
        os: joi.any().required(),
        timezone: headers.app_version ? joi.any().required() : joi.any().optional(),
      }).unknown();
      await schema.validateAsync(headers, options);
    } catch (error) {
      promise.reject(error.details[0].message);
    }
  }
  async validateAdminLogin(body) {
    try {
      const schema = joi.object({
        email: joi.string().max(100).regex(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/).trim(true).required()
          .messages({
            'string.pattern.base': custMessages[lang]['INVALID_EMAIL']
          }),
        password: joi.string().required()
      }).unknown();
      return await schema.validateAsync(body, options)
    } catch (error) {
      return promise.reject(error.details[0].message)
    }
  }
  async validateChangePassword(body) {
    try {
      const schema = joi.object({
        admin_id: joi.optional(),
        password: joi.string().required(),
        newPassword: joi.string().required(),
        confirmPassword: joi.string().required()
      })
      return await schema.validateAsync(body, options)
    } catch (error) {
      return promise.reject(error.details[0].message)
    }
  }
  async validateCategoryManagement(body) {
    try {
      const schema = joi.object({
        admin_id: joi.optional(),
        id: joi.optional(),
        name: joi.string().required(),
        image: joi.string().optional()
      })
      return await schema.validateAsync(body, options)
    } catch (error) {
      return promise.reject(error.details[0].message)
    }
  }
  async validateGetDetail(body){
    try {
      const schema = joi.object({
        admin_id: joi.optional(),
        _id: joi.string().required(),
      })
      return await schema.validateAsync(body, options)
    } catch (error) {
      return promise.reject(error.details[0].message)
    }
  }
  async subCategoryValidation(body) {
    try {
      const schema = joi.object({
        admin_id: joi.optional(),
        _id: joi.optional(),
        category: joi.required(),
        name: joi.string().required(),
        image: joi.string().optional()
      })
      return await schema.validateAsync(body, options)
    } catch (error) {
      return promise.reject(error.details[0].message)
    }
  }
}

module.exports = new Validator();