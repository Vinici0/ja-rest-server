const { response } = require("express");
const userService = require("../services/authService");
const Response = require("../helpers/response");

const responseAuth = new Response();

const login = async (req, res = response) => {
  const { correo, password } = req.body;
  try {
    const { usuario, token } = await userService.login(correo, password);
    responseAuth.success(res, "Login correcto", {
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hable con el administrador",
    });
  }
};

module.exports = {
  login,
};
