const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Actividades = require("../models/Actividades"); // Asegúrate de que la ruta del modelo sea correcta

// Ruta para obtener todas las actividades
router.get("/", async (req, res) => {
  try {
    const actividadesList = await Actividades.find();
    res.json(actividadesList);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

// Ruta para crear una nueva actividad
router.post(
  "/",
  [
    // Puedes agregar validaciones aquí si es necesario
  ],
  async (req, res) => {
    try {
      const nuevaActividad = new Actividades(req.body);
      await nuevaActividad.save();
      res.json(nuevaActividad);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Error del servidor");
    }
  }
);

// Ruta para actualizar una actividad por ID
router.put("/:id", async (req, res) => {
  try {
    const actividad = await Actividades.findById(req.params.id);

    if (!actividad) {
      return res.status(404).json({ msg: "Actividad no encontrada" });
    }

    // Actualiza los campos necesarios
    if (req.body.imagen) actividad.imagen = req.body.imagen;
    if (req.body.actividades) actividad.actividades = req.body.actividades;
    if (req.body.tipo) actividad.tipo = req.body.tipo;
    if (req.body.grupo_actividad) actividad.grupo_actividad = req.body.grupo_actividad;

    await actividad.save();
    res.json(actividad);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

// Ruta para eliminar una actividad por ID
router.delete("/:id", async (req, res) => {
  try {
    const actividad = await Actividades.findById(req.params.id);

    if (!actividad) {
      return res.status(404).json({ msg: "Actividad no encontrada" });
    }

    await Actividades.deleteOne({ _id: req.params.id });
    res.json({ msg: "Actividad eliminada" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

// Ruta para eliminar múltiples actividades por IDs
router.delete("/multiple", async (req, res) => {
  try {
    const { actividadIds } = req.body;

    if (!actividadIds || actividadIds.length === 0) {
      return res.status(400).json({ msg: "IDs de actividades son requeridos" });
    }

    const result = await Actividades.deleteMany({ _id: { $in: actividadIds } });

    if (result.deletedCount > 0) {
      return res.json({ msg: "Actividades eliminadas exitosamente" });
    } else {
      return res.status(404).json({ msg: "No se encontraron actividades para eliminar" });
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
 *     Actividades:
 *       type: object
 *       properties:
 *         imagen:
 *           type: string
 *           description: La URL de la imagen de la actividad
 *         actividades:
 *           type: string
 *           description: El nombre de la actividad
 *         tipo:
 *           type: number
 *           description: El tipo de actividad (por ejemplo, 1 = Individual, 2 = Grupal)
 *         grupo_actividad:
 *           type: string
 *           description: El grupo de actividad al que pertenece
 *       example:
 *         imagen: "https://ejemplo.com/imagen.jpg"
 *         actividades: "Yoga"
 *         tipo: 1
 *         grupo_actividad: "60c72b2f9b1e8b3a789e4a02"
 */

// Ruta para obtener todas las actividades
// @route   GET api/actividades
// @desc    Obtener todas las actividades
// @access  Público
/**
 * @swagger
 * /api/actividades:
 *   get:
 *     summary: Obtener todas las actividades
 *     tags:
 *       - Actividades
 *     responses:
 *       200:
 *         description: Una lista de todas las actividades
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Actividades'
 *       500:
 *         description: Error del servidor
 */

// Ruta para crear una nueva actividad
// @route   POST api/actividades
// @desc    Crear una nueva actividad
// @access  Público
/**
 * @swagger
 * /api/actividades:
 *   post:
 *     summary: Crear una nueva actividad
 *     tags:
 *       - Actividades
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Actividades'
 *     responses:
 *       200:
 *         description: La actividad creada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Actividades'
 *       500:
 *         description: Error del servidor
 */

// Ruta para actualizar una actividad por ID
// @route   PUT api/actividades/{id}
// @desc    Actualizar una actividad por ID
// @access  Público
/**
 * @swagger
 * /api/actividades/{id}:
 *   put:
 *     summary: Actualizar una actividad por ID
 *     tags:
 *       - Actividades
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: El ID de la actividad a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Actividades'
 *     responses:
 *       200:
 *         description: La actividad actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Actividades'
 *       404:
 *         description: Actividad no encontrada
 *       500:
 *         description: Error del servidor
 */

// Ruta para eliminar una actividad por ID
// @route   DELETE api/actividades/{id}
// @desc    Eliminar una actividad por ID
// @access  Público
/**
 * @swagger
 * /api/actividades/{id}:
 *   delete:
 *     summary: Eliminar una actividad por ID
 *     tags:
 *       - Actividades
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: El ID de la actividad a eliminar
 *     responses:
 *       200:
 *         description: Actividad eliminada
 *       404:
 *         description: Actividad no encontrada
 *       500:
 *         description: Error del servidor
 */

// Ruta para eliminar múltiples actividades por IDs
// @route   DELETE api/actividades/multiple
// @desc    Eliminar múltiples actividades por IDs
// @access  Público
/**
 * @swagger
 * /api/actividades/multiple:
 *   delete:
 *     summary: Eliminar múltiples actividades por IDs
 *     tags:
 *       - Actividades
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               actividadIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Un array de IDs de las actividades a eliminar
 *             example:
 *               actividadIds: ["id1", "id2"]
 *     responses:
 *       200:
 *         description: Actividades eliminadas exitosamente
 *       400:
 *         description: Solicitud incorrecta, IDs de actividades requeridos
 *       404:
 *         description: No se encontraron actividades para eliminar
 *       500:
 *         description: Error del servidor
 */
