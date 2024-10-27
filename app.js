const express = require('express')
const AppError = require('./utils/appError')
const errorController = require('./controller/errorController')
const blogRouter = require('./routes/blogRoutes')
const appRouter = require('./routes/appRoutes')
const helmet = require("helmet")
const mongoSanitize = require("express-mongo-sanitize")
const XSS = require("xss-clean")
const HPP = require("hpp")
const bodyparser = require("body-parser")
const cors = require('cors')
const path = require('path')

const app = express()
app.use('/uploads' ,express.static(path.join(__dirname ,'uploads')))

app.use(cors())
app.options('*' ,cors())

app.use(helmet())
app.use(express.json())

app.use(mongoSanitize())
app.use(XSS())
app.use(HPP())

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended: false}))

app.use('/blogs' ,blogRouter)
app.use('/' ,appRouter)

app.all('*' , (req ,res ,next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!` ,404))
})

app.use(errorController)

module.exports = app;