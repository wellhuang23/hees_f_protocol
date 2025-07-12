<template>
  <el-dialog
    :model-value="visible"
    :title="t('cusSugs.addSug')"
    width="500"
    center
    @create:model-value="$emit('create:visible', $event)"
  >
    <el-form :model="form" label-position="top">
      <el-form-item :label="t('cusSugs.name')">
        <el-input v-model="form.name" :maxlength="50" show-word-limit />
      </el-form-item>
      <el-form-item :label="t('cusSugs.content')">
        <el-input v-model="form.content" type="textarea" :rows="4" />
      </el-form-item>
      <el-form-item :label="t('cusSugs.sub')">
        <el-select v-model="form.subId" placeholder="Select">
          <el-option
            v-for="item in subItems"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="$emit('create:visible', false)">{{ t('general.cancel') }}</el-button>
        <el-button type="primary" @click="submitForm">
          {{ t('general.confirm') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import { useCusSuggestionsStore } from '@/stores/oms/bases';
import { createNewCusSuggestion } from '@/services/oms/bases'
import {ElNotification} from "element-plus";

defineProps<{
  visible: boolean;
}>();

defineEmits(['create:visible']);

const { t, locale } = useI18n();
const cusSuggestionsStore = useCusSuggestionsStore();
const { cusSugSubItems } = storeToRefs(cusSuggestionsStore);

const form = ref({
  name: '',
  content: '',
  subId: 0,
});

const subItems = computed(() => {
  return cusSugSubItems.value.map(item => ({
    value: item.subId,
    label: locale.value === 'zh-TW'
      ? `${item.subNo}-${item.subName}`
      : `${item.subNo}-${item.subEngName}`,
  }));
});

const submitForm = async () => {
  // console.log('Form submitted:', typeof form.value.name);
  // console.log('Form submitted:', typeof form.value.content);
  // console.log('Form submitted:', typeof form.value.subId);
  const createRes = await createNewCusSuggestion({
    cusSugName: form.value.name,
    cusSugDesc: form.value.content,
    subId: form.value.subId
  })
  if (createRes === '00000') {
    ElNotification({
      title: t('notice.noticeTitle'),
      message: t('notice.createCusSuggestionSuccessMsg'),
      type: 'success'
    });
    location.reload(); // Consider updating data without a full reload
  } else if (createRes === '99006') {
    ElNotification({
      title: t('notice.noticeTitle'),
      message: t('notice.createCusSuggestionNoPerErrorMsg'),
      type: 'error'
    });
  } else {
    ElNotification({
      title: t('notice.noticeTitle'),
      message: t('notice.createCusSuggestionErrorMsg'),
      type: 'error'
    });
  }
};
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}
</style>
