const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { Schema } = mongoose;

module.exports = (mongoose) => {
    const schema = new Schema({
        name:{
            type: String,
            required: false,
        },
        email:{
            type: String,
            required: false,
            unique: false,
            set: v => v.trim().toLowerCase()
        },
        password: {
            type: String,
            required: false,
            set: (value)=>{
                let password = bcrypt.hashSync(value, 10);
                return password;
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
        }
    },{
        timestamps: true
    });
    return mongoose.model('Admin',schema,'admins')
};
