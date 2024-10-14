const mongoose = require("mongoose");

const claseSchema = mongoose.Schema({
  //id: { type: Number, required: false }, // id en SQLAlchemy es autoincremental, por lo que no es requerido en Mongoose
  imagen: { type: String, required: false },
  titulo: { type: String, required: false },
  tipo: { type: Number, required: false },
  idioma: { type: String, required: false },
});

module.exports = mongoose.model("Clases", claseSchema);