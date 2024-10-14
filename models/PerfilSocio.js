const mongoose = require("mongoose");

const perfilSocioSchema = mongoose.Schema({
  //id: { type: Number, required: false }, // id en SQLAlchemy es autoincremental, por lo que no es requerido en Mongoose
  nombre: { type: String, required: false },
  descripcion: { type: String, required: false },
});

module.exports = mongoose.model("PerfilSocio", perfilSocioSchema);