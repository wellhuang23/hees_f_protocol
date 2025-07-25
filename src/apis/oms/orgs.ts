import type {
    GeneralResParam,
    GetAllSubsResParams,
    Sub,
    GetGroupSubsResParams,
    GroupCompanies,
    ComSubs,
    ComSub,
    CreateComSubsReqParams,
    CreateComSubsResParams,
    UpdateComSubsReqParams,
    ChangeAdminPwdReqParams,
    ChangeAdminPwdResParams,
    GetComInfoResParams,
    ComInfo,
    GetComStrUnitResParams,
    ComStrUnit,
    ComStrUnitOprReqParams,
    GetComJobPositionResParams,
    ComJobPosition,
    GetUserInfoColResParams,
    UserInfoCol,
} from '@/interfaces'
import request from '@/utils/requests'
import { convertToNumber } from '@/utils/conNumber'

const ORGS_API = '/oms/orgs'

class OMSOrgsAPI {
    // API for Getting All Subscription Items
    async getAllSubscriptions(token: string): Promise<GetAllSubsResParams> {
        return request<any, any>({
            url: ORGS_API + '/sub/all',
            method: 'GET',
            headers: {
                Authorization: `HEEsToken ${token}`,
            },
        }).then((response): GetAllSubsResParams => {
            if (response.data.errno === '00000') {
                const subs: Sub[] = []
                for (const sub of response.data.data) {
                    subs.push({
                        subId: convertToNumber(sub.sub_id) ?? 0,
                        subNo: sub.sub_no,
                        subName: sub.sub_name,
                        subDesc: sub.sub_desc,
                        subEngName: sub.sub_eng_name,
                        subEngDesc: sub.sub_eng_desc,
                    })
                }

                return {
                    errno: response.data.errno,
                    desc: response.data.desc,
                    subs: subs
                }
            } else {
                return {
                    errno: response.data.errno,
                    desc: response.data.desc,
                }
            }
        });
    }

    // API for Getting All Groups with Subscriptions
    async getAllGroupSubscriptions(token: string): Promise<GetGroupSubsResParams> {
        return request<any, any>({
            url: ORGS_API + '/com/sub/all',
            method: 'GET',
            headers: {
                Authorization: `HEEsToken ${token}`,
            },
        }).then((response): GetGroupSubsResParams => {
            if (response.data.errno === '00000') {
                const groups: GroupCompanies[] = []
                for (const group of response.data.data) {
                    const companies: ComSubs[] = []
                    for (const company of group.companies) {
                        const subs: ComSub[] = []
                        for (const sub of company.subs) {
                            subs.push({
                                subId: convertToNumber(sub.sub_id) ?? 0,
                                subNo: sub.sub_no,
                                subName: sub.sub_name,
                                subEngName: sub.sub_eng_name,
                                subStartDate: sub.start_date,
                                subEndDate: sub.end_date,
                            })
                        }

                        companies.push({
                            comId: convertToNumber(company.com_id) ?? 0,
                            comTaxNo: company.com_tax_no,
                            comStName: company.com_st_name,
                            comEngName: company.com_eng_name,
                            subs: subs
                        })
                    }

                    groups.push({
                        groupId: convertToNumber(group.group_id) ?? 0,
                        groupName: group.group_name,
                        comSubs: companies,
                    })
                }

                return {
                    errno: response.data.errno,
                    desc: response.data.desc,
                    groups: groups
                }
            } else {
                return {
                    errno: response.data.errno,
                    desc: response.data.desc,
                }
            }
        });
    }

    // API for Creating New Company Subscriptions
    async createNewComSubscription(data: CreateComSubsReqParams, token: string): Promise<CreateComSubsResParams> {
        const subs = []
        for (const sub of data.comSubs.subs) {
            subs.push({
                'sub_id': sub.subId,
                'start_date': sub.subStartDate,
                'end_date': sub.subEndDate,
            })
        }

        const params = {
            'group_id': data.groupId,
            'group_name': data.groupName,
            'com_subs': {
                'com_id': data.comSubs.comId,
                'com_tax_no': data.comSubs.comTaxNo,
                'com_name': data.comSubs.comName,
                'com_st_name': data.comSubs.comStName,
                'com_eng_name': data.comSubs.comEngName,
                'subs': subs
            }
        }

        return request<any, any>({
            url: ORGS_API + '/com/sub/create',
            method: 'POST',
            headers: {
                Authorization: `HEEsToken ${token}`,
            },
            data: params,
        }).then((response): CreateComSubsResParams => {
            if (response.data.errno === '00000') {
                return {
                    errno: response.data.errno,
                    desc: response.data.desc,
                    adminPwd: response.data.admin_pwd,
                }
            } else {
                return {
                    errno: response.data.errno,
                    desc: response.data.desc,
                }
            }
        });
    }

    // API for Updating Subscriptions in Company
    async updateComSubscription(data: UpdateComSubsReqParams, token: string): Promise<GeneralResParam> {
        const subs = []
        for (const sub of data.subs) {
            subs.push({
                'sub_id': sub.subId,
                'start_date': sub.subStartDate,
                'end_date': sub.subEndDate,
            })
        }

        const params = {
            'com_id': data.comId,
            'subs': subs
        }

        return request<any, any>({
            url: ORGS_API + '/com/sub/update',
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

    // API for Changing Group Admin Password
    async changeGroupAdminPwd(data: ChangeAdminPwdReqParams, token: string): Promise<ChangeAdminPwdResParams> {
        const params = {
            'com_id': data.comId,
        }

        return request<any, any>({
            url: ORGS_API + '/admin/pwd/change',
            method: 'POST',
            headers: {
                Authorization: `HEEsToken ${token}`,
            },
            data: params,
        }).then((response): ChangeAdminPwdResParams => {
            if (response.data.errno === '00000') {
                return {
                    errno: response.data.errno,
                    desc: response.data.desc,
                    adminNewPwd: response.data.new_admin_pwd
                }
            }
            return {
                errno: response.data.errno,
                desc: response.data.desc,
            }
        });
    }

    // API for Getting Company Information
    async getComInfo(token: string, comId: number): Promise<GetComInfoResParams> {
        const params = {
            'com_id': comId,
        }
        return request<any, any>({
            url: ORGS_API + '/com/info',
            method: 'GET',
            headers: {
                Authorization: `HEEsToken ${token}`,
            },
            params: params,
        }).then((response): GetComInfoResParams => {
            if (response.data.errno === '00000') {
                return {
                    errno: response.data.errno,
                    desc: response.data.desc,
                    comInfo: {
                        comId: (convertToNumber(response.data.data.com_id) ?? 0),
                        comName: response.data.data.com_name,
                        comStName: response.data.data.com_st_name,
                        comTaxNo: response.data.data.com_tax_no,
                        comLeader: response.data.data.com_leader,
                        comPhone: response.data.data.com_phone,
                        comAddr: response.data.data.com_addr,
                        comDesc: response.data.data.com_desc,
                        comEngName: response.data.data.com_eng_name,
                        comEngAddr: response.data.data.com_eng_addr,
                        groupId: (convertToNumber(response.data.data.group_id) ?? 0),
                        groupName: response.data.data.group_name,
                        groupDesc: response.data.data.group_desc,
                    }
                }
            } else {
                return {
                    errno: response.data.errno,
                    desc: response.data.desc,
                }
            }
        });
    }

    // API for Updating Company Information
    async updateComInfo(data: ComInfo, token: string): Promise<GeneralResParam> {
        const params = {
            com_id: data.comId,
            com_name: data.comName,
            com_st_name: data.comStName,
            com_tax_no: data.comTaxNo,
            com_leader: data.comLeader,
            com_phone: data.comPhone,
            com_addr: data.comAddr,
            com_desc: data.comDesc,
            com_eng_name: data.comEngName,
            com_eng_addr: data.comEngAddr,
            group_id: data.groupId,
            group_name: data.groupName,
            group_desc: data.groupDesc,
        }
        return request<any, any>({
            url: ORGS_API + '/com/info/update',
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

    // API for Getting Company Structure Units
    async getComStrUnits(token: string, comId: number): Promise<GetComStrUnitResParams> {
        const params = {
            'com_id': comId,
        }
        return request<any, any>({
            url: ORGS_API + '/com/str/units',
            method: 'GET',
            headers: {
                Authorization: `HEEsToken ${token}`,
            },
            params: params,
        }).then((response): GetComStrUnitResParams => {
            if (response.data.errno === '00000') {
                const comStrUnits: ComStrUnit[] = []
                for (const row of response.data.data) {
                    const children: ComStrUnit[] = []
                    if (row.children.length > 0) {
                        this._resortComStrUnitChildren(row.children, (convertToNumber(row.str_unit_id) ?? 0)).then(res => {
                            children.push(...res)
                        })
                    }

                    comStrUnits.push({
                        strUnitId: (convertToNumber(row.str_unit_id) ?? 0),
                        strUnitName: row.str_unit_name,
                        strUnitDesc: row.str_unit_desc,
                        strUnitNo: row.str_unit_no,
                        children: children,
                        parentStrUnitId: 0
                    })
                }

                return {
                    errno: response.data.errno,
                    desc: response.data.desc,
                    comStrUnit: comStrUnits
                }
            } else {
                return {
                    errno: response.data.errno,
                    desc: response.data.desc,
                }
            }
        });
    }

    // API for Creating Company Structure Units
    async createNewComStrUnits(data: ComStrUnitOprReqParams, comId: number, token: string): Promise<GeneralResParam> {
        const strUnits = []
        for (const row of data.strUnits ?? []) {
            strUnits.push({
                str_unit_name: row.strUnitName,
                str_unit_desc: row.strUnitDesc,
                str_unit_no: row.strUnitNo
            })
        }

        const params = {
            com_id: comId,
            parent_str_unit_id: data.parentStrUnitId ?? 0,
            str_units: strUnits,
        }
        return request<any, any>({
            url: ORGS_API + '/com/str/unit/create',
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

    // API for Updating Company Structure Unit
    async updateComStrUnit(data: ComStrUnitOprReqParams, token: string): Promise<GeneralResParam> {
        const params = {
            str_unit_id: data.strUnitId ?? 0,
            str_unit_name: data.strUnitName ?? '',
            str_unit_desc: data.strUnitDesc ?? '',
            str_unit_no: data.strUnitNo ?? '',
            parent_str_unit_id: data.parentStrUnitId ?? 0
        }
        return request<any, any>({
            url: ORGS_API + '/com/str/unit/update',
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

    // API for Deleting Company Structure Unit
    async deleteComStrUnit(data: ComStrUnitOprReqParams, token: string): Promise<GeneralResParam> {
        const params = {
            str_unit_id: data.strUnitId ?? 0
        }
        return request<any, any>({
            url: ORGS_API + '/com/str/unit/delete',
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

    // API for Getting Company Job Positions
    async getComJobPositions(token: string, comId: number): Promise<GetComJobPositionResParams> {
        const params = {
            'com_id': comId,
        }
        return request<any, any>({
            url: ORGS_API + '/com/job/pos/get',
            method: 'GET',
            headers: {
                Authorization: `HEEsToken ${token}`,
            },
            params: params,
        }).then((response): GetComJobPositionResParams => {
            if (response.data.errno === '00000') {
                const comJobPositions: ComJobPosition[] = []
                for (const row of response.data.data) {
                    comJobPositions.push({
                        jobPosId: (convertToNumber(row.jp_id) ?? 0),
                        jobPosName: row.jp_name,
                        jobPosLevel: row.jp_level,
                        jobPosDesc: row.jp_desc,
                    })
                }

                return {
                    errno: response.data.errno,
                    desc: response.data.desc,
                    comJobPositions: comJobPositions
                }
            } else {
                return {
                    errno: response.data.errno,
                    desc: response.data.desc,
                }
            }
        });
    }

    // API for Creating Company Job Position
    async createNewJobPosition(data: ComJobPosition, comId: number, token: string): Promise<GeneralResParam> {
        const params = {
            com_id: comId,
            jp_name: data.jobPosName,
            jp_level: data.jobPosLevel,
            jp_desc: data.jobPosDesc,
        }
        return request<any, any>({
            url: ORGS_API + '/com/job/pos/create',
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

    // API for Updating Company Job Position
    async updateJobPosition(data: ComJobPosition, token: string): Promise<GeneralResParam> {
        const params = {
            jp_id: data.jobPosId,
            jp_name: data.jobPosName,
            jp_level: data.jobPosLevel,
            jp_desc: data.jobPosDesc,
        }
        return request<any, any>({
            url: ORGS_API + '/com/job/pos/update',
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

    // API for Deleting Company Job Position
    async deleteJobPosition(data: ComJobPosition, token: string): Promise<GeneralResParam> {
        const params = {
            jp_id: data.jobPosId,
        }
        return request<any, any>({
            url: ORGS_API + '/com/job/pos/delete',
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

    async _resortComStrUnitChildren(children: Array<any>, parentStrUnitId: number): Promise<ComStrUnit[]> {
        const result: Array<ComStrUnit> = []
        for (const child of children) {
            let children: ComStrUnit[] = []
            if (child.children.length > 0) {
                this._resortComStrUnitChildren(child.children, child.str_unit_id).then(res => {
                    children.push(...res)
                })
            }

            result.push({
                strUnitId: (convertToNumber(child.str_unit_id) ?? 0),
                strUnitName: child.str_unit_name,
                strUnitDesc: child.str_unit_desc,
                strUnitNo: child.str_unit_no,
                children: children,
                parentStrUnitId: parentStrUnitId
            })
        }

        return result
    }

    // API for Getting Company Job Positions
    async getUserInfoCols(token: string, comId: number): Promise<GetUserInfoColResParams> {
        const params = {
            'com_id': comId,
        }
        return request<any, any>({
            url: ORGS_API + '/user/info/cols',
            method: 'GET',
            headers: {
                Authorization: `HEEsToken ${token}`,
            },
            params: params,
        }).then((response): GetUserInfoColResParams => {
            if (response.data.errno === '00000') {
                const userInfoCols: UserInfoCol[] = []
                for (const row of response.data.data) {
                    userInfoCols.push({
                        colId: (convertToNumber(row.user_col_id) ?? 0),
                        colName: row.col_name,
                        colDesc: row.col_desc,
                        colType: (convertToNumber(row.col_type) ?? 0),
                        colTypeName: row.col_type_name,
                        colRequire: row.col_require,
                    })
                }

                return {
                    errno: response.data.errno,
                    desc: response.data.desc,
                    userInfoCols: userInfoCols
                }
            } else {
                return {
                    errno: response.data.errno,
                    desc: response.data.desc,
                }
            }
        });
    }

    // API for Operation of User Information Columns in Company
    async operateUserInfoCols(data: UserInfoCol[], comId: number, token: string): Promise<GeneralResParam> {
        const cols = []
        for (const row of data) {
            cols.push({
                user_col_id: row.colId,
                col_name: row.colName,
                col_desc: row.colDesc,
                col_type: row.colType,
                col_require: row.colRequire,
            })
        }

        const params = {
            com_id: comId,
            user_info_cols: cols
        }
        return request<any, any>({
            url: ORGS_API + '/user/info/cols/operation',
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

    // API for Deleting User Information Column in Company
    async deleteUserInfoCol(colId: number, token: string): Promise<GeneralResParam> {
        const params = {
            user_col_id: colId
        }
        return request<any, any>({
            url: ORGS_API + '/user/info/col/delete',
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

export default new OMSOrgsAPI;
