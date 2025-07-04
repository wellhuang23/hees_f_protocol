<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { checkToken } from '@/services/oms/checkToken'
import { localCache } from '@/utils/storages'
import { sessionCache } from '@/utils/storages'
import {
  DEVICE_INFO,
  INIT_WEBSITE
} from '@/global/contstants'
import {ElNotification} from 'element-plus'

const router = useRouter()


onMounted(async () => {
  const token = localCache.getCache(DEVICE_INFO)?.token ?? ''

  const init_website = sessionCache.getCache(INIT_WEBSITE)?.checkToken ?? false

  if (!init_website){
    if (token != '') {
      const result = await checkToken(token)
      if (result === '00000') {
        ElNotification({
          title: '通知',
          message: '歡迎回到 HEEs 系統',
          type: 'success'
        })
      } else if (result != '00000') {
        if (result === '02004') {
          ElNotification({
            title: '通知',
            message: '設備註冊時效已過期，請重新登入',
            type: 'error'
          })
        } else if (result === '02005') {
          ElNotification({
            title: '通知',
            message: '訂閱已過期，請洽系統管理員',
            type: 'error'
          })
        } else if (result === '-----') {
          ElNotification({
            title: '通知',
            message: '登入資料有誤，請重新登入',
            type: 'error'
          })
        } else {
          ElNotification({
            title: '通知',
            message: '系統錯誤，請洽系統管理員',
            type: 'error'
          })
        }

        await router.push({path: '/logIn'})
      }
    } else {
      await router.push({path: '/logIn'})
    }
    sessionCache.setCache(INIT_WEBSITE, {'checkToken': true})
  }
})
</script>

<template>
  <router-view></router-view>
</template>
