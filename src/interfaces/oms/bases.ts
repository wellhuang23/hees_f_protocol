import type {
    GeneralResParam
} from '@/interfaces'

// Get Log of OMS Services Request Parameters
export interface GetLogsReqParams {
    // Logs Start Search Time
    logStartTime: string;

    // Logs End Search Time
    logEndTime: string;
}

export interface ExecutionInfo {
    // Error No.
    errno: string;

    // Function Execute Status
    status: string;

    // Function Location
    func: string;

    // Function Description
    desc: string;

    // Using Model in ORM
    _model: string;
}

export interface LogInfo {
    // log ID
    logId: number;

    // Log Level
    level: string;

    // Error No.
    errno: string;

    // Log Description
    desc: string;

    // Operator (groupId.comId.userType.userId)
    operator: string;

    // Operator User ID
    opeUserId: number;

    // Operator User Short Name
    opeUserStName: string;

    // Operator User Type
    // 0: System Administrator
    // 1: Group Administrator
    // 2: General User
    opeUserType: number;

    // Operator User Type Name
    opeUserTypeName: string;

    // Operator User's Company Short Name
    opeUserComStName: string;

    // Operator User's Group Name
    opeUserGroupName: string;

    // API Path
    apiPath: string;

    // API Method
    apiMethod: string;

    // API Start Time
    startTime: string;

    // API End Time
    endTime: string;

    // API Expend Time (Second)
    durationTime: number;

    // Exception
    exception: string;

    // All Execution in the API
    executions: ExecutionInfo[];
}

// Get Log of OMS Services Response Parameters
export interface GetLogsResParams extends GeneralResParam {
    // Logs Data
    data?: LogInfo[];
}
