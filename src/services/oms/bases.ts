import type {
    GetLogsReqParams,
    GetLogsResParams,
} from '@/interfaces'
import OMSBasesAPI from '@/apis/oms/bases.ts'
import { updateToken } from '@/services'
import {
    useDeviceInfoStore,
    useOmsServerLogsStore
} from '@/stores'

const deviceStore = useDeviceInfoStore()
const omsServerLogsStore = useOmsServerLogsStore()

export async function getOmsServerLogs(getLogsReqParams: GetLogsReqParams) {
    const token = deviceStore.token
    return OMSBasesAPI.getLogs(getLogsReqParams, token).then(async (res: GetLogsResParams)=> {
        if (res.errno === '99005') {
            const refreshTokenResult = await updateToken().then()
            if (refreshTokenResult === '00000') {
                const refreshToken = deviceStore.token
                return OMSBasesAPI.getLogs(
                    getLogsReqParams,
                    refreshToken).then((refreshRes: GetLogsResParams) => {
                    omsServerLogsStore.setOmsServerLogs(refreshRes)
                    return refreshRes.errno
                })
            }
        } else {
            omsServerLogsStore.setOmsServerLogs(res)
            return res.errno
        }
        return res.errno
    })
}
