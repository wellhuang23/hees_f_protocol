<script setup lang="ts">
import { onMounted, ref } from "vue";
import { getComJobPositions, updateComJobPositions } from "@/services";
import { useUserInfoStore, useValidComStore, useComJobPositionStore } from "@/stores";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import {ElMessage, ElNotification} from 'element-plus';
import type {ComJobPosition} from '@/interfaces'
import JpDelPosition from "@/components/oms/JPDelPosition.vue"

const { t } = useI18n();

const router = useRouter();
const userInfo = useUserInfoStore();
const validComStore = useValidComStore();
const comJobPositionStore = useComJobPositionStore();

const comTaxNo = validComStore.currentCom.comTaxNo;
const perCreateCode = comTaxNo + '-oms-006-1000';
const perUpdateCode = comTaxNo + '-oms-006-0010';
const perDeleteCode = comTaxNo + '-oms-006-0001';

const isDelJPDialogVisible = ref(false);
const selectedJobPosition = ref<ComJobPosition | null>(null);

// 用於存儲正在編輯的行，key 是行的唯一標識，value 是該行的修改中數據
const editingRows = ref<{ [key: string]: any }>({});
// 用於保存原始數據，以便取消時恢復
const originalRows = ref<{ [key: string]: any }>({});

onMounted(async () => {
  const perCode = comTaxNo + '-oms-006-0100';
  let visible = false;
  if (userInfo.per0100.includes(perCode)) {
    visible = true;
  }

  if (!visible) {
    await router.push('/main/401');
  }

  await getComJobPositions();
});

// 點擊修改按鈕
const handleUpdate = (row: any) => {
  // 使用 jobPosId 作為唯一標識，確保每行都可以獨立編輯
  if (!row.jobPosId) {
    console.error("行數據缺少 jobPosId，無法進入編輯模式。");
    ElMessage.error("行數據缺少唯一標識，無法進行修改操作。");
    return;
  }

  // 將原始數據保存一份，用於取消時恢復
  originalRows.value[row.jobPosId] = { ...row };
  // 將當前行複製一份到 editingRows 中進行修改，不直接修改原始數據
  editingRows.value[row.jobPosId] = { ...row };
};

// 點擊保存按鈕
const handleSave = async (row: ComJobPosition) => {
  if (!row.jobPosId) return;
  const updatedData = editingRows.value[row.jobPosId];
  const updateRes = await updateComJobPositions({
    jobPosId: row.jobPosId,
    jobPosName: updatedData.jobPosName,
    jobPosLevel: updatedData.jobPosLevel,
    jobPosDesc: updatedData.jobPosDesc,
  })
  if (updateRes === '00000') {
    ElNotification({
      title: t('notice.noticeTitle'),
      message: t('notice.updateComJobPositionSuccessMsg'),
      type: 'success'
    });
    delete editingRows.value[row.jobPosId];
    delete originalRows.value[row.jobPosId];
  } else if (updateRes === '99006') {
    ElNotification({
      title: t('notice.noticeTitle'),
      message: t('notice.updateComJobPositionNoPerErrorMsg'),
      type: 'error'
    });
  } else {
    ElNotification({
      title: t('notice.noticeTitle'),
      message: t('notice.updateComJobPositionErrorMsg'),
      type: 'error'
    });
  }
};

// 點擊取消按鈕
const handleCancel = (row: any) => {
  if (!row.jobPosId) return;

  // 清除編輯狀態
  delete editingRows.value[row.jobPosId];
  delete originalRows.value[row.jobPosId];
};

// 點擊刪除按鈕
const handleDelete = async (row: ComJobPosition) => {
  selectedJobPosition.value = row;
  isDelJPDialogVisible.value = true;
};

// 檢查某行是否處於編輯模式
const isRowEditing = (row: any) => {
  return !!editingRows.value[row.jobPosId];
};

</script>

<template>
  <el-row justify="space-between" align="middle" class="page-header">
    <el-col :span="20"></el-col>
    <el-col :span="4" style="text-align: right;">
      <el-button v-if="userInfo.per1000.includes(perCreateCode)" type="success">{{ t('comJP.addBtn') }}</el-button>
    </el-col>
  </el-row>
  <br><br>
  <el-table :data="comJobPositionStore.comJobPositions" style="width: 100%" stripe>
    <el-table-column fixed :label="t('comJP.jpNameLabel')" min-width="15%">
      <template #default="{ row }">
        <span v-if="!isRowEditing(row)">{{ row.jobPosName }}</span>
        <el-input v-else v-model="editingRows[row.jobPosId].jobPosName" :maxlength="20" show-word-limit />
      </template>
    </el-table-column>

    <el-table-column :label="t('comJP.jpLevelLabel')" min-width="15%">
      <template #default="{ row }">
        <span v-if="!isRowEditing(row)">{{ row.jobPosLevel }}</span>
        <el-input v-else v-model="editingRows[row.jobPosId].jobPosLevel" :maxlength="10" show-word-limit />
      </template>
    </el-table-column>

    <el-table-column :label="t('comJP.jpDescLabel')" min-width="50%">
      <template #default="{ row }">
        <span v-if="!isRowEditing(row)">{{ row.jobPosDesc }}</span>
        <el-input v-else v-model="editingRows[row.jobPosId].jobPosDesc" />
      </template>
    </el-table-column>

    <el-table-column
        v-if="userInfo.per0010.includes(perUpdateCode) || userInfo.per0001.includes(perDeleteCode)"
        :label="t('comJP.operationLabel')"
        width="180px"
        align="center"
    >
      <template #default="scope">
        <template v-if="isRowEditing(scope.row)">
          <el-button
              type="primary"
              size="small"
              @click="handleSave(scope.row)"
          >
            {{ t('comJP.saveBtn') }} </el-button>
          <el-button
              type="info"
              size="small"
              @click="handleCancel(scope.row)"
          >
            {{ t('comJP.cancelBtn') }} </el-button>
        </template>
        <template v-else>
          <el-button
              v-if="userInfo.per0010.includes(perUpdateCode)"
              type="warning"
              size="small"
              @click="handleUpdate(scope.row)"
          >
            {{ t('comJP.modifyBtn') }}
          </el-button>
          <el-button
              v-if="userInfo.per0001.includes(perDeleteCode)"
              type="danger"
              size="small"
              @click="handleDelete(scope.row)"
          >
            {{ t('comJP.deleteBtn') }}
          </el-button>
        </template>
      </template>
    </el-table-column>
  </el-table>
  <jp-del-position v-model="isDelJPDialogVisible" :event="selectedJobPosition" />
</template>

<style scoped lang="scss">
</style>