<template>
  <el-dialog
    :model-value="modelValue"
    :title="dialogTitle"
    @update:modelValue="$emit('update:modelValue', $event)"
    width="700"
    center
  >
    <el-form :model="form" :rules="rules" ref="formRef" label-width="auto">
      <el-form-item :label="t('subAddNewGroup.comTaxNo')" prop="comTaxNo">
        <el-input v-model="form.comTaxNo" :maxlength="8" show-word-limit />
      </el-form-item>
      <el-form-item :label="t('subAddNewGroup.comName')" prop="comName">
        <el-input v-model="form.comName" :maxlength="50" show-word-limit />
      </el-form-item>
      <el-form-item :label="t('subAddNewGroup.comStName')" prop="comStName">
        <el-input v-model="form.comStName" :maxlength="10" show-word-limit />
      </el-form-item>
      <el-form-item :label="t('subAddNewGroup.comEngName')" prop="comEngName">
        <el-input v-model="form.comEngName" :maxlength="100" show-word-limit />
      </el-form-item>
      <el-form-item
        v-for="(subscription, index) in subscriptions"
        :key="subscription.subId"
        :label="locale === 'zh-TW' ? subItems[index].subName : subItems[index].subEngName"
        :prop="`subscriptions.${index}.endDate`"
        :rules="[{ validator: validateDates, trigger: 'change' }]"
      >
        <div class="date-picker-container">
          <el-date-picker
            v-model="subscription.startDate"
            type="date"
            :placeholder="t('subAddNewGroup.startDate')"
            value-format="YYYY-MM-DD"
          />
          <span class="date-separator">~</span>
          <el-date-picker
            v-model="subscription.endDate"
            type="date"
            :placeholder="t('subAddNewGroup.endDate')"
            value-format="YYYY-MM-DD"
          />
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitForm(formRef)">{{ t('subAddNewGroup.add') }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSubItemsStore } from '@/stores/oms/orgs'
import { storeToRefs } from 'pinia'
import { ElNotification, type FormInstance, type FormRules } from 'element-plus'
import type { GroupCompanies, NewComSub } from '@/interfaces'
import { createGroupComSubs, getAllGroupSubs } from '@/services'

const { t, locale } = useI18n()

const props = defineProps<{ modelValue: boolean, group: GroupCompanies | null }>()
const emit = defineEmits(['update:modelValue'])

const formRef = ref<FormInstance>()

const form = ref({
  comTaxNo: '',
  comName: '',
  comStName: '',
  comEngName: '',
})

const subItemsStore = useSubItemsStore()
const { subItems } = storeToRefs(subItemsStore)

const subscriptions = ref<{ subId: number, startDate: string, endDate: string }[]>([])

watch(subItems, (newSubItems) => {
  subscriptions.value = newSubItems.map((item: any) => ({
    subId: item.subId,
    startDate: '',
    endDate: ''
  }))
}, { immediate: true })

const rules = ref<FormRules>({
  comTaxNo: [
    { required: true, message: t('subAddNewGroup.rules.comTaxNo.required'), trigger: 'blur' },
    { len: 8, message: t('subAddNewGroup.rules.comTaxNo.length'), trigger: 'blur' },
  ],
  comName: [
    { required: true, message: t('subAddNewGroup.rules.comName.required'), trigger: 'blur' },
    { min: 1, max: 30, message: t('subAddNewGroup.rules.comName.length'), trigger: 'blur' },
  ],
  comStName: [
    { required: true, message: t('subAddNewGroup.rules.comStName.required'), trigger: 'blur' },
    { min: 1, max: 10, message: t('subAddNewGroup.rules.comStName.length'), trigger: 'blur' },
  ],
  comEngName: [
    { required: true, message: t('subAddNewGroup.rules.comEngName.required'), trigger: 'blur' },
    { min: 1, max: 100, message: t('subAddNewGroup.rules.comEngName.length'), trigger: 'blur' },
  ],
})

const validateDates = (rule: any, _: any, callback: any) => {
  const index = rule.field.split('.')[1]
  const startDate = subscriptions.value[index].startDate
  const endDate = subscriptions.value[index].endDate
  if (startDate && endDate && startDate > endDate) {
    callback(new Error(t('subAddNewGroup.rules.date.startBeforeEnd')))
  } else if (endDate && new Date(endDate) < new Date(new Date().toDateString())) {
    callback(new Error(t('subAddNewGroup.rules.date.endAfterToday')))
  } else {
    callback()
  }
}

const dialogTitle = computed(() => {
  if (locale.value === 'zh-TW') {
    return `集團名稱 : ${props.group?.groupName || ''}`
  } else {
    return `Group Name : ${props.group?.groupName || ''}`
  }
})

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid: boolean) => {
    if (valid) {
      const subs: NewComSub[] = subscriptions.value
        .filter(sub => sub.startDate)
        .map(sub => ({
          subId: sub.subId,
          subStartDate: sub.startDate,
          subEndDate: sub.endDate,
        }));

      const comSubs = {
        comId: -1,
        comTaxNo: form.value.comTaxNo,
        comName: form.value.comName,
        comStName: form.value.comStName,
        comEngName: form.value.comEngName,
        subs: subs,
      }

      const param = {
        groupId: props.group?.groupId ?? -1,
        groupName: props.group?.groupName ?? '',
        comSubs: comSubs,
      }

      const res = await createGroupComSubs(param)
      if (res.errno === '00000') {
        await getAllGroupSubs()

        ElNotification({
          title: t('notice.noticeTitle'),
          message: t('notice.createNewCompanySuccessMsg'),
          type: 'success'
        })
        emit('update:modelValue', false) // Close dialog on success
      } else if (res.errno === '99006') {
        ElNotification({
          title: t('notice.noticeTitle'),
          message: t('notice.createNewCompanyNoPerErrorMsg'),
          type: 'error'
        })
      } else if (res.errno === '03001') {
        ElNotification({
          title: t('notice.noticeTitle'),
          message: t('notice.createNewCompanyDupComTaxNoErrorMsg'),
          type: 'error'
        })
      } else if (res.errno === '03002') {
        ElNotification({
          title: t('notice.noticeTitle'),
          message: t('notice.createNewCompanyComTaxNoErrorMsg'),
          type: 'error'
        })
      } else if (['99001', '99002', '99003'].includes(res.errno)) {
        ElNotification({
          title: t('notice.noticeTitle'),
          message: t('notice.createNewCompanyFormatErrorMsg'),
          type: 'error'
        })
      } else {
        ElNotification({
          title: t('notice.noticeTitle'),
          message: t('notice.createNewCompanyComErrorMsg'),
          type: 'error'
        })
      }
    } else {
      ElNotification({
        title: t('notice.noticeTitle'),
        message: t('notice.createNewCompanyFormatErrorMsg'),
        type: 'error'
      })
    }
  })
}
</script>

<style scoped lang="scss">
.dialog-footer {
  text-align: center;
}
.date-picker-container {
  display: flex;
  align-items: center;
  width: 100%;
}
.date-separator {
  margin: 0 10px;
}
</style>