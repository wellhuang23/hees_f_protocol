<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const dialogVisible = defineModel<boolean>('dialogVisible', { required: true })

const handleCancel = () => {
  dialogVisible.value = false
}

const handleConfirm = () => {
  console.log('ADD NEW UNIT')
  dialogVisible.value = false
}
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="t('comStr.addUnitTitle')"
    width="30%"
    :before-close="handleCancel"
  >
    <span>{{ t('comStr.addUnitContent') }}</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="info" @click="handleCancel">{{ t('general.cancel') }}</el-button>
        <el-button type="primary" @click="handleConfirm">{{ t('general.confirm') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped></style>
