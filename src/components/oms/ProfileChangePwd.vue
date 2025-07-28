<script setup lang="ts">
import { reactive, ref } from 'vue'
import {ElNotification, type FormInstance, type FormRules} from 'element-plus'
import {useI18n} from 'vue-i18n'
import { changeGenUserPwdSelf } from '@/services'

const { t } = useI18n();

const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive({
  currentPwd: '',
  newPwd: '',
  confirmPwd: ''
})

const validatePass = (_rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error(t('profile.org.chPwdNewPwdConfirmTip')))
  } else if (value !== ruleForm.newPwd) {
    callback(new Error(t('profile.org.chPwdNewPwdConfirmSameTip')))
  } else {
    callback()
  }
}

const rules = reactive<FormRules>({
  currentPwd: [
    { required: true, message: () => t('profile.org.chPwdCurrentPwdTip'), trigger: 'blur' }
  ],
  newPwd: [
    { required: true, message: () => t('profile.org.chPwdNewPwdTip'), trigger: 'blur' }
  ],
  confirmPwd: [
    { required: true, validator: validatePass, trigger: 'blur' }
  ]
})

const submitForm = async () => {
  if (!ruleFormRef.value) return;
  try {
    await ruleFormRef.value.validate();
    if (ruleForm.currentPwd === ruleForm.newPwd) {
      ElNotification({
        title: t('notice.noticeTitle'),
        message: t('profile.pwd.chPwdSameTip'),
        type: 'error'
      });
    } else {
      const res = await changeGenUserPwdSelf(ruleForm.currentPwd, ruleForm.newPwd);
      if (res === '00000') {
        ElNotification({
          title: t('notice.noticeTitle'),
          message: t('notice.updateProfilePwdSuccessMsg'),
          type: 'success'
        });
        ruleForm.currentPwd = ''
        ruleForm.newPwd = ''
        ruleForm.confirmPwd = ''
      } else if (res === '02002') {
        ElNotification({
          title: t('notice.noticeTitle'),
          message: t('notice.updateProfileCurrentErrorMsg'),
          type: 'error'
        });
      } else {
        ElNotification({
          title: t('notice.noticeTitle'),
          message: t('notice.updateProfileErrorMsg'),
          type: 'error'
        });
      }
    }
  } catch (error) {
    ElNotification({
      title: t('notice.noticeTitle'),
      message: t('notice.updateProfileErrorMsg'),
      type: 'error'
    });
  }
}
</script>

<template>
  <h2>{{ t('profile.pwd.changePwdTitle') }}</h2>
  <div class="form-container">
    <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="240px"
        label-position="top"
        class="password-form"
        status-icon
    >
      <el-form-item :label="t('profile.pwd.chPwdCurrentPwd')" prop="currentPwd">
        <el-input v-model="ruleForm.currentPwd" type="password" show-password />
      </el-form-item>
      <el-form-item :label="t('profile.pwd.chPwdNewPwd')" prop="newPwd">
        <el-input v-model="ruleForm.newPwd" type="password" show-password />
      </el-form-item>
      <el-form-item :label="t('profile.pwd.chPwdNewPwdConfirm')" prop="confirmPwd">
        <el-input v-model="ruleForm.confirmPwd" type="password" show-password />
      </el-form-item>
      <el-form-item>
        <div class="form-actions">
          <el-button type="primary" @click="submitForm">{{ t('profile.pwd.confirm') }}</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped lang="scss">
.form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 210px);
  width: 100%;
}

.password-form {
  width: 400px;
}

.form-actions {
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>
