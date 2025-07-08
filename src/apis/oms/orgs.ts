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
    UpdateComSubsReqParams
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
                    groupAdminPwd: response.data.group_admin_pwd,
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
}

export default new OMSOrgsAPI;
