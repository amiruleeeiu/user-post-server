const express=require('express')
const bodyParser = require('body-parser')
const userRoutes=require('./routes/userRouts');
const mongoose = require('mongoose');
const postRoutes=require('./routes/post-routes')
const cors = require('cors')
const fileUpload = require('express-fileupload');
const path = require('path');
require('dotenv').config()

const app=express();
app.use(cors())
app.use(bodyParser.json())
app.use(express.static('controller/images'));
app.use(fileUpload());
app.use('/user',userRoutes)
app.use('/post',postRoutes)

app.use((err,req,res,next)=>{
    res.status(err.code || 500),
    res.json({message:err.message || 'An Unknown error occured'})
})

app.get('/name',(req,res)=>{
    res.json({message:'send data'})
})

mongoose
    .connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.pa181.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
        {useNewUrlParser: true}
    ).then(()=>{
        console.log('server connected');
    }).catch(()=>{
        console.log('Server connection failed');
    })

app.listen(process.env.PORT || 3001,()=>{
    console.log("Server running in port 3001");
})