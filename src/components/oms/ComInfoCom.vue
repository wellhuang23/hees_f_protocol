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
const editableComName = ref('')
const editableComStName = ref('')
const editableComLeader = ref('')
const editableComPhone = ref('')
const editableComAddr = ref('')
const editableComDesc = ref('')
const editableComEngName = ref('')
const editableComEngAddr = ref('')

const startEditing = () => {
  editableComName.value = props.info?.comName
  editableComStName.value = props.info?.comStName
  editableComLeader.value = props.info?.comLeader
  editableComPhone.value = props.info?.comPhone
  editableComAddr.value = props.info?.comAddr
  editableComDesc.value = props.info?.comDesc
  editableComEngName.value = props.info?.comEngName
  editableComEngAddr.value = props.info?.comEngAddr
  isEditing.value = true
}

const cancelEditing = () => {
  isEditing.value = false
}

const confirmChanges = async () => {
  const updateRes = await updateComInfo({
    comId: convertToNumber(props.info?.comId) ?? 0,
    comName: editableComName.value,
    comStName: editableComStName.value,
    comTaxNo: props.info?.comTaxNo,
    comLeader: editableComLeader.value,
    comPhone: editableComPhone.value,
    comAddr: editableComAddr.value,
    comDesc: editableComDesc.value,
    comEngName: editableComEngName.value,
    comEngAddr: editableComEngAddr.value,
    groupId: convertToNumber(props.info?.groupId) ?? 0,
    groupName: props.info?.groupName,
    groupDesc: props.info?.groupDesc,
  })
  if (updateRes === '00000') {
    ElNotification({
      title: t('notice.noticeTitle'),
      message: t('notice.updateComInfoSuccessMsg'),
      type: 'success'
    });
  } else if (updateRes === '99006') {
    ElNotification({
      title: t('notice.noticeTitle'),
      message: t('notice.updateComInfoNoPerErrorMsg'),
      type: 'error'
    });
  } else {
    ElNotification({
      title: t('notice.noticeTitle'),
      message: t('notice.updateComInfoErrorMsg'),
      type: 'error'
    });
  }
  isEditing.value = false
}
</script>

<template>
  <div class="com-info-container">
    <div class="header">
      <h3>{{ t('comInfo.comInfo.title') }}</h3>
      <el-button v-if="!isEditing && validUpdate()" type="warning" @click="startEditing">
        {{ t('comInfo.comInfo.modify') }}
      </el-button>
    </div>

    <!-- Display Mode -->
    <div v-if="!isEditing" class="info-display">
      <div class="field">
        <p class="field-label">{{ t('comInfo.comInfo.comName') }}</p>
        <p class="field-value">{{ props.info?.comName }}</p>
      </div>
      <div class="field">
        <p class="field-label">{{ t('comInfo.comInfo.comStName') }}</p>
        <p class="field-value">{{ props.info?.comStName }}</p>
      </div>
      <div class="field">
        <p class="field-label">{{ t('comInfo.comInfo.comTaxNo') }}</p>
        <p class="field-value">{{ props.info?.comTaxNo }}</p>
      </div>
      <div class="field">
        <p class="field-label">{{ t('comInfo.comInfo.comLeader') }}</p>
        <p class="field-value">{{ props.info?.comLeader }}</p>
      </div>
      <div class="field">
        <p class="field-label">{{ t('comInfo.comInfo.comPhone') }}</p>
        <p class="field-value">{{ props.info?.comPhone }}</p>
      </div>
      <div class="field">
        <p class="field-label">{{ t('comInfo.comInfo.comAddr') }}</p>
        <p class="field-value">{{ props.info?.comAddr }}</p>
      </div>
      <div class="field">
        <p class="field-label">{{ t('comInfo.comInfo.comDesc') }}</p>
        <p class="field-value">{{ props.info?.comDesc }}</p>
      </div>
      <div class="field">
        <p class="field-label">{{ t('comInfo.comInfo.comEngName') }}</p>
        <p class="field-value">{{ props.info?.comEngName }}</p>
      </div>
      <div class="field">
        <p class="field-label">{{ t('comInfo.comInfo.comEngAddr') }}</p>
        <p class="field-value">{{ props.info?.comEngAddr }}</p>
      </div>
    </div>

    <!-- Edit Mode -->
    <div v-else class="info-edit">
      <div class="field">
        <label class="field-label" for="comNameInput">{{ t('comInfo.comInfo.comName') }}</label>
        <el-input id="comNameInput" v-model="editableComName" :maxlength="30" show-word-limit />
      </div>
      <div class="field">
        <label class="field-label" for="comStNameInput">{{ t('comInfo.comInfo.comStName') }}</label>
        <el-input id="comStNameInput" v-model="editableComStName" :maxlength="10" show-word-limit />
      </div>
      <div class="field">
        <p class="field-label">{{ t('comInfo.comInfo.comTaxNo') }}</p>
        <p class="field-value">{{ props.info?.comTaxNo }}</p>
      </div>
      <div class="field">
        <label class="field-label" for="comLeaderInput">{{ t('comInfo.comInfo.comLeader') }}</label>
        <el-input id="comLeaderInput" v-model="editableComLeader" :maxlength="30" show-word-limit />
      </div>
      <div class="field">
        <label class="field-label" for="comAddrInput">{{ t('comInfo.comInfo.comAddr') }}</label>
        <el-input id="comAddrInput" v-model="editableComAddr" />
      </div>
      <div class="field">
        <label class="field-label" for="comPhoneInput">{{ t('comInfo.comInfo.comPhone') }}</label>
        <el-input id="comPhoneInput" v-model="editableComPhone" :maxlength="20" show-word-limit />
      </div>
      <div class="field">
        <label class="field-label" for="comDescTextarea">{{ t('comInfo.comInfo.comDesc') }}</label>
        <el-input id="comDescTextarea" v-model="editableComDesc" type="textarea" rows="5"></el-input>
      </div>
      <div class="field">
        <label class="field-label" for="comEngNameInput">{{ t('comInfo.comInfo.comEngName') }}</label>
        <el-input id="comEngNameInput" v-model="editableComEngName" :maxlength="100" show-word-limit />
      </div>
      <div class="field">
        <label class="field-label" for="comEngAddrInput">{{ t('comInfo.comInfo.comEngAddr') }}</label>
        <el-input id="comEngAddrInput" v-model="editableComEngAddr" />
      </div>
      <div class="edit-actions">
        <el-button type="info" @click="cancelEditing">{{ t('comInfo.comInfo.cancel') }}</el-button>
        <el-button type="primary" @click="confirmChanges">{{ t('comInfo.comInfo.confirm') }}</el-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.com-info-container {
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