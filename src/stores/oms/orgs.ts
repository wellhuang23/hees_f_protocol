import { defineStore } from 'pinia'
import {
    sessionCache,
    localCache,
} from '@/utils/storages'
import type {
    Sub,
    GroupCompanies,
    ValidCom,
    LogInResParams,
} from '@/interfaces'
import {
    SUB_ITEMS,
    VALID_COM,
} from '@/global/contstants'

const useSubItemsStore = defineStore(SUB_ITEMS, {
    state:() => ({
        subItems: sessionCache.getCache(SUB_ITEMS)?.subItems ?? [] as Sub[],
        groupSubs: sessionCache.getCache(SUB_ITEMS)?.groupSubs ?? [] as GroupCompanies[],
    }),
    actions: {
        setSubItems(subItems: Sub[]) {
            const data: Sub[] = []
            for (const subItem of subItems) {
                data.push({
                    subId: subItem.subId,
                    subNo: subItem.subNo,
                    subName: subItem.subName,
                    subDesc: subItem.subDesc,
                    subEngName: subItem.subEngName,
                    subEngDesc: subItem.subEngDesc
                })
            }
            this.subItems = data

            sessionCache.setCache(SUB_ITEMS, {
                subItems: data,
                groupSubs: this.groupSubs,
            })
        },

        setGroupSubs(groups: GroupCompanies[]) {
            const data: GroupCompanies[] = []
            for (const group of groups) {
                data.push({
                    groupId: group.groupId,
                    groupName: group.groupName,
                    comSubs: group.comSubs,
                })
            }
            this.groupSubs = data

            sessionCache.setCache(SUB_ITEMS, {
                subItems: this.subItems,
                groupSubs: data,
            })
        },

        clearSubItems() {
            this.subItems = []
            this.groupSubs = []

            sessionCache.removeCache(SUB_ITEMS)
        }
    }
})

const useValidComStore = defineStore(VALID_COM, {
    state:() => ({
        originalCom: localCache.getCache(VALID_COM)?.originalCom ?? {} as ValidCom,
        currentCom: localCache.getCache(VALID_COM)?.currentCom ?? {} as ValidCom,
        validCompanies: localCache.getCache(VALID_COM)?.validCompanies ?? [] as ValidCom[],
    }),
    actions: {
        activeLogIn(data: LogInResParams) {
            const tempCom: ValidCom = {
                comId: 0,
                comTaxNo: 'xxxxxxxx',
                comStName: ''
            }
            let originCom: ValidCom = tempCom
            for (const validCom of data.validCompanies ?? []) {
                if (validCom.comId == data.comId) {
                    originCom = validCom
                }
            }
            this.originalCom = originCom
            this.currentCom = originCom
            this.validCompanies = data.validCompanies ?? []

            localCache.setCache(VALID_COM, {
                originalCom: originCom ?? tempCom,
                currentCom: originCom ?? tempCom,
                validCompanies: data.validCompanies ?? [],
            })
        },

        changeCom(comTaxNo: string) {
            const tempCom: ValidCom = {
                comId: 0,
                comTaxNo: 'xxxxxxxx',
                comStName: ''
            }
            let current: ValidCom = tempCom
            for (const validCom of this.validCompanies) {
                if (validCom.comTaxNo === comTaxNo) {
                    current = validCom
                }
            }

            this.currentCom = current

            localCache.setCache(VALID_COM, {
                originalCom: this.originalCom,
                currentCom: current ?? tempCom,
                validCompanies: this.validCompanies
            })
        }
    }
})

export {
    useSubItemsStore,
    useValidComStore,
}
