const mongoose = require("mongoose");

const marketingSchema = mongoose.Schema({
  //id: { type: Number, required: false }, // id en SQLAlchemy es autoincremental, por lo que no es requerido en Mongoose
  campaña : { type: String, required: false },
  descripcion: { type: String, required: false },  
});

module.exports = mongoose.model("Marketing", marketingSchema);