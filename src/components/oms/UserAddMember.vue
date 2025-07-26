<script setup lang="ts">
import {onMounted, reactive, ref, watch} from 'vue'
import { getUserInfoCols, getComStrUnits, getComJobPositions, createNewUser} from '@/services'
import {useUserInfoColsStore, useComStrUnitStore, useComJobPositionStore} from '@/stores'
import {storeToRefs} from 'pinia'
import {useI18n} from 'vue-i18n'
import {ElNotification, type FormRules} from 'element-plus'
import type {UserDetailInfo, UserInfoCol, UserJobPosition, UserStrUnit} from '@/interfaces'
import UserAddMemberConfirm from '@/components/oms/UserAddMemberConfirm.vue'

const { t } = useI18n()

const userInfoColsStore = useUserInfoColsStore()
const comStrUnitStore = useComStrUnitStore()
const comJobPositionStore = useComJobPositionStore()

const { userInfoCols: infoCols } = storeToRefs(userInfoColsStore)
const { allComStrUnits: allComStrUnits } = storeToRefs(comStrUnitStore)
const { comJobPositions: comJobPositions } = storeToRefs(comJobPositionStore)

const emit = defineEmits(['close']);

defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
})

const form = reactive({
  userName: '',
  userStName: '',
  userNo: '',
  email: '',
  comStrUnits: ref([]),
  comJobPositions: ref([])
});

const dynamicData = reactive<Record<string, any>>({});

watch(infoCols, (newInfoCols: UserInfoCol[]) => {
  if (newInfoCols) {
    newInfoCols.forEach(item => {
      if (dynamicData[item.colId] === undefined) {
        dynamicData[item.colId] = '';
      }
    });
  }
}, { deep: true });


const closeDialog = () => {
  emit('close');
  form.userName = ''
  form.userStName = ''
  form.userNo = ''
  form.email = ''
  form.comStrUnits = []
  form.comJobPositions = []
  Object.keys(dynamicData).forEach(key => {
    dynamicData[key] = '';
  });
}

const rules = reactive<FormRules>({
  userName: [
    { required: true, message: 'Please input Member Name', trigger: 'blur' },
    { min: 1, max: 30, message: 'Length should be 1 to 30', trigger: 'blur' },
  ],
  userStName: [
    { required: true, message: 'Please input Member Username', trigger: 'blur' },
    { min: 1, max: 30, message: 'Length should be 1 to 30', trigger: 'blur' },
  ],
  email: [
    { required: true, message: 'Please input Member Email', trigger: 'blur' },
    { min: 1, message: 'Email should not be Empty', trigger: 'blur' },
  ],
});

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

const dateTimeFormat = (colType: number) => {
  if (colType === 3) {
    return 'YYYY-MM-DD'
  } else {
    return 'YYYY-MM-DD HH:mm:ss'
  }
}

const showConfirmDialog = ref(false)
const userPwd = ref('')

const handleInputChange = (value: any, item: any) => {
  if (item.colType === 3) { // date
    dynamicData[item.colId] = value ? new Date(value).toISOString().slice(0, 10) : '';
  } else if (item.colType === 4) { // datetime-local
    dynamicData[item.colId] = value ? new Date(value).toISOString().slice(0, 19).replace('T', ' ') : '';
  } else {
    dynamicData[item.colId] = value;
  }
}

const handleReloadPage = () => {
  emit('close', false)
}

const submitForm = async () => {
  console.log(form)
  console.log('Dynamic Fields:', dynamicData)

  const jobPositions: UserJobPosition[] = []
  for (const jp of form.comJobPositions) {
    jobPositions.push({
      jobPosId: jp,
      jobPosName: '',
      jobPosEngName: '',
      jobPosLevel: '',
    })
  }

  const strUnits: UserStrUnit[] = []
  for (const su of form.comStrUnits) {
    strUnits.push({
      strUnitId: su,
      strUnitName: '',
      strUnitEngName: '',
      strUnitNo: '',
    })
  }

  const detailData: UserDetailInfo[] = []
  for (const infoCol of userInfoColsStore.userInfoCols) {
    detailData.push({
      userDataId: 0,
      data: dynamicData[infoCol.colId],
      colId: infoCol.colId
    })
  }

  const createData = {
    userName: form.userName,
    userStName: form.userStName,
    userType: 3,
    userNo: form.userNo,
    email: form.email,
    jobPositions: jobPositions,
    strUnits: strUnits,
    detailInfo: detailData
  }

  const createRes = await createNewUser(createData)
  if (createRes.errno === '00000') {
    ElNotification({
      title: t('notice.noticeTitle'),
      message: t('notice.createUserSuccessMsg'),
      type: 'success'
    });
    userPwd.value = createRes.userNewPwd as string
    showConfirmDialog.value = true
  } else if (createRes.errno === '99006') {
    ElNotification({
      title: t('notice.noticeTitle'),
      message: t('notice.createUserNoPerErrorMsg'),
      type: 'error'
    });
  } else {
    ElNotification({
      title: t('notice.noticeTitle'),
      message: t('notice.createUserErrorMsg'),
      type: 'error'
    });
  }
}

onMounted(async () => {
  await getUserInfoCols()
  await getComStrUnits()
  await getComJobPositions()
})
</script>

<template>
  <el-dialog
      :model-value="visible"
      :title="t('user.addTitle')"
      @close="closeDialog"
      width="500px"
  >
    <h3>{{ t('user.addColumns.basicInfo') }}</h3>
    <el-form :model="form" :rules="rules" ref="formRef" label-position="top">
      <el-form-item :label="t('user.addColumns.userName')" prop="userName">
        <el-input v-model="form.userName" :maxlength="30" show-word-limit></el-input>
      </el-form-item>
      <el-form-item :label="t('user.addColumns.userStName')" prop="userStName">
        <el-input v-model="form.userStName" :maxlength="30" show-word-limit></el-input>
      </el-form-item>
      <el-form-item :label="t('user.addColumns.userNo')" prop="userNo">
        <el-input v-model="form.userNo" :maxlength="20" show-word-limit></el-input>
      </el-form-item>
      <el-form-item :label="t('user.addColumns.email')" prop="email">
        <el-input v-model="form.email" ></el-input>
      </el-form-item>
    </el-form>
    <el-divider />
    <h3>{{ t('user.addColumns.orgInfo') }}</h3>
    <el-form :model="form" :rules="rules" ref="formRef" label-position="top">
      <el-form-item :label="t('user.addColumns.orgStrUnits')" prop="comStrUnits">
        <div class="m-4">
          <el-select
              v-model="form.comStrUnits"
              multiple
              placeholder="Select"
              style="width: 470px"
          >
            <el-option
                v-for="item in allComStrUnits"
                :key="item.strUnitId"
                :label="item.strUnitNo + '-' + item.strUnitName"
                :value="item.strUnitId"
            />
          </el-select>
        </div>
      </el-form-item>
      <el-form-item :label="t('user.addColumns.orgJobPositions')" prop="comJobPositions">
        <div class="m-4">
          <el-select
              v-model="form.comJobPositions"
              multiple
              placeholder="Select"
              style="width: 470px"
          >
            <el-option
                v-for="item in comJobPositions"
                :key="item.jobPosId"
                :label="item.jobPosName + '(' + item.jobPosLevel + ')'"
                :value="item.jobPosId"
            />
          </el-select>
        </div>
      </el-form-item>
    </el-form>
    <div v-if="infoCols.length > 0">
      <el-divider />
      <h3>{{ t('user.addColumns.detailInfo') }}</h3>
      <el-form :model="form" :rules="rules" ref="formRef" label-position="top">
        <el-form-item v-for="item of infoCols" :label="item.colName" label-position="top" :required="item.colRequire">
          <el-input
              v-if="[0, 1, 2].includes(item.colType)"
              :type="detailType(item.colType)"
              v-model="dynamicData[item.colId]"
              @change="(value: any) => handleInputChange(value, item)"
          />
          <el-date-picker
              v-if="[3, 4].includes(item.colType)"
              :type="detailType(item.colType)"
              v-model="dynamicData[item.colId]"
              @change="(value: any) => handleInputChange(value, item)"
              :value-format="dateTimeFormat(item.colType)"
              style="width: 470px"
          />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="submitForm">{{ t('general.confirm') }}</el-button>
      </span>
    </template>
  </el-dialog>
  <user-add-member-confirm
      v-if="showConfirmDialog"
      :userPwd="userPwd"
      @confirm="handleReloadPage()"
  />
</template>

<style scoped lang="scss">

</style>