const homeHandler = (req,res)=>{
    // res.send(`<h1>Hello World from Controller!</h1>`)
    res.render('homePage')
}

module.exports = {
    homeHandler
}