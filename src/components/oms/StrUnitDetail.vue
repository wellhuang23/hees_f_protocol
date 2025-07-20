<template>
  <el-drawer
    :model-value="modelValue"
    :title="t('comStr.unitDetail')"
    @update:model-value="$emit('update:modelValue', $event)"
    size="50%"
  >
    <div v-if="nodeData">
      <p>{{ t('comStr.parentUnitLabel') }}</p>
      <p style="text-indent: 2em;">{{ parentStrUnit }}</p>
      <p>{{ t('comStr.unitNameLabel') }}</p>
      <p style="text-indent: 2em;">{{ nodeData.strUnitName }}</p>
      <p>{{ t('comStr.unitNoLabel') }}</p>
      <p style="text-indent: 2em;">{{ nodeData.strUnitNo }}</p>
      <p>{{ t('comStr.unitDescLabel') }}</p>
      <p style="text-indent: 2em;">{{ nodeData.strUnitDesc }}</p>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import {defineProps, defineEmits, computed} from 'vue'
import { useI18n } from 'vue-i18n'
import {useComStrUnitStore} from '@/stores'
import type {ComStrUnit} from "@/interfaces";

const { t } = useI18n()
const strUnitsStore = useComStrUnitStore()

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

const parentStrUnit = computed(() => {
  for (const row of parentOption.value) {
    const parentStrUnitId = props.nodeData?.parentStrUnitId ?? 0
    if (row.strUnitId === parentStrUnitId) {
      return row.strUnitName
    }
  }
})

defineEmits(['update:modelValue'])
</script>
