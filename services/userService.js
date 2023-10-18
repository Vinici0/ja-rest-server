const bcryptjs = require("bcryptjs");
const sequelize = require("sequelize");
const { dbConnection } = require("../database/config");
const Console = require("../helpers/console");
const consoleHelper = new Console("User Service");

const getUsers = async () => {
  try {
    const users = await dbConnection.query("SELECT * FROM Usuario", {
      type: sequelize.QueryTypes.SELECT,
    });

    consoleHelper.success("Usuarios obtenidos correctamente");
    return users;
  } catch (error) {
    consoleHelper.error(error.msg);
    throw new Error(error.msg);
  }
};

const createUser = async ({ nombre, email, password, rol }) => {
  try {
    const salt = bcryptjs.genSaltSync();
    const hashedPassword = bcryptjs.hashSync(password, salt);
    const user = await dbConnection.query(
      "INSERT INTO Usuario (Nombre, Correo, Password, Rol) VALUES (:nombre, :email, :password, :rol)",
      {
        replacements: {
          nombre,
          email,
          password: hashedPassword,
          rol,
        },
        type: sequelize.QueryTypes.INSERT,
      }
    );
    consoleHelper.success("Usuario creado correctamente");
    return user;
  } catch (error) {
    consoleHelper.error(error.msg);
    throw new Error(error.msg);
  }
};

const updateUser = async (id, dataToUpdate) => {
  try {
    const result = await dbConnection.query(
      `UPDATE JA_Usuario 
      SET nombre = :nombre, 
          email = :email, 
          password = :password, 
          img = :img, 
          role = :role 
      WHERE id = :id`,
      {
        replacements: {
          id,
          ...dataToUpdate,
        },
        type: sequelize.QueryTypes.UPDATE,
      }
    );
    consoleHelper.success("Usuario actualizado correctamente");
    return result;
  } catch (error) {
    consoleHelper.error(error.message);
    throw new Error(error.message);
  }
};

const deleteUser = async (id) => {};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
};
