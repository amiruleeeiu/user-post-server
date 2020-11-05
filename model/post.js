const mongoose = require('mongoose');
const User=require('./user');
const Comment=require('./comment')

const postSchema=new mongoose.Schema({
    title:{type:String,required:true,trim:true},
    description:{type:String,required:true,trim:true},
    img:{type:String,required:true},
    creator:{type:mongoose.Types.ObjectId,required:true,ref:'User'},
    comments:[{type:mongoose.Types.ObjectId,required:true,ref:'Comment'}]
})

module.exports=mongoose.model('Post',postSchema);