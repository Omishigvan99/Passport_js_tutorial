const LocalStrategy = require("passport-local")
const passport = require("passport")
const User = require("./models/UserModel").User
const bcrypt = require("bcrypt")

async function isValid(user, pass) {
    console.log("Got isValid")
    try {
        var hash = user.password
        var result = await bcrypt.compare(pass, hash)
        console.log("bcrypt result:"+result)
        return result
    } catch (error) {
        console.log(error)
    }
}

async function verifyCallback(username, password, done) {
    console.log("Got verifyCallback")
    try {
        var user = await User.findOne({ username: username })
        console.log(user)

        if (!user) {
            return done(null, false)
        }

        if (await isValid(user, password)) {
            console.log("true got called")
            return done(null, user,{message:"Vaild user"})
        } else {
            console.log("false got called")
            return done(null, false,{message:"Invalid user"})
        }
    } catch (error) {
        return done(error)
    }

}

const strategy = new LocalStrategy(verifyCallback)

passport.use(strategy)

passport.serializeUser((user, done) => {
    console.log("Serialized")
    return done(null, user.id)
})
passport.deserializeUser((userID, done) => {
    console.log("deserialized")
    User.findById(userID).then((result) => {
        done(null, result)
    }).catch((err) => {
        done(err)
    })
})

module.exports={passport}