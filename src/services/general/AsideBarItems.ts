import { useUserInfoStore } from '@/stores'
import { storeToRefs } from 'pinia'
import routerSysItems from '@/router/commons/sysItems.json'
import routerOmsItems from '@/router/commons/omsItems.json'

interface AsideBarItem {
    title: string;
    index: string;
}

export function getAsideBarSysItems() {
    const userInfoStore = useUserInfoStore()
    const { per0100, comTaxNo } = storeToRefs(userInfoStore)

    const sysItem: {
        index: string,
        title: string,
        icon: string,
        children: AsideBarItem[],
    } = {
        index: '1',
        title: 'asideBarCategory.sysManage',
        icon: new URL('@/assets/icons/solid/gear.svg', import.meta.url).href,
        children: []
    }
    const appendedSysItemTitle: string[] = []
    for (const item of routerSysItems) {
        for (const perCode of item.meta.perCodes) {
            if (!appendedSysItemTitle.includes(item.meta.title)) {
                if (per0100.value.includes(perCode)) {
                    sysItem.children.push({
                        title: item.meta.title,
                        index: `/main/${item.path}`,
                    })
                    appendedSysItemTitle.push(item.meta.title)
                }
            }
        }
    }

    const omsItem: {
        index: string,
        title: string,
        icon: string,
        children: AsideBarItem[],
    } = {
        index: '2',
        title: 'asideBarCategory.omsSubscription',
        icon: new URL('@/assets/icons/solid/network-wired.svg', import.meta.url).href,
        children: []
    }
    const appendedOmsItemTitle: string[] = []
    for (const item of routerOmsItems) {
        for (const perCode of item.meta.perCodes) {
            if (!appendedOmsItemTitle.includes(item.meta.title)) {
                if (per0100.value.includes(perCode.replace('xxxxxxxx', comTaxNo.value))) {
                    omsItem.children.push({
                        title: item.meta.title,
                        index: `/main/${item.path}`,
                    })
                    appendedOmsItemTitle.push(item.meta.title)
                }
            }
        }
    }

    return [sysItem, omsItem]
}
