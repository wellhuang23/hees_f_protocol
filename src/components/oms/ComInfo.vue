<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserInfoStore, useValidComStore } from '@/stores'
import { getComInfo } from '@/services/oms/orgs'

const userInfo = useUserInfoStore();
const validComStore = useValidComStore()
const router = useRouter();

onMounted(async () => {
  const comTaxNo = validComStore.currentCom.comTaxNo
  const perCode = 'xxxxxxxx-oms-004-0100'
  let visible = false
  if (userInfo.per0100.includes(perCode.replace('xxxxxxxx', comTaxNo))) {
    visible = true
  }

  if (!visible) {
    await router.push('/main/401');
  }

  await getComInfo()
});
</script>

<template>
  <div>COMPANY INFORMATION</div>
</template>

<style scoped lang="scss">

</style>