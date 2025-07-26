<script setup lang="ts">
import {useI18n} from 'vue-i18n'
import type { UserInfo } from '@/interfaces'
import {useUserInfoStore, useValidComStore} from "@/stores";

const validComStore = useValidComStore()
const userInfo = useUserInfoStore()

const comTaxNo = validComStore.currentCom.comTaxNo
const perUpdateUser = comTaxNo + '-oms-008-0010'

const props = defineProps({
  users: {
    type: Array as () => UserInfo[],
    required: true
  }
})

const { t } = useI18n()
</script>

<template>
  <div class="users-container">
  <el-table :data="props.users" stripe style="width: 100%">
    <el-table-column prop="userNo" :label="t('user.userListTitle.userNo')" />
    <el-table-column prop="userName" :label="t('user.userListTitle.userName')" />
    <el-table-column prop="userStName" :label="t('user.userListTitle.userStName')" />
    <el-table-column prop="email" :label="t('user.userListTitle.email')" />
  </el-table>
  </div>
</template>

<style scoped lang="scss">
.users-container {
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  width: 85%;
}
</style>