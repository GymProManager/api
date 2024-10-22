const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Empleado = require("../models/Empleado"); // Asegúrate de que la ruta del modelo sea correcta

// Ruta para obtener todos los empleados
router.get("/", async (req, res) => {
  try {
    const empleadoList = await Empleado.find();
    res.json(empleadoList);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

// Ruta para crear un nuevo empleado
router.post(
  "/",
  [
    // Puedes agregar validaciones aquí si es necesario
  ],
  async (req, res) => {
    try {
      console.log(req.body);
      
      const {
        nombre = '',
        apellidos= '',
        perfil= '',
        foto= '',
      } = req.body;

      const nuevoEmpleado = new Empleado({ 
        nombre
        , apellidos
        , perfil
        , foto
       });

      await nuevoEmpleado.save();
      res.json(nuevoEmpleado);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Error del servidor");
    }
  }
);

// Ruta para actualizar un empleado por ID
router.put("/:id", async (req, res) => {
  try {
    const empleado = await Empleado.findById(req.params.id);

    if (!empleado) {
      return res.status(404).json({ msg: "Empleado no encontrado" });
    }

    // Actualiza los campos necesarios
    if (req.body.nombre) empleado.nombre = req.body.nombre;
    if (req.body.apellidos) empleado.apellidos = req.body.apellidos;
    if (req.body.perfil) empleado.perfil = req.body.perfil;
    if (req.body.foto) empleado.foto = req.body.foto;
    if (req.body.perfil_empleado) empleado.perfil_empleado = req.body.perfil_empleado;

    await empleado.save();
    res.json(empleado);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

// Ruta para eliminar un empleado por ID
router.delete("/:id", async (req, res) => {
  try {
    const empleado = await Empleado.findById(req.params.id);

    if (!empleado) {
      return res.status(404).json({ msg: "Empleado no encontrado" });
    }

    await Empleado.deleteOne({ _id: req.params.id });
    res.json({ msg: "Empleado eliminado" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

// Ruta para eliminar múltiples empleados por IDs
router.delete("/multiple", async (req, res) => {
  try {
    const { empleadoIds } = req.body;

    if (!empleadoIds || empleadoIds.length === 0) {
      return res.status(400).json({ msg: "IDs de empleados son requeridos" });
    }

    const result = await Empleado.deleteMany({ _id: { $in: empleadoIds } });

    if (result.deletedCount > 0) {
      return res.json({ msg: "Empleados eliminados exitosamente" });
    } else {
      return res.status(404).json({ msg: "No se encontraron empleados para eliminar" });
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
 *     Empleado:
 *       type: object
 *       properties:
 *         nombre:
 *           type: string
 *           description: El nombre del empleado
 *         apellidos:
 *           type: string
 *           description: Los apellidos del empleado
 *         perfil:
 *           type: number
 *           description: El número de perfil del empleado
 *         foto:
 *           type: string
 *           description: La URL de la foto del empleado
 *       example:
 *         nombre: Juan
 *         apellidos: Pérez Gómez
 *         perfil: "60c72b2f9b1e8b3a789e4a02"
 *         foto: "base64"
 */

// Ruta para obtener todos los empleados
// @route   GET api/empleado
// @desc    Obtener todos los empleados
// @access  Público
/**
 * @swagger
 * /api/empleado:
 *   get:
 *     summary: Obtener todos los empleados
 *     tags:
 *       - Empleado
 *     responses:
 *       200:
 *         description: Una lista de todos los empleados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Empleado'
 *       500:
 *         description: Error del servidor
 */

// Ruta para crear un nuevo empleado
// @route   POST api/empleado
// @desc    Crear un nuevo empleado
// @access  Público
/**
 * @swagger
 * /api/empleado:
 *   post:
 *     summary: Crear un nuevo empleado
 *     tags:
 *       - Empleado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Empleado'
 *     responses:
 *       200:
 *         description: El empleado creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Empleado'
 *       500:
 *         description: Error del servidor
 */

// Ruta para actualizar un empleado por ID
// @route   PUT api/empleado/{id}
// @desc    Actualizar un empleado por ID
// @access  Público
/**
 * @swagger
 * /api/empleado/{id}:
 *   put:
 *     summary: Actualizar un empleado por ID
 *     tags:
 *       - Empleado
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: El ID del empleado a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Empleado'
 *     responses:
 *       200:
 *         description: El empleado actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Empleado'
 *       404:
 *         description: Empleado no encontrado
 *       500:
 *         description: Error del servidor
 */

// Ruta para eliminar un empleado por ID
// @route   DELETE api/empleado/{id}
// @desc    Eliminar un empleado por ID
// @access  Público
/**
 * @swagger
 * /api/empleado/{id}:
 *   delete:
 *     summary: Eliminar un empleado por ID
 *     tags:
 *       - Empleado
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: El ID del empleado a eliminar
 *     responses:
 *       200:
 *         description: Empleado eliminado
 *       404:
 *         description: Empleado no encontrado
 *       500:
 *         description: Error del servidor
 */

// Ruta para eliminar múltiples empleados por IDs
// @route   DELETE api/empleado/multiple
// @desc    Eliminar múltiples empleados por IDs
// @access  Público
/**
 * @swagger
 * /api/empleado/multiple:
 *   delete:
 *     summary: Eliminar múltiples empleados por IDs
 *     tags:
 *       - Empleado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               empleadoIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Un array de IDs de los empleados a eliminar
 *             example:
 *               empleadoIds: ["id1", "id2"]
 *     responses:
 *       200:
 *         description: Empleados eliminados exitosamente
 *       400:
 *         description: Solicitud incorrecta, IDs de empleados requeridos
 *       404:
 *         description: No se encontraron empleados para eliminar
 *       500:
 *         description: Error del servidor
 */
