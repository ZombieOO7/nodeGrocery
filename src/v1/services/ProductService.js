const {Product,conn,ProductMedia} = require('../../data/models');
const promise = require('bluebird');
const fs = require('fs');


class ProductService{
  async list(body){
    try{
      let {page_no,limit,_id} = body;
      let products;
      let where = {};
      if('_id' in body){
        where = {
          subCategory:_id
        };
      }
      if(page_no && limit){
        var page = (page_no-1) * limit; 
        products = await Product.find(where).populate('category','_id name').populate('subCategory','_id name').populate('image','_id image').sort([['createdAt','DESC']]).limit(limit).skip(page);
      }else{
        products = await Product.find(where).populate('category','_id name').populate('subCategory','_id name').populate('image','_id image').sort([['createdAt','DESC']]);
      }
      let count = await Product.count({});
      return { products: products, total: count};
    }catch(error){
      return promise.reject(error)
    }
  }
  async store(req){
    // const session = conn.startSession();
    try{
      let product;
      if('_id' in req.body && req.body._id != null){
        product = await this.detail(req.body._id);
      }else{
        product = await Product.create(req.body);        
      }
      if(req.files && req.files.length > 0){
        delete req.body.image;
        req.body.image = [];
        await product.updateOne({image:[]});
        await ProductMedia.deleteMany({product:product._id});
        await Promise.all(req.files.map(async (file) => {
          let media = await ProductMedia.create({product:product._id,image:file.filename})
          req.body.image.push(media._id);
        }));
      }
      console.log('images ======>',req.body.image);
      await product.updateOne(req.body);
      return product;
    }catch(error){
      console.log('error ====>',error)
      return promise.reject(error)
    }
  }
  async detail(id){
    try{
      let product = await Product.findOne({_id:id}).populate('category','_id name').populate('subCategory','_id name').populate('image','_id image');
      console.log('product =======>',product);
      if(product == null){
        throw new Error('RECORD_NOT_FOUND');
      }
      return product;
    }catch(error){
      return promise.reject(error)
    }
  }
  async delete(id){
    try{
      let product = await Product.findOne({_id:id});
      if(product == null){
        throw new Error('RECORD_NOT_FOUND');
      }
      await product.deleteOne();
      return product;
    }catch(error){
      return promise.reject(error)
    }
  }
}
module.exports = new ProductService();