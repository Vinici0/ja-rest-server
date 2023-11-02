const { response } = require("express");
const userService = require("../services/authService");
const Response = require("../helpers/response");

const responseAuth = new Response();

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { usuario, token } = await userService.login(email, password);

    responseAuth.success(res, "Login correcto", {
      usuario,
      token,
    });
    
  } catch (error) {
    console.log(error);
    if (error.message === "Usuario / Password no son correctos") {
      return responseAuth.error(res, error.message, 401);
    }

    responseAuth.error(res, "Error en el servidor", 500);
    
  }
};

const renewToken = async (req, res = response) => {
  const { idJaUsuario } = req;
  console.log(idJaUsuario);
  try {
    const { usuario, token } = await userService.renewToken(idJaUsuario);
    responseAuth.success(res, "Token renovado correctamente", {
      usuario,
      token,
    });
  } catch (error) {
    responseAuth.error(res, error.msg, error.status || 500);
    console.log(error);
  }
};

module.exports = {
  login,
  renewToken,
};
