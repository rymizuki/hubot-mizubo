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
        return new WeatherResults({
          city,
          list,
        })
          .filterByDate(moment())
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
  getTempMax () {
    return maxBy(this.list, (weather) => {
      return weather.main.temp
    })
  }
  getTempMin () {
    return minBy(this.list, (weather) => {
      return weather.main.temp
    })
  }
}

const loc = 'Shinagawa, JP'
const apiKey  = '64574b4d9cabca3f2e114cbf19ef90c5'

module.exports = function (robot) {
  const client = new Weather({ key: apiKey })

  robot.hear(/^!weather/, (msg) => {
    msg.send('inquiring wheather...')

    client.getToday({ q: loc })
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

        msg.send(`${ res.city.name }の今日の天候は ${ weatherstr } です`)
        msg.send(`${ res.city.name }の今日の気温は ${ tempstr } です`)
      })
  })
}