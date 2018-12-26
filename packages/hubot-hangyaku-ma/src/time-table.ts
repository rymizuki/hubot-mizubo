import { IScheduler } from 'hubot-extension-scheduler'
import { TimeRecord } from './time-record'

export class TimeTable {
  private records: TimeRecord[]
  constructor(table, private scheduler: IScheduler) {
    this.records = table.map(([timing, type, label]) => {
      const [hour, minute, dayOfWeek]: [number, number, number[] | null] = timing
      return new TimeRecord(hour, minute, dayOfWeek, type, label);
    })
  }
  onTime(fn: (record: TimeRecord) => void): void {
    this.records.forEach((record) => {
      const time = {
        hour: record.hour,
        minute: record.minute,
        dayOfWeek: record.days,
      }
      this.scheduler.register({ time })
        .onTime((() => {
          fn.call(null, record)
        }))
    })
  }
  filterByDay(day: number): TimeRecord[] {
    return this.records.filter((record: TimeRecord) => {
      return record.isInDay(day)
    })
  }
}

