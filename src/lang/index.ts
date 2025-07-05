import { createI18n } from 'vue-i18n'
import enUsMsg from '@/lang/commons/en-US.json'
import zhTwMsg from '@/lang/commons/zh-TW.json'
import { localCache } from '@/utils/storages.ts'
import { PERSONAL_SETTING } from '@/global/contstants.ts'

const locale = localCache.getCache(PERSONAL_SETTING)?.locale ?? 'zh-TW'

const i18n = createI18n({
    locale: locale,
    fallbackLocale: 'zh-TW',
    messages: {
        'zh-TW': zhTwMsg,
        'en-US': enUsMsg
    }
})

export { i18n }
