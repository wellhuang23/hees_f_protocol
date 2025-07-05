<script setup lang="ts">
import { reactive, ref } from 'vue' // Import 'ref'
import type {
  FormInstance,
  FormRules
} from 'element-plus'
import BottomSign from '@/components/BottomSign.vue'

// Import icons
import { OfficeBuilding, User, Lock } from '@element-plus/icons-vue'
import { logInAction } from '@/services'
import { ElNotification } from 'element-plus'
import { useRouter } from 'vue-router'
import { changeLanguage } from '@/services/general/changeLang'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
// Ref for the form instance
const formRef = ref<FormInstance>()

const router = useRouter()

const logInForm = reactive({
  comTaxNo: '',
  user: '',
  pwd: ''
})

const handleSelect = (index: string) => {
  if (index === '1_1') {
    changeLanguage('zh-TW')
  } else if (index === '1_2') {
    changeLanguage('en-US')
  }
}

// Validate Company Tax No.
const comTaxNoValidator = (_rule: any, value: any, callback: any) => {
  // Assuming a valid Taiwan Uniform Invoice Number is 8 digits
  if (value === '' || value.length !== 8 || !/^\d+$/.test(value)) { // Added check for digits only
    callback(new Error(t('logInPage.errHintComTaxNo')))
  } else {
    callback()
  }
}

// Validate User (Email)
const userValidator = (_rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error(t('logInPage.errHintUser')))
  } else if (value === 'admin') {
    // 'admin' is a special case and doesn't need email format validation
    callback();
  } else {
    // A more robust regex for email validation (can be adjusted)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(value)) {
      callback(new Error(t('logInPage.errHintUser')))
    } else {
      callback()
    }
  }
}

// Validate Password
const pwdValidator = (_rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error(t('logInPage.errHintPwd')))
  } else {
    callback()
  }
}

// Validation Rules
const rules = reactive<FormRules<typeof logInForm>>({
  comTaxNo: [{ validator: comTaxNoValidator, trigger: 'blur' }],
  user: [{ validator: userValidator, trigger: 'blur' }],
  pwd: [{ validator: pwdValidator, trigger: 'blur' }]
})


// Submit Form
const onSubmit = async () => { // Changed to async as validate returns a Promise
  if (!formRef.value) return // Use formRef.value

  try {
    const valid = await formRef.value.validate() // Await the validation
    if (valid) {
      logInAction({
        comTaxNo: logInForm.comTaxNo,
        user: logInForm.user,
        pwd: logInForm.pwd,
        deviceType: 0
      }).then((result) => {
        if (result === '00000') {
          ElNotification({
            title: t('notice.noticeTitle'),
            message: t('notice.logInSuccessMsg'),
            type: 'success'
          })
          router.push('/')
        } else if (result === '02001') {
          ElNotification({
            title: t('notice.noticeTitle'),
            message: t('notice.logInNoUserMsg'),
            type: 'error'
          })
        } else if (result === '02002') {
          ElNotification({
            title: t('notice.noticeTitle'),
            message: t('notice.logInWrongPwdMsg'),
            type: 'error'
          })
        } else if (result === '02005') {
          ElNotification({
            title: t('notice.noticeTitle'),
            message: t('notice.logInSubExpireMsg'),
            type: 'error'
          })
        } else {
          ElNotification({
            title: t('notice.noticeTitle'),
            message: t('notice.systemErrorMsg'),
            type: 'error'
          })
        }
      })
      // Here you would typically send logInForm data to your backend
    } else {
    }
  } catch (error) {
    ElNotification({
      title: t('notice.noticeTitle'),
      message: t('notice.logInValidateErrorMsg'),
      type: 'error'
    })
  }
}
</script>

<template>
  <div class="logInPage">
    <div class="language-selector">
      <el-menu
          :ellipsis="false"
          mode="horizontal"
          background-color="transparent"
          text-color="#fff"
          active-text-color="#ffd04b"
          @select="handleSelect"
      >
        <el-sub-menu index="1" class="hide-arrow">
          <template #title>
            <img src="/src/assets/icons/solid/globe.svg" alt="Language" class="globe" style="width: 20px; height: 20px;"/>
          </template>
          <el-menu-item index="1_1" style="color: black;">繁體中文</el-menu-item>
          <el-menu-item index="1_2" style="color: black;">English</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </div>
    <el-form :model="logInForm" class="logInContainer" ref="formRef" :rules="rules">
      <h1 class="logInTitle">{{ t('logInPage.title') }}</h1>
      <el-form-item prop="comTaxNo">
        <el-input
            type="text"
            :placeholder="t('logInPage.hintComTaxNo')"
            v-model="logInForm.comTaxNo"
        >
          <template #prefix>
            <el-icon class="el-input__icon">
              <OfficeBuilding />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="user">
        <el-input
            type="text"
            :placeholder="t('logInPage.hintUser')"
            v-model="logInForm.user"
        >
          <template #prefix>
            <el-icon class="el-input__icon">
              <User />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="pwd">
        <el-input
            type="password"
            :placeholder="t('logInPage.hintPwd')"
            v-model="logInForm.pwd"
            :show-password="true"
        >
          <template #prefix>
            <el-icon class="el-input__icon"><Lock /></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit()">{{ t('logInPage.submitBtn') }}</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div>
    <bottom-sign />
  </div>
</template>

<style scoped lang="scss">
.logInPage {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(to bottom, #142334, #6894c7);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  .language-selector {
    position: absolute;
    top: 10px;
    right: 10px;
    .el-menu {
      border-bottom: none;
        filter: invert(100%) sepia(100%) saturate(0%) hue-rotate(288deg) brightness(102%) contrast(102%);
      }
    }
  }

  .logInContainer {
    width: 400px;
    background-color: #fff;
    border: 1px solid #eaeaea;
    border-radius: 15px;
    padding: 35px 35px 15px 35px;
    box-shadow: 0 0 25px #cacaca;

    .logInTitle {
      text-align: center;
      margin-bottom: 20px;
    }
    :deep(.el-form-item__content) {
      justify-content: center;
    }
  }
</style>