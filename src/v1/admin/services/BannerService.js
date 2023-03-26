const {Banner,conn} = require('../../../data/models/index');
const promise = require('bluebird');
const fs = require('fs');

class BannerService{
  async list(body){
    try{
      // let banners = await Banner.find({});
      let {page_no,limit} = body;
      let banners;
      if(page_no && limit){
        var page = (page_no-1) * limit; 
        banners = await Banner.find({}).limit(limit).skip(page);
      }else{
        banners = await Banner.find({});
      }
      let count = await Banner.count({});
      return { banners: banners, total: count};
    }catch(error){
      return promise.reject(error)
    }
  }
  async store(req){
    console.log("Req File :: ", req.file); 
    // const session = conn.startSession();
    try{
      let banner;
      if('_id' in req.body && req.body._id != null){
        banner = await this.detail(req.body._id);
      }else{
        banner = await Banner.create(req.body);        
      }
      if(req.file && req.file != undefined && req.file != null){
        // if(banner !=null && banner.image != null){
        //   fs.unlinkSync(__dirname+`../../../../storage/banner/${banner.image}`);
        // }
        req.body.image = req.file.filename;
      }
      await banner.updateOne(req.body);
      return banner;
    }catch(error){
      console.log('error ====>',error)
      return promise.reject(error)
    }
  }
  async detail(id){
    try{
      let banner = await Banner.findOne({_id:id});
      console.log('banner =======>',banner);
      if(banner == null){
        throw new Error('RECORD_NOT_FOUND');
      }
      return banner;
    }catch(error){
      return promise.reject(error)
    }
  }
  async delete(id){
    try{
      let banner = await Banner.findOne({_id:id});
      if(banner == null){
        throw new Error('RECORD_NOT_FOUND');
      }
      await banner.deleteOne();
      return banner;
    }catch(error){
      return promise.reject(error)
    }
  }
}
module.exports = new BannerService();