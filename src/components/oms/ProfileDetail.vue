<script setup lang="ts">
import {useI18n} from 'vue-i18n'
import type {UserDetailInfo} from '@/interfaces'
import {onMounted, reactive, toRaw} from 'vue'
import {ElNotification, type FormRules} from "element-plus";
import { QuestionFilled } from '@element-plus/icons-vue'
import { updateProfileDetail } from '@/services'

const { t } = useI18n();

const props = defineProps({
  details: {
    type: Array as () => UserDetailInfo[],
    default: [],
    require: true
  }
})

const form = reactive({})

const dynamicData = reactive<Record<string, any>>({});

const rules = reactive<FormRules>({})

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

const handleInputChange = (value: any, item: any) => {
  if (item.colType === 3) { // date
    dynamicData[item.userDataId] = value ? new Date(value).toISOString().slice(0, 10) : '';
  } else if (item.colType === 4) { // datetime-local
    dynamicData[item.userDataId] = value ? new Date(value).toISOString().slice(0, 19).replace('T', ' ') : '';
  } else {
    dynamicData[item.userDataId] = value;
  }
}

const confirmChanges = async () => {
  const modifiedData: UserDetailInfo[] = []
  for (const info of props.details) {
    modifiedData.push({
      userDataId: info.userDataId,
      data: dynamicData[info.userDataId],
      colId: 0
    })
  }

  const res = await updateProfileDetail(modifiedData)
  if (res === '00000') {
    ElNotification({
      title: t('notice.noticeTitle'),
      message: t('notice.updateProfileDetailSuccessMsg'),
      type: 'success'
    });
  } else {
    ElNotification({
      title: t('notice.noticeTitle'),
      message: t('notice.updateProfileDetailErrorMsg'),
      type: 'error'
    });
  }
}

onMounted(async () => {
  for (const item of props.details) {
    dynamicData[item.userDataId] = item.data
  }
})
</script>

<template>
  <div>
    <el-form :model="form" :rules="rules" ref="formRef" label-position="top">
      <el-form-item v-for="item of props.details" label-position="top" :required="item.colRequire">
        <template #label>
          <span>{{ item.colName }}</span>
          <el-tooltip
              class="box-item"
              effect="dark"
              :content="item.colDesc"
              placement="top-start"
          >
            <el-icon style="margin-left: 4px; vertical-align: middle;"><QuestionFilled /></el-icon>
          </el-tooltip>
        </template>
        <el-input
            v-if="[0, 1, 2].includes(item.colType ?? 0)"
            :type="detailType(item.colType ?? 0)"
            v-model="dynamicData[item.userDataId]"
            @change="(value: any) => handleInputChange(value, item)"
        />
        <el-date-picker
            v-if="[3, 4].includes(item.colType ?? 3)"
            :type="detailType(item.colType ?? 3)"
            v-model="dynamicData[item.userDataId]"
            @change="(value: any) => handleInputChange(value, item)"
            :value-format="dateTimeFormat(item.colType ?? 3)"
            style="width: 100%"
        />
      </el-form-item>
      <div class="edit-actions">
        <el-button type="primary" @click="confirmChanges">{{ t('profile.basic.modifyBtn') }}</el-button>
      </div>
    </el-form>
  </div>
</template>

<style scoped lang="scss">
.edit-actions {
  display: flex;
  justify-content: flex-end;
  align-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}
</style>