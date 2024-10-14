const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Recompensas = require("../models/Recompensas"); // Asegúrate de que la ruta del modelo sea correcta

// Ruta para obtener todas las recompensas
router.get("/", async (req, res) => {
  try {
    const recompensasList = await Recompensas.find();
    res.json(recompensasList);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

// Ruta para crear una nueva recompensa
router.post(
  "/",
  [
    // Puedes agregar validaciones aquí si es necesario
  ],
  async (req, res) => {
    try {
      const nuevaRecompensa = new Recompensas(req.body);
      await nuevaRecompensa.save();
      res.json(nuevaRecompensa);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Error del servidor");
    }
  }
);

// Ruta para actualizar una recompensa por ID
router.put("/:id", async (req, res) => {
  try {
    const recompensa = await Recompensas.findById(req.params.id);

    if (!recompensa) {
      return res.status(404).json({ msg: "Recompensa no encontrada" });
    }

    // Actualiza los campos necesarios
    if (req.body.nombre) recompensa.nombre = req.body.nombre;
    if (req.body.descripcion) recompensa.descripcion = req.body.descripcion;

    await recompensa.save();
    res.json(recompensa);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

// Ruta para eliminar una recompensa por ID
router.delete("/:id", async (req, res) => {
  try {
    const recompensa = await Recompensas.findById(req.params.id);

    if (!recompensa) {
      return res.status(404).json({ msg: "Recompensa no encontrada" });
    }

    await Recompensas.deleteOne({ _id: req.params.id });
    res.json({ msg: "Recompensa eliminada" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

// Ruta para eliminar múltiples recompensas por IDs
router.delete("/multiple", async (req, res) => {
  try {
    const { recompensaIds } = req.body;

    if (!recompensaIds || recompensaIds.length === 0) {
      return res.status(400).json({ msg: "IDs de recompensas son requeridos" });
    }

    const result = await Recompensas.deleteMany({ _id: { $in: recompensaIds } });

    if (result.deletedCount > 0) {
      return res.json({ msg: "Recompensas eliminadas exitosamente" });
    } else {
      return res.status(404).json({ msg: "No se encontraron recompensas para eliminar" });
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
 *     Recompensas:
 *       type: object
 *       properties:
 *         nombre:
 *           type: string
 *           description: El nombre de la recompensa
 *         descripcion:
 *           type: string
 *           description: La descripción de la recompensa
 *       example:
 *         nombre: "Recompensa por lealtad"
 *         descripcion: "Recompensa otorgada por acumular 100 puntos"
 */

// Ruta para obtener todas las recompensas
// @route   GET api/recompensas
// @desc    Obtener todas las recompensas
// @access  Público
/**
 * @swagger
 * /api/recompensas:
 *   get:
 *     summary: Obtener todas las recompensas
 *     tags:
 *       - Recompensas
 *     responses:
 *       200:
 *         description: Una lista de todas las recompensas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Recompensas'
 *       500:
 *         description: Error del servidor
 */

// Ruta para crear una nueva recompensa
// @route   POST api/recompensas
// @desc    Crear una nueva recompensa
// @access  Público
/**
 * @swagger
 * /api/recompensas:
 *   post:
 *     summary: Crear una nueva recompensa
 *     tags:
 *       - Recompensas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Recompensas'
 *     responses:
 *       200:
 *         description: La recompensa creada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recompensas'
 *       500:
 *         description: Error del servidor
 */

// Ruta para actualizar una recompensa por ID
// @route   PUT api/recompensas/{id}
// @desc    Actualizar una recompensa por ID
// @access  Público
/**
 * @swagger
 * /api/recompensas/{id}:
 *   put:
 *     summary: Actualizar una recompensa por ID
 *     tags:
 *       - Recompensas
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: El ID de la recompensa a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Recompensas'
 *     responses:
 *       200:
 *         description: La recompensa actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recompensas'
 *       404:
 *         description: Recompensa no encontrada
 *       500:
 *         description: Error del servidor
 */

// Ruta para eliminar una recompensa por ID
// @route   DELETE api/recompensas/{id}
// @desc    Eliminar una recompensa por ID
// @access  Público
/**
 * @swagger
 * /api/recompensas/{id}:
 *   delete:
 *     summary: Eliminar una recompensa por ID
 *     tags:
 *       - Recompensas
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: El ID de la recompensa a eliminar
 *     responses:
 *       200:
 *         description: Recompensa eliminada
 *       404:
 *         description: Recompensa no encontrada
 *       500:
 *         description: Error del servidor
 */

// Ruta para eliminar múltiples recompensas por IDs
// @route   DELETE api/recompensas/multiple
// @desc    Eliminar múltiples recompensas por IDs
// @access  Público
/**
 * @swagger
 * /api/recompensas/multiple:
 *   delete:
 *     summary: Eliminar múltiples recompensas por IDs
 *     tags:
 *       - Recompensas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               recompensaIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Un array de IDs de las recompensas a eliminar
 *             example:
 *               recompensaIds: ["id1", "id2"]
 *     responses:
 *       200:
 *         description: Recompensas eliminadas exitosamente
 *       400:
 *         description: Solicitud incorrecta, IDs de recompensas requeridos
 *       404:
 *         description: No se encontraron recompensas para eliminar
 *       500:
 *         description: Error del servidor
 */
