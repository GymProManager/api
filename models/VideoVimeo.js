const mongoose = require("mongoose");

const videoVimeoSchema = mongoose.Schema({
  nombre: { type: String, required: true, default: "Sin nombre" },
  imagenBase64: { type: String, required: false },
  link: { type: String, required: false },
  descripcion: { type: String, required: false },
});

module.exports = mongoose.model("VideoVimeo", videoVimeoSchema);