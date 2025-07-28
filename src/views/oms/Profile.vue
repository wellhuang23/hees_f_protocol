<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { onMounted } from 'vue'
import { getProfile } from '@/services'
import { useProfileStore } from '@/stores'
import ProfileBasic from '@/components/oms/ProfileBasic.vue'
import ProfileChangePwd from '@/components/oms/ProfileChangePwd.vue'
import ProfileDetail from '@/components/oms/ProfileDetail.vue'
import ProfileOrg from '@/components/oms/ProfileOrg.vue'

const { t } = useI18n();

const profileStore = useProfileStore()

const activeLabel = 'basicProfile'
const activeName = ref(activeLabel)

onMounted(async () => {
  await getProfile()
})
</script>

<template>
  <el-tabs v-model="activeName" class="demo-tabs">
    <el-tab-pane :label="t('profile.basic.title')" name="basicProfile">
      <profile-basic :user-info="profileStore.profile" />
    </el-tab-pane>
    <el-tab-pane :label="t('profile.org.title')" name="orgInfo">
      <profile-org :str-units="profileStore.profile.strUnits" :job-positions="profileStore.profile.jobPositions" />
    </el-tab-pane>
    <el-tab-pane :label="t('profile.detail.title')" name="detailProfile">
      <profile-detail :details="profileStore.profile.detailInfo"/>
    </el-tab-pane>
    <el-tab-pane :label="t('profile.pwd.title')" name="pwdSetting">
      <profile-change-pwd />
    </el-tab-pane>
  </el-tabs>
</template>

<style scoped lang="scss">

</style>