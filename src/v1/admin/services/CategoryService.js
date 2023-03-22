const {Category,conn} = require('../../../data/models/index');
const promise = require('bluebird');
const fs = require('fs');

class CategoryService{
  async list(req){
    try{
      let categories = await Category.find({});
      let count = await Category.count({});
      return { categories: categories, total: count};
    }catch(error){
      return promise.reject(error)
    }
  }
  async store(req){
    console.log("Req File :: ", req.file); 
    // const session = conn.startSession();
    try{
      let category;
      if('id' in req.body && req.body.id != null){
        category = await this.detail(req.body.id);
        await category.updateOne(req.body);
      }
      if(req.file && req.file != undefined && req.file != null){
        if(category !=null && category.image != null){
          fs.unlinkSync(__dirname+`storage/category/${category.image}`);
        }
        req.body.image = req.file.filename;
      }
      if('id' in req.body ==false){
        category = await Category.create(req.body);        
      }
      return category;
    }catch(error){
      console.log('error ====>',error)
      return promise.reject(error)
    }
  }
  async detail(id){
    try{
      let category = await Category.findOne({_id:id});
      if(category == null){
        throw new Error('RECORD_NOT_FOUND');
      }
      return category;
    }catch(error){
      return promise.reject(error)
    }
  }
  async delete(id){
    try{
      let category = await Category.findOne({_id:id});
      if(category == null){
        throw new Error('RECORD_NOT_FOUND');
      }
      await category.deleteOne();
      return category;
    }catch(error){
      return promise.reject(error)
    }
  }
}
module.exports = new CategoryService();