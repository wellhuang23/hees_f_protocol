import { defineStore } from 'pinia'
import { localCache } from '@/utils/storages'

import { PERSONAL_SETTING } from '@/global/contstants'

const usePersonalSetting = defineStore(PERSONAL_SETTING, {
    state:() => ({
        locale: localCache.getCache(PERSONAL_SETTING)?.locale ?? 'zh-TW',
        isAsideCollapsed: localCache.getCache(PERSONAL_SETTING)?.isAsideCollapsed ?? false,
    }),
    actions: {
        setLocale(locale: string) {
            this.locale = locale

            localCache.setCache(PERSONAL_SETTING, {
                locale: this.locale,
                isAsideCollapsed: this.isAsideCollapsed
            })
        },
        toggleAside() {
            this.isAsideCollapsed = !this.isAsideCollapsed

            localCache.setCache(PERSONAL_SETTING, {
                locale: this.locale,
                isAsideCollapsed: this.isAsideCollapsed
            })
        }
    }
})

export { usePersonalSetting }
