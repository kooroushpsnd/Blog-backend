const { default: mongoose } = require("mongoose");

const blogSchema = new mongoose.Schema({
    title:{
        type: String,
        require: [true ,'Blog must have a title'],
        unique: true
    },
    category: {
        type: String,
        default: 'generall'
    },
    content: String,
    image: String,
    created: {
        type: Date,
        default: Date.now
    }
})

const Blog = mongoose.model("Blog" ,blogSchema)

module.exports = Blog