import type { GeneralResParam } from '@/interfaces'
import type {
    GetLogsReqParams,
    GetLogsResParams,
    LogInfo,
    ExecutionInfo,
    GetCalEventsResParams,
    CalEvent,
    CalEventReqParams,
    GetCusSugResParams,
    CusSugMsg,
    CusSugReqParams,
    GetCusSugSubItemParams,
    CusSugSubItem,
    GetNotificationResParams,
    Notification,
    NotificationReqParams,
} from '@/interfaces'
import request from '@/utils/requests'
import { convertToNumber } from '@/utils/conNumber'
import {
    useUserInfoStore,
    useValidComStore,
} from '@/stores'

const BASE_API = '/oms/bases'
const userInfoStore = useUserInfoStore()
const validComStore = useValidComStore()

class OMSBasesAPI {
    // API for Checking OMS Services Alive
    async checkConnection(): Promise<GeneralResParam> {
        return request<any, any>({
            url: BASE_API + '/conn',
            method: 'GET',
        }).then((response): GeneralResParam => {
            return {
                errno: response.data.errno,
                desc: response.data.desc,
            }
        });
    }

    // API for Getting Logs in OMS Services
    async getLogs(data: GetLogsReqParams, token: string): Promise<GetLogsResParams> {
        const params = {
            'log_start_time': data.logStartTime,
            'log_end_time': data.logEndTime,
        }

        return request<any, any>({
            url: BASE_API + '/logs/get',
            method: 'GET',
            headers: {
                Authorization: `HEEsToken ${token}`,
            },
            params: params
        }).then((response): GetLogsResParams => {
            if (response.data.errno === '00000') {
                const logs: LogInfo[] = [];
                let logId: number = 1
                for (let log of response.data.data) {
                    const executions:ExecutionInfo[] = [];
                    for (let execution of log.executions) {
                        executions.push({
                            errno: execution.errno,
                            status: execution.status,
                            func: execution.func,
                            desc: execution.desc,
                            _model: execution._model
                        })
                    }

                    logs.push({
                        logId: logId,
                        level: log.level,
                        errno: log.errno,
                        desc: log.desc,
                        operator: log.operator,
                        apiPath: log.api_path,
                        apiMethod: log.api_method,
                        startTime: log.start_time,
                        endTime: log.end_time,
                        durationTime: (convertToNumber(log.duration_time) ?? 0),
                        exception: log.exception,
                        opeUserId: (convertToNumber(log.ope_user_id) ?? 0),
                        opeUserStName: log.ope_user_st_name,
                        opeUserType: (convertToNumber(log.ope_user_type) ?? 2),
                        opeUserTypeName: log.ope_user_type_name,
                        opeUserComStName: log.ope_user_com_st_name,
                        opeUserGroupName: log.ope_user_group_name,
                        executions: executions,
                    })

                    logId ++
                }

                return {
                    errno: response.data.errno,
                    desc: response.data.desc,
                    data: logs
                }
            } else {
                return {
                    errno: response.data.errno,
                    desc: response.data.desc,
                }
            }
        });
    }

    // API for Getting System calendar Events
    async getSysCalEvents(token: string): Promise<GetCalEventsResParams> {
        return request<any, any>({
            url: BASE_API + '/cals/sys/get',
            method: 'GET',
            headers: {
                Authorization: `HEEsToken ${token}`,
            },
        }).then((response): GetCalEventsResParams => {
            if (response.data.errno === '00000') {
                const calEvents: CalEvent[] = []
                for (const calEvent of response.data.data) {
                    calEvents.push({
                        calId: (convertToNumber(calEvent.cal_id) ?? 0),
                        calName: calEvent.cal_name,
                        calDesc: calEvent.cal_desc,
                        calEngName: calEvent.cal_eng_name,
                        calEngDesc: calEvent.cal_eng_desc,
                        calDate: calEvent.cal_date,
                        calType: (convertToNumber(calEvent.cal_type) ?? 0),
                    })
                }

                return {
                    errno: response.data.errno,
                    desc: response.data.desc,
                    calData: calEvents,
                }
            } else {
                return {
                    errno: response.data.errno,
                    desc: response.data.desc,
                }
            }
        });
    }

    // API for Creating New Calendar Event
    async createNewCalEvent(data: CalEventReqParams, token: string): Promise<GeneralResParam> {
        const params = {
            'cal_name': data.calName ?? '',
            'cal_desc': data.calDesc ?? '',
            'cal_eng_name': data.calEngName ?? '',
            'cal_eng_desc': data.calEngDesc ?? '',
            'cal_date': data.calDate ?? '1970-01-01',
            'cal_type': data.calType ?? 0,
        }

        return request<any, any>({
            url: BASE_API + '/cal/sys/create',
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

    // API for Updating Calendar Event
    async updateCalEvent(data: CalEventReqParams, token: string): Promise<GeneralResParam> {
        const params = {
            'cal_id': data.calId ?? 0,
            'cal_name': data.calName ?? '',
            'cal_desc': data.calDesc ?? '',
            'cal_eng_name': data.calEngName ?? '',
            'cal_eng_desc': data.calEngDesc ?? '',
            'cal_date': data.calDate ?? '1970-01-01',
            'cal_type': data.calType ?? 0,
        }

        return request<any, any>({
            url: BASE_API + '/cal/sys/update',
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

    // API for Deleting Calendar Event
    async deleteCalEvent(data: CalEventReqParams, token: string): Promise<GeneralResParam> {
        const params = {
            'cal_id': data.calId ?? 0,
        }

        return request<any, any>({
            url: BASE_API + '/cal/sys/delete',
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

    // API for Syncing National Calendar Events from Government
    async syncGovCalEvents(token: string): Promise<GeneralResParam> {
        return request<any, any>({
            url: BASE_API + '/cals/sys/sync',
            method: 'POST',
            headers: {
                Authorization: `HEEsToken ${token}`,
            },
        }).then((response): GeneralResParam => {
            return {
                errno: response.data.errno,
                desc: response.data.desc,
            }
        });
    }

    // API for Getting System calendar Events
    async getCusSugSubItem(token: string): Promise<GetCusSugSubItemParams> {
        return request<any, any>({
            url: BASE_API + '/cus/sub/items',
            method: 'GET',
            headers: {
                Authorization: `HEEsToken ${token}`,
            },
        }).then((response): GetCusSugSubItemParams => {
            if (response.data.errno === '00000') {
                const cusSugSubItems: CusSugSubItem[] = []
                for (const cusSugSubItem of response.data.data) {
                    cusSugSubItems.push({
                        subId: (convertToNumber(cusSugSubItem.sub_id) ?? 0),
                        subNo: cusSugSubItem.sub_no,
                        subName: cusSugSubItem.sub_name,
                        subEngName: cusSugSubItem.sub_eng_name,
                    })
                }

                return {
                    errno: response.data.errno,
                    desc: response.data.desc,
                    subs: cusSugSubItems,
                }
            } else {
                return {
                    errno: response.data.errno,
                    desc: response.data.desc,
                }
            }
        });
    }

    // API for Getting Customer Suggestion
    async getCusSuggestion(token: string): Promise<GetCusSugResParams> {
        return request<any, any>({
            url: BASE_API + '/cus/sugs/get',
            method: 'GET',
            headers: {
                Authorization: `HEEsToken ${token}`,
            },
        }).then((response): GetCusSugResParams => {
            if (response.data.errno === '00000') {
                const cusSugStatus0: CusSugMsg[] = []
                for (const cusSug of response.data.status_0) {
                    cusSugStatus0.push({
                        cusSugId: (convertToNumber(cusSug.cus_sug_id) ?? 0),
                        cusSugName: cusSug.cus_sug_name,
                        cusSugDesc: cusSug.cus_sug_desc,
                        cusSugRes: cusSug.cus_sug_res,
                        cusSugStatus: (convertToNumber(cusSug.status) ?? 0),
                        notes: cusSug.notes,
                        cusSugSub: {
                            subId: (convertToNumber(cusSug.sub.sub_id) ?? 0),
                            subNo: cusSug.sub.sub_no,
                            subName: cusSug.sub.sub_name,
                            subEngName: cusSug.sub.sub_eng_name,
                        },
                        creator: {
                            userId: (convertToNumber(cusSug.creator.user_id) ?? 0),
                            userStName: cusSug.creator.user_st_name,
                            comStName: cusSug.creator.com_st_name,
                            groupName: cusSug.creator.group_name,
                        },
                        updater: {
                            userId: (convertToNumber(cusSug.updater.user_id) ?? 0),
                            userStName: cusSug.updater.user_st_name,
                            comStName: cusSug.updater.com_st_name,
                            groupName: cusSug.updater.group_name,
                        },
                    })
                }

                const cusSugStatus1: CusSugMsg[] = []
                for (const cusSug of response.data.status_1) {
                    cusSugStatus1.push({
                        cusSugId: (convertToNumber(cusSug.cus_sug_id) ?? 0),
                        cusSugName: cusSug.cus_sug_name,
                        cusSugDesc: cusSug.cus_sug_desc,
                        cusSugRes: cusSug.cus_sug_res,
                        cusSugStatus: (convertToNumber(cusSug.status) ?? 1),
                        notes: cusSug.notes,
                        cusSugSub: {
                            subId: (convertToNumber(cusSug.sub.sub_id) ?? 0),
                            subNo: cusSug.sub.sub_no,
                            subName: cusSug.sub.sub_name,
                            subEngName: cusSug.sub.sub_eng_name,
                        },
                        creator: {
                            userId: (convertToNumber(cusSug.creator.user_id) ?? 0),
                            userStName: cusSug.creator.user_st_name,
                            comStName: cusSug.creator.com_st_name,
                            groupName: cusSug.creator.group_name,
                        },
                        updater: {
                            userId: (convertToNumber(cusSug.updater.user_id) ?? 0),
                            userStName: cusSug.updater.user_st_name,
                            comStName: cusSug.updater.com_st_name,
                            groupName: cusSug.updater.group_name,
                        },
                    })
                }

                const cusSugStatus2: CusSugMsg[] = []
                for (const cusSug of response.data.status_2) {
                    cusSugStatus2.push({
                        cusSugId: (convertToNumber(cusSug.cus_sug_id) ?? 0),
                        cusSugName: cusSug.cus_sug_name,
                        cusSugDesc: cusSug.cus_sug_desc,
                        cusSugRes: cusSug.cus_sug_res,
                        cusSugStatus: (convertToNumber(cusSug.status) ?? 2),
                        notes: cusSug.notes,
                        cusSugSub: {
                            subId: (convertToNumber(cusSug.sub.sub_id) ?? 0),
                            subNo: cusSug.sub.sub_no,
                            subName: cusSug.sub.sub_name,
                            subEngName: cusSug.sub.sub_eng_name,
                        },
                        creator: {
                            userId: (convertToNumber(cusSug.creator.user_id) ?? 0),
                            userStName: cusSug.creator.user_st_name,
                            comStName: cusSug.creator.com_st_name,
                            groupName: cusSug.creator.group_name,
                        },
                        updater: {
                            userId: (convertToNumber(cusSug.updater.user_id) ?? 0),
                            userStName: cusSug.updater.user_st_name,
                            comStName: cusSug.updater.com_st_name,
                            groupName: cusSug.updater.group_name,
                        },
                    })
                }

                const cusSugStatus3: CusSugMsg[] = []
                for (const cusSug of response.data.status_3) {
                    cusSugStatus3.push({
                        cusSugId: (convertToNumber(cusSug.cus_sug_id) ?? 0),
                        cusSugName: cusSug.cus_sug_name,
                        cusSugDesc: cusSug.cus_sug_desc,
                        cusSugRes: cusSug.cus_sug_res,
                        cusSugStatus: (convertToNumber(cusSug.status) ?? 3),
                        notes: cusSug.notes,
                        cusSugSub: {
                            subId: (convertToNumber(cusSug.sub.sub_id) ?? 0),
                            subNo: cusSug.sub.sub_no,
                            subName: cusSug.sub.sub_name,
                            subEngName: cusSug.sub.sub_eng_name,
                        },
                        creator: {
                            userId: (convertToNumber(cusSug.creator.user_id) ?? 0),
                            userStName: cusSug.creator.user_st_name,
                            comStName: cusSug.creator.com_st_name,
                            groupName: cusSug.creator.group_name,
                        },
                        updater: {
                            userId: (convertToNumber(cusSug.updater.user_id) ?? 0),
                            userStName: cusSug.updater.user_st_name,
                            comStName: cusSug.updater.com_st_name,
                            groupName: cusSug.updater.group_name,
                        },
                    })
                }

                return {
                    errno: response.data.errno,
                    desc: response.data.desc,
                    status0: cusSugStatus0,
                    status1: cusSugStatus1,
                    status2: cusSugStatus2,
                    status3: cusSugStatus3,
                }
            } else {
                return {
                    errno: response.data.errno,
                    desc: response.data.desc,
                }
            }
        });
    }

    // API for Creating New Customer Suggestion
    async createNewCusSuggestion(data: CusSugReqParams, token: string): Promise<GeneralResParam> {
        const params = {
            'cus_sug_name': data.cusSugName ?? '',
            'cus_sug_desc': data.cusSugDesc ?? '',
            'sub_id': data.subId ?? 0,
        }

        return request<any, any>({
            url: BASE_API + '/cus/sug/create',
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

    // API for Updating New Customer Suggestion
    async updateCusSuggestion(data: CusSugReqParams, token: string): Promise<GeneralResParam> {
        const params = {
            'cus_sug_id': data.cusSugId ?? 0,
            'cus_sug_res': data.cusSugRes ?? '',
            'cus_sug_status': data.cusSugStatus ?? 1,
            'notes': data.notes ?? '',
            'sub_id': data.subId ?? 0,
        }

        return request<any, any>({
            url: BASE_API + '/cus/sug/update',
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

    // API for Deleting New Customer Suggestion
    async deleteCusSuggestion(data: CusSugReqParams, token: string): Promise<GeneralResParam> {
        const params = {
            'cus_sug_id': data.cusSugId ?? 0,
        }

        return request<any, any>({
            url: BASE_API + '/cus/sug/delete',
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

    // API for Getting System Notifications
    async getSysNotifications(token: string): Promise<GetNotificationResParams> {
        return request<any, any>({
            url: BASE_API + '/noti/sys/get',
            method: 'GET',
            headers: {
                Authorization: `HEEsToken ${token}`,
            },
        }).then((response): GetNotificationResParams => {
            if (response.data.errno === '00000') {
                const notifications: Notification[] = []
                for (const notification of response.data.data) {
                    notifications.push({
                        notiId: (convertToNumber(notification.noti_id) ?? 0),
                        notiName: notification.noti_name,
                        notiDesc: notification.noti_desc,
                        notiType: (convertToNumber(notification.noti_type) ?? 0),
                        createTime: notification.create_time,
                        updateTime: notification.update_time,
                        creator: {
                            userId: (convertToNumber(notification.creator.user_id) ?? 0),
                            userStName: notification.creator.user_st_name,
                            comStName: notification.creator.com_st_name,
                            groupName: notification.creator.group_name,
                        },
                    })
                }

                return {
                    errno: response.data.errno,
                    desc: response.data.desc,
                    notifications: notifications,
                }
            } else {
                return {
                    errno: response.data.errno,
                    desc: response.data.desc,
                }
            }
        });
    }

    // API for Creating New System Notification
    async createNewSysNotification(data: NotificationReqParams, token: string): Promise<GeneralResParam> {
        const params = {
            'noti_name': data.notiName ?? '',
            'noti_desc': data.notiDesc ?? '',
        }

        return request<any, any>({
            url: BASE_API + '/noti/sys/create',
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

    // API for Updating System Notification
    async updateSysNotification(data: NotificationReqParams, token: string): Promise<GeneralResParam> {
        const params = {
            'noti_id': data.notiId ?? 0,
            'noti_name': data.notiName ?? '',
            'noti_desc': data.notiDesc ?? '',
        }

        return request<any, any>({
            url: BASE_API + '/noti/sys/update',
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

    // API for Deleting System Notification
    async deleteSysNotification(data: NotificationReqParams, token: string): Promise<GeneralResParam> {
        const params = {
            'noti_id': data.notiId ?? 0,
        }

        return request<any, any>({
            url: BASE_API + '/noti/sys/delete',
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

    // API for Getting Group Notifications
    async getGroupNotifications(token: string): Promise<GetNotificationResParams> {
        const groupId = userInfoStore.groupId
        const params = {
            group_id: groupId,
        }
        return request<any, any>({
            url: BASE_API + '/noti/group/get',
            method: 'GET',
            headers: {
                Authorization: `HEEsToken ${token}`,
            },
            params: params,
        }).then((response): GetNotificationResParams => {
            if (response.data.errno === '00000') {
                const notifications: Notification[] = []
                for (const notification of response.data.data) {
                    notifications.push({
                        notiId: (convertToNumber(notification.noti_id) ?? 0),
                        notiName: notification.noti_name,
                        notiDesc: notification.noti_desc,
                        notiType: (convertToNumber(notification.noti_type) ?? 0),
                        createTime: notification.create_time,
                        updateTime: notification.update_time,
                        creator: {
                            userId: (convertToNumber(notification.creator.user_id) ?? 0),
                            userStName: notification.creator.user_st_name,
                            comStName: notification.creator.com_st_name,
                            groupName: notification.creator.group_name,
                        },
                    })
                }

                return {
                    errno: response.data.errno,
                    desc: response.data.desc,
                    notifications: notifications,
                }
            } else {
                return {
                    errno: response.data.errno,
                    desc: response.data.desc,
                }
            }
        });
    }

    // API for Creating New Group Notification
    async createNewGroupNotification(data: NotificationReqParams, token: string): Promise<GeneralResParam> {
        const params = {
            'noti_name': data.notiName ?? '',
            'noti_desc': data.notiDesc ?? '',
        }

        return request<any, any>({
            url: BASE_API + '/noti/group/create',
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

    // API for Updating Group Notification
    async updateGroupNotification(data: NotificationReqParams, token: string): Promise<GeneralResParam> {
        const params = {
            'noti_id': data.notiId ?? 0,
            'noti_name': data.notiName ?? '',
            'noti_desc': data.notiDesc ?? '',
        }

        return request<any, any>({
            url: BASE_API + '/noti/group/update',
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

    // API for Deleting Group Notification
    async deleteGroupNotification(data: NotificationReqParams, token: string): Promise<GeneralResParam> {
        const params = {
            'noti_id': data.notiId ?? 0,
        }

        return request<any, any>({
            url: BASE_API + '/noti/group/delete',
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

    // API for Getting Company Notifications
    async getComNotifications(token: string): Promise<GetNotificationResParams> {
        const comId = validComStore.currentCom.comId
        const params = {
            com_id: comId,
        }
        return request<any, any>({
            url: BASE_API + '/noti/com/get',
            method: 'GET',
            headers: {
                Authorization: `HEEsToken ${token}`,
            },
            params: params,
        }).then((response): GetNotificationResParams => {
            if (response.data.errno === '00000') {
                const notifications: Notification[] = []
                for (const notification of response.data.data) {
                    notifications.push({
                        notiId: (convertToNumber(notification.noti_id) ?? 0),
                        notiName: notification.noti_name,
                        notiDesc: notification.noti_desc,
                        notiType: (convertToNumber(notification.noti_type) ?? 0),
                        createTime: notification.create_time,
                        updateTime: notification.update_time,
                        creator: {
                            userId: (convertToNumber(notification.creator.user_id) ?? 0),
                            userStName: notification.creator.user_st_name,
                            comStName: notification.creator.com_st_name,
                            groupName: notification.creator.group_name,
                        },
                    })
                }

                return {
                    errno: response.data.errno,
                    desc: response.data.desc,
                    notifications: notifications,
                }
            } else {
                return {
                    errno: response.data.errno,
                    desc: response.data.desc,
                }
            }
        });
    }

    // API for Creating New Company Notification
    async createNewComNotification(data: NotificationReqParams, token: string): Promise<GeneralResParam> {
        const params = {
            'noti_name': data.notiName ?? '',
            'noti_desc': data.notiDesc ?? '',
        }

        return request<any, any>({
            url: BASE_API + '/noti/com/create',
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

    // API for Updating Company Notification
    async updateComNotification(data: NotificationReqParams, token: string): Promise<GeneralResParam> {
        const params = {
            'noti_id': data.notiId ?? 0,
            'noti_name': data.notiName ?? '',
            'noti_desc': data.notiDesc ?? '',
        }

        return request<any, any>({
            url: BASE_API + '/noti/com/update',
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

    // API for Deleting Company Notification
    async deleteComNotification(data: NotificationReqParams, token: string): Promise<GeneralResParam> {
        const params = {
            'noti_id': data.notiId ?? 0,
        }

        return request<any, any>({
            url: BASE_API + '/noti/com/delete',
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

export default new OMSBasesAPI;
