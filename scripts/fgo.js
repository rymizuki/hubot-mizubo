// Description:
//   FGOの情報を検索します
//
// Commands:
//   hubot fgo 鯖 <名前> - サーヴァント情報を取得します
//
const ServantDatasource = require('servant-datasource')
const FgoDropEfficiency = require('fgo-drop-efficiency')

module.exports = function (robot) {
  const servant = new ServantDatasource()
  const dropEfficiency = new FgoDropEfficiency()

  function createHandler (msg, name) {
    return function handleError (err) {
      if (err.response.status == 404) {
        msg.send(`${ name }の情報は見つかりませんでした`)
      } else if (err.response.status) {
        msg.send(`取得できません。ステータス ${ err.response.status }`)
      } else {
        robot.logger.error(err)
        msg.send(`取得できません`)
      }
    }
  }

  robot.respond(/fgo 鯖 (.+)/, (msg) => {
    const name = msg.match[1]

    servant.findUri(name)
      .then((uri) => {
        msg.send(`${ name }の情報: ${ uri }`)
      })
      .catch(createHandler(msg, name))
  })

  function formatOutput (item) {
    const header = `${ item.name }のドロップ情報:`
    const contents = []
    item.records.forEach(({ rank, area, quest, drop_rate, drop_rate_unit }) => {
      contents.push(`${ rank } ${ area || '-' } ${ quest || '-' } ${ drop_rate || '-' }${ drop_rate_unit }`)
    })
    if (contents.length > 0) {
      contents.unshift(header)
    } else {
      contents.pusth(header)
      contents.push(`見つかりませんでした`)
    }
    return contents.join('\n')
  }

  robot.respond(/fgo drop (.+)/, (msg) => {
    const name = msg.match[1]
    return dropEfficiency.search(name)
      .then((items) => {
        robot.logger.debug('got items', items)
        if (items.length == 0) {
          msg.send(`${ name }の情報は見つかりませんでした`)
          return
        }
        items.forEach((item) => {
          const output = formatOutput(item)
          msg.send(output)
        })
      })
      .catch((err) => {
        msg.send('取得できませんでした')
        robot.logger.error(err)
      })
  })
}
