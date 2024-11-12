const mongoose = require("mongoose");

const cuestionariochema = mongoose.Schema({
  nombre: { type: String, required: true, default: "Sin nombre" },  
  descripcion: { type: String, required: false },
  preguntas: { type: String, required: false },
});

module.exports = mongoose.model("Cuestionario", cuestionariochema);


// 

const preguntas_ejemplo = [
    {
        "pregunta": "¿Cuál es tu nombre?",
        "tipo": "texto",
        "respuesta": ""
   },
   {
        "pregunta": "¿Cuál es tu edad?",
        "tipo": "numero",
        "respuesta": 0
   },
   {
        "pregunta": "¿Cuál es tu género?",
        "tipo": "opciones",
        "respuesta": "",
        "opciones": ["Masculino", "Femenino"]
   }
];