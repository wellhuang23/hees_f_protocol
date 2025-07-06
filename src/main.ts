import { createApp } from 'vue'
import 'element-plus/dist/index.css'
import '@/style.css'
import App from '@/App.vue'
import router from '@/router'
import pinia from '@/stores'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { i18n } from '@/lang'
import { usePersonalSetting } from '@/stores'

const app = createApp(App)
app.use(pinia)
app.use(i18n)
app.use(router)

// Ensure i18n locale is set from personal setting after pinia is available
const personalSettingStore = usePersonalSetting()
i18n.global.locale.value = personalSettingStore.locale

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.mount('#app')
