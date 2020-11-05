const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Post=require('./post')

const userSchema=new mongoose.Schema({
    name:{type:String,required:true,trim:true},
    email:{type:String,required:true,unique:true},
    image:{type:String},
    password:{type:String,required:true},
    posts:[{type:mongoose.Types.ObjectId,required:true,ref:'Post'}]
})

userSchema.plugin(uniqueValidator);
module.exports=mongoose.model('User',userSchema);