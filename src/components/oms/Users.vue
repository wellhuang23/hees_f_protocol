<script setup lang="ts">
import GearIcon from '@/assets/icons/solid/gear.svg'
import {useUserInfoStore, useValidComStore, useStrUnitUsersStore} from '@/stores'
import {ref, computed, onMounted} from 'vue'
import UserUpInfoCol from '@/components/oms/UserUpInfoCol.vue'
import UserAddMember from '@/components/oms/UserAddMember.vue'
import {useI18n} from 'vue-i18n'
import type { StrUnitUser, UserInfo } from '@/interfaces'
import { getStrUnitUsers } from '@/services'
import UsersList from '@/components/oms/UsersList.vue'

const { t, locale } = useI18n()

const validComStore = useValidComStore()
const userInfo = useUserInfoStore()
const strUnitUsersStore = useStrUnitUsersStore()

const comTaxNo = validComStore.currentCom.comTaxNo
const perReadUserInfoCols = comTaxNo + '-oms-007-0100'
const perReadUsers = comTaxNo + '-oms-008-0100'
const perCreateUser = comTaxNo + '-oms-008-1000'

const showUserInfoCols = ref(false)
const isAddMemberDialogVisible = ref(false);
const selectedNodeUsers = ref<UserInfo[]>([])
const selectedNodeCategory = ref<String>('')

const closeAddMemberDialog = () => {
  isAddMemberDialogVisible.value = false;
};

const treeData = computed(() => {
  const transformData = (data: StrUnitUser[]): any[] => {
    return data.map(item => {
      const children = item.children ? transformData(item.children) : []
      return {
        ...item,
        id: item.strUnitId,
        label: locale.value === 'zh-TW' ? item.strUnitName : item.strUnitEngName,
        children: [...children]
      }
    })
  }
  return transformData(strUnitUsersStore.strUnitUsers)
})

const props = {
  children: 'children',
  label: 'label',
  value: 'id'
}

const handleNodeClick = (node: any) => {
  selectedNodeUsers.value = node.users || []
  selectedNodeCategory.value = locale.value === 'zh-TW' ? node.strUnitName : node.strUnitEngName
}

onMounted(async () => {
  await getStrUnitUsers()
})
</script>

<template>
  <div class="user-list-wrapper">
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
    <div class="content-container" v-if="userInfo.per0100.includes(perReadUsers)">
      <div class="str-units-container">
        <el-tree
            :data="treeData"
            :props="props"
            @node-click="handleNodeClick"
            :expand-on-click-node="false"
            :default-expand-all="true"
        />
      </div>
      <users-list class="users-container" :users="selectedNodeUsers" :category="selectedNodeCategory" />
    </div>
    <user-up-info-col v-model:drawerVisible="showUserInfoCols" />
    <user-add-member :visible="isAddMemberDialogVisible" @close="closeAddMemberDialog" />
  </div>
</template>

<style scoped lang="scss">
.user-list-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.refresh-button-container {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px; /* Add some space below the button */
}

.content-container {
  display: flex;
  gap: 20px;
  flex-grow: 1;
  min-height: 0;
  overflow: hidden;
}

.str-units-container {
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  flex-shrink: 0; /* Do not shrink */
  overflow-y: auto;
  /* Let the width be determined by its content */
  width: auto;
  max-width: 50%; /* Optional: prevent it from getting too wide */
}

.users-container {
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  height: 100%;
  flex-grow: 1;
  /* This is crucial for flex children that need to shrink */
  min-width: 0;
}
</style>
