import OMSAuthsAPI from '@/apis/oms/auths.ts'
import type { GeneralResParam, GenTokenResParams } from '@/interfaces'
import { localCache } from '@/utils/storages.ts'
import {
    DEVICE_INFO,
    USER_INFO
} from '@/global/contstants.ts'

export async function checkToken(token: string){
    return OMSAuthsAPI.verToken(token).then(async (check_res: GeneralResParam) => {
        if (check_res.errno === '00000') {
            return check_res.errno
        } else if (check_res.errno === '99005') {
            const deviceNo = localCache.getCache(DEVICE_INFO)?.deviceNo ?? ''
            if (deviceNo === '') {
                localCache.removeCache(USER_INFO)
                localCache.removeCache(DEVICE_INFO)

                return '-----'
            } else {
                return OMSAuthsAPI.genToken({
                    deviceNo: deviceNo
                }).then((gen_res: GenTokenResParams) => {
                    if (gen_res.errno === '00000') {
                        localCache.setCache(DEVICE_INFO, {
                            deviceNo: deviceNo,
                            token: gen_res.token
                        })

                        return gen_res.errno
                    } else {
                        localCache.removeCache(USER_INFO)
                        localCache.removeCache(DEVICE_INFO)

                        return gen_res.errno
                    }
                })
            }
        } else {
            localCache.removeCache(USER_INFO)
            localCache.removeCache(DEVICE_INFO)

            return check_res.errno
        }
    })
}
