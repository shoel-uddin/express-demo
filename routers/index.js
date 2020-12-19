
const homeRouter=  require('./homeRouter')
const movieRouter=  require('./movieRouter')


const express = require('express')
const router = express.Router()

router.use('/', homeRouter)
router.use('/movies', movieRouter)

module.exports = router