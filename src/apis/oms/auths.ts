import type { GeneralResParam } from '@/interfaces'
import type {
    LogInReqParams,
    LogInResParams,
    GenTokenReqParams,
    GenTokenResParams,
    GetSysRoleResParams,
    SysRole,
    SysPermission,
    GetSysRoleUsersResParams,
    SysRoleUser,
    SysRoleUsers,
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

    // API for Syncing User Latest Basic Information & Permission Codes
    async syncUser(token: string): Promise<GeneralResParam> {
        return request<any, any>({
            url: AUTH_API + '/user/sync',
            method: 'GET',
            headers: {
                Authorization: `HEEsToken ${token}`,
            }
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

    // API for Getting System Permission Roles
    async getSysPerRoles(token: string): Promise<GetSysRoleResParams> {
        return request<any, any>({
            url: AUTH_API + '/sys/per/roles',
            method: 'GET',
            headers: {
                Authorization: `HEEsToken ${token}`,
            }
        }).then((response): GetSysRoleResParams => {
            if (response.data.errno === '00000') {
                const roles: SysRole[] = []
                for (const role of response.data.data) {
                    const sysPermissions: SysPermission[] = []
                    for (const per of role.permissions) {
                        sysPermissions.push({
                            sysPerId: convertToNumber(per.sys_per_id),
                            sysPerNo: per.sys_per_no,
                            sysPerName: per.sys_per_name,
                            sysPerDesc: per.sys_per_desc,
                            sysPerEngName: per.sys_per_eng_name,
                            sysPerEngDesc: per.sys_per_eng_desc,
                        })
                    }

                    roles.push({
                        sysRoleId: convertToNumber(role.def_role_id),
                        sysRoleName: role.def_role_name,
                        sysRoleDesc: role.def_role_desc,
                        sysRoleEngName: role.def_role_eng_name,
                        sysRoleEngDesc: role.def_role_eng_desc,
                        sysPermissions: sysPermissions
                    })
                }

                return {
                    errno: response.data.errno,
                    desc: response.data.desc,
                    sysRoles: roles
                }
            } else {
                return {
                    errno: response.data.errno,
                    desc: response.data.desc,
                    sysRoles: []
                }
            }
        });
    }

    // API for Getting System Permission Roles
    async getSysPerRoleUsers(token: string): Promise<GetSysRoleUsersResParams> {
        return request<any, any>({
            url: AUTH_API + '/sys/per/role/users',
            method: 'GET',
            headers: {
                Authorization: `HEEsToken ${token}`,
            }
        }).then((response): GetSysRoleUsersResParams => {
            if (response.data.errno === '00000') {
                const roles: SysRoleUsers[] = []
                for (const role of response.data.data) {
                    const sysRoleUsers: SysRoleUser[] = []
                    for (const user of role.users) {
                        sysRoleUsers.push({
                            userId: convertToNumber(user.user_id),
                            userStName: user.user_st_name,
                        })
                    }

                    roles.push({
                        sysRoleId: convertToNumber(role.def_role_id),
                        sysRoleName: role.def_role_name,
                        sysRoleEngName: role.def_role_eng_name,
                        sysRoleUsers: sysRoleUsers
                    })
                }

                return {
                    errno: response.data.errno,
                    desc: response.data.desc,
                    sysRoleUsers: roles
                }
            } else {
                return {
                    errno: response.data.errno,
                    desc: response.data.desc,
                    sysRoleUsers: []
                }
            }
        });
    }
}

export default new OMSAuthsAPI();
