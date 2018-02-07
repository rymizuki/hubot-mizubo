const Q = require('q')
const { defaults } = require('lodash')

/**
 * hubotからslackのuploadを呼ぶためのメソッドを抽象化したもの
 */
module.exports = function (robot) {
  robot.upload = function (envelope, title, data) {
    this.logger.debug('upload content', envelope, title, data)

    const client = this.adapter.client
    if (client) {
      const params = defaults({
        channels: envelope.room,
      }, data)
      return client.web.files.upload(title, params)
        .catch(() => {
          robot.send(envelope, `${ title }のアップロードに失敗しました...`)
        })
    } else {
      this.logger.warning('`robot.upload` called by unsupported adapter.')
      return Q.when({})
    }
  }
}
