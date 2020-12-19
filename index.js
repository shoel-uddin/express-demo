const http = require('http')
const express = require('express')
const morgan = require('morgan')
const es6Renderer = require('express-es6-template-engine')


const app = express()
const server = http.createServer(app)
const logger = morgan('dev')
app.use(express.urlencoded({extended: true}))
app.engine('html', es6Renderer);
app.set('views', 'templates');
app.set('view engine', 'html');

const PORT = 3000

const session = require('express-session');
const FileStore = require('session-file-store')(session);
app.use(session({
    store: new FileStore(),  // no options for now
    secret: 'asdfasdfasdfsafsafsafdasdfasdf3',
    saveUninitialized: false,
    resave: true,
    rolling: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}));


const router = require('./routers')
const { User } = require('./models')
const bcrypt = require('bcryptjs')

app.use(logger)
app.use(router)

app.get('/create',(req,res)=>{
    res.send(`
<form method="POST">
    <input type="text" name="username" autofocus placeholder="username">
    <br>
    <input type="password" name="password">
    <br>
    <input type="submit" value="Create User">
</form>    
    `);
})
app.post('/create', async (req, res)=>{
    const {
        username,
        password
    } = req.body;
    const hash = bcrypt.hashSync(password, 10)
    try{
        const newUser = await User.create({
            username,
            hash
        })
        console.log(newUser);
    
        res.send('user created')

    } catch (e) {
        res.send(`
        <h1>UserName Is Taken!</h1>
        <br>
        <h1>TRY AGAIN</h1>
        `);
    }
})

app.get('/login',(req,res)=>{
    res.send(`
<form method="POST">
    <input type="text" name="username" autofocus placeholder="username">
    <br>
    <input type="password" name="password">
    <br>
    <input type="submit" value="Login">
</form>    
    `);
})

app.post('/login', async (req,res)=>{
    const {
        username,
        password
    } = req.body;

    const user = await User.findOne({
        where: {
            username
        }
    })
    if (user) {
        //res.send(`Welcome ${username}!`)
        const isValid = bcrypt.compareSync(password, user.hash)
        if (isValid){

            req.session.user = {
                username: user.username,
                id: user.id
            };
            req.session.save(() => {
                res.send(`
                <h2>That is Right</h2>
                <br>
                <h6>ShoDotz &copy;</h6>
                `)
            });
        } else {
            res.send(' WRONG!!!')
        }
    } else{
        res.send(`TRY AGAIN! No User found!`)
    }
})



const isLoggedIn = (req, res, next) => {
    console.log("logged in works");
    if (req.session.user){
        next();
    } else {
        res.send(`
        <h1> Better Luck Next Time!</h1>
        <br>
        <h6>ShoDotz &copy;</h6>
        `)
    }
}

app.post('/logout', (req, res) => {
    req.session.destroy(() => {
        console.log('LOGOUT!');
        // after deleting the session...
        res.redirect('/login');
    });
});

app.use(isLoggedIn)
app.get('/restricted', (req,res)=>{
    console.log(req.session.user);
    if (req.session.user){
        res.send(`
        <h1>Welcome!</h1>
        <form method="POST" action="/logout">
            <input type="submit" value="logout">
        </form>
        <br>
        <h6>ShoDotz &copy;</h6>
        `);
    } 
    //res.send('<h1> Wrong!</h1>')
})

app.get ('/also-restricted', (req,res)=> {
    res.send('JackPot')
})

server.listen(PORT, ()=>{
    console.log(`Listening at port ${PORT}`)
})