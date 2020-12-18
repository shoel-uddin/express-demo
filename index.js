const http = require('http')
const express = require('express')
const morgan = require('morgan')

const app = express()
const server = http.createServer(app)
const logger = morgan('dev')

const homeRouter = require('./routers/homeRouter')

const PORT = 3000


app.use(logger)
app.use('/', homeRouter)
// app.get('/',(req,res)=>{
//     res.send(`<h1>Hello World!</h1>`)
// })

server.listen(PORT, ()=>{
    console.log(`Listening at port ${PORT}`)
})