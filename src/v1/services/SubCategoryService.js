const {SubCategory,conn} = require('../../data/models');
const promise = require('bluebird');
const fs = require('fs');

class SubCategoryService{
  async   list(body){
    try{
      let where = {};
      if('_id' in body){
        where = {
          category:body._id
        }
      }
      let {page_no,limit} = body;
      let subCategories;
      if(page_no && limit){
        var page = (page_no-1) * limit; 
        subCategories = await SubCategory.find(where).populate('category','_id name').sort([['createdAt','DESC']]).limit(limit).skip(page);
      }else{
        subCategories = await SubCategory.find(where).populate('category','_id name').sort([['createdAt','DESC']]);
      }
      let count = await SubCategory.count({});
      return { subCategories: subCategories, total: count};
    }catch(error){
      return promise.reject(error)
    }
  }
  async store(req){
    console.log("Req File :: ", req.file); 
    // const session = conn.startSession();
    try{
      let subCategory;
      if('_id' in req.body && req.body._id != null){
        subCategory = await this.detail(req.body._id);
      }else{
        subCategory = await SubCategory.create(req.body);        
      }
      if(req.file && req.file != undefined && req.file != null){
        // if(subCategory !=null && subCategory.image != null){
        //   fs.unlinkSync(__dirname+`../../../../storage/subCategory/${subCategory.image}`);
        // }
        req.body.image = req.file.filename;
      }
      await subCategory.updateOne(req.body);
      return subCategory;
    }catch(error){
      console.log('error ====>',error)
      return promise.reject(error)
    }
  }
  async detail(id){
    try{
      let subCategory = await SubCategory.findOne({_id:id}).populate('category','name');
      console.log('subCategory =======>',subCategory);
      if(subCategory == null){
        throw new Error('RECORD_NOT_FOUND');
      }
      return subCategory;
    }catch(error){
      return promise.reject(error)
    }
  }
  async delete(id){
    try{
      let subCategory = await SubCategory.findOne({_id:id});
      if(subCategory == null){
        throw new Error('RECORD_NOT_FOUND');
      }
      await subCategory.deleteOne();
      return subCategory;
    }catch(error){
      return promise.reject(error)
    }
  }
}
module.exports = new SubCategoryService();