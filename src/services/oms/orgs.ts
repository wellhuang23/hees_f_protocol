import OMSOrgsAPI from '@/apis/oms/orgs'
import type {
    GeneralResParam,
    GetAllSubsResParams,
    GetGroupSubsResParams,
    CreateComSubsReqParams,
    CreateComSubsResParams,
    UpdateComSubsReqParams,
    ChangeGroupAdminPwdReqParams,
    ChangeGroupAdminPwdResParams
} from '@/interfaces'
import {
    useDeviceInfoStore,
    useSubItemsStore
} from '@/stores'
import { updateToken } from '@/services'

const deviceStore = useDeviceInfoStore()
const usbItemsStore = useSubItemsStore()

export async function getAllSubItems() {
    const token = deviceStore.token
    return OMSOrgsAPI.getAllSubscriptions(token).then(async (res: GetAllSubsResParams)=> {
        if (res.errno === '00000') {
            usbItemsStore.setSubItems(res.subs ?? [])
        } else {
            if (res.errno === '99005') {
                const refreshTokenResult = await updateToken().then()
                if (refreshTokenResult === '00000') {
                    const refreshToken = deviceStore.token
                    return OMSOrgsAPI.getAllSubscriptions(refreshToken).then((refreshRes: GetAllSubsResParams) => {
                        usbItemsStore.setSubItems(refreshRes.subs ?? [])
                    })
                }
            }
        }
    })
}

export async function getAllGroupSubs() {
    const token = deviceStore.token
    return OMSOrgsAPI.getAllGroupSubscriptions(token).then(async (res: GetGroupSubsResParams)=> {
        if (res.errno === '00000') {
            usbItemsStore.setGroupSubs(res.groups ?? [])
        } else {
            if (res.errno === '99005') {
                const refreshTokenResult = await updateToken().then()
                if (refreshTokenResult === '00000') {
                    const refreshToken = deviceStore.token
                    return OMSOrgsAPI.getAllGroupSubscriptions(refreshToken).then((refreshRes: GetGroupSubsResParams) => {
                        usbItemsStore.setGroupSubs(refreshRes.groups ?? [])
                    })
                }
            }
        }
    })
}

export async function createGroupComSubs(createParams: CreateComSubsReqParams) {
    const token = deviceStore.token
    return OMSOrgsAPI.createNewComSubscription(createParams, token).then(async (res: CreateComSubsResParams)=> {
        if (res.errno === '00000') {
            return res
        } else {
            if (res.errno === '99005') {
                const refreshTokenResult = await updateToken().then()
                if (refreshTokenResult === '00000') {
                    const refreshToken = deviceStore.token
                    return OMSOrgsAPI.createNewComSubscription(
                        createParams,
                        refreshToken).then((refreshRes: CreateComSubsResParams) => {
                        return refreshRes
                    })
                }
            }
        }
        return res
    })
}

export async function updateComSubs(updateParams: UpdateComSubsReqParams) {
    const token = deviceStore.token
    return OMSOrgsAPI.updateComSubscription(updateParams, token).then(async (res: GeneralResParam)=> {
        if (res.errno === '00000') {
            return res
        } else {
            if (res.errno === '99005') {
                const refreshTokenResult = await updateToken().then()
                if (refreshTokenResult === '00000') {
                    const refreshToken = deviceStore.token
                    return OMSOrgsAPI.updateComSubscription(
                        updateParams,
                        refreshToken).then((refreshRes: GeneralResParam) => {
                        return refreshRes
                    })
                }
            }
        }
        return res
    })
}

export async function changeGroupAdminPwd(changeParams: ChangeGroupAdminPwdReqParams) {
    const token = deviceStore.token
    return OMSOrgsAPI.changeGroupAdminPwd(changeParams, token).then(async (res: ChangeGroupAdminPwdResParams)=> {
        if (res.errno === '00000') {
            return res
        } else {
            if (res.errno === '99005') {
                const refreshTokenResult = await updateToken().then()
                if (refreshTokenResult === '00000') {
                    const refreshToken = deviceStore.token
                    return OMSOrgsAPI.changeGroupAdminPwd(
                        changeParams,
                        refreshToken).then((refreshRes: ChangeGroupAdminPwdResParams) => {
                        return refreshRes
                    })
                }
            }
        }
        return res
    })
}
