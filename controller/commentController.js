const mongoose  = require('mongoose');
const Post = require('../model/post');
const Comment=require('../model/comment');

exports.postCommentController=async(req,res,next)=>{
    let{comment,creator,postId}=req.body;
    let createComment;
    try{
        createComment=await Comment({
            comment,
            creator,
            postId
        })
    }catch(err){
        const error=new Error('Creating comment failed,Please try again');
        return next(error)
    }
    console.log(comment,creator,postId);
    let post;
    try{
        post=await Post.findById({_id:postId});
    }catch(err){
        const error=new Error('Dont find post,Please try again');
        return next(error)
    }

    
    try{
        
        const sess=await mongoose.startSession();
        sess.startTransaction();
        await createComment.save({session:sess});
        post.comments.push(createComment);
        await post.save({session:sess});
        await sess.commitTransaction();
    }catch{
        const error=new Error('Dont save comment,Please try again');
        return next(error)
    }
    res.json(createComment)
}

exports.getCommentController=async(req,res,next)=>{
    let comment;
    try{
        comment=await Comment.find();
    }catch(err){
        const error=new Error('Get comment failed try,try again');
        return next(error)
    }
    res.json(comment)
}