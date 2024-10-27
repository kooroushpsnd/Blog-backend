const express = require('express')
const router = express.Router()

router.get('/' ,(req ,res) => {
    res.send('Hello and Welcome to my website please use Users and Blogs routes to access other parts')
})

module.exports = router