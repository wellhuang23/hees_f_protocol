<template>
  <el-dialog
      :model-value="visible"
      :title="t('comPerRoles.cusRoles.addCusRole.title')"
      @close="closeDialog"
      width="1000px"
  >
    <el-form :model="form" :rules="rules" ref="formRef" label-position="top">
      <el-form-item :label="t('comPerRoles.cusRoles.addCusRole.roleName')" prop="title">
        <el-input v-model="form.title" :maxlength="50" show-word-limit></el-input>
      </el-form-item>
      <el-form-item :label="t('comPerRoles.cusRoles.addCusRole.roleDesc')" prop="content">
        <el-input v-model="form.desc" type="textarea" :rows="4"></el-input>
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
      <span class="dialog-footer">
        <el-button type="primary" @click="submitForm">{{ t('general.confirm') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {ref, reactive, onMounted} from 'vue';
import { useI18n } from 'vue-i18n';
import {ElNotification, type ElTable, type FormInstance, type FormRules} from 'element-plus';
import { getSubComPermissions, createComCusRole } from '@/services'
import { useComPerRoleStore } from '@/stores'
import type {ComPermission, SubComPermissions} from "@/interfaces";

const { t, locale } = useI18n();

defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['close']);

const formRef = ref<FormInstance>();
const selectedPerIds = ref<(number | undefined)[]>([])

const form = reactive({
  title: '',
  desc: '',
});

const rules = reactive<FormRules>({
  title: [
    { required: true, message: 'Please input title', trigger: 'blur' },
    { min: 1, max: 50, message: 'Length should be 1 to 50', trigger: 'blur' },
  ]
});

const comPerRoleStore = useComPerRoleStore();

const showSubName = (row: SubComPermissions) => {
  return locale.value === 'zh-TW' ? row.subName : row.subEngName
}

const showPerName = (row: ComPermission) => {
  return locale.value === 'zh-TW' ? row.comPerName : row.comPerEngName
}

const showPerDesc = (row: ComPermission) => {
  return locale.value === 'zh-TW' ? row.comPerDesc : row.comPerEngDesc
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

const closeDialog = () => {
  emit('close');
  form.title = ''
  form.desc = ''
  selectedPerIds.value = []
};

const submitForm = async () => {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid) => {
    if (valid) {
      const createRes = await createComCusRole({
        comRoleName: form.title,
        comRoleDesc: form.desc,
        comPerIds: selectedPerIds.value.filter((id): id is number => id !== undefined)
      })
      if (createRes === '00000') {
        ElNotification({
          title: t('notice.noticeTitle'),
          message: t('notice.createComCusRoleSuccessMsg'),
          type: 'success'
        });
        closeDialog()

      } else if (createRes === '99006') {
        ElNotification({
          title: t('notice.noticeTitle'),
          message: t('notice.createComCusRoleNoPerErrorMsg'),
          type: 'error'
        });
      } else {
        ElNotification({
          title: t('notice.noticeTitle'),
          message: t('notice.createComCusRoleErrorMsg'),
          type: 'error'
        });
      }
    }
  })
};

onMounted(async () => {
  await getSubComPermissions()
})
</script>

<style scoped>
.dialog-footer {
  text-align: center;
  display: block;
}
</style>
