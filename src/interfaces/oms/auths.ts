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
