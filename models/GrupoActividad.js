const mongoose = require("mongoose");

const grupoActividadSchema = mongoose.Schema({
  //id: { type: Number, required: false }, // id en SQLAlchemy es autoincremental, por lo que no es requerido en Mongoose
  imagen : { type: String, required: false },
  nivel_esfuerzo: { type: String, required: false },
  valor: { type: Number, required: false },
});

module.exports = mongoose.model("GrupoActividad", grupoActividadSchema);