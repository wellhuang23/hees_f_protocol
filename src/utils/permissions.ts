import { localCache } from '@/utils/storages'
import type {
    RouteLocationNormalized,
    NavigationGuardNext
} from 'vue-router'
import {
    USER_INFO,
    DEVICE_INFO,
    VALID_COM,
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
    const comTaxNo = localCache.getCache(VALID_COM)?.currentCom.comTaxNo ?? 'xxxxxxxx'
    if (!NOT_CHECK_PERMISSION.includes(to.path)) {
        const perCodes = to.meta.perCodes as string[] ?? []
        for (const perCode of perCodes) {
            let _perCode: string = ''
            if (perCode.includes('xxxxxxxx')) {
                _perCode = perCode.replace('xxxxxxxx', comTaxNo)
            } else {
                _perCode = perCode
            }
            if (!per0100.includes(_perCode)) {
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
