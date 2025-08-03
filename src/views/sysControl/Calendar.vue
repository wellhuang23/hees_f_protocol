<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useUserInfoStore } from '@/stores/oms/auths';
import CalEvents from '@/components/sysControl/CalEvents.vue';
import CalAddEvent from '@/components/sysControl/CalAddEvent.vue';
import { syncGovCalEvents } from '@/services/oms/bases';
import { ElNotification } from "element-plus";

const { t } = useI18n();
const userInfoStore = useUserInfoStore();

const isSyncing = ref(false);
const isAddEventDialogVisible = ref(false);

const canAddEvent = computed(() => {
  return userInfoStore.per1000.includes('sys-004-1000');
});

const canRefreshHoliday = computed(() => {
  return userInfoStore.per1000.includes('sys-004-1000') && userInfoStore.per0010.includes('sys-004-0010');
});

const addEvent = () => {
  isAddEventDialogVisible.value = true;
};

const refreshHoliday = async () => {
  isSyncing.value = true;
  try {
    const refreshRes = await syncGovCalEvents();
    if (refreshRes === '00000') {
      ElNotification({
        title: t('notice.noticeTitle'),
        message: t('notice.syncCalendarSuccessMsg'),
        type: 'success'
      });
    } else if (refreshRes === '99006') {
      ElNotification({
        title: t('notice.noticeTitle'),
        message: t('notice.syncCalendarNoPerErrorMsg'),
        type: 'error'
      });
    } else {
      ElNotification({
        title: t('notice.noticeTitle'),
        message: t('notice.syncCalendarErrorMsg'),
        type: 'error'
      });
    }
  } finally {
    isSyncing.value = false;
  }
};
</script>

<template>
  <div class="calendar-view-container">
    <div class="actions-bar">
      <el-button v-if="canAddEvent" type="success" @click="addEvent">{{ t('calendar.addEvent') }}</el-button>
      <div class="spacer"></div>
      <el-button
        v-if="canRefreshHoliday"
        type="info"
        @click="refreshHoliday"
        :loading="isSyncing"
      >
        {{ t('calendar.refreshHoliday') }}
      </el-button>
    </div>
    <cal-events />
    <cal-add-event v-model="isAddEventDialogVisible" />
  </div>
</template>

<style scoped lang="scss">
.calendar-view-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.actions-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  flex-shrink: 0;
}

.spacer {
  flex-grow: 1;
}
</style>