<script setup lang="ts">
import { reactive, ref } from 'vue' // Import 'ref'
import type {
  FormInstance,
  FormRules
} from 'element-plus'

// Import icons
import { OfficeBuilding, User, Lock } from '@element-plus/icons-vue'
import { logInAction } from '@/services'
import { ElNotification } from 'element-plus'
import { useRouter } from 'vue-router'

// Ref for the form instance
const formRef = ref<FormInstance>()

const router = useRouter()

const logInForm = reactive({
  comTaxNo: '',
  user: '',
  pwd: ''
})

// Validate Company Tax No.
const comTaxNoValidator = (_rule: any, value: any, callback: any) => {
  // Assuming a valid Taiwan Uniform Invoice Number is 8 digits
  if (value === '' || value.length !== 8 || !/^\d+$/.test(value)) { // Added check for digits only
    callback(new Error('請輸入正確的統一編號 (8位數字)'))
  } else {
    callback()
  }
}

// Validate User (Email)
const userValidator = (_rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('請輸入登入 Email'))
  } else if (value === 'admin') {
    // 'admin' is a special case and doesn't need email format validation
    callback();
  } else {
    // A more robust regex for email validation (can be adjusted)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(value)) {
      callback(new Error('請輸入正確的 Email 格式 (例如: your@example.com)'))
    } else {
      callback()
    }
  }
}

// Validate Password
const pwdValidator = (_rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('請輸入密碼'))
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
      console.log('表單提交成功！', logInForm)
      logInAction({
        comTaxNo: logInForm.comTaxNo,
        user: logInForm.user,
        pwd: logInForm.pwd,
        deviceType: 0
      }).then((result) => {
        if (result === '00000') {
          ElNotification({
            title: '通知',
            message: '登入成功',
            type: 'success'
          })
          router.push('/')
        } else if (result === '02001') {
          ElNotification({
            title: '通知',
            message: '查無此用戶',
            type: 'error'
          })
        } else if (result === '02002') {
          ElNotification({
            title: '通知',
            message: '密碼輸入錯誤',
            type: 'error'
          })
        } else {
          ElNotification({
            title: '通知',
            message: '系統錯誤，請洽系統管理員',
            type: 'error'
          })
        }
      })
      // Here you would typically send logInForm data to your backend
    } else {
      console.log('表單驗證失敗，請檢查輸入。')
    }
  } catch (error) {
    console.error('驗證過程中發生錯誤:', error)
  }
}
</script>

<template>
  <div class="logInPage">
    <el-form :model="logInForm" class="logInContainer" ref="formRef" :rules="rules">
      <h1 class="logInTitle">歡迎使用 HEEs 系統</h1>
      <el-form-item prop="comTaxNo">
        <el-input
            type="text"
            placeholder="請輸入貴公司統一編號"
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
            placeholder="請輸入登入 Email"
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
          placeholder="請輸入登入密碼"
          v-model="logInForm.pwd"
          :show-password="true"
        >
          <template #prefix>
            <el-icon class="el-input__icon"><Lock /></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit()">登入</el-button> </el-form-item>
    </el-form>
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

  .logInContainer {
    width: 400px;
    background-color: #fff;
    border: 1px solid #eaeaea;
    border-radius: 15px;
    padding: 35px 35px 15px 35px;
    box-shadow: 0 0 25px #cacaca;
    // margin: 250px auto; /* This can push it down. Remove or adjust if you want it vertically centered by flexbox */

    .logInTitle {
      text-align: center;
      margin-bottom: 20px; // Add some spacing below the title
    }
    :deep(.el-form-item__content) {
      justify-content: center;
    }
  }
}
</style>