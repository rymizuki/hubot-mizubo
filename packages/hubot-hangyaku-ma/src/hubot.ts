import { IRobot, IResponse } from 'xhubot'
import moment = require('moment')
import { TimeTable } from './time-table'
import { TimeRecord } from './time-record'

const data = [
  [[12, 15, [1, 3, 5]], '狩猟戦'],
  [[12, 30, null],      '強敵襲来'],
  [[16,  0, null],      '強敵襲来'],
  [[16, 50, [1, 3, 5]], '狩猟戦'],
  [[19, 55, null],      'ブリテンボス'],
  [[20, 30, null],      '円卓会議'],
  [[20, 50, [1, 3, 5]], '狩猟戦'],
  [[20, 50, [4, 6]],    '伝承戦'],
  [[20, 50, [6]], '殲滅戦'],
  [[21, 30, [1, 3, 5]], 'アーサー選抜戦'],
  [[22,  0, null],      '強敵襲来'],
]

export = (robot: IRobot) => {
  const timetable = new TimeTable(data, robot.scheduler);
  const envelope = { room: '#叛逆性ミリオンアーサー' }

  timetable.onTime((record) => {
    robot.send(envelope, `ねえアーサー！${ record.content }の時間だよ！`)
  })

  robot.respond(/timetable/, (res: IResponse) => {
    const day = moment().day()
    const output = timetable
      .filterByDay(day)
      .map((record: TimeRecord) => `${ record.time } - ${ record.content }`)
      .join('\n')
    res.send(output);
  })
}
