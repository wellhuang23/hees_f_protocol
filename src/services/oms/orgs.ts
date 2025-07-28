import OMSOrgsAPI from '@/apis/oms/orgs'
import type {
    GeneralResParam,
    GetAllSubsResParams,
    GetGroupSubsResParams,
    CreateComSubsReqParams,
    CreateComSubsResParams,
    UpdateComSubsReqParams,
    ChangeAdminPwdReqParams,
    ChangeAdminPwdResParams,
    GetComInfoResParams,
    ComInfo,
    GetComStrUnitResParams,
    ComStrUnitOprReqParams,
    GetComJobPositionResParams,
    ComJobPosition,
    GetUserInfoColResParams,
    UserInfoCol,
    GetStrUnitUsersResParams,
    UserInfo,
    ChangeUserPwdResParams,
    CreateGenUserResParams,
    ProfileResParams, UserDetailInfo,
} from '@/interfaces'
import {
    useDeviceInfoStore,
    useSubItemsStore,
    useValidComStore,
    useComInfoStore,
    useComStrUnitStore,
    useComJobPositionStore,
    useUserInfoColsStore,
    useStrUnitUsersStore,
    useProfileStore,
} from '@/stores'
import { updateToken } from '@/services'

const deviceStore = useDeviceInfoStore()
const usbItemsStore = useSubItemsStore()
const validComStore = useValidComStore()
const comInfoStore = useComInfoStore()
const comStrUnitStore = useComStrUnitStore()
const comJobPositionStore = useComJobPositionStore()
const userInfoColsStore = useUserInfoColsStore()
const strUnitUsersStore = useStrUnitUsersStore()
const profileStore = useProfileStore()

export async function getAllSubItems() {
    const token = deviceStore.token
    return OMSOrgsAPI.getAllSubscriptions(token).then(async (res: GetAllSubsResParams)=> {
        if (res.errno === '00000') {
            usbItemsStore.setSubItems(res.subs ?? [])
        } else {
            if (res.errno === '99005') {
                const refreshTokenResult = await updateToken().then()
                if (refreshTokenResult === '00000') {
                    const refreshToken = deviceStore.token
                    return OMSOrgsAPI.getAllSubscriptions(refreshToken).then((refreshRes: GetAllSubsResParams) => {
                        usbItemsStore.setSubItems(refreshRes.subs ?? [])
                    })
                }
            }
        }
    })
}

export async function getAllGroupSubs() {
    const token = deviceStore.token
    return OMSOrgsAPI.getAllGroupSubscriptions(token).then(async (res: GetGroupSubsResParams)=> {
        if (res.errno === '00000') {
            usbItemsStore.setGroupSubs(res.groups ?? [])
        } else {
            if (res.errno === '99005') {
                const refreshTokenResult = await updateToken().then()
                if (refreshTokenResult === '00000') {
                    const refreshToken = deviceStore.token
                    return OMSOrgsAPI.getAllGroupSubscriptions(refreshToken).then((refreshRes: GetGroupSubsResParams) => {
                        usbItemsStore.setGroupSubs(refreshRes.groups ?? [])
                    })
                }
            }
        }
    })
}

export async function createGroupComSubs(createParams: CreateComSubsReqParams) {
    const token = deviceStore.token
    return OMSOrgsAPI.createNewComSubscription(createParams, token).then(async (res: CreateComSubsResParams)=> {
        if (res.errno === '00000') {
            return res
        } else {
            if (res.errno === '99005') {
                const refreshTokenResult = await updateToken().then()
                if (refreshTokenResult === '00000') {
                    const refreshToken = deviceStore.token
                    return OMSOrgsAPI.createNewComSubscription(
                        createParams,
                        refreshToken).then((refreshRes: CreateComSubsResParams) => {
                        return refreshRes
                    })
                }
            }
        }
        return res
    })
}

export async function updateComSubs(updateParams: UpdateComSubsReqParams) {
    const token = deviceStore.token
    return OMSOrgsAPI.updateComSubscription(updateParams, token).then(async (res: GeneralResParam)=> {
        if (res.errno === '00000') {
            return res
        } else {
            if (res.errno === '99005') {
                const refreshTokenResult = await updateToken().then()
                if (refreshTokenResult === '00000') {
                    const refreshToken = deviceStore.token
                    return OMSOrgsAPI.updateComSubscription(
                        updateParams,
                        refreshToken).then((refreshRes: GeneralResParam) => {
                        return refreshRes
                    })
                }
            }
        }
        return res
    })
}

export async function changeGroupAdminPwd(changeParams: ChangeAdminPwdReqParams) {
    const token = deviceStore.token
    return OMSOrgsAPI.changeGroupAdminPwd(changeParams, token).then(async (res: ChangeAdminPwdResParams)=> {
        if (res.errno === '00000') {
            return res
        } else {
            if (res.errno === '99005') {
                const refreshTokenResult = await updateToken().then()
                if (refreshTokenResult === '00000') {
                    const refreshToken = deviceStore.token
                    return OMSOrgsAPI.changeGroupAdminPwd(
                        changeParams,
                        refreshToken).then((refreshRes: ChangeAdminPwdResParams) => {
                        return refreshRes
                    })
                }
            }
        }
        return res
    })
}

export async function getComInfo() {
    const token = deviceStore.token
    const comId = validComStore.currentCom.comId
    return OMSOrgsAPI.getComInfo(token, comId).then(async (res: GetComInfoResParams)=> {
        if (res.errno === '00000') {
            comInfoStore.setComInfo(res)
            return res.errno
        } else {
            if (res.errno === '99005') {
                const refreshTokenResult = await updateToken().then()
                if (refreshTokenResult === '00000') {
                    const refreshToken = deviceStore.token
                    return OMSOrgsAPI.getComInfo(refreshToken, comId).then((refreshRes: GetComInfoResParams) => {
                        comInfoStore.setComInfo(refreshRes)
                        return refreshRes.errno
                    })
                }
            }
        }
        return res.errno
    })
}

export async function updateComInfo(data: ComInfo) {
    const token = deviceStore.token
    return OMSOrgsAPI.updateComInfo(data, token).then(async (res: GeneralResParam)=> {
        if (res.errno === '00000') {
            OMSOrgsAPI.getComInfo(token, data.comId).then((getRes: GetComInfoResParams)=> {
                if (getRes.errno === '00000') {
                    comInfoStore.setComInfo(getRes)
                }
                return getRes.errno
            })
        } else {
            if (res.errno === '99005') {
                const refreshTokenResult = await updateToken().then()
                if (refreshTokenResult === '00000') {
                    const refreshToken = deviceStore.token
                    return OMSOrgsAPI.updateComInfo(data, refreshToken).then((refreshRes: GeneralResParam) => {
                        if (refreshRes.errno === '00000') {
                            OMSOrgsAPI.getComInfo(token, data.comId).then((refreshGetRes: GetComInfoResParams)=> {
                                if (refreshGetRes.errno === '00000') {
                                    comInfoStore.setComInfo(refreshGetRes)
                                }
                                return refreshGetRes.errno
                            })
                        }
                    })
                }
            }
        }
        return res.errno
    })
}

export async function getComStrUnits() {
    const token = deviceStore.token
    const comId = validComStore.currentCom.comId
    return OMSOrgsAPI.getComStrUnits(token, comId).then(async (res: GetComStrUnitResParams)=> {
        if (res.errno === '00000') {
            comStrUnitStore.setComStrUnits(res)
            return res.errno
        } else {
            if (res.errno === '99005') {
                const refreshTokenResult = await updateToken().then()
                if (refreshTokenResult === '00000') {
                    const refreshToken = deviceStore.token
                    return OMSOrgsAPI.getComStrUnits(refreshToken, comId).then((refreshRes: GetComStrUnitResParams) => {
                        comStrUnitStore.setComStrUnits(refreshRes)
                        return refreshRes.errno
                    })
                }
            }
        }
        return res.errno
    })
}

export async function creatNewComStrUnits(data: ComStrUnitOprReqParams) {
    const token = deviceStore.token
    const comId = validComStore.currentCom.comId
    return OMSOrgsAPI.createNewComStrUnits(data, comId, token).then(async (res: GeneralResParam)=> {
        if (res.errno === '00000') {
            OMSOrgsAPI.getComStrUnits(token, comId).then((getRes: GetComStrUnitResParams)=> {
                if (getRes.errno === '00000') {
                    comStrUnitStore.setComStrUnits(getRes)
                }
                return getRes.errno
            })
        } else {
            if (res.errno === '99005') {
                const refreshTokenResult = await updateToken().then()
                if (refreshTokenResult === '00000') {
                    const refreshToken = deviceStore.token
                    return OMSOrgsAPI.createNewComStrUnits(data, comId, refreshToken).then((refreshRes: GeneralResParam) => {
                        if (refreshRes.errno === '00000') {
                            OMSOrgsAPI.getComStrUnits(token, comId).then((refreshGetRes: GetComStrUnitResParams)=> {
                                if (refreshGetRes.errno === '00000') {
                                    comStrUnitStore.setComStrUnits(refreshGetRes)
                                }
                                return refreshGetRes.errno
                            })
                        }
                    })
                }
            }
        }
        return res.errno
    })
}

export async function updateComStrUnit(data: ComStrUnitOprReqParams) {
    const token = deviceStore.token
    const comId = validComStore.currentCom.comId
    return OMSOrgsAPI.updateComStrUnit(data, token).then(async (res: GeneralResParam)=> {
        if (res.errno === '00000') {
            OMSOrgsAPI.getComStrUnits(token, comId).then((getRes: GetComStrUnitResParams)=> {
                if (getRes.errno === '00000') {
                    comStrUnitStore.setComStrUnits(getRes)
                }
                return getRes.errno
            })
        } else {
            if (res.errno === '99005') {
                const refreshTokenResult = await updateToken().then()
                if (refreshTokenResult === '00000') {
                    const refreshToken = deviceStore.token
                    return OMSOrgsAPI.updateComStrUnit(data, refreshToken).then((refreshRes: GeneralResParam) => {
                        if (refreshRes.errno === '00000') {
                            OMSOrgsAPI.getComStrUnits(token, comId).then((refreshGetRes: GetComStrUnitResParams)=> {
                                if (refreshGetRes.errno === '00000') {
                                    comStrUnitStore.setComStrUnits(refreshGetRes)
                                }
                                return refreshGetRes.errno
                            })
                        }
                    })
                }
            }
        }
        return res.errno
    })
}

export async function deleteComStrUnit(data: ComStrUnitOprReqParams) {
    const token = deviceStore.token
    const comId = validComStore.currentCom.comId
    return OMSOrgsAPI.deleteComStrUnit(data, token).then(async (res: GeneralResParam)=> {
        if (res.errno === '00000') {
            OMSOrgsAPI.getComStrUnits(token, comId).then((getRes: GetComStrUnitResParams)=> {
                if (getRes.errno === '00000') {
                    comStrUnitStore.setComStrUnits(getRes)
                }
                return getRes.errno
            })
        } else {
            if (res.errno === '99005') {
                const refreshTokenResult = await updateToken().then()
                if (refreshTokenResult === '00000') {
                    const refreshToken = deviceStore.token
                    return OMSOrgsAPI.deleteComStrUnit(data, refreshToken).then((refreshRes: GeneralResParam) => {
                        if (refreshRes.errno === '00000') {
                            OMSOrgsAPI.getComStrUnits(token, comId).then((refreshGetRes: GetComStrUnitResParams)=> {
                                if (refreshGetRes.errno === '00000') {
                                    comStrUnitStore.setComStrUnits(refreshGetRes)
                                }
                                return refreshGetRes.errno
                            })
                        }
                    })
                }
            }
        }
        return res.errno
    })
}

export async function getComJobPositions() {
    const token = deviceStore.token
    const comId = validComStore.currentCom.comId
    return OMSOrgsAPI.getComJobPositions(token, comId).then(async (res: GetComJobPositionResParams)=> {
        if (res.errno === '00000') {
            comJobPositionStore.setComJobPositions(res)
            return res.errno
        } else {
            if (res.errno === '99005') {
                const refreshTokenResult = await updateToken().then()
                if (refreshTokenResult === '00000') {
                    const refreshToken = deviceStore.token
                    return OMSOrgsAPI.getComJobPositions(refreshToken, comId).then((refreshRes: GetComJobPositionResParams) => {
                        comJobPositionStore.setComJobPositions(refreshRes)
                        return refreshRes.errno
                    })
                }
            }
        }
        return res.errno
    })
}

export async function createComJobPositions(params: ComJobPosition) {
    const token = deviceStore.token
    const comId = validComStore.currentCom.comId
    return OMSOrgsAPI.createNewJobPosition(params, comId, token).then(async (res: GeneralResParam)=> {
        if (res.errno === '99005') {
            const refreshTokenResult = await updateToken().then()
            if (refreshTokenResult === '00000') {
                const refreshToken = deviceStore.token
                return OMSOrgsAPI.createNewJobPosition(
                    params,
                    comId,
                    refreshToken).then((refreshRes: GeneralResParam) => {
                    if (refreshRes.errno === '00000') {
                        return OMSOrgsAPI.getComJobPositions(token, comId).then(async (refreshGetRes: GetComJobPositionResParams) => {
                            if (refreshGetRes.errno === '00000') {
                                comJobPositionStore.setComJobPositions(refreshGetRes)
                            }
                            return refreshGetRes.errno
                        })
                    } else {
                        return refreshRes.errno
                    }
                })
            }
        } else {
            if (res.errno === '00000') {
                return OMSOrgsAPI.getComJobPositions(token, comId).then(async (getRes: GetComJobPositionResParams) => {
                    if (getRes.errno === '00000') {
                        comJobPositionStore.setComJobPositions(getRes)
                    }
                    return getRes.errno
                })
            } else {
                return res.errno
            }
        }
        return res.errno
    })
}

export async function updateComJobPositions(params: ComJobPosition) {
    const token = deviceStore.token
    const comId = validComStore.currentCom.comId
    return OMSOrgsAPI.updateJobPosition(params, token).then(async (res: GeneralResParam)=> {
        if (res.errno === '99005') {
            const refreshTokenResult = await updateToken().then()
            if (refreshTokenResult === '00000') {
                const refreshToken = deviceStore.token
                return OMSOrgsAPI.updateJobPosition(
                    params,
                    refreshToken).then((refreshRes: GeneralResParam) => {
                    if (refreshRes.errno === '00000') {
                        return OMSOrgsAPI.getComJobPositions(token, comId).then(async (refreshGetRes: GetComJobPositionResParams) => {
                            if (refreshGetRes.errno === '00000') {
                                comJobPositionStore.setComJobPositions(refreshGetRes)
                            }
                            return refreshGetRes.errno
                        })
                    } else {
                        return refreshRes.errno
                    }
                })
            }
        } else {
            if (res.errno === '00000') {
                return OMSOrgsAPI.getComJobPositions(token, comId).then(async (getRes: GetComJobPositionResParams) => {
                    if (getRes.errno === '00000') {
                        comJobPositionStore.setComJobPositions(getRes)
                    }
                    return getRes.errno
                })
            } else {
                return res.errno
            }
        }
        return res.errno
    })
}

export async function deleteComJobPositions(params: ComJobPosition) {
    const token = deviceStore.token
    const comId = validComStore.currentCom.comId
    return OMSOrgsAPI.deleteJobPosition(params, token).then(async (res: GeneralResParam)=> {
        if (res.errno === '99005') {
            const refreshTokenResult = await updateToken().then()
            if (refreshTokenResult === '00000') {
                const refreshToken = deviceStore.token
                return OMSOrgsAPI.deleteJobPosition(
                    params,
                    refreshToken).then((refreshRes: GeneralResParam) => {
                    if (refreshRes.errno === '00000') {
                        return OMSOrgsAPI.getComJobPositions(token, comId).then(async (refreshGetRes: GetComJobPositionResParams) => {
                            if (refreshGetRes.errno === '00000') {
                                comJobPositionStore.setComJobPositions(refreshGetRes)
                            }
                            return refreshGetRes.errno
                        })
                    } else {
                        return refreshRes.errno
                    }
                })
            }
        } else {
            if (res.errno === '00000') {
                return OMSOrgsAPI.getComJobPositions(token, comId).then(async (getRes: GetComJobPositionResParams) => {
                    if (getRes.errno === '00000') {
                        comJobPositionStore.setComJobPositions(getRes)
                    }
                    return getRes.errno
                })
            } else {
                return res.errno
            }
        }
        return res.errno
    })
}

export async function getUserInfoCols() {
    const token = deviceStore.token
    const comId = validComStore.currentCom.comId
    return OMSOrgsAPI.getUserInfoCols(token, comId).then(async (res: GetUserInfoColResParams)=> {
        if (res.errno === '00000') {
            userInfoColsStore.setUserInfoCols(res)
            return res.errno
        } else {
            if (res.errno === '99005') {
                const refreshTokenResult = await updateToken().then()
                if (refreshTokenResult === '00000') {
                    const refreshToken = deviceStore.token
                    return OMSOrgsAPI.getUserInfoCols(refreshToken, comId).then((refreshRes: GetUserInfoColResParams) => {
                        userInfoColsStore.setUserInfoCols(refreshRes)
                        return refreshRes.errno
                    })
                }
            }
        }
        return res.errno
    })
}

export async function operateUserInfoCols(params: UserInfoCol[]) {
    const token = deviceStore.token
    const comId = validComStore.currentCom.comId
    return OMSOrgsAPI.operateUserInfoCols(params, comId, token).then(async (res: GeneralResParam)=> {
        if (res.errno === '99005') {
            const refreshTokenResult = await updateToken().then()
            if (refreshTokenResult === '00000') {
                const refreshToken = deviceStore.token
                return OMSOrgsAPI.operateUserInfoCols(
                    params,
                    comId,
                    refreshToken).then((refreshRes: GeneralResParam) => {
                    if (refreshRes.errno === '00000') {
                        return OMSOrgsAPI.getUserInfoCols(token, comId).then(async (refreshGetRes: GetUserInfoColResParams) => {
                            if (refreshGetRes.errno === '00000') {
                                userInfoColsStore.setUserInfoCols(refreshGetRes)
                            }
                            return refreshGetRes.errno
                        })
                    } else {
                        return refreshRes.errno
                    }
                })
            }
        } else {
            if (res.errno === '00000') {
                return OMSOrgsAPI.getUserInfoCols(token, comId).then(async (getRes: GetUserInfoColResParams) => {
                    if (getRes.errno === '00000') {
                        userInfoColsStore.setUserInfoCols(getRes)
                    }
                    return getRes.errno
                })
            } else {
                return res.errno
            }
        }
        return res.errno
    })
}

export async function deleteUserInfoCol(colId: number) {
    const token = deviceStore.token
    const comId = validComStore.currentCom.comId
    return OMSOrgsAPI.deleteUserInfoCol(colId, token).then(async (res: GeneralResParam)=> {
        if (res.errno === '99005') {
            const refreshTokenResult = await updateToken().then()
            if (refreshTokenResult === '00000') {
                const refreshToken = deviceStore.token
                return OMSOrgsAPI.deleteUserInfoCol(
                    colId,
                    refreshToken).then((refreshRes: GeneralResParam) => {
                    if (refreshRes.errno === '00000') {
                        return OMSOrgsAPI.getUserInfoCols(token, comId).then(async (refreshGetRes: GetUserInfoColResParams) => {
                            if (refreshGetRes.errno === '00000') {
                                userInfoColsStore.setUserInfoCols(refreshGetRes)
                            }
                            return refreshGetRes.errno
                        })
                    } else {
                        return refreshRes.errno
                    }
                })
            }
        } else {
            if (res.errno === '00000') {
                return OMSOrgsAPI.getUserInfoCols(token, comId).then(async (getRes: GetUserInfoColResParams) => {
                    if (getRes.errno === '00000') {
                        userInfoColsStore.setUserInfoCols(getRes)
                    }
                    return getRes.errno
                })
            } else {
                return res.errno
            }
        }
        return res.errno
    })
}

export async function getStrUnitUsers() {
    const token = deviceStore.token
    const comId = validComStore.currentCom.comId
    return OMSOrgsAPI.getStrUnitUsers(token, comId).then(async (res: GetStrUnitUsersResParams)=> {
        if (res.errno === '00000') {
            strUnitUsersStore.setStrUnitUser(res)
            return res.errno
        } else {
            if (res.errno === '99005') {
                const refreshTokenResult = await updateToken().then()
                if (refreshTokenResult === '00000') {
                    const refreshToken = deviceStore.token
                    return OMSOrgsAPI.getUserInfoCols(refreshToken, comId).then((refreshRes: GetStrUnitUsersResParams) => {
                        strUnitUsersStore.setStrUnitUser(refreshRes)
                        return refreshRes.errno
                    })
                }
            }
        }
        return res.errno
    })
}

export async function createNewUser(params: UserInfo) {
    const token = deviceStore.token
    const comId = validComStore.currentCom.comId
    return OMSOrgsAPI.createNewUser(params, comId, token).then(async (res: CreateGenUserResParams)=> {
        if (res.errno === '99005') {
            const refreshTokenResult = await updateToken().then()
            if (refreshTokenResult === '00000') {
                const refreshToken = deviceStore.token
                return OMSOrgsAPI.createNewUser(
                    params,
                    comId,
                    refreshToken).then((refreshRes: CreateGenUserResParams) => {
                    if (refreshRes.errno === '00000') {
                        return OMSOrgsAPI.getStrUnitUsers(token, comId).then(async (refreshGetRes: GetStrUnitUsersResParams) => {
                            if (refreshGetRes.errno === '00000') {
                                strUnitUsersStore.setStrUnitUser(refreshGetRes)
                            }
                            return refreshRes
                        })
                    } else {
                        return refreshRes
                    }
                })
            }
        } else {
            if (res.errno === '00000') {
                return OMSOrgsAPI.getStrUnitUsers(token, comId).then(async (getRes: GetStrUnitUsersResParams) => {
                    if (getRes.errno === '00000') {
                        strUnitUsersStore.setStrUnitUser(getRes)
                    }
                    return res
                })
            } else {
                return res
            }
        }
        return res
    })
}

export async function updateUser(params: UserInfo) {
    const token = deviceStore.token
    const comId = validComStore.currentCom.comId
    return OMSOrgsAPI.updateUser(params, token).then(async (res: GeneralResParam)=> {
        if (res.errno === '99005') {
            const refreshTokenResult = await updateToken().then()
            if (refreshTokenResult === '00000') {
                const refreshToken = deviceStore.token
                return OMSOrgsAPI.updateUser(
                    params,
                    refreshToken).then((refreshRes: GeneralResParam) => {
                    if (refreshRes.errno === '00000') {
                        return OMSOrgsAPI.getStrUnitUsers(token, comId).then(async (refreshGetRes: GetStrUnitUsersResParams) => {
                            if (refreshGetRes.errno === '00000') {
                                strUnitUsersStore.setStrUnitUser(refreshGetRes)
                            }
                            return refreshGetRes.errno
                        })
                    } else {
                        return refreshRes.errno
                    }
                })
            }
        } else {
            if (res.errno === '00000') {
                return OMSOrgsAPI.getStrUnitUsers(token, comId).then(async (getRes: GetStrUnitUsersResParams) => {
                    if (getRes.errno === '00000') {
                        strUnitUsersStore.setStrUnitUser(getRes)
                    }
                    return getRes.errno
                })
            } else {
                return res.errno
            }
        }
        return res.errno
    })
}

export async function deleteUser(userId: number) {
    const token = deviceStore.token
    const comId = validComStore.currentCom.comId
    return OMSOrgsAPI.deleteUser(userId, token).then(async (res: GeneralResParam)=> {
        if (res.errno === '99005') {
            const refreshTokenResult = await updateToken().then()
            if (refreshTokenResult === '00000') {
                const refreshToken = deviceStore.token
                return OMSOrgsAPI.deleteUser(
                    userId,
                    refreshToken).then((refreshRes: GeneralResParam) => {
                    if (refreshRes.errno === '00000') {
                        return OMSOrgsAPI.getStrUnitUsers(token, comId).then(async (refreshGetRes: GetStrUnitUsersResParams) => {
                            if (refreshGetRes.errno === '00000') {
                                strUnitUsersStore.setStrUnitUser(refreshGetRes)
                            }
                            return refreshGetRes.errno
                        })
                    } else {
                        return refreshRes.errno
                    }
                })
            }
        } else {
            if (res.errno === '00000') {
                return OMSOrgsAPI.getStrUnitUsers(token, comId).then(async (getRes: GetStrUnitUsersResParams) => {
                    if (getRes.errno === '00000') {
                        strUnitUsersStore.setStrUnitUser(getRes)
                    }
                    return getRes.errno
                })
            } else {
                return res.errno
            }
        }
        return res.errno
    })
}

export async function changeGenUserPwd(userId: number) {
    const token = deviceStore.token
    return OMSOrgsAPI.changeUserPwd(userId, token).then(async (res: ChangeUserPwdResParams)=> {
        if (res.errno === '00000') {
            return res
        } else {
            if (res.errno === '99005') {
                const refreshTokenResult = await updateToken().then()
                if (refreshTokenResult === '00000') {
                    const refreshToken = deviceStore.token
                    return OMSOrgsAPI.changeUserPwd(
                        userId,
                        refreshToken).then((refreshRes: ChangeUserPwdResParams) => {
                        return refreshRes
                    })
                }
            }
        }
        return res
    })
}

export async function getProfile() {
    const token = deviceStore.token
    return OMSOrgsAPI.getProfile(token).then(async (res: ProfileResParams)=> {
        if (res.errno === '00000') {
            profileStore.setProfile(res)
            return res.errno
        } else {
            if (res.errno === '99005') {
                const refreshTokenResult = await updateToken().then()
                if (refreshTokenResult === '00000') {
                    const refreshToken = deviceStore.token
                    return OMSOrgsAPI.getProfile(refreshToken).then((refreshRes: ProfileResParams) => {
                        profileStore.setProfile(refreshRes)
                        return refreshRes.errno
                    })
                }
            }
        }
        return res.errno
    })
}

export async function updateProfileBasic(userStName: string) {
    const token = deviceStore.token
    return OMSOrgsAPI.updateBasicProfile(userStName, token).then(async (res: GeneralResParam)=> {
        if (res.errno === '99005') {
            const refreshTokenResult = await updateToken().then()
            if (refreshTokenResult === '00000') {
                const refreshToken = deviceStore.token
                return OMSOrgsAPI.updateBasicProfile(
                    userStName,
                    refreshToken).then((refreshRes: GeneralResParam) => {
                    if (refreshRes.errno === '00000') {
                        return OMSOrgsAPI.getProfile(token).then(async (refreshGetRes: ProfileResParams) => {
                            if (refreshGetRes.errno === '00000') {
                                profileStore.setProfile(refreshGetRes)
                            }
                            return refreshGetRes.errno
                        })
                    } else {
                        return refreshRes.errno
                    }
                })
            }
        } else {
            if (res.errno === '00000') {
                return OMSOrgsAPI.getProfile(token).then(async (getRes: ProfileResParams) => {
                    if (getRes.errno === '00000') {
                        profileStore.setProfile(getRes)
                    }
                    return getRes.errno
                })
            } else {
                return res.errno
            }
        }
        return res.errno
    })
}

export async function updateProfileDetail(detailInfo: UserDetailInfo[]) {
    const token = deviceStore.token
    return OMSOrgsAPI.updateDetailProfile(detailInfo, token).then(async (res: GeneralResParam)=> {
        if (res.errno === '99005') {
            const refreshTokenResult = await updateToken().then()
            if (refreshTokenResult === '00000') {
                const refreshToken = deviceStore.token
                return OMSOrgsAPI.updateDetailProfile(
                    detailInfo,
                    refreshToken).then((refreshRes: GeneralResParam) => {
                    if (refreshRes.errno === '00000') {
                        return OMSOrgsAPI.getProfile(token).then(async (refreshGetRes: ProfileResParams) => {
                            if (refreshGetRes.errno === '00000') {
                                profileStore.setProfile(refreshGetRes)
                            }
                            return refreshGetRes.errno
                        })
                    } else {
                        return refreshRes.errno
                    }
                })
            }
        } else {
            if (res.errno === '00000') {
                return OMSOrgsAPI.getProfile(token).then(async (getRes: ProfileResParams) => {
                    if (getRes.errno === '00000') {
                        profileStore.setProfile(getRes)
                    }
                    return getRes.errno
                })
            } else {
                return res.errno
            }
        }
        return res.errno
    })
}

export async function changeGenUserPwdSelf(originPwd: string, newPwd: string) {
    const token = deviceStore.token
    return OMSOrgsAPI.updateSelfPwd(originPwd, newPwd, token).then(async (res: GeneralResParam)=> {
        if (res.errno === '00000') {
            return res.errno
        } else {
            if (res.errno === '99005') {
                const refreshTokenResult = await updateToken().then()
                if (refreshTokenResult === '00000') {
                    const refreshToken = deviceStore.token
                    return OMSOrgsAPI.updateSelfPwd(
                        originPwd,
                        newPwd,
                        refreshToken).then((refreshRes: GeneralResParam) => {
                        return refreshRes.errno
                    })
                }
            }
        }
        return res.errno
    })
}
