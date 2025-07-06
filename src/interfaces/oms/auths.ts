import type {
    GeneralResParam
} from '@/interfaces'

// Log In Request Parameters
export interface LogInReqParams {
    // Company Tax No.
    comTaxNo: string;
    // User
    user: string;
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

export interface GetSysRoleResParams extends GeneralResParam {
    // System Roles
    sysRoles: SysRole[];
}
