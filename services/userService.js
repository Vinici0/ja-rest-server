const bcryptjs = require("bcryptjs");
const sequelize = require("sequelize");
const { dbConnection } = require("../database/config");
const Console = require("../helpers/console");
const consoleHelper = new Console("User Service");

const getUsers = async () => {
  try {
    const users = await dbConnection.query("SELECT * FROM JA_Usuario", {
      type: sequelize.QueryTypes.SELECT,
    });

    consoleHelper.success("Usuarios obtenidos correctamente");
    return users;
  } catch (error) {
    consoleHelper.error(error.msg);
    throw new Error(error.msg);
  }
};

const getUserById = async (id) => {
  try {
    const user = await dbConnection.query(
      "SELECT * FROM JA_Usuario WHERE idJaUsuario = :id",
      {
        replacements: {
          id,
        },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    consoleHelper.success("Usuario obtenido correctamente");
    return user;
  } catch (error) {
    consoleHelper.error(error.msg);
    throw new Error(error.msg);
  }
};

const createUser = async ({ nombre, email, password, role }) => {
  try {
    const salt = bcryptjs.genSaltSync();
    const hashedPassword = bcryptjs.hashSync(password, salt);

    //Que el correo no exista
    const userExist = await dbConnection.query(
      "SELECT * FROM JA_Usuario WHERE email = :email",
      {
        replacements: {
          email,
        },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (userExist.length > 0) {
      return {
        msg: "El correo ya existe",
        status: 400,
      };
    }

    const user = await dbConnection.query(
      "EXEC InsertarUsuario :nombre, :email, :password, :role",
      {
        replacements: {
          nombre,
          email,
          password: hashedPassword,
          role,
        },
        type: sequelize.QueryTypes.SELECT,
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
      WHERE idJaUsuario = :id`,
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

const deleteUser = async (id) => {
  try {
    const user = await dbConnection.query(
      "DELETE FROM JA_Usuario WHERE idJaUsuario = :id",
      {
        replacements: {
          id,
        },
        type: sequelize.QueryTypes.DELETE,
      }
    );
    consoleHelper.success("Usuario eliminado correctamente");
    return user;
  } catch (error) {
    consoleHelper.error(error.msg);
    throw new Error(error.msg);
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserById
};
