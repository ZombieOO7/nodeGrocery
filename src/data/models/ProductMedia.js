const mongoose = require('mongoose');
const { Schema } = mongoose;

module.exports = (mongoose) => {
    const schema = new Schema({
        product:{
            type:Schema.Types.ObjectId,
            ref: 'Product',
            required: false,
        },
        image:{
            type: String,
            required: false,
            get: (value)=>{
                return `${process.env.APP_URL}storage/product/${value}`;
            }
        },
    },{
        timestamps: true
    });
    schema.set('toObject', { getters: true });
    schema.set('toJSON', { getters: true });
    return mongoose.model('ProductMedia',schema,'product_media')
};
