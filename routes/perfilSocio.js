const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const PerfilSocio = require("../models/PerfilSocio"); // Asegúrate de que la ruta del modelo sea correcta

// Ruta para obtener todos los perfiles de socios
router.get("/", async (req, res) => {
  try {
    const perfilSocioList = await PerfilSocio.find();
    res.json(perfilSocioList);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

// Ruta para crear un nuevo perfil de socio
router.post(
  "/",
  [
    // Puedes agregar validaciones aquí si es necesario
  ],
  async (req, res) => {
    try {
      const nuevoPerfilSocio = new PerfilSocio(req.body);
      await nuevoPerfilSocio.save();
      res.json(nuevoPerfilSocio);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Error del servidor");
    }
  }
);

// Ruta para actualizar un perfil de socio por ID
router.put("/:id", async (req, res) => {
  try {
    const perfilSocio = await PerfilSocio.findById(req.params.id);

    if (!perfilSocio) {
      return res.status(404).json({ msg: "Perfil de socio no encontrado" });
    }

    // Actualiza los campos necesarios
    if (req.body.nombre) perfilSocio.nombre = req.body.nombre;
    if (req.body.descripcion) perfilSocio.descripcion = req.body.descripcion;

    await perfilSocio.save();
    res.json(perfilSocio);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

// Ruta para eliminar un perfil de socio por ID
router.delete("/:id", async (req, res) => {
  try {
    const perfilSocio = await PerfilSocio.findById(req.params.id);

    if (!perfilSocio) {
      return res.status(404).json({ msg: "Perfil de socio no encontrado" });
    }

    await PerfilSocio.deleteOne({ _id: req.params.id });
    res.json({ msg: "Perfil de socio eliminado" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

// Ruta para eliminar múltiples perfiles de socio por IDs
router.delete("/multiple", async (req, res) => {
  try {
    const { perfilSocioIds } = req.body;

    if (!perfilSocioIds || perfilSocioIds.length === 0) {
      return res.status(400).json({ msg: "IDs de perfiles de socio son requeridos" });
    }

    const result = await PerfilSocio.deleteMany({ _id: { $in: perfilSocioIds } });

    if (result.deletedCount > 0) {
      return res.json({ msg: "Perfiles de socio eliminados exitosamente" });
    } else {
      return res.status(404).json({ msg: "No se encontraron perfiles de socio para eliminar" });
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
 *     PerfilSocio:
 *       type: object
 *       properties:
 *         nombre:
 *           type: string
 *           description: El nombre del perfil de socio
 *         descripcion:
 *           type: string
 *           description: Una descripción del perfil de socio
 *       example:
 *         nombre: Juan Pérez
 *         descripcion: Perfil del socio inicial
 */

// Ruta para obtener todos los perfiles de socios
// @route   GET api/perfil-socio
// @desc    Obtener todos los perfiles de socio
// @access  Público
/**
 * @swagger
 * /api/perfil-socio:
 *   get:
 *     summary: Obtener todos los perfiles de socios
 *     tags:
 *       - PerfilSocio
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Una lista de todos los perfiles de socios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PerfilSocio'
 *       500:
 *         description: Error del servidor
 */

// Ruta para crear un nuevo perfil de socio
// @route   POST api/perfil-socio
// @desc    Crear un nuevo perfil de socio
// @access  Público
/**
 * @swagger
 * /api/perfil-socio:
 *   post:
 *     summary: Crear un nuevo perfil de socio
 *     tags:
 *       - PerfilSocio
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PerfilSocio'
 *     responses:
 *       200:
 *         description: El perfil de socio creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PerfilSocio'
 *       500:
 *         description: Error del servidor
 */

// Ruta para actualizar un perfil de socio por ID
// @route   PUT api/perfil-socio/{id}
// @desc    Actualizar un perfil de socio por ID
// @access  Público
/**
 * @swagger
 * /api/perfil-socio/{id}:
 *   put:
 *     summary: Actualizar un perfil de socio por ID
 *     tags:
 *       - PerfilSocio
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: El ID del perfil de socio a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PerfilSocio'
 *     responses:
 *       200:
 *         description: El perfil de socio actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PerfilSocio'
 *       404:
 *         description: Perfil de socio no encontrado
 *       500:
 *         description: Error del servidor
 */

// Ruta para eliminar un perfil de socio por ID
// @route   DELETE api/perfil-socio/{id}
// @desc    Eliminar un perfil de socio por ID
// @access  Público
/**
 * @swagger
 * /api/perfil-socio/{id}:
 *   delete:
 *     summary: Eliminar un perfil de socio por ID
 *     tags:
 *       - PerfilSocio
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: El ID del perfil de socio a eliminar
 *     responses:
 *       200:
 *         description: Perfil de socio eliminado
 *       404:
 *         description: Perfil de socio no encontrado
 *       500:
 *         description: Error del servidor
 */

// Ruta para eliminar múltiples perfiles de socio por IDs
// @route   DELETE api/perfil-socio/multiple
// @desc    Eliminar múltiples perfiles de socio por IDs
// @access  Público
/**
 * @swagger
 * /api/perfil-socio/multiple:
 *   delete:
 *     summary: Eliminar múltiples perfiles de socio por IDs
 *     tags:
 *       - PerfilSocio
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               perfilSocioIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Un array de IDs de los perfiles de socio a eliminar
 *             example:
 *               perfilSocioIds: ["id1", "id2"]
 *     responses:
 *       200:
 *         description: Perfiles de socio eliminados exitosamente
 *       400:
 *         description: Solicitud incorrecta, IDs de perfiles de socio requeridos
 *       404:
 *         description: No se encontraron perfiles de socio para eliminar
 *       500:
 *         description: Error del servidor
 */
