import { IRobot, IResponse } from 'xhubot'
import moment = require('moment')
import { TimeTable } from './time-table'
import { TimeRecord } from './time-record'

const data = [
  [[12,  0, null],      'bonus', 'スタミナ'],
  [[12, 15, [1, 3, 5]], 'event', '狩猟戦'],
  [[12, 30, null],      'event', '強敵襲来'],
  [[16,  0, null],      'event', '強敵襲来'],
  [[16, 50, [1, 3, 5]], 'event', '狩猟戦'],
  [[18,  0, null],      'bonus', 'スタミナ'],
  [[19, 55, null],      'event', 'ブリテンボス'],
  [[20, 30, null],      'event', '円卓会議'],
  [[20, 50, [1, 3, 5]], 'event', '狩猟戦'],
  [[20, 50, [4, 6]],    'event', '伝承戦'],
  [[20, 50, [0, 2]],    'event', '殲滅戦'],
  [[21, 30, [1, 3, 5]], 'event', 'アーサー選抜戦'],
  [[22,  0, null],      'event', '強敵襲来'],
]

export = (robot: IRobot) => {
  const timetable = new TimeTable(data, robot.scheduler);
  const envelope = { room: '#叛逆性ミリオンアーサー' }

  timetable.onTime((record) => {
    const message = record.isBonus() ? `ねえアーサー！${ record.content }が受け取れるよ！` :
                    record.isEvent() ? `ねえアーサー！${ record.content }の時間だよ！` : 'なんでもないよ！'
    robot.send(envelope, message)
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
