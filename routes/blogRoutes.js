const express = require('express')
const blogController = require('../controller/blogController')
const router = express.Router()
const multer = require('multer')

let storage = multer.diskStorage({
    destination: function(req ,file ,cb){
        cb(null ,'./uploads')
    },
    filename: function(req ,file ,cb){
        cb(null ,file.fieldname + '_' + Date.now() + "_" + file.originalname)
    }
})

let upload = multer({
    storage
}).single('image')

router
    .route('/')
    .get(blogController.getAllBlogs)
    .post(upload ,blogController.createBlog)

router
    .route('/:title')
    .get(blogController.getBlog)
    .patch(upload ,blogController.editBlog)
    .delete(blogController.deleteBlog)

module.exports = router