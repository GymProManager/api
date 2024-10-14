const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Entrenamiento = require("../models/Entrenamiento"); // Asegúrate de que la ruta del modelo sea correcta

// Ruta para obtener todos los entrenamientos
router.get("/", async (req, res) => {
  try {
    const entrenamientoList = await Entrenamiento.find();
    res.json(entrenamientoList);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

// Ruta para crear un nuevo entrenamiento
router.post(
  "/",
  [
    // Puedes agregar validaciones aquí si es necesario
  ],
  async (req, res) => {
    try {
      const nuevoEntrenamiento = new Entrenamiento(req.body);
      await nuevoEntrenamiento.save();
      res.json(nuevoEntrenamiento);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Error del servidor");
    }
  }
);

// Ruta para actualizar un entrenamiento por ID
router.put("/:id", async (req, res) => {
  try {
    const entrenamiento = await Entrenamiento.findById(req.params.id);

    if (!entrenamiento) {
      return res.status(404).json({ msg: "Entrenamiento no encontrado" });
    }

    // Actualiza los campos necesarios
    if (req.body.imagen) entrenamiento.imagen = req.body.imagen;
    if (req.body.nombre) entrenamiento.nombre = req.body.nombre;
    if (req.body.semanas) entrenamiento.semanas = req.body.semanas;
    if (req.body.etiquetas) entrenamiento.etiquetas = req.body.etiquetas;
    if (req.body.empleado) entrenamiento.empleado = req.body.empleado;
    if (req.body.tipo) entrenamiento.tipo = req.body.tipo;

    await entrenamiento.save();
    res.json(entrenamiento);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

// Ruta para eliminar un entrenamiento por ID
router.delete("/:id", async (req, res) => {
  try {
    const entrenamiento = await Entrenamiento.findById(req.params.id);

    if (!entrenamiento) {
      return res.status(404).json({ msg: "Entrenamiento no encontrado" });
    }

    await Entrenamiento.deleteOne({ _id: req.params.id });
    res.json({ msg: "Entrenamiento eliminado" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

// Ruta para eliminar múltiples entrenamientos por IDs
router.delete("/multiple", async (req, res) => {
  try {
    const { entrenamientoIds } = req.body;

    if (!entrenamientoIds || entrenamientoIds.length === 0) {
      return res.status(400).json({ msg: "IDs de entrenamientos son requeridos" });
    }

    const result = await Entrenamiento.deleteMany({ _id: { $in: entrenamientoIds } });

    if (result.deletedCount > 0) {
      return res.json({ msg: "Entrenamientos eliminados exitosamente" });
    } else {
      return res.status(404).json({ msg: "No se encontraron entrenamientos para eliminar" });
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
 *     Entrenamiento:
 *       type: object
 *       properties:
 *         imagen:
 *           type: string
 *           description: La URL de la imagen del entrenamiento
 *         nombre:
 *           type: string
 *           description: El nombre del entrenamiento
 *         semanas:
 *           type: number
 *           description: El número de semanas que dura el entrenamiento
 *         etiquetas:
 *           type: string
 *           description: Las etiquetas relacionadas al entrenamiento
 *         empleado:
 *           type: string
 *           description: El nombre del empleado responsable del entrenamiento
 *         tipo:
 *           type: number
 *           description: El tipo de entrenamiento (por ejemplo, 1 = Intensivo, 2 = Moderado)
 *       example:
 *         imagen: "https://ejemplo.com/imagen.jpg"
 *         nombre: "Entrenamiento de fuerza"
 *         semanas: 12
 *         etiquetas: "fuerza, resistencia"
 *         empleado: "Juan Pérez"
 *         tipo: 1
 */

// Ruta para obtener todos los entrenamientos
// @route   GET api/entrenamiento
// @desc    Obtener todos los entrenamientos
// @access  Público
/**
 * @swagger
 * /api/entrenamiento:
 *   get:
 *     summary: Obtener todos los entrenamientos
 *     tags:
 *       - Entrenamiento
 *     responses:
 *       200:
 *         description: Una lista de todos los entrenamientos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Entrenamiento'
 *       500:
 *         description: Error del servidor
 */

// Ruta para crear un nuevo entrenamiento
// @route   POST api/entrenamiento
// @desc    Crear un nuevo entrenamiento
// @access  Público
/**
 * @swagger
 * /api/entrenamiento:
 *   post:
 *     summary: Crear un nuevo entrenamiento
 *     tags:
 *       - Entrenamiento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Entrenamiento'
 *     responses:
 *       200:
 *         description: El entrenamiento creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Entrenamiento'
 *       500:
 *         description: Error del servidor
 */

// Ruta para actualizar un entrenamiento por ID
// @route   PUT api/entrenamiento/{id}
// @desc    Actualizar un entrenamiento por ID
// @access  Público
/**
 * @swagger
 * /api/entrenamiento/{id}:
 *   put:
 *     summary: Actualizar un entrenamiento por ID
 *     tags:
 *       - Entrenamiento
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: El ID del entrenamiento a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Entrenamiento'
 *     responses:
 *       200:
 *         description: El entrenamiento actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Entrenamiento'
 *       404:
 *         description: Entrenamiento no encontrado
 *       500:
 *         description: Error del servidor
 */

// Ruta para eliminar un entrenamiento por ID
// @route   DELETE api/entrenamiento/{id}
// @desc    Eliminar un entrenamiento por ID
// @access  Público
/**
 * @swagger
 * /api/entrenamiento/{id}:
 *   delete:
 *     summary: Eliminar un entrenamiento por ID
 *     tags:
 *       - Entrenamiento
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: El ID del entrenamiento a eliminar
 *     responses:
 *       200:
 *         description: Entrenamiento eliminado
 *       404:
 *         description: Entrenamiento no encontrado
 *       500:
 *         description: Error del servidor
 */

// Ruta para eliminar múltiples entrenamientos por IDs
// @route   DELETE api/entrenamiento/multiple
// @desc    Eliminar múltiples entrenamientos por IDs
// @access  Público
/**
 * @swagger
 * /api/entrenamiento/multiple:
 *   delete:
 *     summary: Eliminar múltiples entrenamientos por IDs
 *     tags:
 *       - Entrenamiento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               entrenamientoIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Un array de IDs de los entrenamientos a eliminar
 *             example:
 *               entrenamientoIds: ["id1", "id2"]
 *     responses:
 *       200:
 *         description: Entrenamientos eliminados exitosamente
 *       400:
 *         description: Solicitud incorrecta, IDs de entrenamientos requeridos
 *       404:
 *         description: No se encontraron entrenamientos para eliminar
 *       500:
 *         description: Error del servidor
 */
