const { Schema, default: mongoose } = require("mongoose")

const reporteSchema = new Schema(
    {
        servicio:String,
        locomotora:String,
        siendo:String,
        nombre:String,
        guarda:String,
        con:String,
        art:String,
        dia:String,
        observaciones:String,
        estado:Boolean
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model("Reporte", reporteSchema)