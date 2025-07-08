import { defineStore } from 'pinia'
import { sessionCache } from '@/utils/storages'
import type {
    Sub,
    GroupCompanies
} from '@/interfaces'
import {
    SUB_ITEMS
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
        }
    }
})

export {
    useSubItemsStore
}
