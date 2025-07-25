<script setup lang="ts">
import {defineEmits, onMounted, ref} from 'vue'
import { useI18n } from 'vue-i18n'
import PlusIcon from '@/assets/icons/solid/plus.svg'
import { storeToRefs } from 'pinia'
import {
  useUserInfoColsStore,
  useValidComStore,
  useUserInfoStore,
} from '@/stores'
import { getUserInfoCols, operateUserInfoCols } from '@/services'
import type {  UserInfoCol } from '@/interfaces'
import {ElNotification} from 'element-plus'
import UserDelInfoCol from '@/components/oms/UserDelInfoCol.vue'

const { t } = useI18n()

const drawerVisible = defineModel<boolean>('drawerVisible', { required: true })

// Define a type for a unit group
interface InfoColGroup {
  colId: number;
  colName: string;
  colDesc: string;
  colType: number;
  colTypeName: string;
  colRequire: boolean;
}

const userInfo = useUserInfoStore()
const userInfoColsStore = useUserInfoColsStore()
const validComStore = useValidComStore()

const comTaxNo = validComStore.currentCom.comTaxNo
const perUpdateUserInfoCol = comTaxNo + '-oms-007-0010'
const perDeleteUserInfoCol = comTaxNo + '-oms-007-0001'

const { userInfoCols: infoCols } = storeToRefs(userInfoColsStore)

const isDelSugDialogVisible = ref(false);

// Reactive array for the unit groups
const infoColGroups = ref<InfoColGroup[]>(infoCols.value);

const emits = defineEmits(['update:modelValue'])

const handleDeleteConfirmed = () => {
  emits('update:modelValue', false);
};

// Function to add a new unit group
const addUserInfoColGroup = () => {
  infoColGroups.value.push({
    colId: 0,
    colName: '',
    colDesc: '',
    colType: 0,
    colTypeName: '',
    colRequire: false,
  });
};

const typeOptions = [
  {
    value: 0,
    label: t('userInfoCol.colTypeOption.string')
  },
  {
    value: 1,
    label: t('userInfoCol.colTypeOption.integer')
  },
  {
    value: 2,
    label: t('userInfoCol.colTypeOption.float')
  },
  {
    value: 3,
    label: t('userInfoCol.colTypeOption.date')
  },
  {
    value: 4,
    label: t('userInfoCol.colTypeOption.datetime')
  }
]

const requireOptions = [
  {
    value: false,
    label: t('userInfoCol.colRequireOption.false')
  },
  {
    value: true,
    label: t('userInfoCol.colRequireOption.true')
  }
]

// Reset fields on cancel
const handleCancel = () => {
  drawerVisible.value = false
  infoColGroups.value = infoCols.value
}

const deleteColId = ref<number>(0);
const handleDelete = (colId: number) => {
  if (colId !== 0) {
    deleteColId.value = colId
    isDelSugDialogVisible.value = true
  }
}

// Process data on confirm
const handleConfirm = async () => {
  const userInfoCols:UserInfoCol[]  = []
  for (const row of infoColGroups.value) {
    userInfoCols.push({
      colId: row.colId,
      colName: row.colName,
      colDesc: row.colDesc,
      colType: row.colType,
      colRequire: row.colRequire,
    })
  }
  const res = await operateUserInfoCols(userInfoCols)
  if (res === '00000') {
    ElNotification({
      title: t('notice.noticeTitle'),
      message: t('notice.updateUserInfoColsSuccessMsg'),
      type: 'success'
    });
    infoColGroups.value = infoCols.value
    // drawerVisible.value = false
  } else if (res === '99006') {
    ElNotification({
      title: t('notice.noticeTitle'),
      message: t('notice.updateUserInfoColsNoPerErrorMsg'),
      type: 'error'
    });
  } else {
    ElNotification({
      title: t('notice.noticeTitle'),
      message: t('notice.updateUserInfoColsErrorMsg'),
      type: 'error'
    });
  }
}

onMounted(async () => {
  await getUserInfoCols()
})
</script>

<template>
  <el-drawer
      v-model="drawerVisible"
      :title="t('userInfoCol.title')"
      width="50%"
      :before-close="handleCancel"
  >
    <el-form>
      <div v-for="(group, index) in infoColGroups" :key="index" class="unit-group">
        <h3 class="unit-group-title">{{ t('userInfoCol.groupDesc').replace('x', `${index + 1}`) }}</h3>
        <el-form-item :label="t('userInfoCol.colName')" required>
          <el-input
              v-model="group.colName"
              :maxlength="20"
              show-word-limit
              :disabled="!userInfo.per0010.includes(perUpdateUserInfoCol)"
          />
        </el-form-item>
        <el-form-item :label="t('userInfoCol.colDesc')">
          <el-input
              v-model="group.colDesc"
              type="textarea"
              :rows="5"
              :disabled="!userInfo.per0010.includes(perUpdateUserInfoCol)"
          />
        </el-form-item>
        <el-form-item :label="t('userInfoCol.colType')">
          <el-select v-model="group.colType" placeholder="Select">
            <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="!userInfo.per0010.includes(perUpdateUserInfoCol)"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('userInfoCol.colRequire')">
          <el-select v-model="group.colRequire" placeholder="Select">
            <el-option
                v-for="item in requireOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="!userInfo.per0010.includes(perUpdateUserInfoCol)"
            />
          </el-select>
        </el-form-item>
        <el-button
            type="danger"
            @click="handleDelete(group.colId)"
            :disabled="!userInfo.per0001.includes(perDeleteUserInfoCol)"
        >
          {{ t('general.delete') }}
        </el-button>
      </div>
      <el-button type="default" @click="addUserInfoColGroup" style="width: 100%;">
        <el-icon :size="20">
          <img :src="PlusIcon" alt="AddGroup" style="width: 1em; height: 1em;" />
        </el-icon>
      </el-button>
    </el-form>
    <template #footer>
      <span >
        <el-button type="info" @click="handleCancel">{{ t('general.cancel') }}</el-button>
        <el-button
            type="primary"
            @click="handleConfirm"
            :disabled="!userInfo.per0010.includes(perUpdateUserInfoCol)"
        >
          {{ t('general.confirm') }}
        </el-button>
      </span>
    </template>
  </el-drawer>
  <user-del-info-col
      v-if="isDelSugDialogVisible"
      v-model="isDelSugDialogVisible"
      :colId="deleteColId.valueOf()"
      @delete-confirmed="handleDeleteConfirmed"
  />
</template>

<style scoped>
.unit-group {
  border: 1px solid #dcdfe6;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 4px;
  position: relative;
}

.unit-group-title {
  position: absolute;
  top: -10px;
  left: 10px;
  background: #fff;
  padding: 0 5px;
  font-size: 14px;
  color: #606266;
}
</style>