const http = require('http')
const express = require('express')
const morgan = require('morgan')
const es6Renderer = require('express-es6-template-engine')

const app = express()
const server = http.createServer(app)
const logger = morgan('dev')

app.engine('html', es6Renderer);
app.set('views', 'templates');
app.set('view engine', 'html');

const PORT = 3000
const homeRouter = require('./routers/homeRouter')
const movieRouter = require('./routers/movieRouter')
const data = require('./data.json')

app.use(logger)
app.use('/', homeRouter)
// app.get('/',(req,res)=>{
//     res.send(`<h1>Hello World!</h1>`)
// })

app.use('/movies', movieRouter)

server.listen(PORT, ()=>{
    console.log(`Listening at port ${PORT}`)
})