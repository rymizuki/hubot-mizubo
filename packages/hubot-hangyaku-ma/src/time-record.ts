import moment = require('moment')

export class TimeRecord {
  public time: string
  constructor(
    public hour: number,
    public minute: number,
    public days: number[] | null,
    public type: 'bonus' | 'event',
    public content: string
  ) {
    this.time = moment()
      .set('hour', this.hour)
      .set('minute', this.minute)
      .format('HH:mm')
  }
  isInDay(day: number): boolean {
    if (this.days === null) return true
    return this.days.filter((target) => day === target).length > 0
  }
  isBonus(): boolean {
    return this.type === 'bonus'
  }
  isEvent(): boolean {
    return this.type === 'event'
  }
}

