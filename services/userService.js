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
          img = :img, 
          role = :role 
      WHERE idJaUsuario = :id`,
      {
        replacements: {
          nombre: dataToUpdate.nombre,
          email: dataToUpdate.email,
          img: dataToUpdate.img,
          role: dataToUpdate.role,
          id,
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
const updateUserInfo = async (idJaUsuario, body) => {
  try {
    const { oldPassword, newPassword, newEmail, newName } = body;

    const usuario = await dbConnection.query(
      "SELECT * FROM JA_Usuario WHERE idJaUsuario = :idJaUsuario",
      {
        replacements: {
          idJaUsuario,
        },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (!usuario || usuario.length === 0) {
      throw new Error("Usuario no encontrado");
    }

    const validPassword = bcryptjs.compareSync(
      oldPassword,
      usuario[0].password
    );
    if (!validPassword) {
      throw new Error("La contraseña anterior no es correcta");
    }

    // Verificar si el nuevo email ya existe
    const userExist = await dbConnection.query(
      "SELECT * FROM JA_Usuario WHERE email = :newEmail AND idJaUsuario != :idJaUsuario",
      {
        replacements: {
          newEmail,
          idJaUsuario,
        },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (userExist.length > 0) {
      throw new Error("El correo electrónico ya está en uso");
    }

    const hashedPassword = bcryptjs.hashSync(newPassword, 10); // 10 es el número de rondas de hashing

    await dbConnection.query(
      "UPDATE JA_Usuario SET email = :newEmail, nombre = :newName, password = :hashedPassword WHERE idJaUsuario = :idJaUsuario",
      {
        replacements: {
          newEmail,
          newName,
          hashedPassword,
          idJaUsuario,
        },
        type: sequelize.QueryTypes.UPDATE,
      }
    );

    consoleHelper.success("Información de usuario actualizada correctamente");
    const updatedUsuario = await dbConnection.query(
      "SELECT * FROM JA_Usuario WHERE idJaUsuario = :idJaUsuario",
      {
        replacements: {
          idJaUsuario,
        },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    return {
      usuario: updatedUsuario[0],
    };
  } catch (error) {
    consoleHelper.error(error.message);
    throw new Error(error.message);
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserById,
  updateUserInfo,
};
