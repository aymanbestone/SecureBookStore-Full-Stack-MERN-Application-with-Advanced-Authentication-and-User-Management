const { required, bool } = require("joi");
const mongoose = require("mongoose");
const joi = require("joi");
const jwt= require("jsonwebtoken")
const passComplexity = require("joi-password-complexity") 
const shemaUser = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      minlength: 5,
      unique: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      minlength: 2,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
      trim: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

shemaUser.methods.generateToken= function(){
  return jwt.sign({id:this._id,email:this.email,isAdmin:this.isAdmin,username:this.username},process.env.secret_key)
}



const User = mongoose.model("User", shemaUser);

module.exports = { User , validateCreate , validateLogin , validateUpdate , validateResetPass };


//validation de creation
function validateCreate(obj) {
  const shema = joi.object({
    email: joi.string().min(5).required().email().trim(),
    username: joi.string().min(2).required().trim(),
    password: passComplexity().required(),
    isAdmin: joi.bool().default(false)
  });
  return shema.validate(obj)
}
//validation de update
function validateUpdate(obj) {
    const shema = joi.object({
      email: joi.string().min(5).email().trim(),
      username: joi.string().min(2).trim(),
      password: passComplexity(),
    });
    return shema.validate(obj)
  }
  //validate reset password 
  function validateResetPass(obj) {
    const shema = joi.object({
      password: passComplexity().required(),
    });
    return shema.validate(obj)
  }
  //validation de login
  function validateLogin(obj) {
    const shema = joi.object({
      email: joi.string().min(5).required().email().trim(),
      password: joi.string().min(5).required().trim(),
    });
    return shema.validate(obj)
  }
  
  

