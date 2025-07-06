import { defineStore } from 'pinia'
import type {
    GetLogsResParams,
    LogInfo,
} from '@/interfaces'
import {
    OMS_SERVER_LOGS,
} from '@/global/contstants'

const useOmsServerLogsStore = defineStore(OMS_SERVER_LOGS, {
    state:() => ({
        omsServerLogs: [] as LogInfo[],
    }),
    actions: {
        setOmsServerLogs(omsServerLogs: GetLogsResParams) {
            for (const log of omsServerLogs.data ?? []) {
                this.omsServerLogs.push(log)
            }
        },
    }
})

export {
    useOmsServerLogsStore
}
