const { Schema, default: mongoose } = require("mongoose")

const dbSchema = new Schema(
    {
        servicios:[String],
        locomotoras:[String],
        guardas:[String],
        conductores:[String],
        pres:[String]
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model("Data_Base", dbSchema)