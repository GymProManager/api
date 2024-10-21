require('dotenv').config();
const connectDB = require("./config/db");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 4003;
const path = require("path");

const API_KEYS_VALIDS = require("./config/api_keys_valid_prod.json")

const swaggerUI = require("swagger-ui-express")
const swaggerJsDoc = require("swagger-jsdoc");

const swaggerSpec = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "GYMPRO MANAGER API",
      version: "1.0.0",
      contact: {
        name: "Guillermo Lagunas",
        email: "chumemo@gmail.com",
      },
    },
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "x-api-key",
        },
      },
    },
    servers: [
      {
        url: "http://localhost:4003/",
      },
      {
        url: "http://109.176.198.10:4003/",
      },
      {
        url: "https://admin.gympromanager.com/api",
      }
    ],
  },
  apis: [`${path.join(__dirname, "./routes/*.js")}`],
};

var bodyParser = require("body-parser");

app.use(bodyParser.json({ limit: "50mb", extended: true }));

app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit: 1000000}));


const cors = require("cors");

connectDB();

// Middlewares
app.use(cors());
app.use(express.json({ extended: false }));
app.use("/api-doc", swaggerUI.serve, swaggerUI.setup(swaggerJsDoc(swaggerSpec)));


app.all('*', function(req, res, next) {
  // add details of what is allowed in HTTP request headers to the response headers
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Credentials', false);
  res.header('Access-Control-Max-Age', '86400');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Authorization');
  next();
// },isAuthorized);
});

// fulfils pre-flight/promise request
app.options('*', function(req, res) {
 res.send(200);
});

// app.use("/api/ruta", require("./routes/ruta"));
// app.use("/admin/api/auth", require("./routes/auth"));

app.use("/api/perfil-socio", require("./routes/perfilSocio"));
app.use("/api/socio", require("./routes/socio"));
app.use("/api/perfil-empleado", require("./routes/perfilEmpleado"));
app.use("/api/empleado", require("./routes/empleado"));
app.use("/api/actividades", require("./routes/actividades"));
app.use("/api/grupo-actividad", require("./routes/grupoActividad"));
app.use("/api/clases", require("./routes/clases"));
app.use("/api/entrenamiento", require("./routes/entrenamiento"));
app.use("/api/marketing", require("./routes/marketing"));
app.use("/api/recompensa", require("./routes/recompensas"));
app.use("/api/wp", require("./routes/wp"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/horario", require("./routes/horario"));


if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  );
}

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

function isAuthorized(req, res, next) {
  console.log('req.header');
  console.log(req.header);
  console.log('x-api-key');
  console.log(req.header('x-api-key'));
  console.log('api_key');
  console.log(req.header('api_key'));

  let _api_key = '';

  if( req.header('x-api-key') != undefined ) _api_key = req.header('x-api-key');
  if( _api_key == '' && req.header('api_key') != undefined ) _api_key = req.header('api_key');

  console.log('Final _api_key');
  console.log(_api_key);

  if (_api_key != '') {
                  
      console.log('_api_key');
      console.log(_api_key);

      let _isValid = API_KEYS_VALIDS.filter(e=>{
        return e.api_key == _api_key
      })

      if(_isValid.length>0){
        next();        
      }else{
        res.status(500).json({ error: "api_key invalid" });
      }

  } else {
      // No authorization header exists on the incoming
      // request, return not authorized and throw a new error 
      res.status(500).json({ error: "Not Authorized" });
      // throw new Error("Not Authorized");
  }
}
