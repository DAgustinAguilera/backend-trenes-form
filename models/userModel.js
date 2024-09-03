const { Schema, default: mongoose } = require("mongoose")

const userSchema = new Schema(
    {
        firstname:String,
        lastname:String,
        pictureurl:String,
        email:String,
        googleId:String,
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model("User", userSchema)