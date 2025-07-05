import {localCache} from '@/utils/storages.ts'
import {USER_INFO} from '@/global/contstants.ts'
import routerItems from '@/router/commons/asideBarItems.json'

interface AsideBarItem {
    title: string;
    index: string;
}

const per0100 = localCache.getCache(USER_INFO)?.per0100 ?? [] as string[]

export function getAsideBarItems() {
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
                if (per0100.includes(perCode)) {
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
