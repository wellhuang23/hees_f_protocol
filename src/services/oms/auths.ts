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
} from '@/interfaces'
import {
    useUserInfoStore,
    useDeviceInfoStore,
    useSysPerRoleStore,
    useSubItemsStore,
    useValidComStore,
} from '@/stores'


const userInfoStore = useUserInfoStore()
const deviceStore = useDeviceInfoStore()
const sysPerRoleStore = useSysPerRoleStore()
const subItemsStore = useSubItemsStore()
const validComStore = useValidComStore()

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
