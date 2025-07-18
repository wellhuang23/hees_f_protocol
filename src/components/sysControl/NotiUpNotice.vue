<template>
  <el-drawer
    v-model="drawer"
    :title="t('notiUpNotice.title')"
    direction="rtl"
    size="50%"
  >
    <el-form :model="form" label-width="120px">
      <el-form-item :label="t('notiUpNotice.notiName')">
        <el-input v-model="form.notiName" />
      </el-form-item>
      <el-form-item :label="t('notiUpNotice.notiDesc')">
        <el-input v-model="form.notiDesc" type="textarea" :rows="5" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawer = false">{{ t('general.cancel') }}</el-button>
        <el-button type="primary" @click="confirmClick">{{ t('general.confirm') }}</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import {useI18n} from "vue-i18n";
import { updateSysNotification } from '@/services/oms/bases'
import {convertToNumber} from "@/utils/conNumber.ts";
import {ElNotification} from "element-plus";

const { t } = useI18n();

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  notice: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const drawer = ref(props.modelValue)
const form = ref({
  notiId: '',
  notiName: '',
  notiDesc: '',
})

watch(() => props.modelValue, (val) => {
  drawer.value = val
})

watch(drawer, (val) => {
  if (!val) {
    emit('update:modelValue', false)
  }
})

watch(() => props.notice, (val) => {
  if (val) {
    form.value = {
      notiId: val.notiId ?? 0,
      notiName: val.notiName ?? '',
      notiDesc: val.notiDesc ?? '',
    }
  }
}, { immediate: true, deep: true })


const confirmClick = async () => {
  const updateRes = await updateSysNotification({
    notiId: convertToNumber(form.value.notiId) ?? 0,
    notiName: form.value.notiName,
    notiDesc: form.value.notiDesc,
  })
  if (updateRes === '00000') {
    ElNotification({
      title: t('notice.noticeTitle'),
      message: t('notice.updateSysNotificationSuccessMsg'),
      type: 'success'
    });
    location.reload(); // Consider updating data without a full reload
  } else if (updateRes === '99006') {
    ElNotification({
      title: t('notice.noticeTitle'),
      message: t('notice.updateSysNotificationNoPerErrorMsg'),
      type: 'error'
    });
  } else {
    ElNotification({
      title: t('notice.noticeTitle'),
      message: t('notice.updateSysNotificationErrorMsg'),
      type: 'error'
    });
  }
}
</script>
