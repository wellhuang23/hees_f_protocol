<script setup lang="ts">
import GroupInfo from '@/components/oms/ComInfoGroup.vue'
import ComInfo from '@/components/oms/ComInfoCom.vue'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserInfoStore, useValidComStore, useComInfoStore } from '@/stores'
import { getComInfo } from '@/services/oms/orgs'
import { storeToRefs } from "pinia"
const userInfo = useUserInfoStore();

const validComStore = useValidComStore()
const comInfoStore = useComInfoStore()
const router = useRouter();
const { comInfo: comInfo } = storeToRefs(comInfoStore);

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
  <group-info :info="comInfo" />
  <com-info :com-info="comInfo" />
</template>

<style scoped lang="scss">

</style>