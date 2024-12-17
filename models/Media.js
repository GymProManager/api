const mongoose = require("mongoose");

const entrenamientoSchema = mongoose.Schema({
  //id: { type: Number, required: false }, // id en SQLAlchemy es autoincremental, por lo que no es requerido en Mongoose
  imagen: { type: String, required: false },
  nombre: { type: String, required: false },
  semanas: { type: Number, required: false },
  etiquetas: { type: String, required: false },
  empleado: { type: String, required: false },  
  tipo: { type: Number, required: false },
});

module.exports = mongoose.model("Entrenamiento", entrenamientoSchema);