<script setup lang="ts">
import GearIcon from '@/assets/icons/solid/gear.svg'
import {useUserInfoStore, useValidComStore} from '@/stores'
import {ref} from 'vue'
import UserUpInfoCol from '@/components/oms/UserUpInfoCol.vue'
import UserAddMember from '@/components/oms/UserAddMember.vue'
import {useI18n} from 'vue-i18n'

const { t } = useI18n()

const validComStore = useValidComStore()
const userInfo = useUserInfoStore();

const comTaxNo = validComStore.currentCom.comTaxNo
const perReadUserInfoCols = comTaxNo + '-oms-007-0100'
const perCreateUser = comTaxNo + '-oms-008-1000'

const showUserInfoCols = ref(false)
const isAddMemberDialogVisible = ref(false);

const closeAddMemberDialog = () => {
  isAddMemberDialogVisible.value = false;
};
</script>

<template>
  <div class="refresh-button-container">
    <el-button
        v-if="userInfo.per0100.includes(perReadUserInfoCols)"
        class="refresh-button"
        @click="showUserInfoCols = true"
    >
      <img :src="GearIcon" alt="Refresh" style="width: 1em; height: 1em;" />
    </el-button>
    <el-button
        type="success"
        v-if="userInfo.per1000.includes(perCreateUser)"
        @click="isAddMemberDialogVisible = true"
    >
      {{ t('user.addBtn') }}
    </el-button>
  </div>
  <user-up-info-col v-model:drawerVisible="showUserInfoCols" />
  <user-add-member :visible="isAddMemberDialogVisible" @close="closeAddMemberDialog" />
</template>

<style scoped lang="scss">
.refresh-button-container {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px; /* Add some space below the button */
}
</style>
