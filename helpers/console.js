const chalk = require("chalk");

class Console {
  constructor(moduleName) {
    this.moduleName = moduleName;
  }

  logWithTimestamp(message) {
    const currentTimestamp = new Date().toLocaleString();
    console.log(`${currentTimestamp} - ${this.moduleName} - ${message}`);
  }

  success(message) {
    this.logWithTimestamp(`${chalk.green("[SUCCESS]")} ${message}`);
  }

  error(message) {
    this.logWithTimestamp(`${chalk.red("[ERROR]")} ${message}`);
  }

  info(message) {
    this.logWithTimestamp(`${chalk.blue("[INFO]")} ${message}`);
  }
}

module.exports = Console;
