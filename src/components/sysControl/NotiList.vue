<template>
  <div class="noti-list-container">
    <el-row justify="space-between" align="middle" class="page-header">
      <el-col :span="20">
        <p>{{ t('pageTitle.sysNotification') }}</p>
      </el-col>
      <el-col :span="4" style="text-align: right;">
        <el-button v-if="userInfo.per1000.includes('sys-006-1000')" type="success" @click="addNoti">{{ t('sysNoti.addBtn') }}</el-button>
      </el-col>
    </el-row>

    <el-table
      :data="pagedNotifications"
      stripe
      style="width: 100%"
      :row-key="getRowKey"
      :expand-row-keys="expandedRowKeys"
      @row-click="handleRowClick"
    >
      <el-table-column type="expand">
        <template #default="props">
          <div class="noti-details">
            <div class="detail-item">
              <span class="label">{{ t('sysNoti.creator') }}:</span>
              <span class="value">{{ props.row.creator.userStName }}</span>
            </div>
            <div class="detail-item">
              <span class="label">{{ t('sysNoti.company') }}:</span>
              <span class="value">{{ props.row.creator.comStName }}</span>
            </div>
            <div class="detail-item">
              <span class="label">{{ t('sysNoti.group') }}:</span>
              <span class="value">{{ props.row.creator.groupName }}</span>
            </div>
            <div class="detail-item">
              <span class="label">{{ t('sysNoti.releaseTime') }}:</span>
              <span class="value">{{ props.row.createTime }}</span>
            </div>
            <div class="detail-item">
              <span class="label">{{ t('sysNoti.updateTime') }}:</span>
              <span class="value">{{ props.row.updateTime }}</span>
            </div>
            <div class="detail-item">
              <span class="label">{{ t('sysNoti.notiDesc') }}:</span>
              <span class="value">{{ props.row.notiDesc }}</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="notiName" :label="t('sysNoti.notiName')"></el-table-column>
      <el-table-column :label="t('subList.actions')" width="180">
        <template #default="scope">
          <el-button
            v-if="userInfo.per0010.includes('sys-006-0010')"
            type="warning"
            size="small"
            @click.stop="modifyNoti(scope.row)"
          >{{ t('sysNoti.modifyBtn') }}</el-button>
          <el-button
            v-if="userInfo.per0001.includes('sys-006-0001')"
            type="danger"
            size="small"
            @click.stop="deleteNoti(scope.row)"
          >{{ t('sysNoti.deleteBtn') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="totalNotifications"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <NotiAddNotice :visible="isAddNotiDialogVisible" @close="closeAddNotiDialog" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import { useNotificationStore } from '@/stores/oms/bases';
import { useUserInfoStore } from '@/stores/oms/auths';
import { getSysNotification } from '@/services/oms/bases';
import type { Notification } from '@/interfaces/oms/bases';
import { useRouter } from 'vue-router';
import NotiAddNotice from './NotiAddNotice.vue';

const { t } = useI18n();
const notificationStore = useNotificationStore();
const { sysNotification: notifications } = storeToRefs(notificationStore);
const userInfo = useUserInfoStore();
const router = useRouter();

const expandedRowKeys = ref<number[]>([]);
const currentPage = ref(1);
const pageSize = ref(12);
const isAddNotiDialogVisible = ref(false);

const pagedNotifications = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return notifications.value.slice(start, end);
});

const totalNotifications = computed(() => notifications.value.length);

const getRowKey = (row: Notification) => {
  return row.notiId;
};

const handleSizeChange = (val: number) => {
  pageSize.value = val;
  currentPage.value = 1;
};

const handleCurrentChange = (val: number) => {
  currentPage.value = val;
};

const handleRowClick = (row: Notification) => {
  const rowKey = getRowKey(row);
  if (expandedRowKeys.value.includes(rowKey)) {
    expandedRowKeys.value = [];
  } else {
    expandedRowKeys.value = [rowKey];
  }
};

const addNoti = () => {
  isAddNotiDialogVisible.value = true;
};

const closeAddNotiDialog = () => {
  isAddNotiDialogVisible.value = false;
};

const modifyNoti = (row: Notification) => {
  // Implement navigation or dialog for modifying a notification
};

const deleteNoti = (row: Notification) => {
  // Implement logic for deleting a notification
};

onMounted(async () => {
  if (!userInfo.per0100.includes('sys-006-0100')) {
    router.push({ name: 'NoPermission' });
  }
  await getSysNotification();
});
</script>

<style scoped>
.noti-list-container {
  padding: 1rem;
}

.page-header {
  margin-bottom: 1.5rem;
}

.page-header p {
  font-size: 1.25rem;
  font-weight: 600;
}

.noti-details {
  padding: 1rem;
}

.detail-item {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.label {
  font-weight: 600;
  text-align: right;
}

.value {
  word-break: break-word;
  white-space: pre-wrap;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
