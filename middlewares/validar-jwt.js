const jwt = require("jsonwebtoken");
const sequelize = require("sequelize");
const { dbConnection } = require("../database/config");
const validateJWT = (req, res, next) => {
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: "No hay token en la petición",
    });
  }

  try {
    const { idJaUsuario } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    req.idJaUsuario = idJaUsuario;

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      ok: false,
      msg: "Token no válido",
    });
  }
};

//validar si es admin role
const validateAdminRole = async (req, res, next) => {
  try {
    const { idJaUsuario } = req;
    const user = await dbConnection.query(
      "SELECT role FROM JA_Usuario WHERE id = :idJaUsuario",
      {
        replacements: {
          idJaUsuario,
        },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (user[0].role !== "ADMIN_ROLE") {
      return res.status(403).json({
        ok: false,
        msg: "No tienes los permisos necesarios para realizar esta acción",
      });
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error al validar el rol de administrador",
    });
  }
};

module.exports = {
  validateJWT,
  validateAdminRole,
};
