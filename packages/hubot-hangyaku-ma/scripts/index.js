const path = require('path')

module.exports = function (robot) {
  const scriptPath = path.join(__dirname, ".");
  robot.loadFile(scriptPath, "hubot.js");
};
