const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const PerfilEmpleado = require("../models/PerfilEmpleado"); // Asegúrate de que la ruta del modelo sea correcta

// Ruta para obtener todos los perfiles de empleados
router.get("/", async (req, res) => {
  try {
    const perfilEmpleadoList = await PerfilEmpleado.find();
    res.json(perfilEmpleadoList);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

// Ruta para crear un nuevo perfil de empleado
router.post(
  "/",
  [
    // Puedes agregar validaciones aquí si es necesario
  ],
  async (req, res) => {
    try {
      const nuevoPerfilEmpleado = new PerfilEmpleado(req.body);
      await nuevoPerfilEmpleado.save();
      res.json(nuevoPerfilEmpleado);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Error del servidor");
    }
  }
);

// Ruta para actualizar un perfil de empleado por ID
router.put("/:id", async (req, res) => {
  try {
    const perfilEmpleado = await PerfilEmpleado.findById(req.params.id);

    if (!perfilEmpleado) {
      return res.status(404).json({ msg: "Perfil de empleado no encontrado" });
    }

    // Actualiza los campos necesarios
    if (req.body.nombre) perfilEmpleado.nombre = req.body.nombre;
    if (req.body.descripcion) perfilEmpleado.descripcion = req.body.descripcion;

    await perfilEmpleado.save();
    res.json(perfilEmpleado);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

// Ruta para eliminar un perfil de empleado por ID
router.delete("/:id", async (req, res) => {
  try {
    const perfilEmpleado = await PerfilEmpleado.findById(req.params.id);

    if (!perfilEmpleado) {
      return res.status(404).json({ msg: "Perfil de empleado no encontrado" });
    }

    await PerfilEmpleado.deleteOne({ _id: req.params.id });
    res.json({ msg: "Perfil de empleado eliminado" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

// Ruta para eliminar múltiples perfiles de empleado por IDs
router.delete("/multiple", async (req, res) => {
  try {
    const { perfilEmpleadoIds } = req.body;

    if (!perfilEmpleadoIds || perfilEmpleadoIds.length === 0) {
      return res.status(400).json({ msg: "IDs de perfiles de empleado son requeridos" });
    }

    const result = await PerfilEmpleado.deleteMany({ _id: { $in: perfilEmpleadoIds } });

    if (result.deletedCount > 0) {
      return res.json({ msg: "Perfiles de empleado eliminados exitosamente" });
    } else {
      return res.status(404).json({ msg: "No se encontraron perfiles de empleado para eliminar" });
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
 *     PerfilEmpleado:
 *       type: object
 *       properties:
 *         nombre:
 *           type: string
 *           description: El nombre del perfil de empleado
 *         descripcion:
 *           type: string
 *           description: Una descripción del perfil de empleado
 *       example:
 *         nombre: Administrador
 *         descripcion: Perfil para empleados administrativos
 */

// Ruta para obtener todos los perfiles de empleados
// @route   GET api/perfil-empleado
// @desc    Obtener todos los perfiles de empleados
// @access  Público
/**
 * @swagger
 * /api/perfil-empleado:
 *   get:
 *     summary: Obtener todos los perfiles de empleados
 *     tags:
 *       - PerfilEmpleado
 *     responses:
 *       200:
 *         description: Una lista de todos los perfiles de empleados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PerfilEmpleado'
 *       500:
 *         description: Error del servidor
 */

// Ruta para crear un nuevo perfil de empleado
// @route   POST api/perfil-empleado
// @desc    Crear un nuevo perfil de empleado
// @access  Público
/**
 * @swagger
 * /api/perfil-empleado:
 *   post:
 *     summary: Crear un nuevo perfil de empleado
 *     tags:
 *       - PerfilEmpleado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PerfilEmpleado'
 *     responses:
 *       200:
 *         description: El perfil de empleado creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PerfilEmpleado'
 *       500:
 *         description: Error del servidor
 */

// Ruta para actualizar un perfil de empleado por ID
// @route   PUT api/perfil-empleado/{id}
// @desc    Actualizar un perfil de empleado por ID
// @access  Público
/**
 * @swagger
 * /api/perfil-empleado/{id}:
 *   put:
 *     summary: Actualizar un perfil de empleado por ID
 *     tags:
 *       - PerfilEmpleado
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: El ID del perfil de empleado a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PerfilEmpleado'
 *     responses:
 *       200:
 *         description: El perfil de empleado actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PerfilEmpleado'
 *       404:
 *         description: Perfil de empleado no encontrado
 *       500:
 *         description: Error del servidor
 */

// Ruta para eliminar un perfil de empleado por ID
// @route   DELETE api/perfil-empleado/{id}
// @desc    Eliminar un perfil de empleado por ID
// @access  Público
/**
 * @swagger
 * /api/perfil-empleado/{id}:
 *   delete:
 *     summary: Eliminar un perfil de empleado por ID
 *     tags:
 *       - PerfilEmpleado
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: El ID del perfil de empleado a eliminar
 *     responses:
 *       200:
 *         description: Perfil de empleado eliminado
 *       404:
 *         description: Perfil de empleado no encontrado
 *       500:
 *         description: Error del servidor
 */

// Ruta para eliminar múltiples perfiles de empleado por IDs
// @route   DELETE api/perfil-empleado/multiple
// @desc    Eliminar múltiples perfiles de empleado por IDs
// @access  Público
/**
 * @swagger
 * /api/perfil-empleado/multiple:
 *   delete:
 *     summary: Eliminar múltiples perfiles de empleado por IDs
 *     tags:
 *       - PerfilEmpleado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               perfilEmpleadoIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Un array de IDs de los perfiles de empleado a eliminar
 *             example:
 *               perfilEmpleadoIds: ["id1", "id2"]
 *     responses:
 *       200:
 *         description: Perfiles de empleado eliminados exitosamente
 *       400:
 *         description: Solicitud incorrecta, IDs de perfiles de empleado requeridos
 *       404:
 *         description: No se encontraron perfiles de empleado para eliminar
 *       500:
 *         description: Error del servidor
 */
