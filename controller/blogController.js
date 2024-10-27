const catchAsync = require("../utils/catchAsync")
const AppError = require('../utils/appError')
const Blog = require("../models/blogModels")
const fs = require('fs')

const filterObj = (Obj , ...allowedFields) => {
    const newObj = {}
    Object.keys(Obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = Obj[el]
    })
    return newObj
}

exports.getAllBlogs = catchAsync(async(req ,res) => {
    let Blogs = await Blog.find()
    if (Blogs.length == 0) Blogs = "no Blog exist"
    res.status(200).json({
        status: 'success',
        Blogs
    })
})

exports.getBlog = catchAsync(async(req ,res ,next) => {
    const blog = await Blog.findOne({title: req.params.title})
    if(blog){
        res.status(200).json({
            status: "success",
            blog
        })
    }else{
        return next(new AppError("no Blog found" ,404))
    }
})

exports.deleteBlog = catchAsync(async(req,res,next) => {
    const blog = await Blog.findOne({title: req.params.title})
    if(blog){
        await Blog.deleteOne({title: req.params.title})
        res.status(200).json({
            status: "success",
            Blog : blog.title
        })
    }else{
        return next(new AppError("no Blog found" ,404))
    }
})

exports.createBlog = catchAsync(async(req,res,next) => {
    const { title ,category ,content = null } = req.body
    const image = req.file ? req.file.filename : null;

    if(!title){
        return next(new AppError("Please provide a Title" ,400))
    }

    if(image == null){
        return next(new AppError("Please provide an Image" ,400))
    }

    const blog = await Blog.create({
        title,category,content,image
    })

    res.status(201).json({
        status: 'success',
        blog,
        message: "Blog successfully created"
    })
})

exports.editBlog = catchAsync(async(req,res,next) => { 
    let filteredBody = filterObj(req.body ,"title" ,"content" ,"category")
    const newImage = req.file ? req.file.filename : null;
    let blog = await Blog.findOne({title: req.params.title})

    if(!blog) return next(new AppError(`no Blog with ${req.params.title} title` ,400))

    if(newImage && blog.image){
        fs.unlinkSync('./uploads/' + blog.image)
    }

    if(newImage){
        filteredBody.image = newImage
    }

    if(Object.keys(filteredBody).length > 0){
        blog = await Blog.findOneAndUpdate(
        {title : req.params.title} ,filteredBody ,{new: true ,runValidators: true}
    )}else{
        blog = "no change has been made"
    }

    res.status(200).json({
        status:'success',
        data: {
            blog
        }
    })
})