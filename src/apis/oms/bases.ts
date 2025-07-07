import type { GeneralResParam } from '@/interfaces'
import type {
    GetLogsReqParams,
    GetLogsResParams,
    LogInfo,
    ExecutionInfo
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
}

export default new OMSBasesAPI;
