import OMSAuthsAPI from '@/apis/oms/auths'
import type {
    GeneralResParam,
    LogInReqParams,
    LogInResParams,
    GenTokenResParams,
    GetSysRoleResParams,
    GetSysRoleUsersResParams,
    GetSysUsersResParams,
    AssignUserSysPerRoleReqParams,
    GetComRoleResParams,
    GetComRoleUsersResParams,
    AssignUserComPerRoleReqParams,
    ComCusRoleOperationReqParams,
    GetSubComPerResParams,
} from '@/interfaces'
import {
    useUserInfoStore,
    useDeviceInfoStore,
    useSysPerRoleStore,
    useSubItemsStore,
    useValidComStore,
    useComPerRoleStore
} from '@/stores'

const userInfoStore = useUserInfoStore()
const deviceStore = useDeviceInfoStore()
const sysPerRoleStore = useSysPerRoleStore()
const subItemsStore = useSubItemsStore()
const validComStore = useValidComStore()
const comPerRoleStore = useComPerRoleStore()

export async function logInAction(logInInfo: LogInReqParams){
    return OMSAuthsAPI.logIn(logInInfo).then((res: LogInResParams): string => {
        if (res.errno === '00000') {
            userInfoStore.setUserInfo(res)
            deviceStore.setDeviceInfo(res)
            validComStore.activeLogIn(res)

            return res.errno
        } else {
            return res.errno
        }
    })
}

export async function logOutAction(){
    const token = deviceStore.token
    return OMSAuthsAPI.logOut(token).then((res: GeneralResParam): string => {
        if (res.errno === '00000') {
            userInfoStore.clearUserInfo()
            deviceStore.clearDeviceInfo()
            subItemsStore.clearSubItems()

            return res.errno
        } else {
            return res.errno
        }
    })
}

export async function updateToken(){
    const deviceNo = deviceStore.deviceNo
    return OMSAuthsAPI.genToken({
        deviceNo: deviceNo
    }).then((res: GenTokenResParams): string => {
        if (res.errno !== '00000') {
            userInfoStore.clearUserInfo()
            deviceStore.clearDeviceInfo()

            return res.errno
        } else {
            deviceStore.setToken(res)

            return res.errno
        }
    })
}

export async function syncUser(){
    const token = deviceStore.token
    return OMSAuthsAPI.syncUser(token).then(async (res: LogInResParams): Promise<string> => {
        if (res.errno === '00000') {
            userInfoStore.setUserInfo(res)
            validComStore.activeLogIn(res)
            return res.errno
        } else {
            if (res.errno === '99005') {
                const refreshTokenResult = await updateToken().then()
                if (refreshTokenResult === '00000') {
                    const refreshToken = deviceStore.token
                    return OMSAuthsAPI.syncUser(refreshToken).then((refreshRes: LogInResParams): string => {
                        if (refreshRes.errno === '00000') {
                            userInfoStore.setUserInfo(refreshRes)
                            validComStore.activeLogIn(refreshRes)
                        } else {
                            userInfoStore.clearUserInfo()
                            deviceStore.clearDeviceInfo()
                        }
                        return refreshRes.errno
                    })
                } else {
                    userInfoStore.clearUserInfo()
                    deviceStore.clearDeviceInfo()
                    return refreshTokenResult
                }
            } else {
                userInfoStore.clearUserInfo()
                deviceStore.clearDeviceInfo()
                return res.errno
            }
        }
    })
}

export async function getSysRole() {
    const token = deviceStore.token
    return OMSAuthsAPI.getSysPerRoles(token).then(async (res: GetSysRoleResParams)=> {
        if (res.errno === '00000') {
            sysPerRoleStore.setSysRole(res.sysRoles)
        } else {
            if (res.errno === '99005') {
                const refreshTokenResult = await updateToken().then()
                if (refreshTokenResult === '00000') {
                    const refreshToken = deviceStore.token
                    return OMSAuthsAPI.getSysPerRoles(refreshToken).then((refreshRes: GetSysRoleResParams) => {
                        sysPerRoleStore.setSysRole(refreshRes.sysRoles)
                    })
                }
            }
        }
    })
}

export async function getSysRoleUsers() {
    const token = deviceStore.token
    return OMSAuthsAPI.getSysPerRoleUsers(token).then(async (res: GetSysRoleUsersResParams)=> {
        if (res.errno === '00000') {
            sysPerRoleStore.setSysRoleUsers(res.sysRoleUsers)
        } else {
            if (res.errno === '99005') {
                const refreshTokenResult = await updateToken().then()
                if (refreshTokenResult === '00000') {
                    const refreshToken = deviceStore.token
                    return OMSAuthsAPI.getSysPerRoleUsers(refreshToken).then((refreshRes: GetSysRoleUsersResParams) => {
                        sysPerRoleStore.setSysRoleUsers(refreshRes.sysRoleUsers)
                    })
                }
            }
        }
    })
}

export async function getSysUsers() {
    const token = deviceStore.token
    return OMSAuthsAPI.getSysUsers(token).then(async (res: GetSysUsersResParams)=> {
        if (res.errno === '00000') {
            sysPerRoleStore.setSysUsers(res.sysUsers)
        } else {
            if (res.errno === '99005') {
                const refreshTokenResult = await updateToken().then()
                if (refreshTokenResult === '00000') {
                    const refreshToken = deviceStore.token
                    return OMSAuthsAPI.getSysUsers(refreshToken).then((refreshRes: GetSysUsersResParams) => {
                        sysPerRoleStore.setSysUsers(refreshRes.sysUsers)
                    })
                }
            }
        }
    })
}

export async function assignUsersSysPerRole(assignUsersParams: AssignUserSysPerRoleReqParams) {
    const token = deviceStore.token
    return OMSAuthsAPI.assignUserSysPerRole(assignUsersParams, token).then(async (res: GeneralResParam)=> {
        if (res.errno === '00000') {
            return res.errno
        } else {
            if (res.errno === '99005') {
                const refreshTokenResult = await updateToken().then()
                if (refreshTokenResult === '00000') {
                    const refreshToken = deviceStore.token
                    return OMSAuthsAPI.assignUserSysPerRole(
                        assignUsersParams,
                        refreshToken).then((refreshRes: GeneralResParam) => {
                            return refreshRes.errno
                    })
                }
            }
        }
        return res.errno
    })
}

export async function getComRoles() {
    const token = deviceStore.token
    const comId = validComStore.currentCom.comId
    return OMSAuthsAPI.getComPerRoles(comId, token).then(async (res: GetComRoleResParams)=> {
        if (res.errno === '00000') {
            comPerRoleStore.setComRoles(res)
        } else {
            if (res.errno === '99005') {
                const refreshTokenResult = await updateToken().then()
                if (refreshTokenResult === '00000') {
                    const refreshToken = deviceStore.token
                    return OMSAuthsAPI.getComPerRoles(comId, refreshToken).then((refreshRes: GetComRoleResParams) => {
                        comPerRoleStore.setComRoles(refreshRes)
                    })
                }
            }
        }
    })
}

export async function getComRoleUsers() {
    const token = deviceStore.token
    const comId = validComStore.currentCom.comId
    return OMSAuthsAPI.getComPerRoleUsers(comId, token).then(async (res: GetComRoleUsersResParams)=> {
        if (res.errno === '00000') {
            comPerRoleStore.setComRoleUsers(res)
        } else {
            if (res.errno === '99005') {
                const refreshTokenResult = await updateToken().then()
                if (refreshTokenResult === '00000') {
                    const refreshToken = deviceStore.token
                    return OMSAuthsAPI.getComPerRoleUsers(comId, refreshToken).then((refreshRes: GetComRoleUsersResParams) => {
                        comPerRoleStore.setComRoleUsers(refreshRes)
                    })
                }
            }
        }
    })
}

export async function getSubComPermissions() {
    const token = deviceStore.token
    const comId = validComStore.currentCom.comId
    return OMSAuthsAPI.getSubComPermissions(comId, token).then(async (res: GetSubComPerResParams)=> {
        if (res.errno === '00000') {
            comPerRoleStore.setComPermissions(res)
        } else {
            if (res.errno === '99005') {
                const refreshTokenResult = await updateToken().then()
                if (refreshTokenResult === '00000') {
                    const refreshToken = deviceStore.token
                    return OMSAuthsAPI.getSubComPermissions(comId, refreshToken).then((refreshRes: GetSubComPerResParams) => {
                        comPerRoleStore.setComPermissions(refreshRes)
                    })
                }
            }
        }
    })
}

export async function assignUsersComPerRole(assignUsersParams: AssignUserComPerRoleReqParams) {
    const token = deviceStore.token
    return OMSAuthsAPI.assignUserComPerRole(assignUsersParams, token).then(async (res: GeneralResParam)=> {
        if (res.errno === '00000') {
            return res.errno
        } else {
            if (res.errno === '99005') {
                const refreshTokenResult = await updateToken().then()
                if (refreshTokenResult === '00000') {
                    const refreshToken = deviceStore.token
                    return OMSAuthsAPI.assignUserComPerRole(
                        assignUsersParams,
                        refreshToken).then((refreshRes: GeneralResParam) => {
                        return refreshRes.errno
                    })
                }
            }
        }
        return res.errno
    })
}

export async function createComCusRole(reqParams: ComCusRoleOperationReqParams) {
    const token = deviceStore.token
    const comId = validComStore.currentCom.comId
    return OMSAuthsAPI.createComCusRole(reqParams, comId, token).then(async (res: GeneralResParam)=> {
        if (res.errno === '99005') {
            const refreshTokenResult = await updateToken().then()
            if (refreshTokenResult === '00000') {
                const refreshToken = deviceStore.token
                return OMSAuthsAPI.createComCusRole(
                    reqParams,
                    comId,
                    refreshToken).then((refreshRes: GeneralResParam) => {
                    if (refreshRes.errno === '00000') {
                        return OMSAuthsAPI.getComPerRoles(comId, token).then(async (refreshGetRes: GetComRoleResParams) => {
                            if (refreshGetRes.errno === '00000') {
                                comPerRoleStore.setComRoles(refreshGetRes)
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
                return OMSAuthsAPI.getComPerRoles(comId, token).then(async (getRes: GetComRoleResParams) => {
                    if (getRes.errno === '00000') {
                        comPerRoleStore.setComRoles(getRes)
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

export async function updateComCusRole(reqParams: ComCusRoleOperationReqParams) {
    const token = deviceStore.token
    const comId = validComStore.currentCom.comId
    return OMSAuthsAPI.updateComCusRole(reqParams, token).then(async (res: GeneralResParam)=> {
        if (res.errno === '99005') {
            const refreshTokenResult = await updateToken().then()
            if (refreshTokenResult === '00000') {
                const refreshToken = deviceStore.token
                return OMSAuthsAPI.updateComCusRole(
                    reqParams,
                    refreshToken).then((refreshRes: GeneralResParam) => {
                    if (refreshRes.errno === '00000') {
                        return OMSAuthsAPI.getComPerRoles(comId, token).then(async (refreshGetRes: GetComRoleResParams) => {
                            if (refreshGetRes.errno === '00000') {
                                comPerRoleStore.setComRoles(refreshGetRes)
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
                return OMSAuthsAPI.getComPerRoles(comId, token).then(async (getRes: GetComRoleResParams) => {
                    if (getRes.errno === '00000') {
                        comPerRoleStore.setComRoles(getRes)
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

export async function deleteComCusRole(reqParams: ComCusRoleOperationReqParams) {
    const token = deviceStore.token
    const comId = validComStore.currentCom.comId
    return OMSAuthsAPI.deleteComCusRole(reqParams, token).then(async (res: GeneralResParam)=> {
        if (res.errno === '99005') {
            const refreshTokenResult = await updateToken().then()
            if (refreshTokenResult === '00000') {
                const refreshToken = deviceStore.token
                return OMSAuthsAPI.deleteComCusRole(
                    reqParams,
                    refreshToken).then((refreshRes: GeneralResParam) => {
                    if (refreshRes.errno === '00000') {
                        return OMSAuthsAPI.getComPerRoles(comId, token).then(async (refreshGetRes: GetComRoleResParams) => {
                            if (refreshGetRes.errno === '00000') {
                                comPerRoleStore.setComRoles(refreshGetRes)
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
                return OMSAuthsAPI.getComPerRoles(comId, token).then(async (getRes: GetComRoleResParams) => {
                    if (getRes.errno === '00000') {
                        comPerRoleStore.setComRoles(getRes)
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
