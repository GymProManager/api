const mongoose = require("mongoose");

const socioSchema = mongoose.Schema({
  //id: { type: Number, required: false }, // id en SQLAlchemy es autoincremental, por lo que no es requerido en Mongoose
  nombre: { type: String, required: false },
  apellidos: { type: String, required: false },
  fecha_inicio: { type: Date, required: false },
  fecha_alta: { type: Date, required: false },
  telefono: { type: String, required: false } ,
  perfil_socio : { type: mongoose.Schema.Types.ObjectId, ref: "PerfilSocio", required: false },
});

module.exports = mongoose.model("Socio", socioSchema);