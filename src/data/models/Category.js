const mongoose = require('mongoose');
const { Schema } = mongoose;

module.exports = (mongoose) => {
    const schema = new Schema({
        name:{
            type: String,
            required: false,
        },
        image:{
            type: String,
            required: false,
            get: (value)=>{
                return `${process.env.APP_URL}storage/category/${value}`;
            }
        },
        status:{
            type: Number, // 0=inactive,1=active
            required: false,
            default:0,
        },
        deletedAt:{
            type: Date,
            required: false,
        },
    },{
        timestamps: true
    });
    schema.set('toObject', { getters: true });
    schema.set('toJSON', { getters: true });
    return mongoose.model('Category',schema,'categories')
};
