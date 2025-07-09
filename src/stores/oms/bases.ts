import { defineStore } from 'pinia'
import type {
    GetLogsResParams,
    LogInfo,
    GetCalEventsResParams,
    CalEvent,
} from '@/interfaces'
import {
    OMS_SERVER_LOGS,
    CAL_EVENTS,
} from '@/global/contstants'

const useOmsServerLogsStore = defineStore(OMS_SERVER_LOGS, {
    state:() => ({
        omsServerLogs: [] as LogInfo[],
    }),
    actions: {
        setOmsServerLogs(params: GetLogsResParams) {
            const logs: LogInfo[] = []
            if (params.errno === '00000') {
                for (const log of params.data ?? []) {
                    logs.push(log)
                }
            }

            this.omsServerLogs = logs
        },
    }
})

const useCalEventsStore = defineStore(CAL_EVENTS, {
    state:() => ({
        calEvents: [] as CalEvent[]
    }),
    actions: {
        setCalEvents(params: GetCalEventsResParams) {
            const events: CalEvent[] = []
            if (params.errno === '00000') {
                for (const event of params.calData ?? []) {
                    events.push(event)
                }
            }

            this.calEvents = events
        }
    }
})

export {
    useOmsServerLogsStore,
    useCalEventsStore,
}
