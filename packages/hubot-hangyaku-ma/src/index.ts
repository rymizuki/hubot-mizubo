import { TRobot } from '../types/hubot'
import * as path from 'path'

module.exports = function (robot: TRobot) {
  const scriptPath = path.join(__dirname, ".");
  robot.loadFile(scriptPath, "hubot.js");
};
