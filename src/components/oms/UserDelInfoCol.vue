<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { deleteUserInfoCol } from '@/services/oms/orgs'
import { ElNotification } from 'element-plus'

// Props and Emits for v-model
const props = defineProps<{
  modelValue: boolean;
  colId: number;
}>();
const emit = defineEmits(['update:modelValue', 'delete-confirmed']);

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
  if (props.colId != 0) {
    const deleteRes = await deleteUserInfoCol(props.colId)
    if (deleteRes === '00000') {
      ElNotification({
        title: t('notice.noticeTitle'),
        message: t('notice.deleteUserInfoColSuccessMsg'),
        type: 'success'
      });
      emit('delete-confirmed');
      closeDialog();
    } else if (deleteRes === '99006') {
      ElNotification({
        title: t('notice.noticeTitle'),
        message: t('notice.deleteUserInfoColNoPerErrorMsg'),
        type: 'error'
      });
    } else {
      ElNotification({
        title: t('notice.noticeTitle'),
        message: t('notice.deleteUserInfoColErrorMsg'),
        type: 'error'
      });
    }
  }
};
</script>

<template>
  <el-dialog
      v-model="isVisible"
      :title="t('userInfoCol.delUserInfoCol.title')"
      width="400px"
      :close-on-click-modal="true"
      @close="closeDialog"
  >
    <div class="dialog-content-wrapper">
      <p class="dialog-content">{{ t('userInfoCol.delUserInfoCol.content') }}</p>
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