const { request, response } = require("express");
const userService = require("../services/userService");
const Response = require("../helpers/response");

const responseUsuario = new Response();

const getUsers = async (req, res) => {
  const { limite = 5, desde = 0 } = req.query;
  try {
    const { total, usuarios } = await userService.getUsers();
    responseUsuario.success(res, "Usuarios obtenidos correctamente", {
      total,
      usuarios: usuarios.slice(Number(desde), Number(limite) + Number(desde)),
    });
  } catch (error) {
    responseUsuario.error(res, error.msg, error.status || 500);
  }
};

const createUser = async (req, res = response) => {
  try {
    const { nombre, email, password, rol } = req.body;
    const usuario = await userService.createUser({
      nombre,
      email,
      password,
      rol,
    });
    responseUsuario.success(res, "Usuario creado correctamente", usuario, 201);
  } catch (error) {
    responseUsuario.error(res, error.msg, error.status || 500);
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
};
