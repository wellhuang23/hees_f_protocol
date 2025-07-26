<template>
  <el-drawer
    :model-value="modelValue"
    :title="t('cusUpSug.title')"
    direction="rtl"
    size="50%"
    @update:model-value="$emit('update:modelValue', $event)"
    @open="resetForm"
  >
    <div v-if="formData" class="detail-container">
      <div class="detail-item">
        <p class="label">{{ t('cusSugDetail.subscription') }}:</p>
        <el-select v-model="formData.cusSugSub" value-key="subId" class="value">
          <el-option
            v-for="item in cusSuggestionsStore.cusSugSubItems"
            :key="item.subId"
            :label="locale === 'zh-TW' ? `${item.subNo} - ${item.subName}` : `${item.subNo} - ${item.subEngName}`"
            :value="item"
          />
        </el-select>
      </div>
      <div class="detail-item">
        <p class="label">{{ t('cusSugDetail.name') }}:</p>
        <p class="value">{{ formData.cusSugName }}</p>
      </div>
      <div class="detail-item">
        <p class="label">{{ t('cusSugDetail.content') }}:</p>
        <pre class="value">{{ formData.cusSugDesc }}</pre>
      </div>
      <div class="detail-item">
        <p class="label">{{ t('cusSugDetail.status') }}:</p>
        <el-select v-model="formData.cusSugStatus" class="value">
          <el-option :label="t('cusUpSug.statusOptions.new')" :value="0" />
          <el-option :label="t('cusUpSug.statusOptions.processing')" :value="1" />
          <el-option :label="t('cusUpSug.statusOptions.done')" :value="2" />
          <el-option :label="t('cusUpSug.statusOptions.sealed')" :value="3" />
        </el-select>
      </div>
      <div class="detail-item">
        <p class="label">{{ t('cusSugDetail.creator') }}:</p>
        <p class="value">{{ formData.creator?.userStName }}</p>
      </div>
      <div class="detail-item">
        <p class="label">{{ t('cusSugDetail.company') }}:</p>
        <p class="value">{{ formData.creator?.comStName }}</p>
      </div>
      <div class="detail-item">
        <p class="label">{{ t('cusSugDetail.group') }}:</p>
        <p class="value">{{ formData.creator?.groupName }}</p>
      </div>
      <div class="detail-item">
        <p class="label">{{ t('cusUpSug.response') }}:</p>
        <el-input v-model="formData.cusSugRes" type="textarea" :rows="4" class="value" />
      </div>
      <div class="detail-item">
        <p class="label">{{ t('cusUpSug.remarks') }}:</p>
        <el-input v-model="formData.notes" type="textarea" :rows="4" class="value" />
      </div>
      <div class="detail-item">
        <p class="label">{{ t('cusSugDetail.respondent') }}:</p>
        <p class="value">{{ formData.updater?.userStName }}</p>
      </div>
    </div>
    <template #footer>
      <div class="footer-container">
        <el-button v-if="userInfo.per0001.includes('sys-007-0001')" type="danger" @click="handleDelete">{{ t('g.delete') }}</el-button>
        <div class="spacer"></div>
        <el-button type="info" @click="$emit('update:modelValue', false)">{{ t('g.cancel') }}</el-button>
        <el-button type="primary" @click="handleUpdate">{{ t('cusUpSug.updateBtn') }}</el-button>
      </div>
    </template>
  </el-drawer>
  <CusDelSug
    v-if="isDelSugDialogVisible"
    v-model="isDelSugDialogVisible"
    :event="formData"
    @delete-confirmed="handleDeleteConfirmed"
  />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import type { CusSugMsg } from '@/interfaces/oms/bases';
import { updateCusSuggestion } from '@/services/oms/bases';
import { ElNotification } from "element-plus";
import { useCusSuggestionsStore } from '@/stores/oms/bases';
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
const cusSuggestionsStore = useCusSuggestionsStore();
const userInfo = useUserInfoStore();

const formData = ref<CusSugMsg | null>(null);
const isDelSugDialogVisible = ref(false);

const resetForm = () => {
  if (props.suggestion) {
    formData.value = { ...props.suggestion };
  }
};

watch(() => props.suggestion, resetForm, { immediate: true });

const handleUpdate = async () => {
  const updateRes = await updateCusSuggestion({
    cusSugId: formData.value?.cusSugId,
    cusSugRes: formData.value?.cusSugRes,
    cusSugStatus: formData.value?.cusSugStatus,
    notes: formData.value?.notes,
    subId: formData.value?.cusSugSub.subId
  })
  if (updateRes === '00000') {
    ElNotification({
      title: t('notice.noticeTitle'),
      message: t('notice.updateCusSuggestionSuccessMsg'),
      type: 'success'
    });
    emit('update:modelValue', false); // Close drawer on success
  } else if (updateRes === '99006') {
    ElNotification({
      title: t('notice.noticeTitle'),
      message: t('notice.updateCusSuggestionNoPerErrorMsg'),
      type: 'error'
    });
  } else {
    ElNotification({
      title: t('notice.noticeTitle'),
      message: t('notice.updateCusSuggestionErrorMsg'),
      type: 'error'
    });
  }
};

const handleDelete = () => {
  isDelSugDialogVisible.value = true;
};

const handleDeleteConfirmed = () => {
  emit('update:modelValue', false); // Close the main drawer
};
</script>

<style scoped>
.detail-container {
  padding: 1rem;
  font-size: 1rem;
}
.detail-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 1rem;
}
.label {
  font-weight: 600;
  width: 120px;
  color: #606266;
  margin-right: 1rem;
  flex-shrink: 0;
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
  justify-content: flex-end;
  align-items: center;
  width: 100%;
}
.spacer {
  flex-grow: 1;
}
</style>