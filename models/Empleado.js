const mongoose = require("mongoose");

const empleadoSchema = mongoose.Schema({
  //id: { type: Number, required: false }, // id en SQLAlchemy es autoincremental, por lo que no es requerido en Mongoose
  nombre: { type: String, required: false },
  apellidos: { type: String, required: false },
  perfil: { type: String, required: false },
  foto: { type: String, required: false },
  fecha_alta: { type: Date, required: false },
  fecha_inicio: { type: Date, required: false },
  telefono: { type: String, required: false }
});

module.exports = mongoose.model("Empleado", empleadoSchema);