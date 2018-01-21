const axios = require('axios')
const { template } = require('lodash')

class ServantDatasource {
  constructor () {
    this.uriTmpl = template('https://kamigame.jp/fgo/<%= resource %>/<%= dataType %>/<%= name %>.html')
    this.resource = '攻略データベース'
    this.dataType = 'サーヴァント一覧'
  }
  findUri (name) {
    const uri = this.uriTmpl({
      resource: encodeURIComponent(this.resource),
      dataType: encodeURIComponent(this.dataType),
      name:     encodeURIComponent(name),
    })
    return axios.get(uri)
      .then(() => {
        return uri
      })
  }
}

module.exports = function (robot) {
  const servant = new ServantDatasource()

  function createHandler (msg) {
    return function handleError (err) {
      if (err.response.status = 404) {
        msg.send(`${ name }の情報は見つかりませんでした`)
      } else {
        msg.send(`取得できません。ステータス ${ err.response.status }`)
      }
    }
  }

  robot.hear(/^!fgo 鯖 (.+)/, (msg) => {
    const name = msg.match[1]

    servant.findUri(name)
      .then((uri) => {
        msg.send(`${ name }の情報: ${ uri }`)
      })
      .catch(createHandler(msg))
  })
}
