<template>
  <el-dialog
      :model-value="visible"
      :title="t('comJP.addJobPositionTitle')"
      @close="closeDialog"
      width="500px"
  >
    <el-form :model="form" :rules="rules" ref="formRef" label-position="top">
      <el-form-item :label="t('comJP.addJobPosNameLabel')" prop="title">
        <el-input v-model="form.title" :maxlength="20" show-word-limit ></el-input>
      </el-form-item>
      <el-form-item :label="t('comJP.addJobPosLevelLabel')">
        <el-input v-model="form.level" :maxlength="10" show-word-limit ></el-input>
      </el-form-item>
      <el-form-item :label="t('comJP.addJobPosDescLabel')">
        <el-input v-model="form.desc" type="textarea" :rows="4"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="submitForm">{{ t('general.confirm') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import {ElNotification, type FormInstance, type FormRules} from 'element-plus';
import { createComJobPositions } from '@/services'

const { t } = useI18n();

defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['close']);

const formRef = ref<FormInstance>();

const form = reactive({
  title: '',
  level: '',
  desc: '',
});

const rules = reactive<FormRules>({
  title: [
    { required: true, message: 'Please input title', trigger: 'blur' },
    { min: 1, max: 50, message: 'Length should be 1 to 50', trigger: 'blur' },
  ],
});

const closeDialog = () => {
  form.title = ''
  form.level = ''
  form.desc = ''
  emit('close');
};

const submitForm = async () => {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid) => {
    if (valid) {
      const createRes = await createComJobPositions({
        jobPosName: form.title,
        jobPosLevel: form.level,
        jobPosDesc: form.desc
      })
      if (createRes === '00000') {
        ElNotification({
          title: t('notice.noticeTitle'),
          message: t('notice.createComJobPositionSuccessMsg'),
          type: 'success'
        });
        closeDialog()
      } else if (createRes === '99006') {
        ElNotification({
          title: t('notice.noticeTitle'),
          message: t('notice.createComJobPositionNoPerErrorMsg'),
          type: 'error'
        });
      } else {
        ElNotification({
          title: t('notice.noticeTitle'),
          message: t('notice.createComJobPositionErrorMsg'),
          type: 'error'
        });
      }
    }
  });
};
</script>

<style scoped>
.dialog-footer {
  text-align: center;
  display: block;
}
</style>
