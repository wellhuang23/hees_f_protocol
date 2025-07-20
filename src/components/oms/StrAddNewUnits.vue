<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useComStrUnitStore } from '@/stores'
import PlusIcon from '@/assets/icons/solid/plus.svg'
import { creatNewComStrUnits } from '@/services/oms/orgs'
import type { ComStrUnitOprReqParams } from '@/interfaces/oms/orgs'
import {ElNotification} from "element-plus";

const { t } = useI18n()
const strUnitsStore = useComStrUnitStore()

const dialogVisible = defineModel<boolean>('dialogVisible', { required: true })

// Define a type for a unit group
interface UnitGroup {
  name: string;
  description: string;
  no: string;
}

// Reactive array for the unit groups
const unitGroups = ref<UnitGroup[]>([
  { name: '', description: '', no: '' }
]);

// Function to add a new unit group
const addUnitGroup = () => {
  unitGroups.value.push({ name: '', description: '', no: '' });
};

const selectedUnit = ref()

const parentUnitLabel = computed(() => {
  return t('comStr.parentUnit')
})

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

// Reset fields on cancel
const handleCancel = () => {
  dialogVisible.value = false
  unitGroups.value = [{ name: '', description: '', no: '' }];
}

// Process data on confirm
const handleConfirm = async () => {
  console.log(selectedUnit.value)
  console.log(unitGroups.value)
  const units: ComStrUnitOprReqParams[] = []
  for (const row of unitGroups.value) {
    units.push({
      strUnitName: row.name,
      strUnitDesc: row.description,
      strUnitNo: row.no,
    })
  }

  const createRes = await creatNewComStrUnits({
    parentStrUnitId: selectedUnit.value,
    strUnits: units
  })
  if (createRes === '00000') {
    ElNotification({
      title: t('notice.noticeTitle'),
      message: t('notice.createComStrUnitSuccessMsg'),
      type: 'success'
    });
    selectedUnit.value = ''
    unitGroups.value = [{name: '', description: '', no: ''}]
    dialogVisible.value = false
  } else if (createRes === '99006') {
    ElNotification({
      title: t('notice.noticeTitle'),
      message: t('notice.createComStrUnitNoPerErrorMsg'),
      type: 'error'
    });
  } else {
    ElNotification({
      title: t('notice.noticeTitle'),
      message: t('notice.createComStrUnitErrorMsg'),
      type: 'error'
    });
  }
}
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="t('comStr.addUnitTitle')"
    width="50%"
    :before-close="handleCancel"
  >
    <el-form>
      <el-form-item :label="parentUnitLabel" required>
        <el-select v-model="selectedUnit" value-key="unit_id">
          <el-option
            v-for="item in parentOption"
            :key="item.strUnitId"
            :label="item.strUnitName"
            :value="item.strUnitId"
          />
        </el-select>
      </el-form-item>

      <div v-for="(group, index) in unitGroups" :key="index" class="unit-group">
        <h3 class="unit-group-title">{{ t('comStr.addGroupDesc').replace('x', `${index + 1}`) }}</h3>
        <el-form-item :label="t('comStr.unitName')" required>
          <el-input v-model="group.name" :maxlength="20" show-word-limit />
        </el-form-item>
        <el-form-item :label="t('comStr.unitDesc')">
          <el-input v-model="group.description" type="textarea" :rows="5" />
        </el-form-item>
        <el-form-item :label="t('comStr.unitNo')">
          <el-input v-model="group.no" :maxlength="10" show-word-limit />
        </el-form-item>
      </div>

      <el-button type="default" @click="addUnitGroup" style="width: 100%;">
        <el-icon :size="20">
          <img :src="PlusIcon" alt="AddGroup" style="width: 1em; height: 1em;" />
        </el-icon>
      </el-button>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="info" @click="handleCancel">{{ t('general.cancel') }}</el-button>
        <el-button type="primary" @click="handleConfirm">{{ t('general.confirm') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
.unit-group {
  border: 1px solid #dcdfe6;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 4px;
  position: relative;
}

.unit-group-title {
  position: absolute;
  top: -10px;
  left: 10px;
  background: #fff;
  padding: 0 5px;
  font-size: 14px;
  color: #606266;
}
</style>