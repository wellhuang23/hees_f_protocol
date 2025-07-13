<!--<template>-->
<!--  <el-alert type="error" :closable="false" style="width: 100%">-->
<!--    <template #title>-->
<!--      <div style="display: flex; justify-content: space-between; align-items: center;" class="title" >-->
<!--        <div class="title-text">-->
<!--          <span>{{ t('dashboard.sysNotice') }}</span>-->
<!--        </div>-->
<!--      </div>-->
<!--    </template>-->
<!--    <template #default>-->
<!--      <ul>-->
<!--        <li v-for="notification in notificationStore.sysNotification.slice(0, 5)" :key="notification.notiId">-->
<!--          {{ notification.notiName }}-->
<!--        </li>-->
<!--      </ul>-->
<!--      <div class="more-hyperlink">-->
<!--        <router-link to="/main/sys/notifications" class="white-link">-->
<!--          {{ t('dashboard.more') }}-->
<!--        </router-link>-->
<!--      </div>-->
<!--    </template>-->
<!--  </el-alert>-->
<!--  -->
<!--</template>-->

<!--<script setup lang="ts">-->
<!--import {useI18n} from 'vue-i18n';-->
<!--import {onMounted} from 'vue';-->
<!--import {getSysNotification} from '@/services';-->
<!--import {useNotificationStore} from '@/stores/oms/bases';-->

<!--const { t } = useI18n();-->
<!--const notificationStore = useNotificationStore();-->

<!--import { ref } from 'vue';-->
<!--const timezone = ref('');-->

<!--timezone.value = Intl.DateTimeFormat().resolvedOptions().timeZone;-->

<!--onMounted(async () => {-->
<!--  await getSysNotification();-->
<!--});-->
<!--</script>-->

<!--<style lang="scss">-->
<!--.title{-->
<!--  display: flex;-->
<!--  justify-content: space-between;-->
<!--  //padding: 10px;-->

<!--  .more-hyperlink {-->
<!--    justify-content: right;-->
<!--  }-->
<!--}-->

<!--.custom-block .warning {-->
<!--  padding: 8px 16px;-->
<!--  background-color: var(&#45;&#45;block-warning-bg-color);-->
<!--  border-radius: 4px;-->
<!--  border-left: 5px solid var(&#45;&#45;el-color-danger);-->
<!--  margin: 20px 0;-->
<!--}-->
<!--</style>-->

<template>
  <div class="sys-notices custom-block" style="width: 100%">
    <h3 class="custom-block-title">{{ t('dashboard.sysNotice') }}</h3>
    <ul>
      <li v-for="notification in notificationStore.sysNotification.slice(0, 5)" :key="notification.notiId">
        {{ notification.notiName }}
      </li>
    </ul>
    <div class="more-hyperlink">
      <router-link to="/main/sys/notifications">
        {{ t('dashboard.more') }}
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useI18n} from 'vue-i18n';
import {onMounted} from 'vue';
import {getSysNotification} from '@/services';
import {useNotificationStore} from '@/stores/oms/bases';

const { t } = useI18n();
const notificationStore = useNotificationStore();

onMounted(async () => {
  await getSysNotification();
});
</script>

<style scoped lang="scss">
.custom-block.sys-notices {
  padding: 8px 16px;
  background-color: rgba(245, 108, 108, .1);
  border-radius: 4px;
  border-left: 5px solid #f56c6c;
  margin: 20px 0;

  ul {
    padding-left: 100px; /* Indent the entire ul list */
    list-style: disc; /* Ensure standard bullet points */
  }

  li {
    font-style: italic; /* Make the text italic */
    margin-bottom: 5px; /* Add some spacing between list items (optional) */
  }

  .more-hyperlink {
    width: 100%; /* Ensure the hyperlink div takes full width initially */
    text-align: right; /* Align its content (the link) to the right */
    margin-top: 10px; /* Add some space above the link */
  }
}
</style>
