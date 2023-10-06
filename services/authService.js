const bcryptjs = require("bcryptjs");
const Usuario = require("../models/user");
const { generarJWT } = require("../helpers/generar-jwt");

const login = async (correo, password) => {
 
};

module.exports = {
  login,
};
