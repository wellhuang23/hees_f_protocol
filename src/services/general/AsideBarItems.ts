import { useUserInfoStore } from '@/stores'
import { storeToRefs } from 'pinia'
import routerItems from '@/router/commons/asideBarItems.json'

interface AsideBarItem {
    title: string;
    index: string;
}

export function getAsideBarItems() {
    const userInfoStore = useUserInfoStore()
    const { per0100 } = storeToRefs(userInfoStore)

    const sysItem: {
        index: string,
        title: string,
        icon: string,
        children: AsideBarItem[],
    } = {
        index: '1',
        title: 'asideBarCategory.sysManage',
        icon: '/src/assets/icons/solid/gear.svg',
        children: []
    }
    const appendedItemTitle: string[] = []
    for (const item of routerItems) {
        for (const perCode of item.meta.perCodes) {
            if (!appendedItemTitle.includes(item.meta.title)) {
                if (per0100.value.includes(perCode)) {
                    sysItem.children.push({
                        title: item.meta.title,
                        index: `/main/${item.path}`,
                    })
                    appendedItemTitle.push(item.meta.title)
                }
            }
        }
    }

    return [sysItem]
}
