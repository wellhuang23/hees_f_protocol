<template>
  <div class="cus-sug-list-container">
    <el-row justify="space-between" align="middle" class="page-header">
      <el-col :span="20">
        <p>{{ t('cusSug.pageTitle') }}</p>
      </el-col>
      <el-col :span="4" style="text-align: right;">
        <el-button v-if="userInfo.per1000.includes('sys-007-1000')" type="primary" @click="dialogVisible = true">{{ t('cusSug.addBtn') }}</el-button>
      </el-col>
    </el-row>

    <el-collapse v-model="activeNames">
      <el-collapse-item :title="`${t('cusSug.status0')} (${cusSugStatus0.length})`" name="0">
        <el-table :data="cusSugStatus0" stripe style="width: 100%">
          <el-table-column prop="cusSugName" :label="t('cusSug.tableHeaderName')" />
          <el-table-column prop="cusSugSub.subNo" :label="t('cusSug.tableHeaderSubNo')" />
          <el-table-column :label="t('cusSug.tableHeaderSubName')">
            <template #default="scope">
              {{ scope.row.cusSugSub[subNameKey] }}
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
      <el-collapse-item :title="`${t('cusSug.status1')} (${cusSugStatus1.length})`" name="1">
        <el-table :data="cusSugStatus1" stripe style="width: 100%">
          <el-table-column prop="cusSugName" :label="t('cusSug.tableHeaderName')" />
          <el-table-column prop="cusSugSub.subNo" :label="t('cusSug.tableHeaderSubNo')" />
          <el-table-column :label="t('cusSug.tableHeaderSubName')">
            <template #default="scope">
              {{ scope.row.cusSugSub[subNameKey] }}
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
      <el-collapse-item :title="`${t('cusSug.status2')} (${cusSugStatus2.length})`" name="2">
        <el-table :data="cusSugStatus2" stripe style="width: 100%">
          <el-table-column prop="cusSugName" :label="t('cusSug.tableHeaderName')" />
          <el-table-column prop="cusSugSub.subNo" :label="t('cusSug.tableHeaderSubNo')" />
          <el-table-column :label="t('cusSug.tableHeaderSubName')">
            <template #default="scope">
              {{ scope.row.cusSugSub[subNameKey] }}
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
      <el-collapse-item :title="`${t('cusSug.status3')} (${cusSugStatus3.length})`" name="3">
        <el-table :data="cusSugStatus3" stripe style="width: 100%">
          <el-table-column prop="cusSugName" :label="t('cusSug.tableHeaderName')" />
          <el-table-column prop="cusSugSub.subNo" :label="t('cusSug.tableHeaderSubNo')" />
          <el-table-column :label="t('cusSug.tableHeaderSubName')">
            <template #default="scope">
              {{ scope.row.cusSugSub[subNameKey] }}
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>

    <CusAddSug v-model:visible="dialogVisible" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import { useCusSuggestionsStore } from '@/stores/oms/bases';
import { useUserInfoStore } from '@/stores/oms/auths';
import { getCusSuggestions, getCusSugSubItems } from '@/services/oms/bases';
import CusAddSug from './CusAddSug.vue';

const { t, locale } = useI18n();
const cusSuggestionsStore = useCusSuggestionsStore();
const { cusSugStatus0, cusSugStatus1, cusSugStatus2, cusSugStatus3 } = storeToRefs(cusSuggestionsStore);
const userInfo = useUserInfoStore()

const activeNames = ref(['0']);
const dialogVisible = ref(false);

const subNameKey = computed(() => (locale.value === 'zh-TW' ? 'subName' : 'subEngName'));

onMounted(async () => {
  await getCusSugSubItems();
  await getCusSuggestions();
});
</script>

<style scoped>
.cus-sug-list-container {
  padding: 1rem;
}

.page-header {
  margin-bottom: 1.5rem;
}

.page-header p {
  font-size: 1.25rem;
  font-weight: 600;
}
</style>
