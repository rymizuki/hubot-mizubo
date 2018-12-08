// Description:
//   kindleの発売情報を取得する
//
// Commands:
//   hubot kindle <expr> - exprを計算した値をだす
//
const moment = require('moment')
const { map, get, isArray } = require('lodash')
const Amazon = require('apac').OperationHelper;

module.exports = function (robot) {
  const associateTag = process.env.HUBOT_APAC_ASSOCIATE_TAG
  const accessKeyId = process.env.HUBOT_APAC_ACCESS_KEY
  const secretKey = process.env.HUBOT_APAC_ACCESS_SECRET_KEY

  const client = new Amazon({
    locale: 'JP',
    awsId: accessKeyId,
    awsSecret: secretKey,
    assocId: associateTag,
    maxRequestsPerSecond: 1,
    xml2jsOptions:  {
      explicitArray: false
    }
  }, {locale: 'JP'})

  robot.respond(/kindle (.+)/, (msg) => {
    const keywords = msg.match[1]
    msg.send('検索中')

    // SEE ALSO: https://images-na.ssl-images-amazon.com/images/G/09/associates/paapi/dg/index.html
    const params = {
      title: 'not 月刊',
      keywords,
      binding: 'kindle',
      // pubdate: `during ${ moment().format('MM-YYYY') }`,
    }

    client.execute('ItemSearch', {
      SearchIndex: 'Books',
      ResponseGroup: 'ItemAttributes',
      Sort: 'daterank',
      Power: map(params, (value, key) => {
        return `${ key }:${ value }`
      })
        .join(' and ')
    })
      .then((res) => {
        if (get(res, 'result.ItemSearchResponse.Items.Item')) {
          // console.log(res.result.ItemSearchResponse.Items.Item)

          let items = res.result.ItemSearchResponse.Items.Item
          if (!isArray(items)) items = [ items ]

          const rows = items.map(({ DetailPageURL, ItemAttributes }) => {
            const {
              Title,
              PublicationDate,
            } = ItemAttributes
            return `${ PublicationDate } - ${ Title } <${ DetailPageURL }|amazon>`
          })
          // console.log(rows)
          msg.send(rows.join('\n'))
        } else if (get(res, 'result.ItemSearchResponse.Items')) {
          msg.send('見つかりませんでした')
        } else if (get(res, 'result.ItemSearchErrorResponse')) {
          // console.error(JSON.stringify(res.result, null, 2))
          msg.send(res.result.ItemSearchErrorResponse.Error.Message)
        } else {
          console.error('has invalid response:\n', res)
        }
      })
      .catch((err) => {
        console.error('error', err)
      })

  })
}
