const mongoose = require("mongoose");

const horarioSchema = mongoose.Schema({
  //id: { type: Number, required: false }, // id en SQLAlchemy es autoincremental, por lo que no es requerido en Mongoose
  nombre : { type: String, required: false },
  descripcion: { type: String, required: false },  
  hora_inicio: { type: String, required: false },  
  hora_fin: { type: String, required: false },  
});

module.exports = mongoose.model("Horario", horarioSchema);