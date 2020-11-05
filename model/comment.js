const mongoose = require('mongoose');
const User=require('./user');
const Post=require('./post');

const commentSchema=new mongoose.Schema({
    comment:{type:String,required:true,trim:true},
    creator:{type:mongoose.Types.ObjectId,required:true,ref:'User'},
    postId:{type:mongoose.Types.ObjectId,required:true,ref:'Post'}
})

module.exports=mongoose.model('Comment',commentSchema);