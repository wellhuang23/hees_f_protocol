import type {
    GeneralResParam
} from '@/interfaces'

// Log In Request Parameters
export interface LogInReqParams {
    // User Log In Account
    // Company Tax No. (for System or Group Administrator)
    // User No.
    // Email
    account: string;

    // Password
    pwd: string;

    // Device Type
    deviceType: number;
}

// Company which is Visible for User
export interface ValidCom {
    // Company ID
    comId: number;

    // Company Tax No.
    comTaxNo: string;

    // Company Short Name
    comStName: string;
}

// Log In Response Parameters
export interface LogInResParams extends GeneralResParam {
    // Token
    token?: string;

    // Device No.
    deviceNo?: string;

    // Group ID
    groupId?: number;

    // Company ID
    comId?: number;

    // Company Tax No.
    comTaxNo?: string;

    // User ID
    userId?: number;

    // User No.
    userNo?: string;

    // User Short Name
    userStName?: string;

    // User Type
    userType?: number;

    // Create Permission Codes
    per1000?: string[];

    // Read Permission Codes
    per0100?: string[];

    // Update Permission Codes
    per0010?: string[];

    // Delete Permission Codes
    per0001?: string[];

    // Visible Companies for User
    validCompanies?: ValidCom[];
}

// Generate Token Request Parameters
export interface GenTokenReqParams {
    // Device No.
    deviceNo: string;
}

// Generate Token Response Parameters
export interface GenTokenResParams extends GeneralResParam {
    // Token
    token?: string;
}

export interface SysPermission {
    // System Permission ID
    sysPerId?: number;

    // System Permission No.
    sysPerNo: string;

    // System Permission Name
    sysPerName: string;

    // System Permission Description
    sysPerDesc: string;

    // System Permission Name in English
    sysPerEngName: string;

    // System Permission Description in English
    sysPerEngDesc: string;
}

export interface SysRole {
    // System Role ID
    sysRoleId?: number;

    // System Role Name
    sysRoleName: string;

    // System Role Description
    sysRoleDesc: string;

    // System Role Name in English
    sysRoleEngName: string;

    // System Role Description in English
    sysRoleEngDesc: string;

    // System Permission in the Role
    sysPermissions: SysPermission[];
}

// Get System Permission Roles with Permissions
export interface GetSysRoleResParams extends GeneralResParam {
    // System Roles
    sysRoles: SysRole[];
}

export interface SysRoleUser {
    // User ID in the System Permission Role
    userId?: number;

    // User No. in the System Permission Role
    userNo: string;

    // User Short Name in theSystem Permission Role
    userStName: string;
}

export interface SysRoleUsers {
    // System Role ID
    sysRoleId?: number;

    // System Role Name
    sysRoleName: string;

    // System Role Name in English
    sysRoleEngName: string;

    // User List in the Role
    sysRoleUsers: SysRoleUser[];
}

// Get System Users in System Permission Roles
export interface GetSysRoleUsersResParams extends GeneralResParam {
    // System Roles
    sysRoleUsers: SysRoleUsers[];
}

// Get System User Response Parameters
export interface GetSysUsersResParams extends GeneralResParam {
    // Users in HEEs Development Organization
    sysUsers: SysRoleUser[];
}

// Assign User to System Permission Role Request Parameters
export interface AssignUserSysPerRoleReqParams {
    // System Permission ID
    sysRoleId: number;

    // User ID List
    userIds: number[];
}

// Company Permission
export interface ComPermission {
    // Company Permission ID
    comPerId?: number;

    // Company Permission No.
    comPerNo: string;

    // Company Permission Name
    comPerName: string;

    // Company Permission Description
    comPerDesc: string;

    // Company Permission Name in English
    comPerEngName: string;

    // Company Permission Description in English
    comPerEngDesc: string;
}

// Company Role
export interface ComRole {
    // Company Role ID
    comRoleId?: number;

    // Company Role Name
    comRoleName: string;

    // Company Role Description
    comRoleDesc: string;

    // Company Role Name in English
    comRoleEngName: string;

    // Company Role Description in English
    comRoleEngDesc: string;

    // Company Permission in the Role
    comPermissions: ComPermission[];
}

// Get Company Permission Roles with Permissions
export interface GetComRoleResParams extends GeneralResParam {
    // Company Default Roles
    defRoles: ComRole[];

    // Company Customize Roles
    cusRoles: ComRole[];
}

// Company User in Roles
export interface ComRoleUser {
    // User ID in the System Permission Role
    userId?: number;

    // User No. in the System Permission Role
    userNo: string;

    // User Short Name in theSystem Permission Role
    userStName: string;
}

// Company Roles with Users
export interface ComRoleUsers {
    // Company Role ID
    comRoleId?: number;

    // Company Role Name
    comRoleName: string;

    // Company Role Name in English
    comRoleEngName: string;

    // User List in the Role
    comRoleUsers: ComRoleUser[];
}

// Get Users in Company Permission Roles
export interface GetComRoleUsersResParams extends GeneralResParam {
    // Company Roles with Users
    comRoleUsers: ComRoleUsers[];
}

// Assign User to Company Permission Role Request Parameters
export interface AssignUserComPerRoleReqParams {
    // Company Permission ID
    comRoleId: number;

    // User ID List
    userIds: number[];
}

// Company Permissions Categorized by Subscription
export interface SubComPermissions {
    // Subscription ID
    subId?: number;

    // Subscription No.
    subNo: string;

    // Subscription Name
    subName: string;

    // Subscription Description
    subDesc: string;

    // Subscription Name in English
    subEngName: string;

    // Subscription Description in English
    subEngDesc: string;

    // Company Permissions
    comPermissions: ComPermission[];
}

// Get Company Permissions Categorized by Subscriptions
export interface GetSubComPerResParams extends GeneralResParam {
    // Company Permissions Categorized by Subscriptions
    subComPermissions: SubComPermissions[];
}

// Create/Update/Delete Company Customize Role Request Parameters
export interface ComCusRoleOperationReqParams {
    // Company Role ID
    comRoleId?: number;

    // Company Role Name
    comRoleName?: string;

    // Company Role Name
    comRoleDesc?: string;

    // List of Selected Company Permission ID
    comPerIds?: number[];
}
