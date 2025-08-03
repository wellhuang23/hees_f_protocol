<script setup lang="ts">
import { defineProps, defineEmits, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElDialog, ElButton } from 'element-plus'

const { t } = useI18n()

const props = defineProps<{
  adminPwd: string
}>()

const emit = defineEmits(['confirm', 'update:modelValue'])

const dialogVisible = ref(true)

const handleConfirm = () => {
  emit('confirm')
  emit('update:modelValue', false)
  dialogVisible.value = false
}
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="t('subChangeGroupAdminPwdConfirm.title')"
    width="30%"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    center
  >
    <template #header="{ titleId, titleClass }">
      <div class="my-header">
        <h4 :id="titleId" :class="titleClass">{{ t('subChangeGroupAdminPwdConfirm.title') }}</h4>
      </div>
    </template>
    <div class="dialog-content">
      <p>{{ props.adminPwd }}</p>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="handleConfirm">
          {{ t('general.confirm') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
.my-header {
  display: flex;
  justify-content: flex-start;
  padding-left: 20px;
}

.dialog-content {
  text-align: center;
  font-size: 1.2em;
  margin-bottom: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  padding-right: 20px;
}
</style>
