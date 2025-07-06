import OMSAuthsAPI from '@/apis/oms/auths'
import type {
    GeneralResParam,
    LogInReqParams,
    LogInResParams,
    GenTokenResParams,
    GetSysRoleResParams,
    GetSysRoleUsersResParams,
} from '@/interfaces'
import {
    useUserInfoStore,
    useDeviceInfoStore,
    useSysPerRoleStore
} from '@/stores'


const userInfoStore = useUserInfoStore()
const userDeviceStore = useDeviceInfoStore()
const sysPerRoleStore = useSysPerRoleStore()

export async function logInAction(logInInfo: LogInReqParams){
    return OMSAuthsAPI.logIn(logInInfo).then((res: LogInResParams): string => {
        if (res.errno === '00000') {
            userInfoStore.setUserInfo(res)
            userDeviceStore.setDeviceInfo(res)

            return res.errno
        } else {
            return res.errno
        }
    })
}

export async function logOutAction(){
    const token = userDeviceStore.token
    return OMSAuthsAPI.logOut(token).then((res: GeneralResParam): string => {
        if (res.errno === '00000') {
            userInfoStore.clearUserInfo()
            userDeviceStore.clearDeviceInfo()

            return res.errno
        } else {
            return res.errno
        }
    })
}

export async function updateToken(){
    const deviceNo = userDeviceStore.deviceNo
    return OMSAuthsAPI.genToken({
        deviceNo: deviceNo
    }).then((res: GenTokenResParams): string => {
        if (res.errno !== '00000') {
            userInfoStore.clearUserInfo()
            userDeviceStore.clearDeviceInfo()

            return res.errno
        } else {
            userDeviceStore.setToken(res)

            return res.errno
        }
    })
}

export async function syncUser(){
    const token = userDeviceStore.token
    return OMSAuthsAPI.syncUser(token).then(async (res: LogInResParams): Promise<string> => {
        if (res.errno === '00000') {
            userInfoStore.setUserInfo(res)
            return res.errno
        } else {
            if (res.errno === '99005') {
                const refreshTokenResult = await updateToken().then()
                if (refreshTokenResult === '00000') {
                    const refreshToken = userDeviceStore.token
                    return OMSAuthsAPI.syncUser(refreshToken).then((refreshRes: LogInResParams): string => {
                        if (refreshRes.errno === '00000') {
                            userInfoStore.setUserInfo(refreshRes)
                        } else {
                            userInfoStore.clearUserInfo()
                            userDeviceStore.clearDeviceInfo()
                        }
                        return refreshRes.errno
                    })
                } else {
                    userInfoStore.clearUserInfo()
                    userDeviceStore.clearDeviceInfo()
                    return refreshTokenResult
                }
            } else {
                userInfoStore.clearUserInfo()
                userDeviceStore.clearDeviceInfo()
                return res.errno
            }
        }
    })
}

export async function getSysRole() {
    const token = userDeviceStore.token
    if (sysPerRoleStore.sysRoles.length === 0) {
        return OMSAuthsAPI.getSysPerRoles(token).then(async (res: GetSysRoleResParams)=> {
            if (res.errno === '00000') {
                sysPerRoleStore.setSysRole(res.sysRoles)
            } else {
                if (res.errno === '99005') {
                    const refreshTokenResult = await updateToken().then()
                    if (refreshTokenResult === '00000') {
                        const refreshToken = userDeviceStore.token
                        return OMSAuthsAPI.getSysPerRoles(refreshToken).then((refreshRes: GetSysRoleResParams) => {
                            sysPerRoleStore.setSysRole(refreshRes.sysRoles)
                        })
                    }
                }
            }
        })
    }
}

export async function getSysRoleUsers() {
    const token = userDeviceStore.token
    if (sysPerRoleStore.sysRoleUsers.length === 0) {
        return OMSAuthsAPI.getSysPerRoleUsers(token).then(async (res: GetSysRoleUsersResParams)=> {
            if (res.errno === '00000') {
                sysPerRoleStore.setSysRoleUsers(res.sysRoleUsers)
            } else {
                if (res.errno === '99005') {
                    const refreshTokenResult = await updateToken().then()
                    if (refreshTokenResult === '00000') {
                        const refreshToken = userDeviceStore.token
                        return OMSAuthsAPI.getSysPerRoleUsers(refreshToken).then((refreshRes: GetSysRoleUsersResParams) => {
                            sysPerRoleStore.setSysRoleUsers(refreshRes.sysRoleUsers)
                        })
                    }
                }
            }
        })
    }
}
