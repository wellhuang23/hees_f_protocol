<script setup lang="ts">
const props = defineProps({
  comInfo: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div>{{ props.comInfo }}</div>
</template>

<style scoped lang="scss">

</style>