import OMSAuthsAPI from '@/apis/oms/auths'
import type {
    GeneralResParam,
    LogInReqParams,
    LogInResParams,
    GenTokenResParams
} from '@/interfaces'
import {
    userUserInfoStore,
    useDeviceInfoStore
} from '@/stores';


const userInfoStore = userUserInfoStore()
const userDeviceStore = useDeviceInfoStore()

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
