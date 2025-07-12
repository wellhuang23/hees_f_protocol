<template>
  <el-drawer
    :model-value="visible"
    :title="t('cusSugDetail.title')"
    direction="rtl"
    size="50%"
    @update:model-value="$emit('update:visible', $event)"
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
  </el-drawer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { CusSugMsg } from '@/interfaces/oms/bases';

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
  suggestion: {
    type: Object as () => CusSugMsg | null,
    default: () => null,
  },
});

defineEmits(['update:visible']);

const { t, locale } = useI18n();

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
</style>