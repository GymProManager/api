const mongoose = require("mongoose");

const fichaSchema = mongoose.Schema({
  nombre: { type: String, required: true, default: "Sin nombre" },
  archivoBase64: { type: String, required: false },
  descripcion: { type: String, required: false },
});

module.exports = mongoose.model("Ficha", fichaSchema);