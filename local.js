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
      title: "EXO API",
      version: "1.0.0",
      contact: {
        name: "Alejandro Castañon",
        email: "hi@alexcd2000.com",
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
        url: "http://localhost:4003",
      },
      {
        url: "https://preview7.alexcd2000.com/admin",
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
},isAuthorized);
// });

// fulfils pre-flight/promise request
app.options('*', function(req, res) {
 res.send(200);
});

// app.use("/api/ruta", require("./routes/ruta"));
app.use("/api/auth", require("./routes/auth"));

app.use("/api/teams", require("./routes/team"));
app.use("/api/avatars", require("./routes/avatar"));

app.use("/api/accounts", require("./routes/account"));
app.use("/api/assetbundles", require("./routes/assetBundle"));
// app.use("/api/asset", require("./routes/avatar"));
app.use("/api/bankaccounts", require("./routes/bankaccount"));
app.use("/api/certificates", require("./routes/certificate"));
app.use("/api/companies", require("./routes/company"));
app.use("/api/creditcards", require("./routes/creditcard"));
app.use("/api/cryptowallets", require("./routes/cryptowallet"));
app.use("/api/devices", require("./routes/device"));
app.use("/api/domains", require("./routes/domain"));
app.use("/api/licences", require("./routes/license"));
app.use("/api/procurements", require("./routes/procurement"));
app.use("/api/services", require("./routes/service"));
app.use("/api/proxies", require("./routes/proxy"));


app.use("/api/owners", require("./routes/owner"));
app.use("/api/vps", require("./routes/vps"));
app.use("/api/sims", require("./routes/sim"));

app.use("/api/usermanagement", require("./routes/usermanagement"));

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
