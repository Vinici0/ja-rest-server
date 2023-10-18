const bcryptjs = require("bcryptjs");
const bcryptjs = require("bcryptjs");
const sequelize = require("sequelize");

const { dbConnection } = require("../database/config");
const { generarJWT } = require("../helpers/generar-jwt");
const Console = require("../helpers/console");

const consoleHelper = new Console("Auth Service");

const login = async (correo, password) => {
  try {
    const usuario = await dbConnection.query(
      "SELECT * FROM Usuario WHERE Correo = :correo",
      {
        replacements: {
          correo,
        },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (!usuario) {
      throw new Error("Usuario / Password no son correctos - correo");
    }
    const validPassword = bcryptjs.compareSync(password, usuario[0].Password);
    if (!validPassword) {
      throw new Error("Usuario / Password no son correctos - password");
    }

    const token = await generarJWT(usuario[0].idUsuario);
    consoleHelper.success("Login correcto");
    return {
      usuario: usuario[0],
      token,
    };
  } catch (error) {
    consoleHelper.error(error.msg);
    throw new Error(error.msg);
  }
};

const renewToken = async (idJaUsuario) => {
  try {
    const usuario = await dbConnection.query(
      "SELECT * FROM JA_Usuario WHERE idJaUsuario = :idJaUsuario",
      {
        replacements: {
          idJaUsuario,
        },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    const token = await generarJWT(usuario[0].id);
    consoleHelper.success("Token renovado correctamente");
    return {
      usuario: usuario[0],
      token,
    };
  } catch (error) {
    consoleHelper.error(error.msg);
    throw new Error(error.msg);
  }
};

module.exports = {
  login,
  renewToken,
};
