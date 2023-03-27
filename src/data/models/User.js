const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');

module.exports = (mongoose) => {
  const UserSchema = new Schema({
    name: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
      unique: false,
      set: (value) => {
        return value.trim().toLowerCase();
      }
    },
    email_verified_at: {
      type: Date,
      required: false,
    },
    password: {
      type: String,
      required: false,
      set: (value) => {
        return bcrypt.hashSync(value, 10);
      }
    },
    status: {
      type: Number, // 0=inactive,1=active
      required: false,
      default: 1,
    },
    tokens:[{
      type: Schema.Types.ObjectId, 
      ref: 'UserDeviceToken' 
    }],
    deletedAt: {
      type: Date,
      required: false,
    },
  }, {
    timestamps: true
  });
  UserSchema.methods.comparePassword = function (password,cb) {
    if(bcrypt.compareSync(password, this.password||'') == true){
        cb(null, true);
    }else{
        return cb('invalid password.');
    }
}
  UserSchema.set('toObject', { getters: true, virtuals: true });
  UserSchema.set('toJSON', { getters: true, virtuals: true });
  return mongoose.model('User', UserSchema, 'users')
};
