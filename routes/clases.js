const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Clase = require("../models/Clases"); // Asegúrate de que la ruta del modelo sea correcta

// Ruta para obtener todas las clases
router.get("/", async (req, res) => {
  try {
    const claseList = await Clase.find();
    res.json(claseList);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

// Ruta para crear una nueva clase
router.post(
  "/",
  [
    // Puedes agregar validaciones aquí si es necesario
  ],
  async (req, res) => {
    try {
      const nuevaClase = new Clase(req.body);
      await nuevaClase.save();
      res.json(nuevaClase);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Error del servidor");
    }
  }
);

// Ruta para actualizar una clase por ID
router.put("/:id", async (req, res) => {
  try {
    const clase = await Clase.findById(req.params.id);

    if (!clase) {
      return res.status(404).json({ msg: "Clase no encontrada" });
    }

    // Actualiza los campos necesarios
    if (req.body.imagen) clase.imagen = req.body.imagen;
    if (req.body.titulo) clase.titulo = req.body.titulo;
    if (req.body.tipo) clase.tipo = req.body.tipo;
    if (req.body.idioma) clase.idioma = req.body.idioma;

    await clase.save();
    res.json(clase);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

// Ruta para eliminar una clase por ID
router.delete("/:id", async (req, res) => {
  try {
    const clase = await Clase.findById(req.params.id);

    if (!clase) {
      return res.status(404).json({ msg: "Clase no encontrada" });
    }

    await Clase.deleteOne({ _id: req.params.id });
    res.json({ msg: "Clase eliminada" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

// Ruta para eliminar múltiples clases por IDs
router.delete("/multiple", async (req, res) => {
  try {
    const { claseIds } = req.body;

    if (!claseIds || claseIds.length === 0) {
      return res.status(400).json({ msg: "IDs de clases son requeridos" });
    }

    const result = await Clase.deleteMany({ _id: { $in: claseIds } });

    if (result.deletedCount > 0) {
      return res.json({ msg: "Clases eliminadas exitosamente" });
    } else {
      return res.status(404).json({ msg: "No se encontraron clases para eliminar" });
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
 *     Clase:
 *       type: object
 *       properties:
 *         imagen:
 *           type: string
 *           description: La URL de la imagen de la clase
 *         titulo:
 *           type: string
 *           description: El título de la clase
 *         tipo:
 *           type: number
 *           description: El tipo de clase (por ejemplo, 1 = Teórica, 2 = Práctica)
 *         idioma:
 *           type: string
 *           description: El idioma en el que se imparte la clase
 *       example:
 *         imagen: "https://ejemplo.com/imagen.jpg"
 *         titulo: "Clase de Yoga"
 *         tipo: 1
 *         idioma: "Español"
 */

// Ruta para obtener todas las clases
// @route   GET api/clases
// @desc    Obtener todas las clases
// @access  Público
/**
 * @swagger
 * /api/clases:
 *   get:
 *     summary: Obtener todas las clases
 *     tags:
 *       - Clase
 *     responses:
 *       200:
 *         description: Una lista de todas las clases
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Clase'
 *       500:
 *         description: Error del servidor
 */

// Ruta para crear una nueva clase
// @route   POST api/clases
// @desc    Crear una nueva clase
// @access  Público
/**
 * @swagger
 * /api/clases:
 *   post:
 *     summary: Crear una nueva clase
 *     tags:
 *       - Clase
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Clase'
 *     responses:
 *       200:
 *         description: La clase creada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Clase'
 *       500:
 *         description: Error del servidor
 */

// Ruta para actualizar una clase por ID
// @route   PUT api/clases/{id}
// @desc    Actualizar una clase por ID
// @access  Público
/**
 * @swagger
 * /api/clases/{id}:
 *   put:
 *     summary: Actualizar una clase por ID
 *     tags:
 *       - Clase
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: El ID de la clase a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Clase'
 *     responses:
 *       200:
 *         description: La clase actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Clase'
 *       404:
 *         description: Clase no encontrada
 *       500:
 *         description: Error del servidor
 */

// Ruta para eliminar una clase por ID
// @route   DELETE api/clases/{id}
// @desc    Eliminar una clase por ID
// @access  Público
/**
 * @swagger
 * /api/clases/{id}:
 *   delete:
 *     summary: Eliminar una clase por ID
 *     tags:
 *       - Clase
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: El ID de la clase a eliminar
 *     responses:
 *       200:
 *         description: Clase eliminada
 *       404:
 *         description: Clase no encontrada
 *       500:
 *         description: Error del servidor
 */

// Ruta para eliminar múltiples clases por IDs
// @route   DELETE api/clases/multiple
// @desc    Eliminar múltiples clases por IDs
// @access  Público
/**
 * @swagger
 * /api/clases/multiple:
 *   delete:
 *     summary: Eliminar múltiples clases por IDs
 *     tags:
 *       - Clase
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               claseIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Un array de IDs de las clases a eliminar
 *             example:
 *               claseIds: ["id1", "id2"]
 *     responses:
 *       200:
 *         description: Clases eliminadas exitosamente
 *       400:
 *         description: Solicitud incorrecta, IDs de clases requeridos
 *       404:
 *         description: No se encontraron clases para eliminar
 *       500:
 *         description: Error del servidor
 */
