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
    GetStrUnitUsersResParams,
    StrUnitUser,
    UserInfo,
    UserJobPosition,
    UserStrUnit,
    UserDetailInfo,
    CreateGenUserResParams,
    ChangeUserPwdResParams,
    ProfileResParams,
    GetGroupUsersResParams,
    ComUsers,
    RolePerUser,
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

    // API for Getting Users & Categorized by Structure Units
    async getStrUnitUsers(token: string, comId: number): Promise<GetStrUnitUsersResParams> {
        const params = {
            'com_id': comId,
        }
        return request<any, any>({
            url: ORGS_API + '/users/info/get',
            method: 'GET',
            headers: {
                Authorization: `HEEsToken ${token}`,
            },
            params: params,
        }).then((response): GetStrUnitUsersResParams => {
            if (response.data.errno === '00000') {
                const strUnitUsers: StrUnitUser[] = []
                for (const row of response.data.data) {
                    const children: StrUnitUser[] = []
                    if (row.children.length > 0) {
                        this._resortStrUnitUserChildren(row.children).then(res => {
                            children.push(...res)
                        })
                    }

                    const users: UserInfo[] = []
                    for (const user of row.users) {
                        const jobPositions: UserJobPosition[] = []
                        for (const jobPosition of user.job_positions) {
                            jobPositions.push({
                                jobPosId: (convertToNumber(jobPosition.jp_id) ?? 0),
                                jobPosName: jobPosition.jp_name,
                                jobPosEngName: jobPosition.jp_eng_name,
                                jobPosLevel: jobPosition.jp_level,
                            })
                        }
                        const strUnits: UserStrUnit[] = []
                        for (const strUnit of user.str_units) {
                            strUnits.push({
                                strUnitId: (convertToNumber(strUnit.str_unit_id) ?? 0),
                                strUnitName: strUnit.str_unit_name,
                                strUnitEngName: strUnit.str_unit_eng_name,
                                strUnitNo: strUnit.str_unit_no,
                            })
                        }

                        const detailInfo: UserDetailInfo[] = []
                        for (const detail of user.details) {
                            detailInfo.push({
                                userDataId: (convertToNumber(detail.user_data_id) ?? 0),
                                data: detail.data,
                                colId: (convertToNumber(detail.user_col_id) ?? 0),
                                colName: detail.col_name,
                                colType: (convertToNumber(detail.col_type) ?? 0),
                                colRequire: detail.col_require
                            })
                        }

                        users.push({
                            userId: (convertToNumber(user.user_id) ?? 0),
                            userName: user.user_name,
                            userStName: user.user_st_name,
                            userType: (convertToNumber(user.user_type) ?? 0),
                            userNo: user.user_no,
                            email: user.email,
                            jobPositions: jobPositions,
                            strUnits: strUnits,
                            detailInfo: detailInfo
                        })
                    }

                    strUnitUsers.push({
                        strUnitId: (convertToNumber(row.str_unit_id) ?? 0),
                        strUnitName: row.str_unit_name,
                        strUnitEngName: row.str_unit_eng_name,
                        strUnitNo: row.str_unit_no,
                        children: children,
                        users: users
                    })
                }

                return {
                    errno: response.data.errno,
                    desc: response.data.desc,
                    strUnitUsers: strUnitUsers
                }
            } else {
                return {
                    errno: response.data.errno,
                    desc: response.data.desc,
                }
            }
        });
    }

    // API for Creating New User in Company
    async createNewUser(data: UserInfo, comId: number, token: string): Promise<CreateGenUserResParams> {
        const details = []
        for (const row of data.detailInfo) {
            details.push({
                user_col_id: row.colId,
                user_data_id: 0,
                data: row.data,
            })
        }

        const jobPositionIds: Number[] = []
        for (const row of data.jobPositions){
            jobPositionIds.push(row.jobPosId)
        }

        const strUnitIds: Number[] = []
        for (const row of data.strUnits){
            strUnitIds.push(row.strUnitId)
        }

        const params = {
            com_id: comId,
            user_name: data.userName,
            user_st_name: data.userStName,
            user_no: data.userNo,
            email: data.email,
            user_info_details: details,
            jp_ids: jobPositionIds,
            su_ids: strUnitIds,
        }
        return request<any, any>({
            url: ORGS_API + '/user/create',
            method: 'POST',
            headers: {
                Authorization: `HEEsToken ${token}`,
            },
            data: params,
        }).then((response): CreateGenUserResParams => {
            return {
                errno: response.data.errno,
                desc: response.data.desc,
                userNewPwd: response.data.new_pwd,
            }
        });
    }

    // API for Updating User in Company
    async updateUser(data: UserInfo, token: string): Promise<GeneralResParam> {
        const details = []
        for (const row of data.detailInfo) {
            details.push({
                user_col_id: 0,
                user_data_id: row.userDataId,
                data: row.data,
            })
        }

        const jobPositionIds: Number[] = []
        for (const row of data.jobPositions){
            jobPositionIds.push(row.jobPosId)
        }

        const strUnitIds: Number[] = []
        for (const row of data.strUnits){
            strUnitIds.push(row.strUnitId)
        }

        const params = {
            user_id: data.userId,
            user_name: data.userName,
            user_st_name: data.userStName,
            user_no: data.userNo,
            email: data.email,
            user_info_details: details,
            jp_ids: jobPositionIds,
            su_ids: strUnitIds,
        }
        return request<any, any>({
            url: ORGS_API + '/user/update',
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

    // API for Deleting User in Company
    async deleteUser(userId: number, token: string): Promise<GeneralResParam> {
        const params = {
            user_id: userId,
        }
        return request<any, any>({
            url: ORGS_API + '/user/delete',
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

    // API for Changing general User Password by Administrator
    async changeUserPwd(userId: number, token: string): Promise<ChangeUserPwdResParams> {
        const params = {
            'user_id': userId,
        }

        return request<any, any>({
            url: ORGS_API + '/user/pwd/change',
            method: 'POST',
            headers: {
                Authorization: `HEEsToken ${token}`,
            },
            data: params,
        }).then((response): ChangeUserPwdResParams => {
            if (response.data.errno === '00000') {
                return {
                    errno: response.data.errno,
                    desc: response.data.desc,
                    userNewPwd: response.data.new_pwd
                }
            }
            return {
                errno: response.data.errno,
                desc: response.data.desc,
            }
        });
    }

    // API for Getting User Profile
    async getProfile(token: string): Promise<ProfileResParams> {
        return request<any, any>({
            url: ORGS_API + '/profile/info/get',
            method: 'GET',
            headers: {
                Authorization: `HEEsToken ${token}`,
            },
        }).then((response): ProfileResParams => {
            if (response.data.errno === '00000') {
                const jobPositions: UserJobPosition[] = []
                for (const jpRelation of response.data.data.jp_relations) {
                    jobPositions.push({
                        jobPosId: (convertToNumber(jpRelation.jp_id) ?? 0),
                        jobPosName: jpRelation.jp_name,
                        jobPosDesc: jpRelation.jp_desc,
                        jobPosEngName: jpRelation.jp_eng_name,
                        jobPosLevel: jpRelation.jp_level
                    })
                }

                const strUnits: UserStrUnit[] = []
                for (const suRelation of response.data.data.su_relations) {
                    strUnits.push({
                        strUnitId: (convertToNumber(suRelation.str_unit_id) ?? 0),
                        strUnitName: suRelation.str_unit_name,
                        strUnitDesc: suRelation.str_unit_desc,
                        strUnitEngName: suRelation.str_unit_eng_name,
                        strUnitNo: suRelation.str_unit_no
                    })
                }

                const details: UserDetailInfo[] = []
                for (const detail of response.data.data.details) {
                    details.push({
                        userDataId: (convertToNumber(detail.user_data_id) ?? 0),
                        data: detail.data,
                        colId: (convertToNumber(detail.user_col_id) ?? 0),
                        colName: detail.col_name,
                        colDesc: detail.col_desc,
                        colType: detail.col_type,
                        colRequire: detail.col_require,
                    })
                }

                return {
                    errno: response.data.errno,
                    desc: response.data.desc,
                    profile: {
                        userId: (convertToNumber(response.data.data.user_data_id) ?? 0),
                        userName: response.data.data.user_name,
                        userStName: response.data.data.user_st_name,
                        userNo: response.data.data.user_no,
                        email: response.data.data.email,
                        jobPositions: jobPositions,
                        strUnits: strUnits,
                        detailInfo: details,
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

    // API for Updating User Basic Information
    async updateBasicProfile(userStName: string, token: string): Promise<GeneralResParam> {
        const params = {
            user_st_name: userStName,
        }

        return request<any, any>({
            url: ORGS_API + '/profile/basic/update',
            method: 'POST',
            headers: {
                Authorization: `HEEsToken ${token}`,
            },
            data: params,
        }).then((response): GeneralResParam => {
            if (response.data.errno === '00000') {
                return {
                    errno: response.data.errno,
                    desc: response.data.desc,
                }
            }
            return {
                errno: response.data.errno,
                desc: response.data.desc,
            }
        });
    }

    // API for Updating User Detail Information
    async updateDetailProfile(userDetailInfo: UserDetailInfo[], token: string): Promise<GeneralResParam> {
        const details = []
        for (const info of userDetailInfo) {
            details.push({
                user_col_id: info.colId,
                user_data_id: info.userDataId,
                data: info.data,
            })
        }

        const params = {
            user_info_details: details,
        }

        return request<any, any>({
            url: ORGS_API + '/profile/detail/update',
            method: 'POST',
            headers: {
                Authorization: `HEEsToken ${token}`,
            },
            data: params,
        }).then((response): GeneralResParam => {
            if (response.data.errno === '00000') {
                return {
                    errno: response.data.errno,
                    desc: response.data.desc,
                }
            }
            return {
                errno: response.data.errno,
                desc: response.data.desc,
            }
        });
    }

    // API for Updating User Password by Self
    async updateSelfPwd(originPwd: string, newPwd: string, token: string): Promise<GeneralResParam> {
        const params = {
            origin_pwd: originPwd,
            new_pwd: newPwd,
        }

        return request<any, any>({
            url: ORGS_API + '/profile/pwd/change',
            method: 'POST',
            headers: {
                Authorization: `HEEsToken ${token}`,
            },
            data: params,
        }).then((response): GeneralResParam => {
            if (response.data.errno === '00000') {
                return {
                    errno: response.data.errno,
                    desc: response.data.desc,
                }
            }
            return {
                errno: response.data.errno,
                desc: response.data.desc,
            }
        });
    }

    // API for Getting Group Users & Categorized by Structure Units
    async getGroupUsers(token: string): Promise<GetGroupUsersResParams> {
        return request<any, any>({
            url: ORGS_API + '/group/users/get',
            method: 'GET',
            headers: {
                Authorization: `HEEsToken ${token}`,
            },
        }).then((response): GetGroupUsersResParams => {
            if (response.data.errno === '00000') {
                const companies: ComUsers[] = []
                for (const com of response.data.data) {
                    const users: RolePerUser[] = []
                    for (const row of com.users) {
                        const children: RolePerUser[] = []
                        if (row.children.length > 0) {
                            this._resortPerRoleUserChildren(row.children).then(res => {
                                children.push(...res)
                            })
                        }

                        users.push({
                            strUnitId: (convertToNumber(row.str_unit_id) ?? 0),
                            strUnitName: row.str_unit_name,
                            strUnitEngName: row.str_unit_eng_name,
                            strUnitNo: row.str_unit_no,
                            userId: (convertToNumber(row.user_id) ?? 0),
                            userStName: row.user_st_name,
                            userNo: row.user_no,
                            children: children
                        })
                    }

                    companies.push({
                        comId: com.com_id,
                        comStName: com.com_st_name,
                        comTaxNo: com.com_tax_no,
                        users: users
                    })
                }

                return {
                    errno: response.data.errno,
                    desc: response.data.desc,
                    companies: companies
                }
            } else {
                return {
                    errno: response.data.errno,
                    desc: response.data.desc,
                    companies: []
                }
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

    async _resortStrUnitUserChildren(children: Array<any>): Promise<StrUnitUser[]> {
        const result: Array<StrUnitUser> = []
        for (const child of children) {
            let _children: StrUnitUser[] = []
            if (child.children.length > 0) {
                this._resortStrUnitUserChildren(child.children).then(res => {
                    _children.push(...res)
                })
            }

            const users: UserInfo[] = []
            for (const user of child.users) {
                const jobPositions: UserJobPosition[] = []
                if ('job_positions' in user) {
                    for (const jobPosition of user.job_positions) {
                        jobPositions.push({
                            jobPosId: (convertToNumber(jobPosition.jp_id) ?? 0),
                            jobPosName: jobPosition.jp_name,
                            jobPosEngName: jobPosition.jp_eng_name,
                            jobPosLevel: jobPosition.jp_level,
                        })
                    }
                }
                const strUnits: UserStrUnit[] = []
                for (const strUnit of user.str_units) {
                    strUnits.push({
                        strUnitId: (convertToNumber(strUnit.str_unit_id) ?? 0),
                        strUnitName: strUnit.str_unit_name,
                        strUnitEngName: strUnit.str_unit_eng_name,
                        strUnitNo: strUnit.str_unit_no,
                    })
                }

                const detailInfo: UserDetailInfo[] = []
                if ('details' in user) {
                    for (const detail of user.details) {
                        detailInfo.push({
                            userDataId: (convertToNumber(detail.user_data_id) ?? 0),
                            data: detail.data,
                            colId: (convertToNumber(detail.user_col_id) ?? 0),
                            colName: detail.col_name,
                            colType: (convertToNumber(detail.col_type) ?? 0),
                            colRequire: detail.col_require
                        })
                    }
                }

                users.push({
                    userId: (convertToNumber(user.user_id) ?? 0),
                    userName: user.user_name,
                    userStName: user.user_st_name,
                    userType: (convertToNumber(user.user_type) ?? 0),
                    userNo: user.user_no,
                    email: user.email,
                    jobPositions: jobPositions,
                    strUnits: strUnits,
                    detailInfo: detailInfo
                })
            }

            result.push({
                strUnitId: (convertToNumber(child.str_unit_id) ?? 0),
                strUnitName: child.str_unit_name,
                strUnitEngName: child.str_unit_eng_name,
                strUnitNo: child.str_unit_no,
                children: _children,
                users: users
            })
        }

        return result
    }

    async _resortPerRoleUserChildren(children: Array<any>): Promise<RolePerUser[]> {
        const result: Array<RolePerUser> = []
        for (const child of children) {
            let _children: RolePerUser[] = []
            if (child.children.length > 0) {
                this._resortPerRoleUserChildren(child.children).then(res => {
                    _children.push(...res)
                })
            }

            result.push({
                strUnitId: (convertToNumber(child.str_unit_id) ?? 0),
                strUnitName: child.str_unit_name,
                strUnitEngName: child.str_unit_eng_name,
                strUnitNo: child.str_unit_no,
                userId: (convertToNumber(child.user_id) ?? 0),
                userStName: child.user_st_name,
                userNo: child.user_no,
                children: _children
            })
        }

        return result
    }
}

export default new OMSOrgsAPI;
