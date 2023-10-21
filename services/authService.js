const bcryptjs = require("bcryptjs");
const sequelize = require("sequelize");

const { dbConnection } = require("../database/config");
const { generarJWT } = require("../helpers/generar-jwt");
const Console = require("../helpers/console");

const consoleHelper = new Console("Auth Service");
const login = async (email, password) => {
  try {
    const usuario = await dbConnection.query(
      "SELECT * FROM JA_Usuario WHERE email = :email",
      {
        replacements: {
          email,
        },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (!usuario || usuario.length === 0) {
      throw new Error("Usuario / Password no son correctos");
    }

    const validPassword = bcryptjs.compareSync(password, usuario[0].password);
    if (!validPassword) {
      throw new Error("Usuario / Password no son correctos");
    }

    const token = await generarJWT(usuario[0].idJaUsuario);
    consoleHelper.success("Login correcto");
    return {
      usuario: usuario[0],
      token,
    };
  } catch (error) {
    consoleHelper.error(error.message);
    throw new Error(error.message);
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
    const token = await generarJWT(usuario[0].idJaUsuario);
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
