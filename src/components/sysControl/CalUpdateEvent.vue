<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import {ElNotification, type FormInstance, type FormRules} from 'element-plus';
import type { CalEvent } from '@/interfaces/oms/bases';
import { updateCalEvent } from '@/services/oms/bases'

// Props and Emits for v-model
const props = defineProps<{
  modelValue: boolean;
  event: CalEvent | null;
}>();
const emit = defineEmits(['update:modelValue']);

const { t } = useI18n();
const formRef = ref<FormInstance>();

// Form data refs
const formData = ref({
  eventName: '',
  eventDescription: '',
  eventNameEn: '',
  eventDescriptionEn: '',
  eventDate: null as Date | null,
  eventType: null as number | null,
});

// Watch for the event prop to change and update the form data
watch(() => props.event, (newEvent) => {
  if (newEvent) {
    formData.value = {
      eventName: newEvent.calName,
      eventDescription: newEvent.calDesc,
      eventNameEn: newEvent.calEngName,
      eventDescriptionEn: newEvent.calEngDesc,
      eventDate: newEvent.calDate ? new Date(newEvent.calDate) : null,
      eventType: newEvent.calType,
    };
  }
}, { immediate: true });


const rules = computed((): FormRules => {
  return {
    eventName: [{ required: true, message: t('calendar.addEventDialog.name') + ' is required', trigger: 'blur' }],
    eventDate: [{ required: true, message: t('calendar.addEventDialog.eventDate') + ' is required', trigger: 'change' }],
    eventType: [{ required: true, message: t('calendar.addEventDialog.type') + ' is required', trigger: 'change' }],
  };
});

const eventTypeOptions = computed(() => [
  { value: 0, label: t('calendar.addEventDialog.types.system') },
  { value: 1, label: t('calendar.addEventDialog.types.national') },
]);

// Computed property to control dialog visibility
const isVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const closeDialog = () => {
  formRef.value?.resetFields();
  isVisible.value = false;
};

const formatDate = (date: Date | null): string | null => {
  if (!date) return null;
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const handleConfirm = async () => {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid) => {
    if (valid) {
      const updateRes = await updateCalEvent({
        calId: props.event?.calId,
        calName: formData.value.eventName,
        calDesc: formData.value.eventDescription,
        calEngName: formData.value.eventNameEn,
        calEngDesc: formData.value.eventDescriptionEn,
        calDate: formatDate(formData.value.eventDate) ?? '1970-01-01',
        calType: formData.value.eventType ?? 0,
      })
      if (updateRes === '00000') {
        ElNotification({
          title: t('notice.noticeTitle'),
          message: t('notice.updateCalendarSuccessMsg'),
          type: 'success'
        });
        location.reload(); // Consider updating data without a full reload
      } else if (updateRes === '99006') {
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
  });
};
</script>

<template>
  <el-dialog
    v-model="isVisible"
    :title="t('calendar.updateEventDialog.title')"
    width="500px"
    :close-on-click-modal="true"
    @close="closeDialog"
  >
    <el-form ref="formRef" :model="formData" :rules="rules" label-position="top">
      <el-form-item :label="t('calendar.addEventDialog.name')" prop="eventName">
        <el-input
          v-model="formData.eventName"
          :placeholder="t('calendar.addEventDialog.name')"
          maxlength="50"
          show-word-limit
        />
      </el-form-item>
      <el-form-item :label="t('calendar.addEventDialog.description')" prop="eventDescription">
        <el-input
          v-model="formData.eventDescription"
          type="textarea"
          :rows="4"
          :placeholder="t('calendar.addEventDialog.description')"
        />
      </el-form-item>
      <el-form-item :label="t('calendar.addEventDialog.nameEn')" prop="eventNameEn">
        <el-input
          v-model="formData.eventNameEn"
          :placeholder="t('calendar.addEventDialog.nameEn')"
          maxlength="100"
          show-word-limit
        />
      </el-form-item>
      <el-form-item :label="t('calendar.addEventDialog.descriptionEn')" prop="eventDescriptionEn">
        <el-input
          v-model="formData.eventDescriptionEn"
          type="textarea"
          :rows="4"
          :placeholder="t('calendar.addEventDialog.descriptionEn')"
        />
      </el-form-item>
      <el-form-item :label="t('calendar.addEventDialog.eventDate')" prop="eventDate">
        <el-date-picker
          v-model="formData.eventDate"
          type="date"
          :placeholder="t('calendar.addEventDialog.eventDate')"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item :label="t('calendar.addEventDialog.type')" prop="eventType">
        <el-select v-model="formData.eventType" :placeholder="t('calendar.addEventDialog.type')" style="width: 100%">
          <el-option
            v-for="item in eventTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">{{ t('general.cancel') }}</el-button>
        <el-button type="primary" @click="handleConfirm">
          {{ t('calendar.updateEventDialog.update') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.add-event-form {
  padding: 20px;
}
</style>
