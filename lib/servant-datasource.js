const axios = require('axios')
const { template } = require('lodash')

module.exports = class ServantDatasource {
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
