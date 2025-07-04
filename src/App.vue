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

const router = useRouter()


onMounted(async () => {
  const token = localCache.getCache(DEVICE_INFO)?.token ?? ''

  const init_website = sessionCache.getCache(INIT_WEBSITE)?.checkToken ?? false

  if (!init_website){
    if (token != '') {
      const result = await checkToken(token)
      if (result != '00000') {
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
