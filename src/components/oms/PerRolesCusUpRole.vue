<template>
  <el-drawer
      v-model="drawer"
      :title="t('comPerRoles.cusRoles.updateCusRole.title')"
      direction="rtl"
      size="80%"
  >
    <el-form :model="form" label-width="120px">
      <el-form-item :label="t('comPerRoles.cusRoles.updateCusRole.roleName')">
        <el-input v-model="form.comRoleName" :maxlength="50" show-word-limit />
      </el-form-item>
      <el-form-item :label="t('comPerRoles.cusRoles.updateCusRole.roleDesc')">
        <el-input v-model="form.comRoleDesc" type="textarea" :rows="3" />
      </el-form-item>
      <div v-for="comSub in comPerRoleStore.subComPermissions" :key="comSub.subId">
        <h4>{{ showSubName(comSub) }}({{ comSub.subNo }})</h4>
        <el-table :data="comSub.comPermissions" border >
          <el-table-column prop="comPerNo" :label="t('comPerRoles.cusRoles.addCusRole.colPerCode')" />
          <el-table-column :label="t('comPerRoles.cusRoles.addCusRole.colPerName')" >
            <template #default="props">
              {{ showPerName(props.row) }}
            </template>
          </el-table-column>
          <el-table-column :label="t('comPerRoles.cusRoles.addCusRole.colPerDesc')" >
            <template #default="props">
              {{ showPerDesc(props.row) }}
            </template>
          </el-table-column>
          <el-table-column :label="t('comPerRoles.cusRoles.addCusRole.status')">
            <template #default="scope">
              <el-button
                  v-if="scope.row.userId !== 0"
                  :type="isSelected(scope.row) ? 'success' : 'info'"
                  plain
                  @click="toggleSelection(scope.row)"
              >
                {{ isSelected(scope.row)
                  ? t('comPerRoles.cusRoles.addCusRole.selected')
                  : t('comPerRoles.cusRoles.addCusRole.notSelected') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-form>
    <template #footer>
      <div style="flex: auto">
        <el-button type="info" @click="drawer = false">{{ t('general.cancel') }}</el-button>
        <el-button type="primary" @click="confirmClick">{{ t('general.confirm') }}</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import {useI18n} from "vue-i18n";
import { updateComCusRole } from '@/services/oms/auths'
import {convertToNumber} from "@/utils/conNumber.ts";
import {ElNotification, type ElTable} from "element-plus";
import type {ComPermission, ComRole, SubComPermissions} from "@/interfaces";
import {useComPerRoleStore} from "@/stores";

const { t, locale } = useI18n();

const comPerRoleStore = useComPerRoleStore();

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  role: {
    type: Object as () => ComRole | null,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const drawer = ref(props.modelValue)
const form = ref({
  comRoleId: 0,
  comRoleName: '',
  comRoleDesc: '',
})

const selectedPerIds = ref<(number | undefined)[]>([])

watch(() => props.modelValue, (val) => {
  drawer.value = val
})

watch(drawer, (val) => {
  if (!val) {
    emit('update:modelValue', false)
  }
})

watch(() => props.role, (val) => {
  if (val) {
    form.value = {
      comRoleId: val.comRoleId ?? 0,
      comRoleName: val.comRoleName ?? '',
      comRoleDesc: val.comRoleDesc ?? '',
    }

    for (const per of val.comPermissions) {
      selectedPerIds.value.push(per.comPerId)
    }
  }
}, { immediate: true, deep: true })

const showSubName = (row: SubComPermissions) => {
  return locale.value === 'zh-TW' ? row.subName : row.subEngName
}

const showPerName = (row: ComPermission) => {
  return locale.value === 'zh-TW' ? row.comPerName : row.comPerEngName
}

const showPerDesc = (row: ComPermission) => {
  return locale.value === 'zh-TW' ? row.comPerDesc : row.comPerEngDesc
}

const closeDrawer = () => {
  emit('update:modelValue', false)
}

const isSelected = (per: ComPermission) => {
  return selectedPerIds.value.includes(per.comPerId)
}

const toggleSelection = (per: ComPermission) => {
  const index = selectedPerIds.value.indexOf(per.comPerId)
  if (index > -1) {
    selectedPerIds.value.splice(index, 1)
  } else {
    selectedPerIds.value.push(per.comPerId)
  }
}

const confirmClick = async () => {
  const updateRes = await updateComCusRole({
    comRoleId: convertToNumber(form.value.comRoleId) ?? 0,
    comRoleName: form.value.comRoleName,
    comRoleDesc: form.value.comRoleDesc,
    comPerIds: selectedPerIds.value.filter((id): id is number => id !== undefined)
  })
  if (updateRes === '00000') {
    ElNotification({
      title: t('notice.noticeTitle'),
      message: t('notice.updateComCusRoleSuccessMsg'),
      type: 'success'
    });
    closeDrawer()
  } else if (updateRes === '99006') {
    ElNotification({
      title: t('notice.noticeTitle'),
      message: t('notice.updateComCusRoleNoPerErrorMsg'),
      type: 'error'
    });
  } else {
    ElNotification({
      title: t('notice.noticeTitle'),
      message: t('notice.updateComCusRoleErrorMsg'),
      type: 'error'
    });
  }
}
</script>
