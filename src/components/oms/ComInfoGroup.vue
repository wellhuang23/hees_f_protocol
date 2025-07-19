<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserInfoStore, useValidComStore } from '@/stores'
import { updateComInfo } from '@/services/oms/orgs'
import { convertToNumber } from '@/utils/conNumber.ts'
import {ElNotification} from "element-plus";

const { t } = useI18n()

const validComStore = useValidComStore();
const userInfo = useUserInfoStore();
const comTaxNo = validComStore.currentCom.comTaxNo
const perUpdateCode = comTaxNo + '-oms-004-0010'

const validUpdate = () => {
  return !!userInfo.per0010.includes(perUpdateCode);
}

const props = defineProps({
  info: {
    type: Object,
    require: true
  }
})

const isEditing = ref(false)
const editableGroupName = ref('')
const editableGroupDesc = ref('')

const startEditing = () => {
  editableGroupName.value = props.info?.groupName
  editableGroupDesc.value = props.info?.groupDesc
  isEditing.value = true
}

const cancelEditing = () => {
  isEditing.value = false
}

const confirmChanges = async () => {
  const updateRes = await updateComInfo({
    comId: convertToNumber(props.info?.comId) ?? 0,
    comName: props.info?.comName,
    comStName: props.info?.comStName,
    comTaxNo: props.info?.comTaxNo,
    comLeader: props.info?.comLeader,
    comPhone: props.info?.comPhone,
    comAddr: props.info?.comAddr,
    comDesc: props.info?.comDesc,
    comEngName: props.info?.comEngName,
    comEngAddr: props.info?.comEngAddr,
    groupId: convertToNumber(props.info?.groupId) ?? 0,
    groupName: editableGroupName.value,
    groupDesc: editableGroupDesc.value,
  })
  if (updateRes === '00000') {
    location.reload();
    ElNotification({
      title: t('notice.noticeTitle'),
      message: t('notice.updateGroupInfoSuccessMsg'),
      type: 'success'
    });
  } else if (updateRes === '99006') {
    ElNotification({
      title: t('notice.noticeTitle'),
      message: t('notice.updateGroupInfoNoPerErrorMsg'),
      type: 'error'
    });
  } else {
    ElNotification({
      title: t('notice.noticeTitle'),
      message: t('notice.updateGroupInfoErrorMsg'),
      type: 'error'
    });
  }
  isEditing.value = false
}
</script>

<template>
  <div class="group-info-container">
    <div class="header">
      <h3>{{ t('comInfo.groupInfo.title') }}</h3>
      <el-button v-if="!isEditing && validUpdate()" type="warning" @click="startEditing">
        {{ t('comInfo.groupInfo.modify') }}
      </el-button>
    </div>

    <!-- Display Mode -->
    <div v-if="!isEditing" class="info-display">
      <div class="field">
        <p class="field-label">{{ t('comInfo.groupInfo.groupName') }}</p>
        <p class="field-value">{{ props.info?.groupName }}</p>
      </div>
      <div class="field">
        <p class="field-label">{{ t('comInfo.groupInfo.groupDesc') }}</p>
        <p class="field-value">{{ props.info?.groupDesc }}</p>
      </div>
    </div>

    <!-- Edit Mode -->
    <div v-else class="info-edit">
      <div class="field">
        <label class="field-label" for="groupNameInput">{{ t('comInfo.groupInfo.groupName') }}</label>
        <input id="groupNameInput" v-model="editableGroupName" type="text" />
      </div>
      <div class="field">
        <label class="field-label" for="groupDescTextarea">{{ t('comInfo.groupInfo.groupDesc') }}</label>
        <textarea id="groupDescTextarea" v-model="editableGroupDesc" rows="5"></textarea>
      </div>
      <div class="edit-actions">
        <el-button type="info" @click="cancelEditing">{{ t('comInfo.groupInfo.cancel') }}</el-button>
        <el-button type="primary" @click="confirmChanges">{{ t('comInfo.groupInfo.confirm') }}</el-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.group-info-container {
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

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

textarea {
  vertical-align: top;
}

.edit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}
</style>