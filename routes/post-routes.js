const router=require('express').Router();
const { body } = require('express-validator');
const { postCommentController, getCommentController } = require('../controller/commentController');
const { postController, getController, updatePost, deletePostController } = require('../controller/postControllers');

router.get('/',getController);

router.post('/',
    [
        body('title').isLength({min:5}),
        body('description').isLength({min:15})
    ],
    postController
);

router.patch('/:pid',
    [
        body('title').isLength({min:5}),
        body('description').isLength({min:15})
    ],
    updatePost
);

router.delete('/:pid',deletePostController);

router.post('/comment',postCommentController)

router.get('/comment',getCommentController);

module.exports=router