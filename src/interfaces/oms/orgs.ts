import type {
    GeneralResParam
} from '@/interfaces'

// Subscription Item
export interface Sub {
    // Subscription Item ID
    subId: number;

    // Subscription Item No.
    subNo: string;

    // Subscription Item Name
    subName: string;

    // Subscription Item Description
    subDesc: string;

    // Subscription Item Name in English
    subEngName: string;

    // Subscription Item Description in English
    subEngDesc: string;
}

// Get All Subscription Items Response Parameters
export interface GetAllSubsResParams extends GeneralResParam {
    // Subscription Items Data
    subs?: Sub[];
}

// Company Subscription Items
export interface ComSub {
    // Subscription Item ID
    subId: number;

    // Subscription Item No.
    subNo: string;

    // Subscription Item Name
    subName: string;

    // Subscription Item Name in English
    subEngName: string;

    // Subscription Start Date
    subStartDate: string;

    // Subscription End Date
    subEndDate: string;
}

// Company Info with Subscription Items
export interface ComSubs {
    // Company ID
    comId: number;

    // Company Tax No.
    comTaxNo: string;

    // Company Short Name
    comStName: string;

    // Company Name in English
    comEngName: string;

    // Subscription Items in the Company
    subs: ComSub[];
}

// group Info with Companies & it's Subscriptions
export interface GroupCompanies {
    // Group ID
    groupId: number;

    // Group Name
    groupName: string;

    // Companies
    comSubs: ComSubs[];
}

// Get All Group Subscriptions Info Response Parameters
export interface GetGroupSubsResParams extends GeneralResParam {
    // Subscription Items Data
    groups?: GroupCompanies[];
}

// New Company Subscription Item
export interface NewComSub {
    // Subscription ID
    subId: number;

    // Subscription Start Date
    subStartDate: string;

    // Subscription End Date
    subEndDate: string;
}

// New Company with Subscriptions
export interface NewComSubs {
    // Company ID
    comId: number;

    // Company Tax No.
    comTaxNo: string;

    // Company Name
    comName: string;

    // Company Short Name
    comStName: string;

    // Company Name in English
    comEngName: string;

    // Subscription Items in the Company
    subs: NewComSub[];
}

// Create New Company Subscription Request Parameters
export interface CreateComSubsReqParams {
    // Group ID
    groupId: number;

    // Group Name
    groupName: string;

    // New Company
    comSubs: NewComSubs;
}

// Create New Company Subscription Response Parameters
export interface CreateComSubsResParams extends GeneralResParam {
    // Group Administrator Password
    adminPwd?: string;
}

// Update Subscriptions in Company Request Parameters
export interface UpdateComSubsReqParams {
    // Company ID
    comId: number;

    // New Company
    subs: NewComSub[];
}

// Change Administrator Password Request Parameters
export interface ChangeAdminPwdReqParams {
    // Company ID
    comId: number;
}

// Change Group Administrator Password Response Parameters
export interface ChangeAdminPwdResParams extends GeneralResParam {
    // Group Administrator Password
    adminNewPwd?: string;
}

// Company Information
export interface ComInfo {
    // Company ID
    comId: number;

    // Company Name
    comName: string;

    // Company Short Name
    comStName: string;

    // Company Tax No.
    comTaxNo: string;

    // Company Leader
    comLeader: string;

    // Company Phone
    comPhone: string;

    // Company Address
    comAddr: string;

    // Company Description
    comDesc: string;

    // Company Name in English
    comEngName: string;

    // Company Address in English
    comEngAddr: string;

    // Group ID
    groupId: number;

    // Group Name
    groupName: string;

    // Group Description
    groupDesc: string;
}

// Get Company Information Response Parameters
export interface GetComInfoResParams extends GeneralResParam {
    // Company Information
    comInfo?: ComInfo;
}

// Company Structure Unit
export interface ComStrUnit {
    // Structure Unit ID
    strUnitId: number;

    // Structure Unit Name
    strUnitName: string;

    // Structure Unit Description
    strUnitDesc: string;

    // Structure Unit No.
    strUnitNo: string;

    // Parent Structure Unit ID
    parentStrUnitId: number;

    // Structure Unit Children
    children: ComStrUnit[];
}

// Get Structure Unit in Company Response Parameters
export interface GetComStrUnitResParams extends GeneralResParam {
    // Structure Units
    comStrUnit?: ComStrUnit[];
}

// Structure Unit in Company Operation Request Parameters
export interface ComStrUnitOprReqParams {
    // Structure Unit ID
    strUnitId?: number;

    // Structure Unit Name
    strUnitName?: string;

    // Structure Unit Description
    strUnitDesc?: string;

    // Structure Unit No.
    strUnitNo?: string;

    // Parent Structure Unit ID
    parentStrUnitId?: number;

    // Create Structure Units
    strUnits?: ComStrUnitOprReqParams[];
}

// Company Job Position
export interface ComJobPosition {
    // Job Position ID
    jobPosId?: number;

    // Job Position Name
    jobPosName?: string;

    // Job Position Level
    jobPosLevel?: string;

    // Job Position Description
    jobPosDesc?: string;
}

// Get Job Position in Company Response Parameters
export interface GetComJobPositionResParams extends GeneralResParam {
    // Job Positions
    comJobPositions?: ComJobPosition[];
}

// User Information Columns
export interface UserInfoCol {
    // User Information Column ID
    colId: number;

    // User Information Column Name
    colName: string;

    // User Information Column Description
    colDesc: string;

    // User Information Column Type
    // 0: String
    // 1: Integer
    // 2: Float
    // 3: Date
    // 4: Datetime
    colType: number;

    // User Information Column Type Name
    colTypeName?: string;

    // User Information Column Require
    colRequire: Boolean;
}

// Get User Information Columns in Company Response Parameters
export interface GetUserInfoColResParams extends GeneralResParam {
    // User Information Columns
    userInfoCols?: UserInfoCol[];
}

// Structure Unit in User
export interface UserStrUnit {
    // Structure Unit ID
    strUnitId: number;

    // Structure Unit Name
    strUnitName: string;

    // Structure Unit Name in English
    strUnitEngName: string;

    // Structure Unit No.
    strUnitNo: string;
}

// Job Positions in User
export interface UserJobPosition {
    // Job Position ID
    jobPosId: number;

    // Job Position Name
    jobPosName: string;

    // Job Position Name in English
    jobPosEngName: string;

    // Job Position Level
    jobPosLevel: string;
}

// User Detail Information
export interface UserDetailInfo {
    // User Data ID
    userDataId: number;

    // Data
    data: string;

    // User Information Column ID
    colId: number;

    // Column Name
    colName?: string;

    // Column Type
    colType?: number;

    // Column Require
    colRequire?: boolean;
}

// User Information
export interface UserInfo {
    // User ID
    userId?: number;

    // User Name
    userName: string;

    // User Short Name
    userStName: string;

    // User Type
    userType: number;

    // User No.
    userNo: string;

    // User Email
    email: string;

    // Job Positions
    jobPositions: UserJobPosition[]

    // Structure Units
    strUnits: UserStrUnit[];

    // User Detail Information
    detailInfo: UserDetailInfo[];
}

// Company Structure Unit with Users
export interface StrUnitUser {
    // Structure Unit ID
    strUnitId: number;

    // Structure Unit Name
    strUnitName: string;

    // Structure Unit Name in English
    strUnitEngName: string;

    // Structure Unit No.
    strUnitNo: string;

    // Structure Unit Children
    children: StrUnitUser[];

    // Users in the Structure Unit
    users: UserInfo[];
}

// Get User Information & Categorize by Structure Unit in Company Response Parameters
export interface GetStrUnitUsersResParams extends GeneralResParam {
    // User Information Columns
    strUnitUsers?: StrUnitUser[];
}
