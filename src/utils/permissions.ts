import { localCache } from '@/utils/storages'
import type {
    RouteLocationNormalized,
    NavigationGuardNext
} from 'vue-router'
import {
    USER_INFO,
    DEVICE_INFO
} from '@/global/contstants'

export function checkLogIn(to: RouteLocationNormalized): boolean {
    const deviceNo = localCache.getCache(DEVICE_INFO)?.deviceNo ?? ''
    if (to.path != '/logIn') {
        return deviceNo !== '';
    } else {
        return true
    }
}

const NOT_CHECK_PERMISSION = ['/logIn', '/main/401', '/main/404', '/main/dashboard']
export function checkPermission(to: RouteLocationNormalized, next: NavigationGuardNext) {
    const per0100: string[] = localCache.getCache(USER_INFO)?.per0100 ?? []
    const comTaxNo: string = localCache.getCache(USER_INFO)?.comTaxNo ?? 'xxxxxxxx'
    if (!NOT_CHECK_PERMISSION.includes(to.path)) {
        const perCodes = to.meta.perCodes as string[] ?? []
        for (const perCode of perCodes) {
            if (perCode.includes('xxxxxxxx')) {
                perCode.replace('xxxxxxxx', comTaxNo)
            }
            if (!per0100.includes(perCode)) {
                next({
                    path: '/main/401'
                })
            }
        }
        next()
    } else {
        next()
    }
}
