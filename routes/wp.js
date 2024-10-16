const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const axios = require('axios');


// Ruta para inicia sesión en WP
router.post(
"/login-wp",
[
    // Puedes agregar validaciones aquí si es necesario
],
    async (req, res) => {
      try {
        console.log('logn wp');

        var bodyFormData = new FormData();
        bodyFormData.append('email', req.body.email);
        bodyFormData.append('password', req.body.password);

        // axios.post('https://gympromanager.com/app-login.php', {
        //   email: req.body.email,
        //   password: req.body.password
        // })
        axios({
            method: "post",
            url: "https://gympromanager.com/app-login.php",
            data: bodyFormData,
            headers: { "Content-Type": "multipart/form-data" },
        })
        .then(function (response) {
          console.log(response.data);
          res.json(response.data);
        }).catch(function (response) {
            //handle error
            console.log(' error', response);
          });

      } catch (err) {
        console.error(err.message);
        res.status(500).send("Error del servidor");
      }
    }
);

// Ruta para obtener usuarios wordpress
router.get(
    "/users-wp",
    [
        // Puedes agregar validaciones aquí si es necesario
    ],
        async (req, res) => {
          try {
            
            // axios.post('https://gympromanager.com/app-users.php', {
            //     token: 'Contraseña...',
            // })
            // .then(function (response) {
            //   console.log(response.data);
            //   res.json(response.data);
            // })

            var bodyFormData = new FormData();
            bodyFormData.append('token','Contraseña...');
            axios({
                method: "post",
                url: "https://gympromanager.com/app-users.php",
                data: bodyFormData,
                headers: { "Content-Type": "multipart/form-data" },
            })
            .then(function (response) {
              console.log(response.data);
              res.json(response.data);
            }).catch(function (response) {
                //handle error
                console.log(' error', response);
              });
    
          } catch (err) {
            console.error(err.message);
            res.status(500).send("Error del servidor");
          }
        }
    );

// Ruta para obtener productos wordpress
router.get(
    "/productos-wp",
    [
        // Puedes agregar validaciones aquí si es necesario
    ],
        async (req, res) => {
          try {
            
            // axios.post('https://gympromanager.com/app-products.php', {
            //     token: 'Contraseña...',
            // })
            // .then(function (response) {
            //   console.log(response.data);
            //   res.json(response.data);
            // })


            var bodyFormData = new FormData();
            bodyFormData.append('token','Contraseña...');
            axios({
                method: "post",
                url: "https://gympromanager.com/app-products.php",
                data: bodyFormData,
                headers: { "Content-Type": "multipart/form-data" },
            })
            .then(function (response) {
              console.log(response.data);
              res.json(response.data);
            }).catch(function (response) {
                //handle error
                console.log(' error', response);
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
 *     LoginWP:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           description: El correo electrónico del usuario en WordPress
 *         password:
 *           type: string
 *           description: La contraseña del usuario en WordPress
 *       example:
 *         email: "usuario@ejemplo.com"
 *         password: "contraseñaSegura123"
 *     UsersWP:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           description: El token de autenticación para acceder a los usuarios de WordPress
 *       example:
 *         token: "Contraseña..."
 *     ProductsWP:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           description: El token de autenticación para acceder a los productos de WordPress
 *       example:
 *         token: "Contraseña..."
 */

/**
 * @swagger
 * /api/wp/login-wp:
 *   post:
 *     summary: Iniciar sesión en WordPress
 *     tags:
 *       - WordPress
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginWP'
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso, devuelve los datos del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/wp/users-wp:
 *   get:
 *     summary: Obtener los usuarios de WordPress
 *     tags:
 *       - WordPress
 *     responses:
 *       200:
 *         description: Lista de usuarios de WordPress
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/wp/productos-wp:
 *   get:
 *     summary: Obtener los productos de WordPress
 *     tags:
 *       - WordPress
 *     responses:
 *       200:
 *         description: Lista de productos de WordPress
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Error del servidor
 */