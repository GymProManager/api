const mongoose = require("mongoose");

const usuarioSchema = mongoose.Schema({
  //id: { type: Number, required: false }, // id en SQLAlchemy es autoincremental, por lo que no es requerido en Mongoose
  usuario: { type: String, required: true},
  password: { type: String, required: false , default: "123456"},
  activo: { type: Number, required: false, default: 1 },
});

module.exports = mongoose.model("Usuario", usuarioSchema);