const mongoose=require("mongoose")

const Schema=require("mongoose").Schema

userSchema=new Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

User=mongoose.model("User",userSchema)

module.exports={
    User
}