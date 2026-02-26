import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email:{
            required:true,
            unique:true,
            type:String
        },
        fullName:{
            required:true,
            type:String
        },
        password:{
            type:String,
            required:true,
            minlength:6,
        },
        profilepic:{
            type:String,
            default:""
        }

},
{timestamps:true}
)

const User = mongoose.model("User",userSchema)

export default User;