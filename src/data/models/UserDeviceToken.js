const mongoose = require('mongoose');
const { Schema } = mongoose;

module.exports = (mongoose) => {
    const deviceSchema = new Schema({
        id: {
            type:Schema.Types.ObjectId,
            required:true,
        },
        fk_user_id: {
            type:Schema.Types.ObjectId,
            ref: 'Users'
        },
    },{
        timestamps: true
    })
    return mongoose.model('UserDeviceToken',deviceSchema,'user_device_tokens')
}