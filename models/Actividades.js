const mongoose = require("mongoose");

const actividadesSchema = mongoose.Schema({
  //id: { type: Number, required: false }, // id en SQLAlchemy es autoincremental, por lo que no es requerido en Mongoose
  imagen: { type: String, required: false },
  actividades: { type: String, required: false },    
  tipo: { type: Number, required: false },
  grupo_actividad: { type: String, required: false },
});

module.exports = mongoose.model("Actividades", actividadesSchema);