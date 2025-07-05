import { createApp } from 'vue'
import 'element-plus/dist/index.css'
import '@/style.css'
import App from '@/App.vue'
import router from '@/router'
import pinia from '@/stores'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { i18n } from '@/lang'

const app = createApp(App)
app.use(pinia)
app.use(i18n)
app.use(router)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.mount('#app')
