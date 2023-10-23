const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");

const Console = require("../helpers/console.js");
const { dbConnection } = require("../database/config.js");

const console = new Console("Server");
class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.paths = {
      auth: "/api/v1/auth",
      config: "/api/v1/config",
      customers: "/api/v1/customers",
      fines: "/api/v1/fines",
      finesDetails: "/api/v1/details",
      measures: "/api/v1/measures",
      meters: "/api/v1/meters",
      reports: "/api/v1/reports",
      users: "/api/v1/users",
    };

    // Conectar a base de datos
    this.conectarDB();

    // Middlewares
    this.middlewares();

    // Rutas de mi aplicación
    this.routes();
  }

  async conectarDB() {
    try {
      await dbConnection.sync();
      console.success("Base de datos online");
    } catch (error) {
      console.error(error);
      throw new Error("Error al iniciar la base de datos");
    }
  }

  middlewares() {
    // CORS
    this.app.use(cors());

    // Lectura y parseo del body
    this.app.use(express.json({ limit: "50mb" }));
    this.app.use(express.urlencoded({ limit: "50mb" }));

    // Directorio Público
    this.app.use(express.static("public"));

    // Fileupload - Carga de archivos
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
        createParentPath: true,
      })
    );
  }

  routes() {
    this.app.use(this.paths.auth, require("../v1/routes/authRoute.js"));
    this.app.use(
      this.paths.customers,
      require("../v1/routes/customerRoute.js")
    );
    this.app.use(this.paths.measures, require("../v1/routes/measureRoute.js"));
    this.app.use(this.paths.meters, require("../v1/routes/meterRoute.js"));
    this.app.use(this.paths.reports, require("../v1/routes/reportRoute.js"));
    this.app.use(this.paths.users, require("../v1/routes/userRoutes.js"));
    this.app.use(this.paths.fines, require("../v1/routes/fineRoute.js"));
    this.app.use(this.paths.config, require("../v1/routes/configRoute.js"));
    this.app.use(
      this.paths.finesDetails,
      require("../v1/routes/fineDetailRoute.js")
    );
  }

  listen() {
    this.app.listen(this.port, () => {
      console.success(`Servidor corriendo en puerto ${this.port}`);
    });
  }
}

module.exports = Server;
