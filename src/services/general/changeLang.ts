import { i18n } from '@/lang'
import { usePersonalSetting } from '@/stores'

const personalSettingStore = usePersonalSetting()

export function changeLanguage(lang: 'zh-TW' | 'en-US') {
    i18n.global.locale.value = lang

    personalSettingStore.setLocale(lang)
}
