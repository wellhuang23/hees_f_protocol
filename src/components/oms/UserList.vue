<script setup lang="ts">
import GearIcon from '@/assets/icons/solid/gear.svg'
import {useUserInfoStore, useValidComStore} from '@/stores'
import {ref} from 'vue'
import UserUpInfoCol from '@/components/oms/UserUpInfoCol.vue'

const validComStore = useValidComStore()
const userInfo = useUserInfoStore();

const comTaxNo = validComStore.currentCom.comTaxNo
const perReadUserInfoCols = comTaxNo + '-oms-007-0100'

const showUserInfoCols = ref(false)
</script>

<template>
  <div class="refresh-button-container">
    <el-button
        v-if="userInfo.per0100.includes(perReadUserInfoCols)"
        class="refresh-button"
        @click="showUserInfoCols = true"
        :disabled="!userInfo.per0100.includes(perReadUserInfoCols)"
    >
      <img :src="GearIcon" alt="Refresh" style="width: 1em; height: 1em;" />
    </el-button>
  </div>
  <user-up-info-col v-model:drawerVisible="showUserInfoCols" />
</template>

<style scoped lang="scss">
.refresh-button-container {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px; /* Add some space below the button */
}
</style>
