module.exports = function (robot) {
  require('@mizuki_r/hubot-scheduler')(robot)
  require('hubot-upload')(robot)
}
