<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { CalEvent } from '@/interfaces/oms/bases';
import { deleteCalEvent } from '@/services/oms/bases'
import {ElNotification} from "element-plus";

// Props and Emits for v-model
const props = defineProps<{
  modelValue: boolean;
  event: CalEvent | null;
}>();
const emit = defineEmits(['update:modelValue']);

const { t } = useI18n();

// Computed property to control dialog visibility
const isVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const closeDialog = () => {
  isVisible.value = false;
};

const handleConfirm = async () => {
  if (props.event?.calId) {
    const deleteRes = await deleteCalEvent({
      calId: props.event.calId
    })
    if (deleteRes === '00000') {
      ElNotification({
        title: t('notice.noticeTitle'),
        message: t('notice.updateCalendarSuccessMsg'),
        type: 'success'
      });
      location.reload(); // Consider updating data without a full reload
    } else if (deleteRes === '99006') {
      ElNotification({
        title: t('notice.noticeTitle'),
        message: t('notice.updateCalendarNoPerErrorMsg'),
        type: 'error'
      });
    } else {
      ElNotification({
        title: t('notice.noticeTitle'),
        message: t('notice.updateCalendarErrorMsg'),
        type: 'error'
      });
    }
  }
  closeDialog();
};
</script>

<template>
  <el-dialog
    v-model="isVisible"
    :title="t('calendar.deleteEventDialog.title')"
    width="400px"
    :close-on-click-modal="true"
    @close="closeDialog"
  >
    <div class="dialog-content-wrapper">
      <p class="dialog-content">{{ t('calendar.deleteEventDialog.content') }}</p>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">{{ t('general.cancel') }}</el-button>
        <el-button type="primary" @click="handleConfirm">
          {{ t('general.confirm') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.dialog-content-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 10px;
  text-align: center;
}

.dialog-content {
  font-size: 1rem;
  line-height: 1.6;
}
</style>
