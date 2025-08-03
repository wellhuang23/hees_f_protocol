<template>
  <div class="sys-notices custom-block" style="width: 100%">
    <h3 class="custom-block-title">{{ t('dashboard.sysNotice') }}</h3>
    <ul>
      <li
          v-for="notification in notificationStore.sysNotification.slice(0, 5)"
          :key="notification.notiId"
          @click="clickNotice(notification.notiId)"
      >
        <router-link to="/main/sys/notifications" class="single-row">
          * {{ notification.notiName }} : {{ notification.notiDesc }}
        </router-link>
      </li>
    </ul>
    <div class="more-hyperlink">
      <router-link to="/main/sys/notifications" class="more-hyperlink-text">
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
import {useRouter} from 'vue-router'

const router = useRouter()

const { t } = useI18n();
const notificationStore = useNotificationStore();

const clickNotice = (notiId: number) => {
  router.push({
    path: '/main/sys/notifications',
    query: {
      notiId: notiId
    },
  })
}

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
    padding-top: 20px;
    padding-left: 30px; /* Indent the entire ul list */
    list-style: disc; /* Ensure standard bullet points */
    width: 100%;
  }

  li {
    font-style: italic; /* Make the text italic */
    margin-bottom: 5px; /* Add some spacing between list items (optional) */

    display: block;
    width: calc(100vw - 340px);
    box-sizing: border-box;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    .single-row {
      color: gray;
      text-decoration: none;
    }
  }

  .more-hyperlink {
    width: 100%; /* Ensure the hyperlink div takes full width initially */
    text-align: right; /* Align its content (the link) to the right */
    margin-top: 10px; /* Add some space above the link */

    .more-hyperlink-text {
      color: black;
      text-decoration: none;
    }
  }
}
</style>
