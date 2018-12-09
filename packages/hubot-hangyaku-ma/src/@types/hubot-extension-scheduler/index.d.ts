declare module 'hubot-extension-scheduler' {
  export type TEnvelope = {
    room: string
  }

  export type TSchedule = {
    time: {
      hour: number,
      minute: number,
      dayOfWeek: number[] | null
    },
    holiday?: boolean,
    data?: any,
    envelope?: TEnvelope,
  }

  export interface ISchedulerTask {
    onTime(listenr: (envelope: TEnvelope, data: any) => void)
  }
  export interface IScheduler {
    register(schedule: TSchedule): ISchedulerTask
  }
}
