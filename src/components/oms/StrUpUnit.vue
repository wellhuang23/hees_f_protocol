<template>
  <el-drawer
    :model-value="modelValue"
    :title="t('comStr.upUnitTitle')"
    @update:model-value="$emit('update:modelValue', $event)"
    size="50%"
  >
    <div v-if="nodeData">
      <el-form :model="form" label-position="top">
        <el-form-item :label="t('comStr.parentUnitLabel')">
          <el-select v-model="form.parentStrUnitId">
            <el-option
              v-for="item in parentOption"
              :key="item.strUnitId"
              :label="item.strUnitName"
              :value="item.strUnitId"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('comStr.unitNameLabel')">
          <el-input v-model="form.strUnitName" :maxlength="20" show-word-limit />
        </el-form-item>
        <el-form-item :label="t('comStr.unitNoLabel')">
          <el-input v-model="form.strUnitNo" :maxlength="10" show-word-limit />
        </el-form-item>
        <el-form-item :label="t('comStr.unitDescLabel')">
          <el-input v-model="form.strUnitDesc" type="textarea" :rows="4" />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <div style="display: flex; justify-content: space-between;">
        <el-button v-if="userInfo.per0001.includes(perDeleteCode)" type="danger" @click="handleDelete">{{ t('g.delete') }}</el-button>
        <div>
          <el-button type="info" @click="$emit('update:modelValue', false)">{{ t('general.cancel') }}</el-button>
          <el-button type="primary" @click="handleConfirm">{{ t('general.confirm') }}</el-button>
        </div>
      </div>
    </template>
  </el-drawer>
  <str-del-unit
      v-if="isDelSugDialogVisible"
      v-model="isDelSugDialogVisible"
      :event="nodeData"
      @delete-confirmed="handleDeleteConfirmed"
  />
</template>

<script setup lang="ts">
import {defineProps, defineEmits, ref, watch, computed} from 'vue'
import { useI18n } from 'vue-i18n'
import { updateComStrUnit } from '@/services/oms/orgs'
import { ElNotification } from 'element-plus'
import { useComStrUnitStore, useUserInfoStore, useValidComStore } from '@/stores'
import StrDelUnit from '@/components/oms/StrDelUnit.vue'
import type { ComStrUnit } from '@/interfaces'

const { t } = useI18n()
const strUnitsStore = useComStrUnitStore()
const userInfo = useUserInfoStore()
const validComStore = useValidComStore()

const isDelSugDialogVisible = ref(false);

const comTaxNo = validComStore.currentCom.comTaxNo
const perDeleteCode = comTaxNo + '-oms-005-0001'

const handleDelete = () => {
  isDelSugDialogVisible.value = true;
};

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  nodeData: {
    type: Object as () => ComStrUnit | null,
    default: null
  }
})

const emits = defineEmits(['update:modelValue'])

const handleDeleteConfirmed = () => {
  emits('update:modelValue', false);
};

const noParenUnit = computed(() => {
  return t('comStr.noParentUnit')
})

const parentOption = computed(() => {
  const options = [{
    strUnitId: 0,
    strUnitName: noParenUnit.value,
  }]
  for (const row of strUnitsStore.allComStrUnits) {
    options.push({
      strUnitId: row.strUnitId,
      strUnitName: row.strUnitNo + '-' + row.strUnitName
    })
  }

  return options
})

const form = ref({
  parentStrUnitId: 0,
  strUnitName: '',
  strUnitNo: '',
  strUnitDesc: ''
})

watch(() => props.nodeData, (newNodeData) => {
  if (newNodeData) {
    form.value = {
      parentStrUnitId: newNodeData.parentStrUnitId || 0,
      strUnitName: newNodeData.strUnitName,
      strUnitNo: newNodeData.strUnitNo,
      strUnitDesc: newNodeData.strUnitDesc
    }
  }
}, { immediate: true })

const handleConfirm = async () => {
  const updateRes = await updateComStrUnit({
    strUnitId: props.nodeData?.strUnitId ?? 0,
    parentStrUnitId: form.value.parentStrUnitId,
    strUnitName: form.value.strUnitName,
    strUnitDesc: form.value.strUnitDesc,
    strUnitNo: form.value.strUnitNo,
  })
  if (updateRes === '00000') {
    ElNotification({
      title: t('notice.noticeTitle'),
      message: t('notice.updateComStrUnitSuccessMsg'),
      type: 'success'
    });
    emits('update:modelValue', false)
  } else if (updateRes === '99006') {
    ElNotification({
      title: t('notice.noticeTitle'),
      message: t('notice.updateComStrUnitNoPerErrorMsg'),
      type: 'error'
    });
  } else {
    ElNotification({
      title: t('notice.noticeTitle'),
      message: t('notice.updateComStrUnitErrorMsg'),
      type: 'error'
    });
  }
}
</script>
