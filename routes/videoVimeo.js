const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const VideoVimeo = require("../models/VideoVimeo"); // Asegúrate de que la ruta del modelo sea correcta

// Ruta para obtener todos los videos de Vimeo
router.get("/", async (req, res) => {
  try {
    const videoList = await VideoVimeo.find();
    res.json(videoList);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

// Ruta para crear un nuevo video de Vimeo
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
      const nuevoVideo = new VideoVimeo(req.body);
      await nuevoVideo.save();
      res.json(nuevoVideo);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Error del servidor");
    }
  }
);

// Ruta para actualizar un video de Vimeo por ID
router.put("/:id", async (req, res) => {
  try {
    const video = await VideoVimeo.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ msg: "Video no encontrado" });
    }

    // Actualiza los campos necesarios
    if (req.body.nombre) video.nombre = req.body.nombre;
    if (req.body.imagenBase64) video.imagenBase64 = req.body.imagenBase64;
    if (req.body.link) video.link = req.body.link;
    if (req.body.descripcion) video.descripcion = req.body.descripcion;

    await video.save();
    res.json(video);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

// Ruta para eliminar un video de Vimeo por ID
router.delete("/:id", async (req, res) => {
  try {
    const video = await VideoVimeo.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ msg: "Video no encontrado" });
    }

    await VideoVimeo.deleteOne({ _id: req.params.id });
    res.json({ msg: "Video eliminado" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

// Ruta para eliminar múltiples videos de Vimeo por IDs
router.delete("/multiple", async (req, res) => {
  try {
    const { videoIds } = req.body;

    if (!videoIds || videoIds.length === 0) {
      return res.status(400).json({ msg: "IDs de videos son requeridos" });
    }

    const result = await VideoVimeo.deleteMany({ _id: { $in: videoIds } });

    if (result.deletedCount > 0) {
      return res.json({ msg: "Videos eliminados exitosamente" });
    } else {
      return res.status(404).json({ msg: "No se encontraron videos para eliminar" });
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
 *     VideoVimeo:
 *       type: object
 *       properties:
 *         nombre:
 *           type: string
 *           description: El nombre del video de Vimeo
 *         imagenBase64:
 *           type: string
 *           description: La imagen en formato Base64 del video de Vimeo
 *         link:
 *           type: string
 *           description: El enlace del video de Vimeo
 *         descripcion:
 *           type: string
 *           description: La descripción del video de Vimeo
 *       example:
 *         nombre: "Video de introducción"
 *         imagenBase64: "dGhpcyBpcyBhIGJhc2U2NCBlbmNvZGVkIGltYWdl"
 *         link: "https://vimeo.com/123456789"
 *         descripcion: "Video introductorio sobre el tema"
 */

// Ruta para obtener todos los videos de Vimeo
// @route   GET api/video-vimeo
// @desc    Obtener todos los videos de Vimeo
// @access  Público
/**
 * @swagger
 * /api/video-vimeo:
 *   get:
 *     summary: Obtener todos los videos de Vimeo
 *     tags:
 *       - VideoVimeo
 *     responses:
 *       200:
 *         description: Una lista de todos los videos de Vimeo
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VideoVimeo'
 *       500:
 *         description: Error del servidor
 */

// Ruta para crear un nuevo video de Vimeo
// @route   POST api/video-vimeo
// @desc    Crear un nuevo video de Vimeo
// @access  Público
/**
 * @swagger
 * /api/video-vimeo:
 *   post:
 *     summary: Crear un nuevo video de Vimeo
 *     tags:
 *       - VideoVimeo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VideoVimeo'
 *     responses:
 *       200:
 *         description: El video de Vimeo creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VideoVimeo'
 *       400:
 *         description: Error en los datos de entrada
 *       500:
 *         description: Error del servidor
 */

// Ruta para actualizar un video de Vimeo por ID
// @route   PUT api/video-vimeo/{id}
// @desc    Actualizar un video de Vimeo por ID
// @access  Público
/**
 * @swagger
 * /api/video-vimeo/{id}:
 *   put:
 *     summary: Actualizar un video de Vimeo por ID
 *     tags:
 *       - VideoVimeo
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: El ID del video de Vimeo a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VideoVimeo'
 *     responses:
 *       200:
 *         description: El video de Vimeo actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VideoVimeo'
 *       404:
 *         description: Video no encontrado
 *       500:
 *         description: Error del servidor
 */

// Ruta para eliminar un video de Vimeo por ID
// @route   DELETE api/video-vimeo/{id}
// @desc    Eliminar un video de Vimeo por ID
// @access  Público
/**
 * @swagger
 * /api/video-vimeo/{id}:
 *   delete:
 *     summary: Eliminar un video de Vimeo por ID
 *     tags:
 *       - VideoVimeo
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: El ID del video de Vimeo a eliminar
 *     responses:
 *       200:
 *         description: Video eliminado
 *       404:
 *         description: Video no encontrado
 *       500:
 *         description: Error del servidor
 */

// Ruta para eliminar múltiples videos de Vimeo por IDs
// @route   DELETE api/video-vimeo/multiple
// @desc    Eliminar múltiples videos de Vimeo por IDs
// @access  Público
/**
 * @swagger
 * /api/video-vimeo/multiple:
 *   delete:
 *     summary: Eliminar múltiples videos de Vimeo por IDs
 *     tags:
 *       - VideoVimeo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               videoIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Un array de IDs de los videos de Vimeo a eliminar
 *             example:
 *               videoIds: ["id1", "id2"]
 *     responses:
 *       200:
 *         description: Videos eliminados exitosamente
 *       400:
 *         description: Solicitud incorrecta, IDs de videos requeridos
 *       404:
 *         description: No se encontraron videos para eliminar
 *       500:
 *         description: Error del servidor
 */
