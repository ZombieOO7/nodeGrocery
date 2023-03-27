const mongoose = require('mongoose');
const { Schema } = mongoose;

module.exports = (mongoose) => {
    const schema = new Schema({
        name: {
            type: String,
            required: false,
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category'
        },
        subCategory: {
            type: Schema.Types.ObjectId,
            ref: 'SubCategory'
        },
        description:{
            type: String,
            required: false,
        },
        image: [{
            type: Schema.Types.ObjectId, 
            ref: 'ProductMedia' 
        }],
        status: {
            type: Number, // 0=inactive,1=active
            required: false,
            default: 0,
        },
        deletedAt: {
            type: Date,
            required: false,
        },
    }, {
        timestamps: true
    });
    schema.set('toObject', { getters: true });
    schema.set('toJSON', { getters: true });
    return mongoose.model('Product', schema, 'products')
};
