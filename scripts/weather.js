const axios = require('axios')
const qs    = require('qs')
const { chain, defaults, maxBy, minBy } = require('lodash')
const moment = require('moment')

const baseUri = 'http://api.openweathermap.org/data/2.5/forecast'

class Weather {
  constructor ({ key }) {
    this.baseUri = baseUri
    this.apiKey  = key
  }
  get (data) {
    const params = defaults(data, {
      APPID: this.apiKey,
      units: 'metric',
    })
    const query = qs.stringify(params)
    return axios.get(`${ baseUri }?${ query }`)
      .then(({ data }) => {
        return data
      })
  }
  getToday (data) {
    return this.get(data)
      .then(({ city, list }) => {
        return new WeatherResults({ city, list, })
          .filterByDate(moment())
      })
  }
  getTomorrow (data) {
    return this.get(data)
      .then(({ city, list }) => {
        return new WeatherResults({ city, list, })
          .filterByDate(moment().clone().add(1, 'days'))
      })
  }
}

class WeatherResults {
  constructor ({ city, list }) {
    this.city = city
    this.list = list
  }
  filterByDate(datetime) {
    return new WeatherResults({
      city: this.city,
      list: chain(this.list)
        .filter((weather) => {
          return moment(weather.dt_txt).format('YYYYMMDD') == datetime.format('YYYYMMDD')
        })
        .value()
    })
  }
}

const loc = 'Shinagawa, JP'
const apiKey  = process.env.HUBOT_WEATHER_KEY

module.exports = function (robot) {
  const client = new Weather({ key: apiKey })

  function fetchAndPost (target, sender) {
    const method = target == 'tomorrow' ? 'getTomorrow' : 'getToday'
    const dateStr = target == 'tomorrow' ? '明日' : '今日'

    client[method]({ q: loc })
      .then((res) => {
        const weatherstr = chain(res.list)
          .map((data) => {
            return `_${ moment(data.dt_txt).format('H時') }_ *${ data.weather[0].main }*`
          })
          .join(', ')
          .value()

        const tempstr = chain(res.list)
          .map((weather) => {
            return `_${ moment(weather.dt_txt).format('H時') }_ *${ Math.round(weather.main.temp) }℃*`
          })
          .join(', ')
          .value()

        sender(`${ res.city.name }の${ dateStr }の天候は ${ weatherstr } です`)
        sender(`${ res.city.name }の${ dateStr }の気温は ${ tempstr } です`)
      })
  }

  robot.scheduler
    .register({
      time: { hour: 7, },
      holiday: true,
      envelope: { room: '#quiet' },
      data: {
      }
    })
    .onTime((envelope, data) => {
      fetchAndPost((content) => {
        robot.send(envelope, content)
      })
    })

  robot.hear(/^!weather(?: (today|tomorrow))?/, (msg) => {
    msg.send('inquiring wheather...')
    const target = msg.match[1]

    fetchAndPost(target, (content) => {
      msg.send(content)
    })
  })
}
