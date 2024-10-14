const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Marketing = require("../models/Marketing"); // Asegúrate de que la ruta del modelo sea correcta

// Ruta para obtener todas las campañas de marketing
router.get("/", async (req, res) => {
  try {
    const marketingList = await Marketing.find();
    res.json(marketingList);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

// Ruta para crear una nueva campaña de marketing
router.post(
  "/",
  [
    // Puedes agregar validaciones aquí si es necesario
  ],
  async (req, res) => {
    try {
      const nuevaCampaña = new Marketing(req.body);
      await nuevaCampaña.save();
      res.json(nuevaCampaña);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Error del servidor");
    }
  }
);

// Ruta para actualizar una campaña de marketing por ID
router.put("/:id", async (req, res) => {
  try {
    const marketing = await Marketing.findById(req.params.id);

    if (!marketing) {
      return res.status(404).json({ msg: "Campaña no encontrada" });
    }

    // Actualiza los campos necesarios
    if (req.body.campaña) marketing.campaña = req.body.campaña;
    if (req.body.descripcion) marketing.descripcion = req.body.descripcion;

    await marketing.save();
    res.json(marketing);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

// Ruta para eliminar una campaña de marketing por ID
router.delete("/:id", async (req, res) => {
  try {
    const marketing = await Marketing.findById(req.params.id);

    if (!marketing) {
      return res.status(404).json({ msg: "Campaña no encontrada" });
    }

    await Marketing.deleteOne({ _id: req.params.id });
    res.json({ msg: "Campaña eliminada" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

// Ruta para eliminar múltiples campañas de marketing por IDs
router.delete("/multiple", async (req, res) => {
  try {
    const { marketingIds } = req.body;

    if (!marketingIds || marketingIds.length === 0) {
      return res.status(400).json({ msg: "IDs de campañas son requeridos" });
    }

    const result = await Marketing.deleteMany({ _id: { $in: marketingIds } });

    if (result.deletedCount > 0) {
      return res.json({ msg: "Campañas eliminadas exitosamente" });
    } else {
      return res.status(404).json({ msg: "No se encontraron campañas para eliminar" });
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
 *     Marketing:
 *       type: object
 *       properties:
 *         campaña:
 *           type: string
 *           description: El nombre de la campaña de marketing
 *         descripcion:
 *           type: string
 *           description: La descripción de la campaña de marketing
 *       example:
 *         campaña: "Lanzamiento de producto"
 *         descripcion: "Campaña para el lanzamiento del nuevo producto X"
 */

// Ruta para obtener todas las campañas de marketing
// @route   GET api/marketing
// @desc    Obtener todas las campañas de marketing
// @access  Público
/**
 * @swagger
 * /api/marketing:
 *   get:
 *     summary: Obtener todas las campañas de marketing
 *     tags:
 *       - Marketing
 *     responses:
 *       200:
 *         description: Una lista de todas las campañas de marketing
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Marketing'
 *       500:
 *         description: Error del servidor
 */

// Ruta para crear una nueva campaña de marketing
// @route   POST api/marketing
// @desc    Crear una nueva campaña de marketing
// @access  Público
/**
 * @swagger
 * /api/marketing:
 *   post:
 *     summary: Crear una nueva campaña de marketing
 *     tags:
 *       - Marketing
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Marketing'
 *     responses:
 *       200:
 *         description: La campaña de marketing creada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Marketing'
 *       500:
 *         description: Error del servidor
 */

// Ruta para actualizar una campaña de marketing por ID
// @route   PUT api/marketing/{id}
// @desc    Actualizar una campaña de marketing por ID
// @access  Público
/**
 * @swagger
 * /api/marketing/{id}:
 *   put:
 *     summary: Actualizar una campaña de marketing por ID
 *     tags:
 *       - Marketing
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: El ID de la campaña de marketing a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Marketing'
 *     responses:
 *       200:
 *         description: La campaña de marketing actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Marketing'
 *       404:
 *         description: Campaña no encontrada
 *       500:
 *         description: Error del servidor
 */

// Ruta para eliminar una campaña de marketing por ID
// @route   DELETE api/marketing/{id}
// @desc    Eliminar una campaña de marketing por ID
// @access  Público
/**
 * @swagger
 * /api/marketing/{id}:
 *   delete:
 *     summary: Eliminar una campaña de marketing por ID
 *     tags:
 *       - Marketing
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: El ID de la campaña de marketing a eliminar
 *     responses:
 *       200:
 *         description: Campaña eliminada
 *       404:
 *         description: Campaña no encontrada
 *       500:
 *         description: Error del servidor
 */

// Ruta para eliminar múltiples campañas de marketing por IDs
// @route   DELETE api/marketing/multiple
// @desc    Eliminar múltiples campañas de marketing por IDs
// @access  Público
/**
 * @swagger
 * /api/marketing/multiple:
 *   delete:
 *     summary: Eliminar múltiples campañas de marketing por IDs
 *     tags:
 *       - Marketing
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               marketingIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Un array de IDs de las campañas de marketing a eliminar
 *             example:
 *               marketingIds: ["id1", "id2"]
 *     responses:
 *       200:
 *         description: Campañas eliminadas exitosamente
 *       400:
 *         description: Solicitud incorrecta, IDs de campañas requeridos
 *       404:
 *         description: No se encontraron campañas para eliminar
 *       500:
 *         description: Error del servidor
 */
