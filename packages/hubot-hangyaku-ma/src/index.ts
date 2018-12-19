import { IRobot } from 'xhubot'
import * as path from 'path'

module.exports = function (robot: IRobot) {
  const scriptPath = path.join(__dirname, ".");
  robot.loadFile(scriptPath, "hubot.js");
};
