import type { GeneralResParam } from '@/interfaces'
import type {
    LogInReqParams,
    LogInResParams,
    GenTokenReqParams,
    GenTokenResParams
} from '@/interfaces'
import request from '@/utils/requests'
import { convertToNumber } from '@/utils/conNumber'

const AUTH_API = '/oms/auths'

class OMSAuthsAPI {
    // API for Logging In
    async logIn(data: LogInReqParams): Promise<LogInResParams> {
        const params = {
            'com_tax_no': data.comTaxNo,
            'user': data.user,
            'pwd': data.pwd,
            'device_type': 0,
        }

        return request<any, any>({
            url: AUTH_API + '/log/in',
            method: 'POST',
            data: params,
        }).then((response): LogInResParams => {
            if (response.data.errno === '00000') {
                return {
                    errno: response.data.errno,
                    desc: response.data.desc,
                    token: response.data.token,
                    deviceNo: response.data.device_no,
                    groupId: convertToNumber(response.data.group_id),
                    comId: convertToNumber(response.data.com_id),
                    userId: convertToNumber(response.data.user_id),
                    userNo: response.data.user_no,
                    userStName: response.data.user_st_name,
                    userType: convertToNumber(response.data.user_type),
                    per1000: response.data.per_1000 || [],
                    per0100: response.data.per_0100 || [],
                    per0010: response.data.per_0010 || [],
                    per0001: response.data.per_0001 || [],
                }
            } else {
                return {
                    errno: response.data.errno,
                    desc: response.data.desc,
                }
            }
        });
    }

    // API for Logging Out
    async logOut(token: string): Promise<GeneralResParam> {
        return request<any, any>({
            url: AUTH_API + '/log/out',
            method: 'POST',
            headers: {
                Authorization: `HEEsToken ${token}`,
            }
        }).then((response): GeneralResParam => {
            return {
                errno: response.data.errno,
                desc: response.data.desc,
            }
        });
    }

    // API for Generating Token
    async genToken(data: GenTokenReqParams): Promise<GenTokenResParams> {
        const params = {
            'device_no': data.deviceNo,
        }

        return request<any, any>({
            url: AUTH_API + '/token/gen',
            method: 'GET',
            params: params
        }).then((response): GenTokenResParams => {
            if (response.data.errno === '00000') {
                return {
                    errno: response.data.errno,
                    desc: response.data.desc,
                    token: response.data.token,
                }
            } else {
                return {
                    errno: response.data.errno,
                    desc: response.data.desc,
                }
            }
        });
    }

    // API for Verifying Token
    async verToken(token: string): Promise<GeneralResParam> {
        return request<any, any>({
            url: AUTH_API + '/token/ver',
            method: 'GET',
            headers: {
                Authorization: `HEEsToken ${token}`,
            }
        }).then((response): GeneralResParam => {
            return {
                errno: response.data.errno,
                desc: response.data.desc,
            }
        });
    }
}

export default new OMSAuthsAPI();
