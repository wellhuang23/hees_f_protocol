<script setup lang="ts">
import LogFilter from '@/components/sysControl/LogFilter.vue'
import LogRecords from '@/components/sysControl/LogRecords.vue'
</script>

<template>
  <div class="system_logs">
    <LogFilter />
    <log-records />
  </div>
</template>

<style scoped lang="scss">
.system_logs {
  padding: 20px;
}
</style>