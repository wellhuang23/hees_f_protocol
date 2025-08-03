<script setup lang="ts">
import {computed, onMounted, reactive, ref} from 'vue'
import {useI18n} from 'vue-i18n'
import type {UserInfo} from '@/interfaces'
import {
  useUserInfoStore,
  useValidComStore,
  useComStrUnitStore,
  useComJobPositionStore,
} from '@/stores'
import {ElNotification, type FormInstance, type FormRules} from 'element-plus'
import {
  getComJobPositions,
  getComStrUnits,
  changeGenUserPwd,
  updateUser,
} from "@/services";
import {storeToRefs} from "pinia";
import UserChangePwdConfirm from '@/components/oms/UserChangePwdConfirm.vue'
import userDelMember from '@/components/oms/UserDelMember.vue'

const validComStore = useValidComStore()
const userInfo = useUserInfoStore()
const comStrUnitStore = useComStrUnitStore()
const comJobPositionStore = useComJobPositionStore()

const { allComStrUnits: allComStrUnits } = storeToRefs(comStrUnitStore)
const { comJobPositions: comJobPositions } = storeToRefs(comJobPositionStore)

const comTaxNo = validComStore.currentCom.comTaxNo
const perUpdateUser = comTaxNo + '-oms-008-0010'
const perDeleteUser = comTaxNo + '-oms-008-0001'

const isEditing = ref(false)
const editingRow = ref<UserInfo | null>(null)
const editFormRef = ref<FormInstance>()

const props = defineProps({
  users: {
    type: Array as () => UserInfo[],
    required: true
  },
  category: {
    required: true
  }
})

const { t, locale } = useI18n()

const emit = defineEmits(['refresh-users']);
const editForm = reactive({
  userName: '',
  userNo: '',
  userStName: '',
  email: '',
  strUnits: [] as number[],
  jobPositions: [] as number[],
  dynamicData: {} as Record<string, any>
});
const detailDataIds = ref([] as number[])

const editFormRules = computed<FormRules>(() => {
  const rules: FormRules = {
    userName: [{ required: true, message: t('user.userList.userName') + t('user.userList.require'), trigger: 'blur' }],
    userStName: [{ required: true, message: t('user.userList.userStName') + t('user.userList.require'), trigger: 'blur' }],
    email: [{ required: true, message: t('user.userList.email') + t('user.userList.require'), trigger: 'blur' }],
  };

  if (editingRow.value && editingRow.value.detailInfo) {
    editingRow.value.detailInfo.forEach(item => {
      if (item.colRequire) {
        rules[`dynamicData.${item.userDataId}`] = [{
          required: true,
          message: `${item.colName} ${t('user.userList.require')}`,
          trigger: 'change'
        }];
      }
    });
  }
  return rules;
});

const showStrUnits = (row: UserInfo) => {
  let strUnits = ''
  const data = row.strUnits
  const len = data.length
  if (len !== 0) {
    for (let i = 0; i < len; i++) {
      if (i < len - 1) {
        strUnits = locale.value === 'zh-TW'
            ? strUnits + `${data[i].strUnitName}(${data[i].strUnitNo})、`
            : strUnits + `${data[i].strUnitEngName}(${data[i].strUnitNo}), `
      } else {
        strUnits = locale.value === 'zh-TW'
            ? strUnits + `${data[i].strUnitName}(${data[i].strUnitNo})`
            : strUnits + `${data[i].strUnitEngName}(${data[i].strUnitNo})`
      }
    }
  }
  return strUnits
}

const showJobPositions = (row: UserInfo) => {
  let jobPositions = ''
  const data = row.jobPositions
  const len = data.length
  if (len !== 0) {
    for (let i = 0; i < len; i++) {
      if (i < len - 1) {
        jobPositions = locale.value === 'zh-TW'
            ? jobPositions + `${data[i].jobPosName}(${data[i].jobPosLevel})、`
            : jobPositions + `${data[i].jobPosEngName}(${data[i].jobPosLevel}), `
      } else {
        jobPositions = locale.value === 'zh-TW'
            ? jobPositions + `${data[i].jobPosName}(${data[i].jobPosLevel})`
            : jobPositions + `${data[i].jobPosEngName}(${data[i].jobPosLevel})`
      }
    }
  }
  return jobPositions
}

const showChangePwdDialog = ref(false)
const userPwd = ref('')

const validUpdate = () => {
  return !!userInfo.per0010.includes(perUpdateUser);
}

const changeUserPwd = async (userId: number) => {
  const res = await changeGenUserPwd(userId)
  if (res.errno === '00000') {
    userPwd.value = res.userNewPwd ?? ''
    showChangePwdDialog.value = true
    isEditing.value = false

    ElNotification({
      title: t('notice.noticeTitle'),
      message: t('notice.updateGenUserPwdSuccessMsg'),
      type: 'success'
    })
  } else {
    if (res.errno === '01001') {
      ElNotification({
        title: t('notice.noticeTitle'),
        message: t('notice.updateGenUserNoUserErrorMsg'),
        type: 'error'
      })
    } else {
      ElNotification({
        title: t('notice.noticeTitle'),
        message: t('notice.updateGenUserErrorMsg'),
        type: 'error'
      })
    }
  }
}

const selectedUser = ref<UserInfo | null>(null);
const isDelUserDialogVisible = ref(false);
const deleteClick = (row: UserInfo) => {
  selectedUser.value = row;
  isDelUserDialogVisible.value = true;
};

const startEditing = (row: UserInfo) => {
  editingRow.value = row;

  editForm.userName = row.userName;
  editForm.userNo = row.userNo;
  editForm.userStName = row.userStName;
  editForm.email = row.email;

  for (const strUnit of row.strUnits) {
    if (strUnit.strUnitId !== 0) {
      editForm.strUnits.push(strUnit.strUnitId)
    }
  }

  for (const jobPosition of row.jobPositions) {
    if (jobPosition.jobPosId !== 0) {
      editForm.jobPositions.push(jobPosition.jobPosId)
    }
  }

  editForm.dynamicData = {};
  row.detailInfo.forEach(detailRow => {
    editForm.dynamicData[detailRow.userDataId] = detailRow.data;
    detailDataIds.value.push(detailRow.userDataId)
  });

  isEditing.value = true;
}

const detailType = (colType: number) => {
  if (colType === 1) {
    return 'number'
  } else if (colType === 2) {
    return 'number'
  } else if (colType === 3) {
    return 'date'
  } else if (colType === 4) {
    return 'datetime'
  } else {
    return 'text'
  }
}

const handleInputChange = (value: any, item: any) => {
  const userDataId = item.userDataId;
  if (item.colType === 3) { // date
    editForm.dynamicData[userDataId] = value ? new Date(value).toISOString().slice(0, 10) : '';
  } else if (item.colType === 4) { // datetime-local
    editForm.dynamicData[userDataId] = value ? new Date(value).toISOString().slice(0, 19).replace('T', ' ') : '';
  } else {
    editForm.dynamicData[userDataId] = value;
  }
}

const dateTimeFormat = (colType: number) => {
  if (colType === 3) {
    return 'YYYY-MM-DD'
  } else {
    return 'YYYY-MM-DD HH:mm:ss'
  }
}

const cancelEditing = () => {
  isEditing.value = false
  editingRow.value = null
  editForm.strUnits = []
  editForm.jobPositions = []
  if (editFormRef.value) {
    editFormRef.value.clearValidate()
  }
  detailDataIds.value = []
}

const updateUserInfo = async (userId: number) => {
  const strUnits = []
  for (const strUnit of editForm.strUnits) {
    strUnits.push({
      strUnitId: strUnit,
      strUnitName: '',
      strUnitEngName: '',
      strUnitNo: ''
    })
  }
  const jobPositions = []
  for (const jobPosition of editForm.jobPositions) {
    jobPositions.push({
      jobPosId: jobPosition,
      jobPosName: '',
      jobPosEngName: '',
      jobPosLevel: ''
    })
  }
  const details = []
  for (const userDataId of detailDataIds.value) {
    details.push({
      userDataId: userDataId,
      data: editForm.dynamicData[userDataId],
      colId: 0,
    })
  }

  const updateRes = await updateUser({
    userType: 3,
    userId: userId,
    userName: editForm.userName,
    userNo: editForm.userNo,
    userStName: editForm.userStName,
    email: editForm.email,
    jobPositions: jobPositions,
    strUnits: strUnits,
    detailInfo: details
  })
  if (updateRes === '00000') {
    ElNotification({
      title: t('notice.noticeTitle'),
      message: t('notice.updateUserSuccessMsg'),
      type: 'success'
    });
    isEditing.value = false
    emit('refresh-users');
  } else if (updateRes === '99006') {
    ElNotification({
      title: t('notice.noticeTitle'),
      message: t('notice.updateUserNoPerErrorMsg'),
      type: 'error'
    });
  } else {
    ElNotification({
      title: t('notice.noticeTitle'),
      message: t('notice.updateUserErrorMsg'),
      type: 'error'
    });
  }
}

const expandedRows = ref<string[]>([])
const rowClick = (row: UserInfo) => {
  // If we are currently editing, and the user clicks a different row, cancel the edit.
  if (isEditing.value) {
    cancelEditing();
  }

  // Proceed with the normal expand/collapse logic.
  if (userInfo.per0010.includes(perUpdateUser)) {
    if (expandedRows.value.includes(row.userNo)) {
      expandedRows.value = expandedRows.value.filter(item => item !== row.userNo)
    } else {
      expandedRows.value.push(row.userNo)
    }
  }
}

const handleExpandChange = () => {
  if (isEditing.value) {
    cancelEditing()
  }
}

onMounted(async () => {
  await getComStrUnits()
  await getComJobPositions()
})
</script>

<template>
  <div>
    <h2>{{ props.category }}</h2>
    <div class="table-wrapper">
      <el-table
        :data="props.users"
        stripe
        style="width: 100%"
        :expand-row-keys="expandedRows"
        :row-key="(row: UserInfo) => row.userId"
        @row-click="rowClick"
        @expand-change="handleExpandChange"
        show-overflow-tooltip
      >
        <el-table-column type="expand">
          <template #default="props">
            <div>
              <h2 class="title">{{ t('user.userList.fullInfo') }}</h2>
              <div class="action-btn" >
                <el-button v-if="!isEditing && validUpdate()" type="warning" @click="startEditing(props.row)">
                  {{ t('user.userList.updateBtn') }}
                </el-button>
              </div>
              <!-- Display Mode -->
              <div v-if="!isEditing" class="info-display">
                <h3 class="title">{{ t('user.userList.basicInfo') }}</h3>
                <div class="field">
                  <p class="field-label">{{ t('user.userList.userName') }}</p>
                  <p class="field-value">{{ props.row.userName }}</p>
                </div>
                <div class="field">
                  <p class="field-label">{{ t('user.userList.userNo') }}</p>
                  <p class="field-value">{{ props.row.userNo }}</p>
                </div>
                <div class="field">
                  <p class="field-label">{{ t('user.userList.userStName') }}</p>
                  <p class="field-value">{{ props.row.userStName }}</p>
                </div>
                <div class="field">
                  <p class="field-label">{{ t('user.userList.email') }}</p>
                  <p class="field-value">{{ props.row.email }}</p>
                </div>
                <el-divider />
                <h3 class="title">{{ t('user.userList.orgInfo') }}</h3>
                <div class="field">
                  <p class="field-label">{{ t('user.userList.orgStrUnits') }}</p>
                  <p class="field-value">{{ showStrUnits(props.row) }}</p>
                </div>
                <div class="field">
                  <p class="field-label">{{ t('user.userList.orgJobPositions') }}</p>
                  <p class="field-value">{{ showJobPositions(props.row) }}</p>
                </div>
                <div v-if="props.row.detailInfo.length > 0">
                  <el-divider />
                  <h3 class="title">{{ t('user.userList.detailInfo') }}</h3>
                  <div class="field" v-for="detail of props.row.detailInfo" :key="detail.userDataId">
                    <p class="field-label">{{ detail.colName }}</p>
                    <p class="field-value">{{ detail.data }}</p>
                  </div>
                </div>
              </div>
              <!-- Edit Mode -->
              <div v-else class="info-edit">
                <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-position="top">
                  <h3 class="title">{{ t('user.userList.basicInfo') }}</h3>
                  <el-form-item :label="t('user.userList.userName')" prop="userName">
                    <el-input v-model="editForm.userName" :maxlength="30" show-word-limit />
                  </el-form-item>
                  <el-form-item :label="t('user.userList.userNo')" prop="userNo">
                    <el-input v-model="editForm.userNo" :maxlength="30" show-word-limit />
                  </el-form-item>
                  <el-form-item :label="t('user.userList.userStName')" prop="userStName">
                    <el-input v-model="editForm.userStName" :maxlength="20" show-word-limit />
                  </el-form-item>
                  <el-form-item :label="t('user.userList.email')" prop="email">
                    <el-input v-model="editForm.email" />
                  </el-form-item>
                  <el-divider />
                  <h3 class="title">{{ t('user.userList.orgInfo') }}</h3>
                  <el-form-item :label="t('user.userList.orgStrUnits')" prop="strUnits">
                    <el-select
                        v-model="editForm.strUnits"
                        multiple
                        placeholder="Select"
                        style="width: 100%"
                    >
                      <el-option
                          v-for="item in allComStrUnits"
                          :key="item.strUnitId"
                          :label="item.strUnitNo + '-' + item.strUnitName"
                          :value="item.strUnitId"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item :label="t('user.userList.orgJobPositions')" prop="jobPositions">
                    <el-select
                        v-model="editForm.jobPositions"
                        multiple
                        placeholder="Select"
                        style="width: 100%"
                    >
                      <el-option
                          v-for="item in comJobPositions"
                          :key="item.jobPosId"
                          :label="item.jobPosName + '(' + item.jobPosLevel + ')'"
                          :value="item.jobPosId"
                      />
                    </el-select>
                  </el-form-item>
                  <div v-if="editingRow && editingRow.detailInfo.length > 0">
                    <el-divider />
                    <h3 class="title">{{ t('user.userList.detailInfo') }}</h3>
                    <el-form-item
                        v-for="item of editingRow.detailInfo"
                        :key="item.userDataId"
                        :label="item.colName"
                        :prop="`dynamicData.${item.userDataId}`"
                    >
                      <el-input
                          v-if="[0, 1, 2].includes(item.colType ?? 0)"
                          :type="detailType(item.colType ?? 0)"
                          v-model="editForm.dynamicData[item.userDataId]"
                          @change="(value: any) => handleInputChange(value, item)"
                      />
                      <el-date-picker
                          v-if="[3, 4].includes(item.colType ?? 3)"
                          :type="detailType(item.colType ?? 3)"
                          v-model="editForm.dynamicData[item.userDataId]"
                          @change="(value: any) => handleInputChange(value, item)"
                          :value-format="dateTimeFormat(item.colType ?? 3)"
                          style="width: 100%"
                      />
                    </el-form-item>
                  </div>
                  <div class="edit-actions">
                    <div>
                      <el-button
                          type="warning"
                          @click="changeUserPwd(props.row.userId)"
                          v-if="![0, 1, 2].includes(userInfo.userType)"
                      >
                        {{ t('user.userList.changePwdBtn') }}
                      </el-button>
                      <el-button
                          v-if="userInfo.per0001.includes(perDeleteUser) && ![0, 1, 2].includes(userInfo.userType)"
                          type="danger"
                          @click="deleteClick(props.row)"
                      >
                        {{ t('user.userList.deleteUserBtn') }}
                      </el-button>
                    </div>
                    <div>
                      <el-button type="info" @click="cancelEditing">
                        {{ t('user.userList.cancelBtn') }}
                      </el-button>
                      <el-button type="primary" @click="updateUserInfo(props.row.userId)">
                        {{ t('user.userList.confirmBtn') }}
                      </el-button>
                    </div>
                  </div>
                </el-form>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="userNo" :label="t('user.userList.userNo')" />
        <el-table-column prop="userName" :label="t('user.userList.userName')" />
        <el-table-column prop="userStName" :label="t('user.userList.userStName')" />
        <el-table-column prop="email" :label="t('user.userList.email')" />
      </el-table>
    </div>
    <user-change-pwd-confirm v-if="showChangePwdDialog" v-model="showChangePwdDialog" :userPwd="userPwd" />
    <user-del-member v-if="isDelUserDialogVisible" v-model="isDelUserDialogVisible" :event="selectedUser" />
  </div>
</template>

<style scoped lang="scss">
.title {
  padding-top: 10px;
  padding-bottom: 10px;
}

.action-btn {
  display: flex;
  justify-content: flex-end;
}

.table-wrapper {
  overflow-x: auto;
  flex-grow: 1;
}

:deep(.el-table .cell) {
  white-space: nowrap;
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

.edit-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.required-marker {
  color: red;
}
</style>