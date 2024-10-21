const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Horario = require("../models/Horario"); // Asegúrate de que la ruta del modelo sea correcta

// Ruta para obtener todos los horarios
router.get("/", async (req, res) => {
  try {
    const horarioList = await Horario.find();
    res.json(horarioList);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

// Ruta para crear un nuevo horario
router.post(
  "/",
  [
    // Puedes agregar validaciones aquí si es necesario
  ],
  async (req, res) => {
    try {
      const nuevoHorario = new Horario(req.body);
      await nuevoHorario.save();
      res.json(nuevoHorario);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Error del servidor");
    }
  }
);

// Ruta para actualizar un horario por ID
router.put("/:id", async (req, res) => {
  try {
    const horario = await Horario.findById(req.params.id);

    if (!horario) {
      return res.status(404).json({ msg: "Horario no encontrado" });
    }

    // Actualiza los campos necesarios
    if (req.body.nombre) horario.nombre = req.body.nombre;
    if (req.body.descripcion) horario.descripcion = req.body.descripcion;
    if (req.body.hora_inicio) horario.hora_inicio = req.body.hora_inicio;
    if (req.body.hora_fin) horario.hora_fin = req.body.hora_fin;

    await horario.save();
    res.json(horario);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

// Ruta para eliminar un horario por ID
router.delete("/:id", async (req, res) => {
  try {
    const horario = await Horario.findById(req.params.id);

    if (!horario) {
      return res.status(404).json({ msg: "Horario no encontrado" });
    }

    await Horario.deleteOne({ _id: req.params.id });
    res.json({ msg: "Horario eliminado" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

// Ruta para eliminar múltiples horarios por IDs
router.delete("/multiple", async (req, res) => {
  try {
    const { horarioIds } = req.body;

    if (!horarioIds || horarioIds.length === 0) {
      return res.status(400).json({ msg: "IDs de horarios son requeridos" });
    }

    const result = await Horario.deleteMany({ _id: { $in: horarioIds } });

    if (result.deletedCount > 0) {
      return res.json({ msg: "Horarios eliminados exitosamente" });
    } else {
      return res.status(404).json({ msg: "No se encontraron horarios para eliminar" });
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
 *     Horario:
 *       type: object
 *       properties:
 *         nombre:
 *           type: string
 *           description: El nombre del horario
 *         descripcion:
 *           type: string
 *           description: La descripción del horario
 *         hora_inicio:
 *           type: string
 *           description: La hora de inicio del horario (formato HH:MM)
 *         hora_fin:
 *           type: string
 *           description: La hora de fin del horario (formato HH:MM)
 *       example:
 *         nombre: "Horario matutino"
 *         descripcion: "Horario de 9 AM a 12 PM"
 *         hora_inicio: "09:00"
 *         hora_fin: "12:00"
 */

// Ruta para obtener todos los horarios
// @route   GET api/horario
// @desc    Obtener todos los horarios
// @access  Público
/**
 * @swagger
 * /api/horario:
 *   get:
 *     summary: Obtener todos los horarios
 *     tags:
 *       - Horario
 *     responses:
 *       200:
 *         description: Una lista de todos los horarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Horario'
 *       500:
 *         description: Error del servidor
 */

// Ruta para crear un nuevo horario
// @route   POST api/horario
// @desc    Crear un nuevo horario
// @access  Público
/**
 * @swagger
 * /api/horario:
 *   post:
 *     summary: Crear un nuevo horario
 *     tags:
 *       - Horario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Horario'
 *     responses:
 *       200:
 *         description: El horario creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Horario'
 *       500:
 *         description: Error del servidor
 */

// Ruta para actualizar un horario por ID
// @route   PUT api/horario/{id}
// @desc    Actualizar un horario por ID
// @access  Público
/**
 * @swagger
 * /api/horario/{id}:
 *   put:
 *     summary: Actualizar un horario por ID
 *     tags:
 *       - Horario
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: El ID del horario a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Horario'
 *     responses:
 *       200:
 *         description: El horario actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Horario'
 *       404:
 *         description: Horario no encontrado
 *       500:
 *         description: Error del servidor
 */

// Ruta para eliminar un horario por ID
// @route   DELETE api/horario/{id}
// @desc    Eliminar un horario por ID
// @access  Público
/**
 * @swagger
 * /api/horario/{id}:
 *   delete:
 *     summary: Eliminar un horario por ID
 *     tags:
 *       - Horario
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: El ID del horario a eliminar
 *     responses:
 *       200:
 *         description: Horario eliminado
 *       404:
 *         description: Horario no encontrado
 *       500:
 *         description: Error del servidor
 */

// Ruta para eliminar múltiples horarios por IDs
// @route   DELETE api/horario/multiple
// @desc    Eliminar múltiples horarios por IDs
// @access  Público
/**
 * @swagger
 * /api/horario/multiple:
 *   delete:
 *     summary: Eliminar múltiples horarios por IDs
 *     tags:
 *       - Horario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               horarioIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Un array de IDs de los horarios a eliminar
 *             example:
 *               horarioIds: ["id1", "id2"]
 *     responses:
 *       200:
 *         description: Horarios eliminados exitosamente
 *       400:
 *         description: Solicitud incorrecta, IDs de horarios requeridos
 *       404:
 *         description: No se encontraron horarios para eliminar
 *       500:
 *         description: Error del servidor
 */
