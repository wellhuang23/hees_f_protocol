import { defineStore } from 'pinia'
import type {
    GetLogsResParams,
    LogInfo,
    GetCalEventsResParams,
    CalEvent,
    CusSugMsg,
    GetCusSugResParams,
    CusSugSubItem,
    GetCusSugSubItemParams,
    Notification,
    GetNotificationResParams,
} from '@/interfaces'
import {
    OMS_SERVER_LOGS,
    CAL_EVENTS,
    CUS_SUGGESTIONS,
    NOTIFICATION,
} from '@/global/contstants'
import { sessionCache } from '@/utils/storages.ts'

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
        calEvents: sessionCache.getCache(CAL_EVENTS)?.subItems ?? [] as CalEvent[]
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

            sessionCache.setCache(CAL_EVENTS, {
                calEvents: events,
            })
        }
    }
})

const useCusSuggestionsStore = defineStore(CUS_SUGGESTIONS, {
    state:() => ({
        cusSugStatus0: [] as CusSugMsg[],
        cusSugStatus1: [] as CusSugMsg[],
        cusSugStatus2: [] as CusSugMsg[],
        cusSugStatus3: [] as CusSugMsg[],
        cusSugSubItems: [] as CusSugSubItem[],
    }),
    actions: {
        setCusSuggestions(params: GetCusSugResParams) {
            this.cusSugStatus0 = params.status0 ?? []
            this.cusSugStatus1 = params.status1 ?? []
            this.cusSugStatus2 = params.status2 ?? []
            this.cusSugStatus3 = params.status3 ?? []
        },

        setCusSugSubItems(params: GetCusSugSubItemParams) {
            this.cusSugSubItems = params.subs ?? []
        }
    }
})

const useNotificationStore = defineStore(NOTIFICATION, {
    state:() => ({
        sysNotification: [] as Notification[],
    }),
    actions: {
        setSysNotifications(params: GetNotificationResParams) {
            this.sysNotification = params.notifications ?? []
        }
    }
})

export {
    useOmsServerLogsStore,
    useCalEventsStore,
    useCusSuggestionsStore,
    useNotificationStore,
}
