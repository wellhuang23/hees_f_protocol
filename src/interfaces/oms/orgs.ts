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
    groupAdminPwd?: string;
}

// Update Subscriptions in Company Request Parameters
export interface UpdateComSubsReqParams {
    // Company ID
    comId: number;

    // New Company
    subs: NewComSub[];
}
