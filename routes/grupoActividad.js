const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const GrupoActividad = require("../models/GrupoActividad"); // Asegúrate de que la ruta del modelo sea correcta

// Ruta para obtener todos los grupos de actividad
router.get("/", async (req, res) => {
  try {
    const grupoActividadList = await GrupoActividad.find();
    res.json(grupoActividadList);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

// Ruta para crear un nuevo grupo de actividad
router.post(
  "/",
  [
    // Puedes agregar validaciones aquí si es necesario
  ],
  async (req, res) => {
    try {
      const nuevoGrupoActividad = new GrupoActividad(req.body);
      await nuevoGrupoActividad.save();
      res.json(nuevoGrupoActividad);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Error del servidor");
    }
  }
);

// Ruta para actualizar un grupo de actividad por ID
router.put("/:id", async (req, res) => {
  try {
    const grupoActividad = await GrupoActividad.findById(req.params.id);

    if (!grupoActividad) {
      return res.status(404).json({ msg: "Grupo de actividad no encontrado" });
    }

    // Actualiza los campos necesarios
    if (req.body.imagen) grupoActividad.imagen = req.body.imagen;
    if (req.body.nivel_esfuerzo) grupoActividad.nivel_esfuerzo = req.body.nivel_esfuerzo;
    if (req.body.valor) grupoActividad.valor = req.body.valor;

    await grupoActividad.save();
    res.json(grupoActividad);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

// Ruta para eliminar un grupo de actividad por ID
router.delete("/:id", async (req, res) => {
  try {
    const grupoActividad = await GrupoActividad.findById(req.params.id);

    if (!grupoActividad) {
      return res.status(404).json({ msg: "Grupo de actividad no encontrado" });
    }

    await GrupoActividad.deleteOne({ _id: req.params.id });
    res.json({ msg: "Grupo de actividad eliminado" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

// Ruta para eliminar múltiples grupos de actividad por IDs
router.delete("/multiple", async (req, res) => {
  try {
    const { grupoActividadIds } = req.body;

    if (!grupoActividadIds || grupoActividadIds.length === 0) {
      return res.status(400).json({ msg: "IDs de grupos de actividad son requeridos" });
    }

    const result = await GrupoActividad.deleteMany({ _id: { $in: grupoActividadIds } });

    if (result.deletedCount > 0) {
      return res.json({ msg: "Grupos de actividad eliminados exitosamente" });
    } else {
      return res.status(404).json({ msg: "No se encontraron grupos de actividad para eliminar" });
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
 *     GrupoActividad:
 *       type: object
 *       properties:
 *         imagen:
 *           type: string
 *           description: La URL de la imagen del grupo de actividad
 *         nivel_esfuerzo:
 *           type: string
 *           description: El nivel de esfuerzo requerido para el grupo de actividad
 *         valor:
 *           type: number
 *           description: El valor del grupo de actividad
 *       example:
 *         imagen: "https://ejemplo.com/imagen.jpg"
 *         nivel_esfuerzo: "Alto"
 *         valor: 100
 */

// Ruta para obtener todos los grupos de actividad
// @route   GET api/grupo-actividad
// @desc    Obtener todos los grupos de actividad
// @access  Público
/**
 * @swagger
 * /api/grupo-actividad:
 *   get:
 *     summary: Obtener todos los grupos de actividad
 *     tags:
 *       - GrupoActividad
 *     responses:
 *       200:
 *         description: Una lista de todos los grupos de actividad
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/GrupoActividad'
 *       500:
 *         description: Error del servidor
 */

// Ruta para crear un nuevo grupo de actividad
// @route   POST api/grupo-actividad
// @desc    Crear un nuevo grupo de actividad
// @access  Público
/**
 * @swagger
 * /api/grupo-actividad:
 *   post:
 *     summary: Crear un nuevo grupo de actividad
 *     tags:
 *       - GrupoActividad
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GrupoActividad'
 *     responses:
 *       200:
 *         description: El grupo de actividad creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GrupoActividad'
 *       500:
 *         description: Error del servidor
 */

// Ruta para actualizar un grupo de actividad por ID
// @route   PUT api/grupo-actividad/{id}
// @desc    Actualizar un grupo de actividad por ID
// @access  Público
/**
 * @swagger
 * /api/grupo-actividad/{id}:
 *   put:
 *     summary: Actualizar un grupo de actividad por ID
 *     tags:
 *       - GrupoActividad
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: El ID del grupo de actividad a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GrupoActividad'
 *     responses:
 *       200:
 *         description: El grupo de actividad actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GrupoActividad'
 *       404:
 *         description: Grupo de actividad no encontrado
 *       500:
 *         description: Error del servidor
 */

// Ruta para eliminar un grupo de actividad por ID
// @route   DELETE api/grupo-actividad/{id}
// @desc    Eliminar un grupo de actividad por ID
// @access  Público
/**
 * @swagger
 * /api/grupo-actividad/{id}:
 *   delete:
 *     summary: Eliminar un grupo de actividad por ID
 *     tags:
 *       - GrupoActividad
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: El ID del grupo de actividad a eliminar
 *     responses:
 *       200:
 *         description: Grupo de actividad eliminado
 *       404:
 *         description: Grupo de actividad no encontrado
 *       500:
 *         description: Error del servidor
 */

// Ruta para eliminar múltiples grupos de actividad por IDs
// @route   DELETE api/grupo-actividad/multiple
// @desc    Eliminar múltiples grupos de actividad por IDs
// @access  Público
/**
 * @swagger
 * /api/grupo-actividad/multiple:
 *   delete:
 *     summary: Eliminar múltiples grupos de actividad por IDs
 *     tags:
 *       - GrupoActividad
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               grupoActividadIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Un array de IDs de los grupos de actividad a eliminar
 *             example:
 *               grupoActividadIds: ["id1", "id2"]
 *     responses:
 *       200:
 *         description: Grupos de actividad eliminados exitosamente
 *       400:
 *         description: Solicitud incorrecta, IDs de grupos de actividad requeridos
 *       404:
 *         description: No se encontraron grupos de actividad para eliminar
 *       500:
 *         description: Error del servidor
 */
