<script setup lang="ts">
import type { UserInfo } from '@/interfaces'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import { updateProfileBasic } from '@/services'
import {ElNotification} from "element-plus";

const { t } = useI18n();

const props = defineProps({
  userInfo: {
    type: Object as () => UserInfo | null,
    require: true
  }
})

const editableUserStName = ref(props.userInfo?.userStName)

const confirmChanges = async () => {
  const originUserStName = props.userInfo?.userStName ?? 'unassigned'
  const newUserStName = editableUserStName.value ?? originUserStName
  const res = await updateProfileBasic(newUserStName)
  if (res === '00000') {
    ElNotification({
      title: t('notice.noticeTitle'),
      message: t('notice.updateProfileBasicSuccessMsg'),
      type: 'success'
    });
  } else {
    ElNotification({
      title: t('notice.noticeTitle'),
      message: t('notice.updateProfileBasicErrorMsg'),
      type: 'error'
    });
  }
}
</script>

<template>
  <div class="info-display">
    <div class="field">
      <p class="field-label">{{ t('profile.basic.colUserName') }}</p>
      <p class="field-value">{{ props.userInfo?.userName }}</p>
    </div>
    <div class="field">
      <label class="field-label" for="groupNameInput">{{ t('profile.basic.colUserStName') }}</label>
      <el-input id="groupNameInput" v-model="editableUserStName" :maxlength="30" show-word-limit />
    </div>
    <div class="field">
      <p class="field-label">{{ t('profile.basic.colUserNo') }}</p>
      <p class="field-value">{{ props.userInfo?.userNo }}</p>
    </div>
    <div class="field">
      <p class="field-label">{{ t('profile.basic.colUserEmail') }}</p>
      <p class="field-value">{{ props.userInfo?.email }}</p>
    </div>
    <div class="edit-actions">
      <el-button type="primary" @click="confirmChanges">{{ t('profile.basic.modifyBtn') }}</el-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.field {
  margin-bottom: 1rem;
}

.field-label, label {
  font-weight: bold;
  margin: 0 0 0.5rem 0;
  display: block;
}

.field-value, input, textarea {
  margin: 0;
  padding: 0;
  // This is a key part for alignment.
  // We assume the labels won't be excessively long.
  // A more robust solution might use JS or a CSS grid if labels vary wildly.
  text-indent: 0; // Reset default indentation
}

.field-value {
  white-space: pre-wrap;
  padding-left: 1rem; /* Indent the value to align */
}

input, textarea {
  width: calc(100% - 1rem); /* Adjust width to account for padding */
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-left: 1rem; /* Indent the input to align */
  box-sizing: border-box;
}

.edit-actions {
  display: flex;
  justify-content: flex-end;
  align-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}
</style>