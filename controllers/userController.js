const { request, response } = require("express");
const userService = require("../services/userService");
const Response = require("../helpers/response");
const { generarJWT } = require("../helpers/generar-jwt");

const responseUsuario = new Response();

const getUsers = async (req, res) => {

  const { limite = 5, desde = 0 } = req.query;
  try {
    const usuarios  = await userService.getUsers();
    responseUsuario.success(res, "Usuarios obtenidos correctamente", {
      usuarios: usuarios
    });
  } catch (error) {
    responseUsuario.error(res, error.msg, error.status || 500);
  }
};

const getUserById = async (req, res = response) => {
  try {
    const { id } = req.params;
    const usuarios = await userService.getUserById(id);
    responseUsuario.success(res, "Usuario obtenido correctamente", usuarios);
  } catch (error) {
    responseUsuario.error(res, error.msg, error.status || 500);
  }
};

const createUser = async (req, res = response) => {
  try {
    const { nombre, email, password, role } = req.body;
    const usuario = await userService.createUser({
      nombre,
      email,
      password,
      role,
    });

    const token = await generarJWT(usuario.idJaUsuario);

    responseUsuario.success(
      res,
      "Usuario creado correctamente",
      { usuario, token },
      201
    );
  } catch (error) {
    responseUsuario.error(res, usuario.msg, usuario.status || 500);
  }
};

const updateUser = async (req, res = response) => {
  try {
    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;
    const usuario = await userService.updateUser(id, resto);

    responseUsuario.success(res, "Usuario actualizado correctamente", usuario);
  } catch (error) {
    responseUsuario.error(res, error.msg, error.status || 500);
  }
};

const deleteUser = async (req, res = response) => {
  try {
    const { id } = req.params;
    const usuario = await userService.deleteUser(id);
    responseUsuario.success(res, "Usuario eliminado correctamente", usuario);
  } catch (error) {
    responseUsuario.error(res, error.msg, error.status || 500);
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserById
};
