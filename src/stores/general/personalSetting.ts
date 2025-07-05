import { defineStore } from 'pinia'
import { localCache } from '@/utils/storages'

import { PERSONAL_SETTING } from '@/global/contstants'

const usePersonalSetting = defineStore(PERSONAL_SETTING, {
    state:() => ({
        locale: localCache.getCache(PERSONAL_SETTING)?.locale ?? 'zh-TW',
    }),
    actions: {
        setLocale(locale: string) {
            this.locale = locale

            localCache.setCache(PERSONAL_SETTING, {
                locale: locale,
            })
        },
    }
})

export { usePersonalSetting }
