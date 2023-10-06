const User = require("../models/user");
const bcryptjs = require("bcryptjs");
const Console = require("../helpers/console");

const consoleHelper = new Console("User Service");
const getUsers = async () => {};

const createUser = async ({ nombre, email, password, rol }) => {};

const updateUser = async (id, dataToUpdate) => {};

const deleteUser = async (id) => {};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
};
