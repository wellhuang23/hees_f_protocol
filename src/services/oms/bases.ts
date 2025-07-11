import type {
    GetLogsReqParams,
    GetLogsResParams,
    GetCalEventsResParams,
    CalEventReqParams,
    GeneralResParam,
    GetCusSugResParams,
    CusSugReqParams,
} from '@/interfaces'
import OMSBasesAPI from '@/apis/oms/bases.ts'
import { updateToken } from '@/services'
import {
    useDeviceInfoStore,
    useOmsServerLogsStore,
    useCalEventsStore,
    useCusSuggestionsStore,
} from '@/stores'

const deviceStore = useDeviceInfoStore()
const omsServerLogsStore = useOmsServerLogsStore()
const calEventsStore = useCalEventsStore()
const cusSuggestionsStore = useCusSuggestionsStore()

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

export async function getCalEvents() {
    const token = deviceStore.token
    return OMSBasesAPI.getSysCalEvents(token).then(async (res: GetCalEventsResParams)=> {
        if (res.errno === '99005') {
            const refreshTokenResult = await updateToken().then()
            if (refreshTokenResult === '00000') {
                const refreshToken = deviceStore.token
                return OMSBasesAPI.getSysCalEvents(
                    refreshToken).then((refreshRes: GetCalEventsResParams) => {
                    calEventsStore.setCalEvents(refreshRes)
                    return refreshRes.errno
                })
            }
        } else {
            calEventsStore.setCalEvents(res)
            return res.errno
        }
        return res.errno
    })
}

export async function createNewCalEvent(params: CalEventReqParams) {
    const token = deviceStore.token
    return OMSBasesAPI.createNewCalEvent(params, token).then(async (res: GeneralResParam)=> {
        if (res.errno === '99005') {
            const refreshTokenResult = await updateToken().then()
            if (refreshTokenResult === '00000') {
                const refreshToken = deviceStore.token
                return OMSBasesAPI.createNewCalEvent(
                    params,
                    refreshToken).then((refreshRes: GeneralResParam) => {
                    return refreshRes.errno
                })
            }
        } else {
            return res.errno
        }
        return res.errno
    })
}

export async function updateCalEvent(params: CalEventReqParams) {
    const token = deviceStore.token
    return OMSBasesAPI.updateCalEvent(params, token).then(async (res: GeneralResParam)=> {
        if (res.errno === '99005') {
            const refreshTokenResult = await updateToken().then()
            if (refreshTokenResult === '00000') {
                const refreshToken = deviceStore.token
                return OMSBasesAPI.updateCalEvent(
                    params,
                    refreshToken).then((refreshRes: GeneralResParam) => {
                    return refreshRes.errno
                })
            }
        } else {
            return res.errno
        }
        return res.errno
    })
}

export async function deleteCalEvent(params: CalEventReqParams) {
    const token = deviceStore.token
    return OMSBasesAPI.deleteCalEvent(params, token).then(async (res: GeneralResParam)=> {
        if (res.errno === '99005') {
            const refreshTokenResult = await updateToken().then()
            if (refreshTokenResult === '00000') {
                const refreshToken = deviceStore.token
                return OMSBasesAPI.deleteCalEvent(
                    params,
                    refreshToken).then((refreshRes: GeneralResParam) => {
                    return refreshRes.errno
                })
            }
        } else {
            return res.errno
        }
        return res.errno
    })
}

export async function syncGovCalEvents() {
    const token = deviceStore.token
    return OMSBasesAPI.syncGovCalEvents(token).then(async (res: GeneralResParam)=> {
        if (res.errno === '99005') {
            const refreshTokenResult = await updateToken().then()
            if (refreshTokenResult === '00000') {
                const refreshToken = deviceStore.token
                return OMSBasesAPI.syncGovCalEvents(
                    refreshToken).then((refreshRes: GeneralResParam) => {
                    return refreshRes.errno
                })
            }
        } else {
            return res.errno
        }
        return res.errno
    })
}

export async function getCusSuggestions() {
    const token = deviceStore.token
    return OMSBasesAPI.getCusSuggestion(token).then(async (res: GetCusSugResParams)=> {
        if (res.errno === '99005') {
            const refreshTokenResult = await updateToken().then()
            if (refreshTokenResult === '00000') {
                const refreshToken = deviceStore.token
                return OMSBasesAPI.getCusSuggestion(
                    refreshToken).then((refreshRes: GetCusSugResParams) => {
                    cusSuggestionsStore.setCusSuggestions(refreshRes)
                    return refreshRes.errno
                })
            }
        } else {
            cusSuggestionsStore.setCusSuggestions(res)
            return res.errno
        }
        return res.errno
    })
}

export async function createNewCusSuggestion(params: CusSugReqParams) {
    const token = deviceStore.token
    return OMSBasesAPI.createNewCusSuggestion(params, token).then(async (res: GeneralResParam)=> {
        if (res.errno === '99005') {
            const refreshTokenResult = await updateToken().then()
            if (refreshTokenResult === '00000') {
                const refreshToken = deviceStore.token
                return OMSBasesAPI.createNewCusSuggestion(
                    params,
                    refreshToken).then((refreshRes: GeneralResParam) => {
                    return refreshRes.errno
                })
            }
        } else {
            return res.errno
        }
        return res.errno
    })
}

export async function updateCusSuggestion(params: CusSugReqParams) {
    const token = deviceStore.token
    return OMSBasesAPI.updateCusSuggestion(params, token).then(async (res: GeneralResParam)=> {
        if (res.errno === '99005') {
            const refreshTokenResult = await updateToken().then()
            if (refreshTokenResult === '00000') {
                const refreshToken = deviceStore.token
                return OMSBasesAPI.updateCusSuggestion(
                    params,
                    refreshToken).then((refreshRes: GeneralResParam) => {
                    return refreshRes.errno
                })
            }
        } else {
            return res.errno
        }
        return res.errno
    })
}

export async function deleteCusSuggestion(params: CusSugReqParams) {
    const token = deviceStore.token
    return OMSBasesAPI.deleteCusSuggestion(params, token).then(async (res: GeneralResParam)=> {
        if (res.errno === '99005') {
            const refreshTokenResult = await updateToken().then()
            if (refreshTokenResult === '00000') {
                const refreshToken = deviceStore.token
                return OMSBasesAPI.deleteCusSuggestion(
                    params,
                    refreshToken).then((refreshRes: GeneralResParam) => {
                    return refreshRes.errno
                })
            }
        } else {
            return res.errno
        }
        return res.errno
    })
}
