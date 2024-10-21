const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Usuario = require("../models/Usuario"); // Asegúrate de que la ruta del modelo sea correcta

// Ruta para crear una nueva actividad
router.post(
    "/",
    [
      // Puedes agregar validaciones aquí si es necesario
    ],
    async (req, res) => {
      try {
        
        const {
            usuario,
            password,
        } = req.body;

        const _usuario = await Usuario.findOne({usuario: usuario, password: password});

        console.log('usuario', _usuario);

        if(_usuario && _usuario.activo == 1) {
            return res.json({
                "status": 1,
                "message": "Usuario autenticado"
            });
        }
        
        res.json({
            "status": 0,
            "message": "Usuario no autorizado"
        });

      } catch (err) {
        console.error(err.message);
        res.status(500).send("Error del servidor");
      }
    }
  );

  module.exports = router;


  /**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       properties:
 *         usuario:
 *           type: string
 *           description: El nombre de usuario
 *         password:
 *           type: string
 *           description: La contraseña del usuario
 *       example:
 *         usuario: miusuario
 *         password: "micontraeña"
 */

// Ruta para iniciar sesion
// @route   POST api/auth
// @desc    Iniciar sesión
// @access  Público
/**
 * @swagger
 * /api/auth:
 *   post:
 *     summary: iniciar sesion
 *     tags:
 *       - Usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       200:
 *         description: Autenticacion exitosa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       500:
 *         description: Error del servidor
 */