const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Cuestionario = require("../models/Cuestionario"); // Asegúrate de que la ruta del modelo sea correcta

// Ruta para obtener todos los cuestionarios
router.get("/", async (req, res) => {
  try {
    const cuestionarioList = await Cuestionario.find();
    res.json(cuestionarioList);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

// Ruta para crear un nuevo cuestionario
router.post(
  "/",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const nuevoCuestionario = new Cuestionario(req.body);
      await nuevoCuestionario.save();
      res.json(nuevoCuestionario);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Error del servidor");
    }
  }
);

// Ruta para actualizar un cuestionario por ID
router.put("/:id", async (req, res) => {
  try {
    const cuestionario = await Cuestionario.findById(req.params.id);

    if (!cuestionario) {
      return res.status(404).json({ msg: "Cuestionario no encontrado" });
    }

    // Actualiza los campos necesarios
    if (req.body.nombre) cuestionario.nombre = req.body.nombre;
    if (req.body.descripcion) cuestionario.descripcion = req.body.descripcion;
    if (req.body.preguntas) cuestionario.preguntas = req.body.preguntas;

    await cuestionario.save();
    res.json(cuestionario);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

// Ruta para eliminar un cuestionario por ID
router.delete("/:id", async (req, res) => {
  try {
    const cuestionario = await Cuestionario.findById(req.params.id);

    if (!cuestionario) {
      return res.status(404).json({ msg: "Cuestionario no encontrado" });
    }

    await Cuestionario.deleteOne({ _id: req.params.id });
    res.json({ msg: "Cuestionario eliminado" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

// Ruta para eliminar múltiples cuestionarios por IDs
router.delete("/multiple", async (req, res) => {
  try {
    const { cuestionarioIds } = req.body;

    if (!cuestionarioIds || cuestionarioIds.length === 0) {
      return res.status(400).json({ msg: "IDs de cuestionarios son requeridos" });
    }

    const result = await Cuestionario.deleteMany({ _id: { $in: cuestionarioIds } });

    if (result.deletedCount > 0) {
      return res.json({ msg: "Cuestionarios eliminados exitosamente" });
    } else {
      return res.status(404).json({ msg: "No se encontraron cuestionarios para eliminar" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Cuestionario:
 *       type: object
 *       properties:
 *         nombre:
 *           type: string
 *           description: El nombre del cuestionario
 *         descripcion:
 *           type: string
 *           description: La descripción del cuestionario
 *         preguntas:
 *           type: string
 *           description: JSON stringify de preguntas y opciones
 *           example: |
 *             [
 *               {
 *                 "pregunta": "¿Cuál es tu nombre?",
 *                 "tipo": "texto",
 *                 "respuesta": ""
 *               },
 *               {
 *                 "pregunta": "¿Cuál es tu edad?",
 *                 "tipo": "numero",
 *                 "respuesta": 0
 *               },
 *               {
 *                 "pregunta": "¿Cuál es tu género?",
 *                 "tipo": "opciones",
 *                 "respuesta": "",
 *                 "opciones": ["Masculino", "Femenino"]
 *               }
 *             ]
 */

// Ruta para obtener todos los cuestionarios
// @route   GET api/cuestionario
// @desc    Obtener todos los cuestionarios
// @access  Público
/**
 * @swagger
 * /api/cuestionario:
 *   get:
 *     summary: Obtener todos los cuestionarios
 *     tags:
 *       - Cuestionario
 *     responses:
 *       200:
 *         description: Una lista de todos los cuestionarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cuestionario'
 *       500:
 *         description: Error del servidor
 */

// Ruta para crear un nuevo cuestionario
// @route   POST api/cuestionario
// @desc    Crear un nuevo cuestionario
// @access  Público
/**
 * @swagger
 * /api/cuestionario:
 *   post:
 *     summary: Crear un nuevo cuestionario
 *     tags:
 *       - Cuestionario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cuestionario'
 *     responses:
 *       200:
 *         description: El cuestionario creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cuestionario'
 *       400:
 *         description: Error en los datos de entrada
 *       500:
 *         description: Error del servidor
 */

// Ruta para actualizar un cuestionario por ID
// @route   PUT api/cuestionario/{id}
// @desc    Actualizar un cuestionario por ID
// @access  Público
/**
 * @swagger
 * /api/cuestionario/{id}:
 *   put:
 *     summary: Actualizar un cuestionario por ID
 *     tags:
 *       - Cuestionario
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: El ID del cuestionario a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cuestionario'
 *     responses:
 *       200:
 *         description: El cuestionario actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cuestionario'
 *       404:
 *         description: Cuestionario no encontrado
 *       500:
 *         description: Error del servidor
 */

// Ruta para eliminar un cuestionario por ID
// @route   DELETE api/cuestionario/{id}
// @desc    Eliminar un cuestionario por ID
// @access  Público
/**
 * @swagger
 * /api/cuestionario/{id}:
 *   delete:
 *     summary: Eliminar un cuestionario por ID
 *     tags:
 *       - Cuestionario
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: El ID del cuestionario a eliminar
 *     responses:
 *       200:
 *         description: Cuestionario eliminado
 *       404:
 *         description: Cuestionario no encontrado
 *       500:
 *         description: Error del servidor
 */

// Ruta para eliminar múltiples cuestionarios por IDs
// @route   DELETE api/cuestionario/multiple
// @desc    Eliminar múltiples cuestionarios por IDs
// @access  Público
/**
 * @swagger
 * /api/cuestionario/multiple:
 *   delete:
 *     summary: Eliminar múltiples cuestionarios por IDs
 *     tags:
 *       - Cuestionario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cuestionarioIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Un array de IDs de los cuestionarios a eliminar
 *             example:
 *               cuestionarioIds: ["id1", "id2"]
 *     responses:
 *       200:
 *         description: Cuestionarios eliminados exitosamente
 *       400:
 *         description: Solicitud incorrecta, IDs de cuestionarios requeridos
 *       404:
 *         description: No se encontraron cuestionarios para eliminar
 *       500:
 *         description: Error del servidor
 */
