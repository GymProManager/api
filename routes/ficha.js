const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Ficha = require("../models/Ficha"); // Asegúrate de que la ruta del modelo sea correcta

// Ruta para obtener todas las fichas
router.get("/", async (req, res) => {
  try {
    const fichaList = await Ficha.find();
    res.json(fichaList);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

// Ruta para crear una nueva ficha
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
      const nuevaFicha = new Ficha(req.body);
      await nuevaFicha.save();
      res.json(nuevaFicha);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Error del servidor");
    }
  }
);

// Ruta para actualizar una ficha por ID
router.put("/:id", async (req, res) => {
  try {
    const ficha = await Ficha.findById(req.params.id);

    if (!ficha) {
      return res.status(404).json({ msg: "Ficha no encontrada" });
    }

    // Actualiza los campos necesarios
    if (req.body.nombre) ficha.nombre = req.body.nombre;
    if (req.body.archivoBase64) ficha.archivoBase64 = req.body.archivoBase64;
    if (req.body.descripcion) ficha.descripcion = req.body.descripcion;

    await ficha.save();
    res.json(ficha);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

// Ruta para eliminar una ficha por ID
router.delete("/:id", async (req, res) => {
  try {
    const ficha = await Ficha.findById(req.params.id);

    if (!ficha) {
      return res.status(404).json({ msg: "Ficha no encontrada" });
    }

    await Ficha.deleteOne({ _id: req.params.id });
    res.json({ msg: "Ficha eliminada" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

// Ruta para eliminar múltiples fichas por IDs
router.delete("/multiple", async (req, res) => {
  try {
    const { fichaIds } = req.body;

    if (!fichaIds || fichaIds.length === 0) {
      return res.status(400).json({ msg: "IDs de fichas son requeridos" });
    }

    const result = await Ficha.deleteMany({ _id: { $in: fichaIds } });

    if (result.deletedCount > 0) {
      return res.json({ msg: "Fichas eliminadas exitosamente" });
    } else {
      return res.status(404).json({ msg: "No se encontraron fichas para eliminar" });
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
 *     Ficha:
 *       type: object
 *       properties:
 *         nombre:
 *           type: string
 *           description: El nombre de la ficha
 *         archivoBase64:
 *           type: string
 *           description: El archivo en formato Base64 de la ficha
 *         descripcion:
 *           type: string
 *           description: La descripción de la ficha
 *       example:
 *         nombre: "Ficha de Proyecto"
 *         archivoBase64: "dGhpcyBpcyBhIGJhc2U2NCBlbmNvZGVkIGZpbGU="
 *         descripcion: "Ficha que contiene detalles del proyecto"
 */

// Ruta para obtener todas las fichas
// @route   GET api/ficha
// @desc    Obtener todas las fichas
// @access  Público
/**
 * @swagger
 * /api/ficha:
 *   get:
 *     summary: Obtener todas las fichas
 *     tags:
 *       - Ficha
 *     responses:
 *       200:
 *         description: Una lista de todas las fichas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ficha'
 *       500:
 *         description: Error del servidor
 */

// Ruta para crear una nueva ficha
// @route   POST api/ficha
// @desc    Crear una nueva ficha
// @access  Público
/**
 * @swagger
 * /api/ficha:
 *   post:
 *     summary: Crear una nueva ficha
 *     tags:
 *       - Ficha
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Ficha'
 *     responses:
 *       200:
 *         description: La ficha creada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ficha'
 *       400:
 *         description: Error en los datos de entrada
 *       500:
 *         description: Error del servidor
 */

// Ruta para actualizar una ficha por ID
// @route   PUT api/ficha/{id}
// @desc    Actualizar una ficha por ID
// @access  Público
/**
 * @swagger
 * /api/ficha/{id}:
 *   put:
 *     summary: Actualizar una ficha por ID
 *     tags:
 *       - Ficha
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: El ID de la ficha a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Ficha'
 *     responses:
 *       200:
 *         description: La ficha actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ficha'
 *       404:
 *         description: Ficha no encontrada
 *       500:
 *         description: Error del servidor
 */

// Ruta para eliminar una ficha por ID
// @route   DELETE api/ficha/{id}
// @desc    Eliminar una ficha por ID
// @access  Público
/**
 * @swagger
 * /api/ficha/{id}:
 *   delete:
 *     summary: Eliminar una ficha por ID
 *     tags:
 *       - Ficha
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: El ID de la ficha a eliminar
 *     responses:
 *       200:
 *         description: Ficha eliminada
 *       404:
 *         description: Ficha no encontrada
 *       500:
 *         description: Error del servidor
 */

// Ruta para eliminar múltiples fichas por IDs
// @route   DELETE api/ficha/multiple
// @desc    Eliminar múltiples fichas por IDs
// @access  Público
/**
 * @swagger
 * /api/ficha/multiple:
 *   delete:
 *     summary: Eliminar múltiples fichas por IDs
 *     tags:
 *       - Ficha
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fichaIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Un array de IDs de las fichas a eliminar
 *             example:
 *               fichaIds: ["id1", "id2"]
 *     responses:
 *       200:
 *         description: Fichas eliminadas exitosamente
 *       400:
 *         description: Solicitud incorrecta, IDs de fichas requeridos
 *       404:
 *         description: No se encontraron fichas para eliminar
 *       500:
 *         description: Error del servidor
 */
