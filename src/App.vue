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
import { ElNotification } from 'element-plus'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { t } = useI18n()


onMounted(async () => {
  const token = localCache.getCache(DEVICE_INFO)?.token ?? ''

  const init_website = sessionCache.getCache(INIT_WEBSITE)?.checkToken ?? false

  if (!init_website){
    if (token != '') {
      const result = await checkToken(token)
      if (result === '00000') {
        ElNotification({
          title: t('notice.noticeTitle'),
          message: t('notice.welcomeMsg'),
          type: 'success'
        })
      } else if (result != '00000') {
        if (result === '02004') {
          ElNotification({
            title: t('notice.noticeTitle'),
            message: t('notice.registerExpireMsg'),
            type: 'error'
          })
        } else if (result === '02005') {
          ElNotification({
            title: t('notice.noticeTitle'),
            message: t('notice.subExpireMsg'),
            type: 'error'
          })
        } else if (result === '-----') {
          ElNotification({
            title: t('notice.noticeTitle'),
            message: t('notice.initDataErrorMsg'),
            type: 'error'
          })
        } else {
          ElNotification({
            title: t('notice.noticeTitle'),
            message: t('notice.systemErrorMsg'),
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
