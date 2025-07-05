<template>
  <footer class="copyright-footer">
    <p>{{ t('copyright.title') }} © {{ t('copyright.year') }} {{ t('copyright.owner') }}. {{ t('copyright.content') }}</p>
  </footer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style scoped lang="scss">
.copyright-footer {
  background-color: black;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.copyright-footer p {
  color: gray;
  font-size: 14px;
  margin: 0;
  padding: 0;
}
</style>
