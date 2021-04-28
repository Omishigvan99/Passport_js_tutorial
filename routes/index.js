const router = require("express").Router()
const User = require("../models/UserModel").User
const bcrypt = require("bcrypt")
const passport=require("../LocalPassport").passport

router.get("/", (req, res) => {
    res.sendFile("D:/node.js/passport js tutorial/html/registerform.html")
})

router.post("/register", async (req, res) => {
    try {
        pass = await bcrypt.hash(req.body.password, 2)

        result = await User.findOne({ username: req.body.username })

        if (result) {
            res.send("User already exists" + result)
        } else {
            user = new User({
                username: req.body.username,
                password: pass
            })

            saveResult = await user.save()
            res.send("Saved to database")
        }
    } catch (err) {
        console.log(err)
    }
})

router.post("/login-user",passport.authenticate('local',{failureRedirect:"/loginfailure",successRedirect:"/loginSuccess"}))

router.get("/login",(req,res)=>{
    res.sendFile("D:/node.js/passport js tutorial/html/loginform.html")
})

router.get("/protectedroute",(req,res)=>{
    if(req.isAuthenticated()){
        res.send('This is protected route <a href="/logout">logout</a>')
    }else{
        res.redirect("/login")
    }
})

router.get("/loginfailure",(req,res)=>{
    res.send("Login failed")
})

router.get("/loginSuccess",(req,res)=>{
    res.send('login success <a href="/protectedroute">route</a>')
})

router.get("/logout",(req,res)=>{
    req.logOut()
    res.redirect("/login")
})


module.exports = router