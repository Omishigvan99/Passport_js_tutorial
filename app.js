const express = require("express")
const session = require("express-session")
const mongoose = require("mongoose")
const MongoStore = require("connect-mongo")
const router=require("./routes/index")
const passport = require("./LocalPassport").passport

//to access all env variables
require("dotenv").config()

//creating app
const app=express()

//genral setup

app.use(express.urlencoded({extended:true}))

//connecting to database
mongoose.connect(process.env.DB_STRING, { useNewUrlParser: true, useUnifiedTopology: true }).then((result)=>{
    console.log("Connected to database")
    app.listen(3000)
    console.log("App Started")
}).catch((err)=>{
    console.log("Something went wrong while connecting to db")
})


//creating session store
sessionStore = MongoStore.create({
    mongoUrl: process.env.DB_STRING,
    collectionName: 'sessions'
})

//creating express session
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store:sessionStore,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}))

//setting passport
require("./LocalPassport") // Requiring Passport so app.js can know about LocalPassport
app.use(passport.initialize())
app.use(passport.session())

//uderstanding passport middleware

app.use((req,res,next)=>{
    console.log(req.session)
    console.log(req.user)
    next()
})

//using routes
app.use(router)

app.use((req,res)=>{
    res.send("404 Error")
})