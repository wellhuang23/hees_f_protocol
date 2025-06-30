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
    async getLogs(data: GetLogsReqParams): Promise<GetLogsResParams> {
        const params = {
            'log_start_time': data.logStartTime,
            'log_end_time': data.logEndTime,
        }

        return request<any, any>({
            url: BASE_API + '/logs/get',
            method: 'GET',
            params: params
        }).then((response): GetLogsResParams => {
            if (response.data.errno === '00000') {
                const logs: LogInfo[] = [];
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
                        executions: executions,
                    })
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
