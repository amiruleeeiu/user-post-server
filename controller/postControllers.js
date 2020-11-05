const { validationResult } = require('express-validator');
const mongoose  = require('mongoose');
const Post = require('../model/post');
const User = require('../model/user');
const Comment=require('../model/comment');

exports.getController=async(req,res,next)=>{

    let post;
    try{
        post=await Post.find();
    }catch(err){
        const error=new Error('Get post failed try,try again');
        return next(error)
    }
    res.json(post)
}

exports.postController=async(req,res,next)=>{
    const error=validationResult(req);
    if(!error.isEmpty()){
        const error=new Error('Post user failed,try again with othentic value');
        return next(error)
    }
    let{title,description,creator}=req.body;

    let file=req.files.file;
    file.mv(`${__dirname}/images/${file.name}`)
       
    let createPost;
    try{
        createPost=await Post({
            title,
            img:`${file.name}`,
            description,
            creator,
            comments:[]
        })
    }catch(err){
        const error=new Error('Post create failed try,try again');
        return next(error)
    }
    let user;
    try{
        user=await User.findById({_id:creator});
    }catch(err){
        const error=new Error('User not defined,please create a user');
        return next(error)
    }

    try{
        const sess=await mongoose.startSession();
        sess.startTransaction();
        await createPost.save({session:sess});
        user.posts.push(createPost);
        await user.save({session:sess});
        await sess.commitTransaction();
    }catch(err){
        const error=new Error('Post create failed,try again');
        return next(error)
    }
    res.json(createPost);
}

exports.updatePost=async(req,res,next)=>{
    const error=validationResult(req);
    if(!error.isEmpty()){
        const error=new Error('Update user failed,try again with othentic value');
        return next(error)
    }
    
    let postId=req.params.pid;
    let{title,description}=req.body;
    let updatedPost;
    try{
        updatedPost=await Post.findById({_id:postId});

    }catch(err){
        const error=new Error('Post not find,Please try again by othentic post');
        return next(error)
    }

    updatedPost.title=title;
    updatedPost.description=description;
    try{
        await updatedPost.save();
    }catch(err){
        const error=new Error('User save failed,Please try again ');
        return next(error)
    }

    res.json({message:'Successfully Updated'});
}

exports.deletePostController=async(req,res,next)=>{
    let postId=req.params.pid;
    let deletePost;
    try{
        deletePost=await Post.findById({_id:postId}).populate('creator');

    }catch(err){
        const error=new Error('Post not find,Please try again by othentic post');
        return next(error)
    }
    let comments;
    try{
        comments=await Comment.find({postId:postId});
    }catch(err){
        const error=new Error('Not found comment, try again');
        return next(error)
    }

    try{
        const sess=await mongoose.startSession();
        sess.startTransaction()
        await deletePost.remove({session:sess});
        deletePost.creator.posts.pull(deletePost);
        await deletePost.creator.save({session:sess});
        await sess.commitTransaction();
    }catch(err){
        const error=new Error('Post not remove,Please try again');
        return next(error)
    }

    res.json({message:'deleted successful'})
}
