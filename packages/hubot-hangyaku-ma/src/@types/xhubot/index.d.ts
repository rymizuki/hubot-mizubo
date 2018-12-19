declare module 'xhubot' {
  import { Robot, Response } from 'hubot'
  import { IScheduler } from 'hubot-extension-scheduler'

  export type TEnvelope = {
    room: string
  }

  export interface IRobot extends Robot<string> {
    send(envelope: TEnvelope, message: string): void
    scheduler: IScheduler
  }

  export interface IResponse extends Response<IRobot> {
  }
}
