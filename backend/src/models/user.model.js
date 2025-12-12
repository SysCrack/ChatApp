import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
        email: {
            type : String,
            required : true,
            uniques : true
        },
        fullName: {
            type : String,
            required : true,
        },
        password: {
            type : String,
            minlength : 6,
            required : true
        },
        profilePic: {
            type: String,
            default : ""
        }
    }, {
    timestamps : true
})


const user = mongoose.model("User", userSchema);

export default user;