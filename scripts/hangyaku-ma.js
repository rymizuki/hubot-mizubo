const timetable = [
  [[12, 15, [1, 3, 5]], '狩猟戦'],
  [[12, 30, null],      '強敵襲来'],
  [[16,  0, null],      '強敵襲来'],
  [[16, 50, [1, 3, 5]], '狩猟戦'],
  [[19, 55, null],      'ブリテンボス'],
  [[20, 30, null],      '円卓会議'],
  [[20, 50, [1, 3, 5]], '狩猟戦'],
  [[20, 50, [4, 6]],    '伝承戦'],
  [[22,  0, null],      '強敵襲来'],
]

module.exports = (robot) => {
  const schedules = timetable.map(([timing, label]) => {
    const [hour, minute, dayOfWeek] = timing
    return {
      time: { hour, minute, dayOfWeek },
      envelope: { room: '#叛逆性ミリオンアーサー' },
      data: {
        label
      }
    }
  })

  const scheduler = robot.scheduler
  schedules.forEach((schedule) => {
    scheduler.register(scheduler)
  })
  scheduler.onTime((envelope, { label }) => {
    robot.send(envelope, `ねえアーサー！${ label }の時間だよ！`)
  })
}
