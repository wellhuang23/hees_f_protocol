import type {
    GetLogsReqParams,
    GetLogsResParams,
    GetCalEventsResParams,
    CalEventReqParams,
    GeneralResParam,
    GetCusSugResParams,
    CusSugReqParams,
    GetCusSugSubItemParams,
    GetNotificationResParams,
    NotificationReqParams,
} from '@/interfaces'
import OMSBasesAPI from '@/apis/oms/bases.ts'
import { updateToken } from '@/services'
import {
    useDeviceInfoStore,
    useOmsServerLogsStore,
    useCalEventsStore,
    useCusSuggestionsStore,
    useNotificationStore,
} from '@/stores'

const deviceStore = useDeviceInfoStore()
const omsServerLogsStore = useOmsServerLogsStore()
const calEventsStore = useCalEventsStore()
const cusSuggestionsStore = useCusSuggestionsStore()
const notificationStore = useNotificationStore()

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
                    if (refreshRes.errno === '00000') {
                        return OMSBasesAPI.getSysCalEvents(token).then(async (refreshGetRes: GetCalEventsResParams)=> {
                            if (refreshGetRes.errno === '00000') {
                                calEventsStore.setCalEvents(refreshGetRes)
                            }
                            return refreshGetRes.errno
                        })
                    } else {
                        return refreshRes.errno
                    }
                })
            }
        } else {
            if (res.errno === '00000') {
                return OMSBasesAPI.getSysCalEvents(token).then(async (getRes: GetCalEventsResParams)=> {
                    if (getRes.errno === '00000') {
                        calEventsStore.setCalEvents(getRes)
                    }
                    return getRes.errno
                })
            }
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
                    if (refreshRes.errno === '00000') {
                        return OMSBasesAPI.getSysCalEvents(token).then(async (refreshGetRes: GetCalEventsResParams)=> {
                            if (refreshGetRes.errno === '00000') {
                                calEventsStore.setCalEvents(refreshGetRes)
                            }
                            return refreshGetRes.errno
                        })
                    } else {
                        return refreshRes.errno
                    }
                })
            }
        } else {
            if (res.errno === '00000') {
                return OMSBasesAPI.getSysCalEvents(token).then(async (getRes: GetCalEventsResParams)=> {
                    if (getRes.errno === '00000') {
                        calEventsStore.setCalEvents(getRes)
                    }
                    return getRes.errno
                })
            }
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
                    if (refreshRes.errno === '00000') {
                        return OMSBasesAPI.getSysCalEvents(token).then(async (refreshGetRes: GetCalEventsResParams)=> {
                            if (refreshGetRes.errno === '00000') {
                                calEventsStore.setCalEvents(refreshGetRes)
                            }
                            return refreshGetRes.errno
                        })
                    } else {
                        return refreshRes.errno
                    }
                })
            }
        } else {
            if (res.errno === '00000') {
                return OMSBasesAPI.getSysCalEvents(token).then(async (getRes: GetCalEventsResParams)=> {
                    if (getRes.errno === '00000') {
                        calEventsStore.setCalEvents(getRes)
                    }
                    return getRes.errno
                })
            }
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
                    if (refreshRes.errno === '00000') {
                        return OMSBasesAPI.getSysCalEvents(token).then(async (refreshGetRes: GetCalEventsResParams)=> {
                            if (refreshGetRes.errno === '00000') {
                                calEventsStore.setCalEvents(refreshGetRes)
                            }
                            return refreshGetRes.errno
                        })
                    } else {
                        return refreshRes.errno
                    }
                })
            }
        } else {
            if (res.errno === '00000') {
                return OMSBasesAPI.getSysCalEvents(token).then(async (getRes: GetCalEventsResParams)=> {
                    if (getRes.errno === '00000') {
                        calEventsStore.setCalEvents(getRes)
                    }
                    return getRes.errno
                })
            }
        }
        return res.errno
    })
}

export async function getCusSugSubItems() {
    const token = deviceStore.token
    return OMSBasesAPI.getCusSugSubItem(token).then(async (res: GetCusSugSubItemParams)=> {
        if (res.errno === '99005') {
            const refreshTokenResult = await updateToken().then()
            if (refreshTokenResult === '00000') {
                const refreshToken = deviceStore.token
                return OMSBasesAPI.getCusSugSubItem(
                    refreshToken).then((refreshRes: GetCusSugSubItemParams) => {
                    cusSuggestionsStore.setCusSugSubItems(refreshRes)
                    return refreshRes.errno
                })
            }
        } else {
            cusSuggestionsStore.setCusSugSubItems(res)
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
                    if (refreshRes.errno === '00000') {
                        return OMSBasesAPI.getCusSuggestion(token).then(async (refreshGetRes: GetCusSugResParams)=> {
                            if (refreshGetRes.errno === '00000') {
                                cusSuggestionsStore.setCusSuggestions(refreshGetRes)
                            }
                            return refreshGetRes.errno
                        })
                    } else {
                        return refreshRes.errno
                    }
                })
            }
        } else {
            if (res.errno === '00000') {
                return OMSBasesAPI.getCusSuggestion(token).then(async (getRes: GetCusSugResParams)=> {
                    if (getRes.errno === '00000') {
                        cusSuggestionsStore.setCusSuggestions(getRes)
                    }
                    return getRes.errno
                })
            }
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
                    if (refreshRes.errno === '00000') {
                        return OMSBasesAPI.getCusSuggestion(token).then(async (refreshGetRes: GetCusSugResParams)=> {
                            if (refreshGetRes.errno === '00000') {
                                cusSuggestionsStore.setCusSuggestions(refreshGetRes)
                            }
                            return refreshGetRes.errno
                        })
                    } else {
                        return refreshRes.errno
                    }
                })
            }
        } else {
            if (res.errno === '00000') {
                return OMSBasesAPI.getCusSuggestion(token).then(async (getRes: GetCusSugResParams)=> {
                    if (getRes.errno === '00000') {
                        cusSuggestionsStore.setCusSuggestions(getRes)
                    }
                    return getRes.errno
                })
            }
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
                    if (refreshRes.errno === '00000') {
                        return OMSBasesAPI.getCusSuggestion(token).then(async (refreshGetRes: GetCusSugResParams)=> {
                            if (refreshGetRes.errno === '00000') {
                                cusSuggestionsStore.setCusSuggestions(refreshGetRes)
                            }
                            return refreshGetRes.errno
                        })
                    } else {
                        return refreshRes.errno
                    }
                })
            }
        } else {
            if (res.errno === '00000') {
                return OMSBasesAPI.getCusSuggestion(token).then(async (getRes: GetCusSugResParams)=> {
                    if (getRes.errno === '00000') {
                        cusSuggestionsStore.setCusSuggestions(getRes)
                    }
                    return getRes.errno
                })
            }
        }
        return res.errno
    })
}

export async function getSysNotification() {
    const token = deviceStore.token
    return OMSBasesAPI.getSysNotifications(token).then(async (res: GetNotificationResParams)=> {
        if (res.errno === '99005') {
            const refreshTokenResult = await updateToken().then()
            if (refreshTokenResult === '00000') {
                const refreshToken = deviceStore.token
                return OMSBasesAPI.getSysNotifications(
                    refreshToken).then((refreshRes: GetNotificationResParams) => {
                    notificationStore.setSysNotifications(refreshRes)
                    return refreshRes.errno
                })
            }
        } else {
            notificationStore.setSysNotifications(res)
            return res.errno
        }
        return res.errno
    })
}

export async function createNewSysNotification(params: NotificationReqParams) {
    const token = deviceStore.token
    return OMSBasesAPI.createNewSysNotification(params, token).then(async (res: GeneralResParam)=> {
        if (res.errno === '99005') {
            const refreshTokenResult = await updateToken().then()
            if (refreshTokenResult === '00000') {
                const refreshToken = deviceStore.token
                return OMSBasesAPI.createNewSysNotification(
                    params,
                    refreshToken).then((refreshRes: GeneralResParam) => {
                    if (refreshRes.errno === '00000') {
                        return OMSBasesAPI.getSysNotifications(token).then(async (refreshGetRes: GetNotificationResParams)=> {
                            if (refreshGetRes.errno === '00000') {
                                notificationStore.setSysNotifications(refreshGetRes)
                            }
                            return refreshGetRes.errno
                        })
                    } else {
                        return refreshRes.errno
                    }
                })
            }
        } else {
            if (res.errno === '00000') {
                return OMSBasesAPI.getSysNotifications(token).then(async (getRes: GetNotificationResParams)=> {
                    if (getRes.errno === '00000') {
                        notificationStore.setSysNotifications(getRes)
                    }
                    return getRes.errno
                })
            }
        }
        return res.errno
    })
}

export async function updateSysNotification(params: NotificationReqParams) {
    const token = deviceStore.token
    return OMSBasesAPI.updateSysNotification(params, token).then(async (res: GeneralResParam)=> {
        if (res.errno === '99005') {
            const refreshTokenResult = await updateToken().then()
            if (refreshTokenResult === '00000') {
                const refreshToken = deviceStore.token
                return OMSBasesAPI.updateSysNotification(
                    params,
                    refreshToken).then((refreshRes: GeneralResParam) => {
                    if (refreshRes.errno === '00000') {
                        return OMSBasesAPI.getSysNotifications(token).then(async (refreshGetRes: GetNotificationResParams)=> {
                            if (refreshGetRes.errno === '00000') {
                                notificationStore.setSysNotifications(refreshGetRes)
                            }
                            return refreshGetRes.errno
                        })
                    } else {
                        return refreshRes.errno
                    }
                })
            }
        } else {
            if (res.errno === '00000') {
                return OMSBasesAPI.getSysNotifications(token).then(async (getRes: GetNotificationResParams)=> {
                    if (getRes.errno === '00000') {
                        notificationStore.setSysNotifications(getRes)
                    }
                    return getRes.errno
                })
            }
        }
        return res.errno
    })
}

export async function deleteSysNotification(params: NotificationReqParams) {
    const token = deviceStore.token
    return OMSBasesAPI.deleteSysNotification(params, token).then(async (res: GeneralResParam)=> {
        if (res.errno === '99005') {
            const refreshTokenResult = await updateToken().then()
            if (refreshTokenResult === '00000') {
                const refreshToken = deviceStore.token
                return OMSBasesAPI.deleteSysNotification(
                    params,
                    refreshToken).then((refreshRes: GeneralResParam) => {
                    if (refreshRes.errno === '00000') {
                        return OMSBasesAPI.getSysNotifications(token).then(async (refreshGetRes: GetNotificationResParams)=> {
                            if (refreshGetRes.errno === '00000') {
                                notificationStore.setSysNotifications(refreshGetRes)
                            }
                            return refreshGetRes.errno
                        })
                    } else {
                        return refreshRes.errno
                    }
                })
            }
        } else {
            if (res.errno === '00000') {
                return OMSBasesAPI.getSysNotifications(token).then(async (getRes: GetNotificationResParams)=> {
                    if (getRes.errno === '00000') {
                        notificationStore.setSysNotifications(getRes)
                    }
                    return getRes.errno
                })
            }
        }
        return res.errno
    })
}

export async function getGroupNotification() {
    const token = deviceStore.token
    return OMSBasesAPI.getGroupNotifications(token).then(async (res: GetNotificationResParams)=> {
        if (res.errno === '99005') {
            const refreshTokenResult = await updateToken().then()
            if (refreshTokenResult === '00000') {
                const refreshToken = deviceStore.token
                return OMSBasesAPI.getGroupNotifications(
                    refreshToken).then((refreshRes: GetNotificationResParams) => {
                    notificationStore.setGroupNotifications(refreshRes)
                    return refreshRes.errno
                })
            }
        } else {
            notificationStore.setGroupNotifications(res)
            return res.errno
        }
        return res.errno
    })
}

export async function createNewGroupNotification(params: NotificationReqParams) {
    const token = deviceStore.token
    return OMSBasesAPI.createNewGroupNotification(params, token).then(async (res: GeneralResParam)=> {
        if (res.errno === '99005') {
            const refreshTokenResult = await updateToken().then()
            if (refreshTokenResult === '00000') {
                const refreshToken = deviceStore.token
                return OMSBasesAPI.createNewGroupNotification(
                    params,
                    refreshToken).then((refreshRes: GeneralResParam) => {
                    if (refreshRes.errno === '00000') {
                        return OMSBasesAPI.getGroupNotifications(token).then(async (refreshGetRes: GetNotificationResParams) => {
                            if (refreshGetRes.errno === '00000') {
                                notificationStore.setGroupNotifications(refreshGetRes)
                            }
                            return refreshGetRes.errno
                        })
                    } else {
                        return refreshRes.errno
                    }
                })
            }
        } else {
            if (res.errno === '00000') {
                return OMSBasesAPI.getGroupNotifications(token).then(async (getRes: GetNotificationResParams) => {
                    if (getRes.errno === '00000') {
                        notificationStore.setGroupNotifications(getRes)
                    }
                    return getRes.errno
                })
            } else {
                return res.errno
            }
        }
        return res.errno
    })
}

export async function updateGroupNotification(params: NotificationReqParams) {
    const token = deviceStore.token
    return OMSBasesAPI.updateGroupNotification(params, token).then(async (res: GeneralResParam)=> {
        if (res.errno === '99005') {
            const refreshTokenResult = await updateToken().then()
            if (refreshTokenResult === '00000') {
                const refreshToken = deviceStore.token
                return OMSBasesAPI.updateGroupNotification(
                    params,
                    refreshToken).then((refreshRes: GeneralResParam) => {
                    if (refreshRes.errno === '00000') {
                        return OMSBasesAPI.getGroupNotifications(token).then(async (refreshGetRes: GetNotificationResParams) => {
                            if (refreshGetRes.errno === '00000') {
                                notificationStore.setGroupNotifications(refreshGetRes)
                            }
                            return refreshGetRes.errno
                        })
                    } else {
                        return refreshRes.errno
                    }
                })
            }
        } else {
            if (res.errno === '00000') {
                return OMSBasesAPI.getGroupNotifications(token).then(async (getRes: GetNotificationResParams) => {
                    if (getRes.errno === '00000') {
                        notificationStore.setGroupNotifications(getRes)
                    }
                    return getRes.errno
                })
            } else {
                return res.errno
            }
        }
        return res.errno
    })
}

export async function deleteGroupNotification(params: NotificationReqParams) {
    const token = deviceStore.token
    return OMSBasesAPI.deleteGroupNotification(params, token).then(async (res: GeneralResParam)=> {
        if (res.errno === '99005') {
            const refreshTokenResult = await updateToken().then()
            if (refreshTokenResult === '00000') {
                const refreshToken = deviceStore.token
                return OMSBasesAPI.deleteGroupNotification(
                    params,
                    refreshToken).then((refreshRes: GeneralResParam) => {
                    if (refreshRes.errno === '00000') {
                        return OMSBasesAPI.getGroupNotifications(token).then(async (refreshGetRes: GetNotificationResParams) => {
                            if (refreshGetRes.errno === '00000') {
                                notificationStore.setGroupNotifications(refreshGetRes)
                            }
                            return refreshGetRes.errno
                        })
                    } else {
                        return refreshRes.errno
                    }
                })
            }
        } else {
            if (res.errno === '00000') {
                return OMSBasesAPI.getGroupNotifications(token).then(async (getRes: GetNotificationResParams) => {
                    if (getRes.errno === '00000') {
                        notificationStore.setGroupNotifications(getRes)
                    }
                    return getRes.errno
                })
            } else {
                return res.errno
            }
        }
        return res.errno
    })
}

export async function getComNotification() {
    const token = deviceStore.token
    return OMSBasesAPI.getComNotifications(token).then(async (res: GetNotificationResParams)=> {
        if (res.errno === '99005') {
            const refreshTokenResult = await updateToken().then()
            if (refreshTokenResult === '00000') {
                const refreshToken = deviceStore.token
                return OMSBasesAPI.getComNotifications(
                    refreshToken).then((refreshRes: GetNotificationResParams) => {
                    notificationStore.setComNotifications(refreshRes)
                    return refreshRes.errno
                })
            }
        } else {
            notificationStore.setComNotifications(res)
            return res.errno
        }
        return res.errno
    })
}

export async function createNewComNotification(params: NotificationReqParams) {
    const token = deviceStore.token
    return OMSBasesAPI.createNewComNotification(params, token).then(async (res: GeneralResParam)=> {
        if (res.errno === '99005') {
            const refreshTokenResult = await updateToken().then()
            if (refreshTokenResult === '00000') {
                const refreshToken = deviceStore.token
                return OMSBasesAPI.createNewComNotification(
                    params,
                    refreshToken).then((refreshRes: GeneralResParam) => {
                    if (refreshRes.errno === '00000') {
                        return OMSBasesAPI.getComNotifications(token).then(async (refreshGetRes: GetNotificationResParams) => {
                            if (refreshGetRes.errno === '00000') {
                                notificationStore.setComNotifications(refreshGetRes)
                            }
                            return refreshGetRes.errno
                        })
                    } else {
                        return refreshRes.errno
                    }
                })
            }
        } else {
            if (res.errno === '00000') {
                return OMSBasesAPI.getComNotifications(token).then(async (getRes: GetNotificationResParams) => {
                    if (getRes.errno === '00000') {
                        notificationStore.setComNotifications(getRes)
                    }
                    return getRes.errno
                })
            } else {
                return res.errno
            }
        }
        return res.errno
    })
}

export async function updateComNotification(params: NotificationReqParams) {
    const token = deviceStore.token
    return OMSBasesAPI.updateComNotification(params, token).then(async (res: GeneralResParam)=> {
        if (res.errno === '99005') {
            const refreshTokenResult = await updateToken().then()
            if (refreshTokenResult === '00000') {
                const refreshToken = deviceStore.token
                return OMSBasesAPI.updateComNotification(
                    params,
                    refreshToken).then((refreshRes: GeneralResParam) => {
                    if (refreshRes.errno === '00000') {
                        return OMSBasesAPI.getComNotifications(token).then(async (refreshGetRes: GetNotificationResParams) => {
                            if (refreshGetRes.errno === '00000') {
                                notificationStore.setComNotifications(refreshGetRes)
                            }
                            return refreshGetRes.errno
                        })
                    } else {
                        return refreshRes.errno
                    }
                })
            }
        } else {
            if (res.errno === '00000') {
                return OMSBasesAPI.getComNotifications(token).then(async (getRes: GetNotificationResParams) => {
                    if (getRes.errno === '00000') {
                        notificationStore.setComNotifications(getRes)
                    }
                    return getRes.errno
                })
            } else {
                return res.errno
            }
        }
        return res.errno
    })
}

export async function deleteComNotification(params: NotificationReqParams) {
    const token = deviceStore.token
    return OMSBasesAPI.deleteComNotification(params, token).then(async (res: GeneralResParam)=> {
        if (res.errno === '99005') {
            const refreshTokenResult = await updateToken().then()
            if (refreshTokenResult === '00000') {
                const refreshToken = deviceStore.token
                return OMSBasesAPI.deleteComNotification(
                    params,
                    refreshToken).then((refreshRes: GeneralResParam) => {
                    if (refreshRes.errno === '00000') {
                        return OMSBasesAPI.getComNotifications(token).then(async (refreshGetRes: GetNotificationResParams) => {
                            if (refreshGetRes.errno === '00000') {
                                notificationStore.setComNotifications(refreshGetRes)
                            }
                            return refreshGetRes.errno
                        })
                    } else {
                        return refreshRes.errno
                    }
                })
            }
        } else {
            if (res.errno === '00000') {
                return OMSBasesAPI.getComNotifications(token).then(async (getRes: GetNotificationResParams) => {
                    if (getRes.errno === '00000') {
                        notificationStore.setComNotifications(getRes)
                    }
                    return getRes.errno
                })
            } else {
                return res.errno
            }
        }
        return res.errno
    })
}
