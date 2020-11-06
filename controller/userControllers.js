const User = require("../model/user");
const { validationResult } = require('express-validator');

exports.getUserControllerById=async(req,res,next)=>{
    let uid=req.params.uid;
    console.log(uid);
    let user;
    try{
        user=await User.findById({_id:uid})
    }catch{
        const error=new Error('User not find,try again');
        return next(error)
    }

    res.json(user);
}

exports.getUserController=async(req,res,next)=>{

    let users;
    try{
        users=await User.find({});
    }catch(err){
        const error=new Error('Users not find,try again');
        return next(error)
    }
    console.log(users);
    res.json(users);
}

exports.signUpController=async(req,res,next)=>{

    const  errors=validationResult(req);

    if(!errors.isEmpty()){
        const error=new Error('User Invalid,please try again');
        return next(error);
    }

    let{name,email,image,password}=req.body;
    console.log(req.body);
    let file=req.files.file;
    file.mv(`${__dirname}/images/${file.name}`)

    let createUser;
    try{
        createUser=await new User({
            name,
            email,
            image:`http://localhost:3001/${file.name}`,
            password,
            post:[]
        })
    }catch(err){
        const error=new Error('Signing Up failed,please try again');
        return next(error)
    }

    let user;
    try{
        user=await User.find({email:email})
    }catch(err){
        const error=new Error('Could not found user');
        return next(error)
    }

    if(!user.length==0){
        const error=new Error('This user already have an account,Try different email');
        return next(error)
    }
    try{
        await createUser.save()
    }catch(err){
        const error=new Error('Could not sign up,please try again');
        return next(error)
    }
    res.json(createUser)
}

exports.loginController=async(req,res,next)=>{
    const  errors=validationResult(req);

    if(!errors.isEmpty()){
        const error=new Error('User Invalid,please try again');
        return next(error);
    }
    let{email,password}=req.body
    console.log(email,password);
    let user;
    try{
        user=await User.findOne({email:email})
    }catch(err){
        const error=new Error('User could not found,please try again');
        return next(error);
    }
    
    if(!user || user.password!=password){
        const error=new Error('Invalid Credential,please try again');
        return next(error);
    }

    res.json({message:'login Successfull',user});
}