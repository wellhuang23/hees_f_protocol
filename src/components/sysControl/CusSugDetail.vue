<template>
  <el-drawer
    :model-value="modelValue"
    :title="t('cusSugDetail.title')"
    direction="rtl"
    size="50%"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div v-if="suggestion" class="detail-container">
      <div class="detail-item">
        <p class="label">{{ t('cusSugDetail.subscription') }}:</p>
        <p class="value">{{ subscriptionName }}</p>
      </div>
      <div class="detail-item">
        <p class="label">{{ t('cusSugDetail.name') }}:</p>
        <p class="value">{{ suggestion.cusSugName }}</p>
      </div>
      <div class="detail-item">
        <p class="label">{{ t('cusSugDetail.content') }}:</p>
        <pre class="value">{{ suggestion.cusSugDesc }}</pre>
      </div>
      <div class="detail-item">
        <p class="label">{{ t('cusSugDetail.status') }}:</p>
        <p class="value">{{ statusText }}</p>
      </div>
      <div class="detail-item">
        <p class="label">{{ t('cusSugDetail.creator') }}:</p>
        <p class="value">{{ suggestion.creator?.userStName }}</p>
      </div>
      <div class="detail-item">
        <p class="label">{{ t('cusSugDetail.company') }}:</p>
        <p class="value">{{ suggestion.creator?.comStName }}</p>
      </div>
      <div class="detail-item">
        <p class="label">{{ t('cusSugDetail.group') }}:</p>
        <p class="value">{{ suggestion.creator?.groupName }}</p>
      </div>
      <div class="detail-item">
        <p class="label">{{ t('cusSugDetail.response') }}:</p>
        <pre class="value">{{ suggestion.cusSugRes }}</pre>
      </div>
      <div class="detail-item">
        <p class="label">{{ t('cusSugDetail.respondent') }}:</p>
        <p class="value">{{ suggestion.updater?.userStName }}</p>
      </div>
    </div>
    <template #footer>
      <div class="footer-container">
        <el-button v-if="userInfo.per0001.includes('sys-007-0001')" type="danger" @click="handleDelete">{{ t('g.delete') }}</el-button>
      </div>
    </template>
  </el-drawer>
  <CusDelSug
    v-if="isDelSugDialogVisible"
    v-model="isDelSugDialogVisible"
    :event="suggestion"
    @delete-confirmed="handleDeleteConfirmed"
  />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { CusSugMsg } from '@/interfaces/oms/bases';
import { useUserInfoStore } from '@/stores/oms/auths';
import CusDelSug from './CusDelSug.vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  suggestion: {
    type: Object as () => CusSugMsg | null,
    default: () => null,
  },
});

const emit = defineEmits(['update:modelValue']);

const { t, locale } = useI18n();
const userInfo = useUserInfoStore();
const isDelSugDialogVisible = ref(false);

const subscriptionName = computed(() => {
  if (!props.suggestion?.cusSugSub) return '';
  const { subNo, subName, subEngName } = props.suggestion.cusSugSub;
  return locale.value === 'zh-TW' ? `${subNo} - ${subName}` : `${subNo} - ${subEngName}`;
});

const statusText = computed(() => {
  if (!props.suggestion) return '';
  const status = props.suggestion.cusSugStatus;
  const isTw = locale.value === 'zh-TW';
  switch (status) {
    case 0:
      return isTw ? '新建議' : 'New Suggestions';
    case 1:
      return isTw ? '處理中' : 'In Processing';
    case 2:
      return isTw ? '已完成' : 'Done';
    case 3:
      return isTw ? '已封存' : 'Sealed';
    default:
      return '';
  }
});

const handleDelete = () => {
  isDelSugDialogVisible.value = true;
};

const handleDeleteConfirmed = () => {
  emit('update:modelValue', false);
};
</script>

<style scoped>
.detail-container {
  padding: 1rem;
  font-size: 1rem;
}
.detail-item {
  display: flex;
  margin-bottom: 1rem;
}
.label {
  font-weight: 600;
  width: 120px;
  color: #606266;
  margin-right: 1rem;
}
.value {
  flex: 1;
  color: #303133;
  min-width: 0;
}
pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: inherit;
  margin: 0;
}
.footer-container {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
}
</style>