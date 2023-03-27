const mongoose = require('mongoose');
const { Schema } = mongoose;

module.exports = (mongoose) => {
    const deviceSchema = new Schema({
        user: {
            type:Schema.Types.ObjectId,
            ref: 'User'
        },
        device_id:{
            type: String,
            required:false,
        },
        device_type:{
            type: Number,
            required:false,
        },
        token:{
            type: String,
            required:false,
        },
    },{
        timestamps: true
    })
    return mongoose.model('UserDeviceToken',deviceSchema,'user_device_tokens')
}