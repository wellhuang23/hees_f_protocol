import type { GeneralResParam } from '@/interfaces'
import type {
    GetLogsReqParams,
    GetLogsResParams,
    LogInfo,
    ExecutionInfo,
    GetCalEventsResParams,
    CalEvent,
    CalEventReqParams,
} from '@/interfaces'
import request from '@/utils/requests'
import { convertToNumber } from '@/utils/conNumber'

const BASE_API = '/oms/bases'

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
}

export default new OMSBasesAPI;
