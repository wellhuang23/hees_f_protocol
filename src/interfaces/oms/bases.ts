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

// Execution Information in Log Information
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

// Log Information
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

// Calendar Event
export interface CalEvent {
    // Calendar Event ID
    calId: number;

    // Calendar Event Name
    calName: string;

    // Calendar Event Description
    calDesc: string;

    // Calendar Event Name in English
    calEngName: string;

    // Calendar Event Description in English
    calEngDesc: string;

    // Calendar Event Date
    calDate: string;

    // Calendar Type
    calType: number;
}

export interface GetCalEventsResParams extends GeneralResParam {
    calData?: CalEvent[];
}

// Create/Update/Delete Single calendar Event Request Parameters
export interface CalEventReqParams {
    // Calendar Event ID
    calId?: number;

    // Calendar Event Name
    calName?: string;

    // Calendar Event Description
    calDesc?: string;

    // Calendar Event Name in English
    calEngName?: string;

    // Calendar Event Description in English
    calEngDesc?: string;

    // Calendar Event Date
    calDate?: string;

    // Calendar Type
    calType?: number;
}

// Subscription Item for Customer Suggestion
export interface CusSugSubItem {
    // Subscription Item ID
    subId: number;

    // Subscription Item No.
    subNo: string;

    // Subscription Item Name
    subName: string;

    // Subscription Item Name in English
    subEngName: string;
}

// Get Subscription Items for Customer Suggestion Response Parameters
export interface GetCusSugSubItemParams extends GeneralResParam {
    // Subscription Items for Customer Suggestion
    subs?: CusSugSubItem[];
}

// Operator in Customer Suggestion
export interface Operator {
    // User ID
    userId: number;

    // User Short Name
    userStName: string;

    // Company Short Name
    comStName: string;

    // Group Name
    groupName: string;
}

// Message about Customer Suggestion
export interface CusSugMsg {
    // Customer Suggestion ID
    cusSugId: number;

    // Customer Suggestion Name
    cusSugName: string;

    // Customer Suggestion Description
    cusSugDesc: string;

    // Custom Suggestion Response
    cusSugRes: string;

    // Custom Suggestion Status
    cusSugStatus: number;

    // Notes
    notes: string;

    // Custom Suggestion Relation Subscription Item
    cusSugSub: CusSugSubItem;

    // Custom Suggestion Creator
    creator: Operator;

    // Custom Suggestion Response Man
    updater: Operator;
}

// Get Customer Suggestions Response Parameters
export interface GetCusSugResParams extends GeneralResParam {
    // Customer Suggestion in Status 0
    status0?: CusSugMsg[];

    // Customer Suggestion in Status 1
    status1?: CusSugMsg[];

    // Customer Suggestion in Status 2
    status2?: CusSugMsg[];

    // Customer Suggestion in Status 3
    status3?: CusSugMsg[];
}

// Create/Update/Delete Single Customer Suggestion Request Parameters
export interface CusSugReqParams {
    // Customer Suggestion ID
    cusSugId?: number;

    // Customer Suggestion Name
    cusSugName?: string;

    // Customer Suggestion Description
    cusSugDesc?: string;

    // Custom Suggestion Response
    cusSugRes?: string;

    // Subscription Item ID
    subId?: number;

    // Custom Suggestion Status
    cusSugStatus?: number;

    // Notes
    notes?: string;
}

// Message about Notification
export interface Notification {
    // Notification ID
    notiId: number;

    // Notification Name
    notiName: string;

    // Notification Description
    notiDesc: string;

    // Notification Type
    notiType: number;

    // Notification Creator
    creator: Operator;
}

// Get Notification Response Parameters
export interface GetNotificationResParams extends GeneralResParam {
    // Notifications
    notifications?: Notification[];
}

// Create/Update/Delete Single Notification Request Parameters
export interface NotificationReqParams {
    // Notification ID
    notiId?: number;

    // Notification Name
    notiName?: string;

    // Notification Description
    notiDesc?: string;
}
