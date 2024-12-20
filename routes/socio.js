const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Socio = require("../models/Socio"); // Asegúrate de que la ruta del modelo sea correcta

// Ruta para obtener todos los socios
router.get("/", async (req, res) => {
  try {
    // const socioList = await Socio.find().populate("PerfilSocio");
    const socioList = await Socio.find();
    res.json(socioList);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

router.get("/:id", async (req, res) =>  {
  const { id } = req.params;
  try {
    const socio = await Socio.find({ _id: id});
    res.json(socio);
  } catch (err) {
    res.status(500).send("Error del servidor");
  }
});

// Ruta para crear un nuevo socio
router.post(
  "/",
  [
    // Puedes agregar validaciones aquí si es necesario
  ],
  async (req, res) => {
    try {
      const nuevoSocio = new Socio(req.body);
      await nuevoSocio.save();
      res.json(nuevoSocio);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Error del servidor");
    }
  }
);



// Ruta para actualizar un socio por ID
router.put("/:id", async (req, res) => {
  try {
    const socio = await Socio.findById(req.params.id);

    if (!socio) {
      return res.status(404).json({ msg: "Socio no encontrado" });
    }

    // Actualiza los campos necesarios
    if (req.body.nombre) socio.nombre = req.body.nombre;
    if (req.body.apellidos) socio.apellidos = req.body.apellidos;
    if (req.body.fecha_inicio) socio.fecha_inicio = req.body.fecha_inicio;
    if (req.body.fecha_alta) socio.fecha_alta = req.body.fecha_alta;
    if (req.body.telefono) socio.telefono = req.body.telefono;
    if (req.body.perfil_socio) socio.perfil_socio = req.body.perfil_socio;

    await socio.save();
    res.json(socio);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

// Ruta para eliminar un socio por ID
router.delete("/:id", async (req, res) => {
  try {
    const socio = await Socio.findById(req.params.id);

    if (!socio) {
      return res.status(404).json({ msg: "Socio no encontrado" });
    }

    await Socio.deleteOne({ _id: req.params.id });
    res.json({ msg: "Socio eliminado" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

// Ruta para eliminar múltiples socios por IDs
router.delete("/multiple", async (req, res) => {
  try {
    const { socioIds } = req.body;

    if (!socioIds || socioIds.length === 0) {
      return res.status(400).json({ msg: "IDs de socios son requeridos" });
    }

    const result = await Socio.deleteMany({ _id: { $in: socioIds } });

    if (result.deletedCount > 0) {
      return res.json({ msg: "Socios eliminados exitosamente" });
    } else {
      return res.status(404).json({ msg: "No se encontraron socios para eliminar" });
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
 *     Socio:
 *       type: object
 *       properties:
 *         nombre:
 *           type: string
 *           description: El nombre del socio
 *         apellidos:
 *           type: string
 *           description: Los apellidos del socio
 *         fecha_inicio:
 *           type: string
 *           format: date
 *           description: La fecha de inicio del socio
 *         fecha_alta:
 *           type: string
 *           format: date
 *           description: La fecha de alta del socio
 *         telefono:
 *           type: string
 *           description: El número de teléfono del socio
 *         perfil_socio:
 *           type: string
 *           description: El ID de referencia al perfil del socio
 *       example:
 *         nombre: Carlos
 *         apellidos: García López
 *         fecha_inicio: 2023-02-01
 *         fecha_alta: 2023-03-01
 *         telefono: 5551234567
 *         perfil_socio: "60c72b2f9b1e8b3a789e4a02"
 */

// Ruta para obtener todos los socios
// @route   GET api/socio
// @desc    Obtener todos los socios
// @access  Público
/**
 * @swagger
 * /api/socio:
 *   get:
 *     summary: Obtener todos los socios
 *     tags:
 *       - Socio
 *     responses:
 *       200:
 *         description: Una lista de todos los socios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Socio'
 *       500:
 *         description: Error del servidor
 */

// Ruta para crear un nuevo socio
// @route   POST api/socio
// @desc    Crear un nuevo socio
// @access  Público
/**
 * @swagger
 * /api/socio:
 *   post:
 *     summary: Crear un nuevo socio
 *     tags:
 *       - Socio
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Socio'
 *     responses:
 *       200:
 *         description: El socio creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Socio'
 *       500:
 *         description: Error del servidor
 */

// Ruta para actualizar un socio por ID
// @route   PUT api/socio/{id}
// @desc    Actualizar un socio por ID
// @access  Público
/**
 * @swagger
 * /api/socio/{id}:
 *   put:
 *     summary: Actualizar un socio por ID
 *     tags:
 *       - Socio
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: El ID del socio a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Socio'
 *     responses:
 *       200:
 *         description: El socio actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Socio'
 *       404:
 *         description: Socio no encontrado
 *       500:
 *         description: Error del servidor
 */

// Ruta para eliminar un socio por ID
// @route   DELETE api/socio/{id}
// @desc    Eliminar un socio por ID
// @access  Público
/**
 * @swagger
 * /api/socio/{id}:
 *   delete:
 *     summary: Eliminar un socio por ID
 *     tags:
 *       - Socio
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: El ID del socio a eliminar
 *     responses:
 *       200:
 *         description: Socio eliminado
 *       404:
 *         description: Socio no encontrado
 *       500:
 *         description: Error del servidor
 */

// Ruta para eliminar múltiples socios por IDs
// @route   DELETE api/socio/multiple
// @desc    Eliminar múltiples socios por IDs
// @access  Público
/**
 * @swagger
 * /api/socio/multiple:
 *   delete:
 *     summary: Eliminar múltiples socios por IDs
 *     tags:
 *       - Socio
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               socioIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Un array de IDs de los socios a eliminar
 *             example:
 *               socioIds: ["id1", "id2"]
 *     responses:
 *       200:
 *         description: Socios eliminados exitosamente
 *       400:
 *         description: Solicitud incorrecta, IDs de socios requeridos
 *       404:
 *         description: No se encontraron socios para eliminar
 *       500:
 *         description: Error del servidor
 */
