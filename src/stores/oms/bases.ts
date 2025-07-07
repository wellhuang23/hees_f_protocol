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
            const logs: LogInfo[] = []
            if (omsServerLogs.errno === '00000') {
                for (const log of omsServerLogs.data ?? []) {
                    logs.push(log)
                }
            }

            this.omsServerLogs = logs
        },
    }
})

export {
    useOmsServerLogsStore
}
