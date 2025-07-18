<script setup lang="ts">
import CompanyNotifications from '@/components/oms/NotiComList.vue'
import GroupNotifications from '@/components/oms/NotiGroupList.vue'
import {onMounted, ref} from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter, useRoute } from 'vue-router'
import { useUserInfoStore, useValidComStore } from "@/stores";

const userInfo = useUserInfoStore();
const validComStore = useValidComStore()
const router = useRouter();
const route = useRoute();

const { t } = useI18n();
let activeName = ref('groupNotices')

onMounted(async () => {
  const comTaxNo = validComStore.currentCom.comTaxNo
  const perCodes = ['xxxxxxxx-oms-001-0100', 'xxxxxxxx-oms-009-0100']
  let visible = false
  for (const perCode of perCodes) {
    if (userInfo.per0100.includes(perCode.replace('xxxxxxxx', comTaxNo))) {
      visible = true
    }
  }

  if (!visible) {
    await router.push('/main/401');
  }

  const activeLabel: string = route.query?.label as string ?? 'groupNotices'
  activeName = ref(activeLabel)
});
</script>

<template>
  <el-tabs v-model="activeName" class="demo-tabs">
    <el-tab-pane :label="t('entNotifications.labelGroup')" name="groupNotices">
      <group-notifications />
    </el-tab-pane>
    <el-tab-pane :label="t('entNotifications.labelCompany')" name="comNotices">
      <company-notifications />
    </el-tab-pane>
  </el-tabs>
</template>

<style scoped lang="scss">

</style>