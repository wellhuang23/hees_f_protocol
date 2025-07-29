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
    GetSysUsersResParams,
    AssignUserSysPerRoleReqParams,
    ValidCom,
    GetComRoleResParams,
    ComPermission,
    ComRole,
    GetComRoleUsersResParams,
    ComRoleUsers,
    ComRoleUser,
    AssignUserComPerRoleReqParams,
    GetSubComPerResParams,
    SubComPermissions,
    ComCusRoleOperationReqParams,
} from '@/interfaces'
import request from '@/utils/requests'
import { convertToNumber } from '@/utils/conNumber'

const AUTH_API = '/oms/auths'

class OMSAuthsAPI {
    // API for Logging In
    async logIn(data: LogInReqParams): Promise<LogInResParams> {
        const params = {
            'account': data.account,
            'pwd': data.pwd,
            'device_type': 0,
        }

        return request<any, any>({
            url: AUTH_API + '/log/in',
            method: 'POST',
            data: params,
        }).then((response): LogInResParams => {
            if (response.data.errno === '00000') {
                const validCompanies: ValidCom[] = [];
                for (const validCompany of response.data.valid_companies) {
                    validCompanies.push({
                        comId: (convertToNumber(validCompany.com_id) ?? 0),
                        comTaxNo: validCompany.com_tax_no,
                        comStName: validCompany.com_st_name
                    })
                }

                return {
                    errno: response.data.errno,
                    desc: response.data.desc,
                    token: response.data.token,
                    deviceNo: response.data.device_no,
                    groupId: convertToNumber(response.data.group_id),
                    comId: convertToNumber(response.data.com_id),
                    comTaxNo: response.data.com_tax_no,
                    userId: convertToNumber(response.data.user_id),
                    userNo: response.data.user_no,
                    userStName: response.data.user_st_name,
                    userType: convertToNumber(response.data.user_type),
                    per1000: response.data.per_1000 || [],
                    per0100: response.data.per_0100 || [],
                    per0010: response.data.per_0010 || [],
                    per0001: response.data.per_0001 || [],
                    validCompanies:validCompanies
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
                const validCompanies: ValidCom[] = [];
                for (const validCompany of response.data.valid_companies) {
                    validCompanies.push({
                        comId: (convertToNumber(validCompany.com_id) ?? 0),
                        comTaxNo: validCompany.com_tax_no,
                        comStName: validCompany.com_st_name
                    })
                }

                return {
                    errno: response.data.errno,
                    desc: response.data.desc,
                    token: response.data.token,
                    deviceNo: response.data.device_no,
                    groupId: convertToNumber(response.data.group_id),
                    comId: convertToNumber(response.data.com_id),
                    comTaxNo: response.data.com_tax_no,
                    userId: convertToNumber(response.data.user_id),
                    userNo: response.data.user_no,
                    userStName: response.data.user_st_name,
                    userType: convertToNumber(response.data.user_type),
                    per1000: response.data.per_1000 || [],
                    per0100: response.data.per_0100 || [],
                    per0010: response.data.per_0010 || [],
                    per0001: response.data.per_0001 || [],
                    validCompanies: validCompanies
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

    // API for Getting Users in System Permission Roles
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
                            userNo: user.user_no,
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

    // API for Getting Users in System Permission Roles
    async getSysUsers(token: string): Promise<GetSysUsersResParams> {
        return request<any, any>({
            url: AUTH_API + '/sys/users',
            method: 'GET',
            headers: {
                Authorization: `HEEsToken ${token}`,
            }
        }).then((response): GetSysUsersResParams => {
            if (response.data.errno === '00000') {
                const users: SysRoleUser[] = []
                for (const user of response.data.data) {
                    users.push({
                        userId: convertToNumber(user.user_id),
                        userNo: user.user_no,
                        userStName: user.user_st_name,
                    })
                }

                return {
                    errno: response.data.errno,
                    desc: response.data.desc,
                    sysUsers: users
                }
            } else {
                return {
                    errno: response.data.errno,
                    desc: response.data.desc,
                    sysUsers: []
                }
            }
        });
    }

    // API for Assigning User to System Permission Role
    async assignUserSysPerRole(data: AssignUserSysPerRoleReqParams, token: string): Promise<GeneralResParam> {
        const params = {
            'def_role_id': data.sysRoleId,
            'user_ids': data.userIds,
        }

        return request<any, any>({
            url: AUTH_API + '/sys/per/role/assign',
            method: 'POST',
            headers: {
                Authorization: `HEEsToken ${token}`,
            },
            data: params,
        }).then((response): GeneralResParam => {
            return {
                errno: response.data.errno,
                desc: response.data.desc,
            }
        });
    }

    // API for Getting Company Permission Roles
    async getComPerRoles(comId: number, token: string): Promise<GetComRoleResParams> {
        const params = {
            'com_id': comId,
        }
        return request<any, any>({
            url: AUTH_API + '/com/per/roles',
            method: 'GET',
            headers: {
                Authorization: `HEEsToken ${token}`,
            },
            params: params,
        }).then((response): GetComRoleResParams => {
            if (response.data.errno === '00000') {
                const defRoles: ComRole[] = []
                for (const defRole of response.data.data.def_roles) {
                    const comPermissions: ComPermission[] = []
                    for (const per of defRole.permissions) {
                        comPermissions.push({
                            comPerId: convertToNumber(per.com_per_id),
                            comPerNo: per.com_per_no,
                            comPerName: per.com_per_name,
                            comPerDesc: per.com_per_desc,
                            comPerEngName: per.com_per_eng_name,
                            comPerEngDesc: per.com_per_eng_desc,
                        })
                    }

                    defRoles.push({
                        comRoleId: convertToNumber(defRole.com_role_id),
                        comRoleName: defRole.com_role_name,
                        comRoleDesc: defRole.com_role_desc,
                        comRoleEngName: defRole.com_role_eng_name,
                        comRoleEngDesc: defRole.com_role_eng_desc,
                        comPermissions: comPermissions
                    })
                }

                const cusRoles: ComRole[] = []
                for (const cusRole of response.data.data.cus_roles) {
                    const comPermissions: ComPermission[] = []
                    for (const per of cusRole.permissions) {
                        comPermissions.push({
                            comPerId: convertToNumber(per.com_per_id),
                            comPerNo: per.com_per_no,
                            comPerName: per.com_per_name,
                            comPerDesc: per.com_per_desc,
                            comPerEngName: per.com_per_eng_name,
                            comPerEngDesc: per.com_per_eng_desc,
                        })
                    }

                    cusRoles.push({
                        comRoleId: convertToNumber(cusRole.com_role_id),
                        comRoleName: cusRole.com_role_name,
                        comRoleDesc: cusRole.com_role_desc,
                        comRoleEngName: cusRole.com_role_eng_name,
                        comRoleEngDesc: cusRole.com_role_eng_desc,
                        comPermissions: comPermissions
                    })
                }

                return {
                    errno: response.data.errno,
                    desc: response.data.desc,
                    defRoles: defRoles,
                    cusRoles: cusRoles,
                }
            } else {
                return {
                    errno: response.data.errno,
                    desc: response.data.desc,
                    defRoles: [],
                    cusRoles: [],
                }
            }
        });
    }

    // API for Getting Users in Company Permission Roles
    async getComPerRoleUsers(comId: number, token: string): Promise<GetComRoleUsersResParams> {
        const params = {
            'com_id': comId,
        }
        return request<any, any>({
            url: AUTH_API + '/sys/per/role/users',
            method: 'GET',
            headers: {
                Authorization: `HEEsToken ${token}`,
            },
            params: params,
        }).then((response): GetComRoleUsersResParams => {
            if (response.data.errno === '00000') {
                const roles: ComRoleUsers[] = []
                for (const role of response.data.data) {
                    const comRoleUsers: ComRoleUser[] = []
                    for (const user of role.users) {
                        comRoleUsers.push({
                            userId: convertToNumber(user.user_id),
                            userNo: user.user_no,
                            userStName: user.user_st_name,
                        })
                    }

                    roles.push({
                        comRoleId: convertToNumber(role.def_role_id),
                        comRoleName: role.def_role_name,
                        comRoleEngName: role.def_role_eng_name,
                        comRoleUsers: comRoleUsers
                    })
                }

                return {
                    errno: response.data.errno,
                    desc: response.data.desc,
                    comRoleUsers: roles
                }
            } else {
                return {
                    errno: response.data.errno,
                    desc: response.data.desc,
                    comRoleUsers: []
                }
            }
        });
    }

    // API for Assigning User to Company Permission Role
    async assignUserComPerRole(data: AssignUserComPerRoleReqParams, token: string): Promise<GeneralResParam> {
        const params = {
            'com_role_id': data.comRoleId,
            'user_ids': data.userIds,
        }

        return request<any, any>({
            url: AUTH_API + '/com/per/role/assign',
            method: 'POST',
            headers: {
                Authorization: `HEEsToken ${token}`,
            },
            data: params,
        }).then((response): GeneralResParam => {
            return {
                errno: response.data.errno,
                desc: response.data.desc,
            }
        });
    }

    // API for Getting Company Permissions Categorized by Subscriptions
    async getSubComPermissions(comId: number, token: string): Promise<GetSubComPerResParams> {
        const params = {
            'com_id': comId,
        }
        return request<any, any>({
            url: AUTH_API + '/com/per/all',
            method: 'GET',
            headers: {
                Authorization: `HEEsToken ${token}`,
            },
            params: params,
        }).then((response): GetSubComPerResParams => {
            if (response.data.errno === '00000') {
                const subs: SubComPermissions[] = []
                for (const sub of response.data.data) {
                    const comPermissions: ComPermission[] = []
                    for (const permission of sub.permissions) {
                        comPermissions.push({
                            comPerId: convertToNumber(permission.com_per_id),
                            comPerNo: permission.com_per_no,
                            comPerName: permission.com_per_name,
                            comPerDesc: permission.com_per_desc,
                            comPerEngName: permission.com_per_eng_name,
                            comPerEngDesc: permission.com_per_eng_desc,
                        })
                    }

                    subs.push({
                        subId: convertToNumber(sub.sub_id),
                        subNo: sub.sub_no,
                        subName: sub.sub_name,
                        subDesc: sub.sub_desc,
                        subEngName: sub.sub_eng_name,
                        subEngDesc: sub.sub_eng_desc,
                        comPermissions: comPermissions,
                    })
                }

                return {
                    errno: response.data.errno,
                    desc: response.data.desc,
                    subComPermissions: subs
                }
            } else {
                return {
                    errno: response.data.errno,
                    desc: response.data.desc,
                    subComPermissions: []
                }
            }
        });
    }

    // API for Creating Company Customize Role
    async createComCusRole(data: ComCusRoleOperationReqParams, comId: number, token: string): Promise<GeneralResParam> {
        const params = {
            'com_id': comId,
            'com_role_name': data.comRoleName,
            'com_role_desc': data.comRoleDesc,
            'com_per_ids': data.comPerIds,
        }

        return request<any, any>({
            url: AUTH_API + '/com/per/role/create',
            method: 'POST',
            headers: {
                Authorization: `HEEsToken ${token}`,
            },
            data: params,
        }).then((response): GeneralResParam => {
            return {
                errno: response.data.errno,
                desc: response.data.desc,
            }
        });
    }

    // API for Updating Company Customize Role
    async updateComCusRole(data: ComCusRoleOperationReqParams, token: string): Promise<GeneralResParam> {
        const params = {
            'com_role_id': data.comRoleId,
            'com_role_name': data.comRoleName,
            'com_role_desc': data.comRoleDesc,
            'com_per_ids': data.comPerIds,
        }

        return request<any, any>({
            url: AUTH_API + '/com/per/role/update',
            method: 'POST',
            headers: {
                Authorization: `HEEsToken ${token}`,
            },
            data: params,
        }).then((response): GeneralResParam => {
            return {
                errno: response.data.errno,
                desc: response.data.desc,
            }
        });
    }

    // API for Deleting Company Customize Role
    async deleteComCusRole(data: ComCusRoleOperationReqParams, token: string): Promise<GeneralResParam> {
        const params = {
            'com_role_id': data.comRoleId,
        }

        return request<any, any>({
            url: AUTH_API + '/com/per/role/delete',
            method: 'POST',
            headers: {
                Authorization: `HEEsToken ${token}`,
            },
            data: params,
        }).then((response): GeneralResParam => {
            return {
                errno: response.data.errno,
                desc: response.data.desc,
            }
        });
    }
}

export default new OMSAuthsAPI();
