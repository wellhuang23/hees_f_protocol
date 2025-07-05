import { defineStore } from 'pinia'
import { localCache } from '@/utils/storages'
import type {
    LogInResParams,
    GenTokenResParams
} from '@/interfaces'
import {
    USER_INFO,
    DEVICE_INFO
} from '@/global/contstants'

const useUserInfoStore = defineStore(USER_INFO, {
    state:() => ({
        groupId: localCache.getCache(USER_INFO)?.groupId ?? -1,
        comId: localCache.getCache(USER_INFO)?.comId ?? -1,
        userId: localCache.getCache(USER_INFO)?.userId ?? -1,
        userNo: localCache.getCache(USER_INFO)?.userNo ?? '',
        userStName: localCache.getCache(USER_INFO)?.userStName ?? '',
        userType: localCache.getCache(USER_INFO)?.userType ?? -1,
        per1000: localCache.getCache(USER_INFO)?.per0100 ?? [] as string[],
        per0100: localCache.getCache(USER_INFO)?.per0100 ?? [] as string[],
        per0010: localCache.getCache(USER_INFO)?.per0100 ?? [] as string[],
        per0001: localCache.getCache(USER_INFO)?.per0100 ?? [] as string[],
    }),
    actions: {
        setUserInfo(logInfo: LogInResParams) {
            this.groupId = logInfo.groupId ?? -1
            this.comId = logInfo.comId ?? -1
            this.userId = logInfo.userId ?? -1
            this.userNo = logInfo.userNo ?? ''
            this.userStName = logInfo.userStName ?? ''
            this.userType = logInfo.userType ?? -1
            this.per1000 = logInfo.per1000 ?? []
            this.per0100 = logInfo.per0100 ?? []
            this.per0010 = logInfo.per0010 ?? []
            this.per0001 = logInfo.per0001 ?? []

            localCache.setCache(USER_INFO, {
                groupId: logInfo.groupId ?? -1,
                comId: logInfo.comId ?? -1,
                userId: logInfo.userId ?? -1,
                userNo: logInfo.userNo ?? '',
                userStName: logInfo.userStName ?? '',
                userType: logInfo.userType ?? -1,
                per1000: logInfo.per1000 ?? [],
                per0100: logInfo.per0100 ?? [],
                per0010: logInfo.per0010 ?? [],
                per0001: logInfo.per0001 ?? [],
            })
        },

        clearUserInfo() {
            this.groupId = -1
            this.comId = -1
            this.userId = -1
            this.userNo = ''
            this.userStName = ''
            this.userType = -1
            this.per1000 = []
            this.per0100 = []
            this.per0010 = []
            this.per0001 = []

            localCache.removeCache(USER_INFO)
        }
    }
})

const useDeviceInfoStore = defineStore(DEVICE_INFO, {
    state:() => ({
        deviceNo: localCache.getCache(DEVICE_INFO)?.deviceNo ?? '',
        token: localCache.getCache(DEVICE_INFO)?.token ?? ''
    }),
    actions: {
        setDeviceInfo(logInInfo: LogInResParams) {
            this.deviceNo = logInInfo.deviceNo
            this.token = logInInfo.token

            localCache.setCache(DEVICE_INFO, {
                deviceNo: logInInfo.deviceNo,
                token: logInInfo.token
            })
        },

        setToken(tokenInfo: GenTokenResParams) {
            this.token = tokenInfo.token

            localCache.setCache(DEVICE_INFO, {
                deviceNo: this.deviceNo,
                token: tokenInfo.token
            })
        },

        clearDeviceInfo() {
            this.deviceNo = ''
            this.token = ''

            localCache.removeCache(DEVICE_INFO)
        }
    }
})

export { useUserInfoStore, useDeviceInfoStore }
