const moment = require('moment')
const Holiday = require('date-holidays')

const baseSalaryDay = 25

moment.fn.isHoliday = function () {
  const dayOfWeek = this.day()
  if (dayOfWeek == 0 || dayOfWeek == 6) return true
  return new Holiday('JA').isHoliday(this.toDate())
}

module.exports = function (robot) {
  const hd = new Holiday('JA')

  function getSalaryDate (date) {
    if (date.isHoliday()) {
      return getSalaryDate(date.clone().subtract(1, 'days'))
    } else {
      return date
    }
  }

  robot.hear(/^!salary/, (msg) => {
    const today      = moment()
    const salaryDate = getSalaryDate(moment(today.format(`YYYY-MM-${ baseSalaryDay }`)))

    const diff = salaryDate.diff(today, 'days')

    if (diff == 0) {
      msg.send(`今日！ が！！ 給料日！！！`)
    }  else if (diff < 0) {
      msg.send(`何いってるんですか、給料日は過ぎましたよ`)
    } else {
      msg.send(`給料日まであと${ diff }日`)
    }
  })
}
