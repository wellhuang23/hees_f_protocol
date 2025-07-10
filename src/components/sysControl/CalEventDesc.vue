<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { CalEvent } from '@/interfaces/oms/bases';

// 使用 defineProps 來接收傳入的 props
const props = defineProps<{
  modelValue: boolean; // 用於 v-model，控制 dialog 的顯示
  event: CalEvent | null; // 當前要顯示的事件，可能為 null
}>();

// 使用 defineEmits 來聲明要觸發的事件
const emit = defineEmits(['update:modelValue']);

const { t, locale } = useI18n();

// 計算屬性，用於雙向綁定 dialog 的可見性
const isVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

// 根據當前語系計算 dialog 的標題
const dialogTitle = computed(() => {
  if (!props.event) return '';
  return locale.value === 'zh-TW' ? props.event.calName : props.event.calEngName;
});

// 根據當前語系計算 dialog 的內容
const dialogContent = computed(() => {
  if (!props.event) return '';
  return locale.value === 'zh-TW' ? props.event.calDesc : props.event.calEngDesc;
});

// ��閉 dialog 的方法
const closeDialog = () => {
  isVisible.value = false;
};
</script>

<template>
  <el-dialog
    v-model="isVisible"
    :title="dialogTitle"
    width="400px"
  >
    <div class="dialog-content-wrapper">
      <p class="dialog-content">{{ dialogContent }}</p>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="closeDialog">
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
}

.dialog-content {
  text-align: center;
  font-size: 1rem;
  line-height: 1.6;
  white-space: pre-wrap; // 保留換行符
}
</style>
