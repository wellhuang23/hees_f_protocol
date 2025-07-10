<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import { useCalEventsStore } from '@/stores/oms/bases';
import type { CalEvent } from '@/interfaces/oms/bases';
import { getCalEvents } from '@/services/oms/bases'
import CalEventDesc from './CalEventDesc.vue';

const { t, locale } = useI18n();
const calEventsStore = useCalEventsStore();
const { calEvents } = storeToRefs(calEventsStore);

// Dialog state
const isDialogVisible = ref(false);
const selectedEvent = ref<CalEvent | null>(null);

const loadCalEventsData = async () => {
  if (calEvents.value.length > 0) return
  await getCalEvents()
}

onMounted(() => {
  loadCalEventsData();
});

const now = new Date();
const currentYear = ref(now.getFullYear());
const currentMonth = ref(now.getMonth()); // 0-11

const showYearSelector = ref(false);
const showMonthSelector = ref(false);

const displayedYear = computed(() => currentYear.value);
const displayedMonth = computed(() => currentMonth.value);

const monthNames = computed(() => [
  t('calendar.months.january'), t('calendar.months.february'), t('calendar.months.march'),
  t('calendar.months.april'), t('calendar.months.may'), t('calendar.months.june'),
  t('calendar.months.july'), t('calendar.months.august'), t('calendar.months.september'),
  t('calendar.months.october'), t('calendar.months.november'), t('calendar.months.december')
]);
const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const displayedMonthName = computed(() => monthNames.value[displayedMonth.value]);

const yearRange = computed(() => {
  const startYear = 1994;
  const endYear = 2100;
  const years = [];
  for (let i = startYear; i <= endYear; i++) {
    years.push(i);
  }
  return years;
});

// 將事件按 YYYY-MM-DD 格式分組
const eventsByDate = computed(() => {
  const map = new Map<string, CalEvent[]>();
  if (calEvents.value) {
    for (const event of calEvents.value) {
      if (!map.has(event.calDate)) {
        map.set(event.calDate, []);
      }
      map.get(event.calDate)!.push(event);
    }
  }
  return map;
});

// 格式化日期為 YYYY-MM-DD
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// 根據 calType 返回對應的 Tag Type
const getTagType = (calType: number) => {
  switch (calType) {
    case 0:
      return 'danger';
    case 1:
      return 'info';
    default:
      return 'primary';
  }
};

const calendarDays = computed(() => {
  const year = displayedYear.value;
  const month = displayedMonth.value;

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const lastDayOfPrevMonth = new Date(year, month, 0);

  const days = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Days from previous month
  const startDayOfWeek = firstDayOfMonth.getDay();
  for (let i = startDayOfWeek; i > 0; i--) {
    const date = new Date(lastDayOfPrevMonth);
    date.setDate(lastDayOfPrevMonth.getDate() - i + 1);
    days.push({ date, isCurrentMonth: false, isToday: false });
  }

  // Days of current month
  for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
    const date = new Date(year, month, i);
    const isToday = date.getTime() === today.getTime();
    days.push({ date, isCurrentMonth: true, isToday });
  }

  // Days from next month
  const endDayOfWeek = lastDayOfMonth.getDay();
  const remainingDays = 6 - endDayOfWeek;
  for (let i = 1; i <= remainingDays; i++) {
    const date = new Date(year, month + 1, i);
    days.push({ date, isCurrentMonth: false, isToday: false });
  }

  while (days.length < 42) {
      const lastDay: Date = days[days.length - 1].date;
      const nextDay: Date = new Date(lastDay);
      nextDay.setDate(lastDay.getDate() + 1);
      days.push({ date: nextDay, isCurrentMonth: false, isToday: false });
  }

  return days;
});

// 顯示事件詳情
const showEventDetails = (event: CalEvent) => {
  selectedEvent.value = event;
  isDialogVisible.value = true;
};

function prevMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
}

function goToToday() {
  const today = new Date();
  currentYear.value = today.getFullYear();
  currentMonth.value = today.getMonth();
}

function selectYear(year: number) {
  currentYear.value = year;
  showYearSelector.value = false;
}

function selectMonth(monthIndex: number) {
  currentMonth.value = monthIndex;
  showMonthSelector.value = false;
}

const toggleYearSelector = () => {
  showYearSelector.value = !showYearSelector.value;
  if (showYearSelector.value) {
    showMonthSelector.value = false;
  }
};

const toggleMonthSelector = () => {
  showMonthSelector.value = !showMonthSelector.value;
  if (showMonthSelector.value) {
    showYearSelector.value = false;
  }
};
</script>

<template>
  <div class="calendar-container">
    <div class="calendar-header">
      <div class="header-selectors">
        <span @click="toggleYearSelector" class="current-year-month">{{ displayedYear }}</span>
        <span @click="toggleMonthSelector" class="current-year-month">{{ displayedMonthName }}</span>
        <div v-if="showYearSelector" class="year-selector">
          <ul class="year-list">
            <li v-for="year in yearRange" :key="year" @click="selectYear(year)">{{ year }}</li>
          </ul>
        </div>
        <div v-if="showMonthSelector" class="month-selector">
          <ul class="month-list">
            <li v-for="(month, index) in monthNames" :key="index" @click="selectMonth(index)">{{ month }}</li>
          </ul>
        </div>
      </div>
      <div class="header-actions">
        <button @click="prevMonth" class="nav-button">&lt;</button>
        <button @click="goToToday" class="today-button">{{ t('calendar.today') }}</button>
        <button @click="nextMonth" class="nav-button">&gt;</button>
      </div>
    </div>
    <div class="calendar-grid">
      <div class="day-header" v-for="day in dayNames" :key="day">{{ day }}</div>
      <div
        class="day-cell"
        v-for="day in calendarDays"
        :key="day.date.toISOString()"
        :class="{
          'other-month': !day.isCurrentMonth,
          'is-today': day.isToday
        }"
      >
        <div class="day-content">
          <span class="day-number">{{ day.date.getDate() }}</span>
          <div class="events-wrapper">
            <el-tag
              v-for="event in eventsByDate.get(formatDate(day.date))"
              :key="event.calId"
              :type="getTagType(event.calType)"
              size="small"
              effect="light"
              @click="showEventDetails(event)"
              style="cursor: pointer;"
            >
              {{ locale === 'zh-TW' ? event.calName : event.calEngName }}
            </el-tag>
          </div>
        </div>
      </div>
    </div>
    <cal-event-desc v-model="isDialogVisible" :event="selectedEvent" />
  </div>
</template>

<style scoped>
.calendar-container {
  width: 100%;
  height: 100%;
  font-family: sans-serif;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
  flex-shrink: 0;
}

.header-selectors {
    display: flex;
    align-items: center;
    position: relative;
}

.current-year-month {
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.current-year-month:hover {
  background-color: #f0f0f0;
}

.current-year-month + .current-year-month {
    margin-left: 10px;
}

.year-selector, .month-selector {
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  z-index: 10;
  max-height: 200px;
  overflow-y: auto;
}

.month-selector {
    left: auto;
    right: 0;
}

.year-list, .month-list {
  list-style: none;
  margin: 0;
  padding: 5px 0;
}

.year-list li, .month-list li {
  padding: 8px 20px;
  cursor: pointer;
}

.year-list li:hover, .month-list li:hover {
  background-color: #e9e9e9;
}


.header-actions {
  display: flex;
  align-items: center;
}

.nav-button, .today-button {
  background: none;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  padding: 8px 12px;
  font-size: 1rem;
  margin: 0 5px;
  transition: background-color 0.2s;
}

.nav-button:hover, .today-button:hover {
  background-color: #f0f0f0;
}

.today-button {
  font-weight: bold;
  color: #007bff;
  border-color: #007bff;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: auto repeat(6, 1fr);
  gap: 5px;
  flex-grow: 1;
}

.day-header {
  text-align: center;
  font-weight: bold;
  color: #666;
  padding-bottom: 10px;
}

.day-cell {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  transition: background-color 0.2s;
  padding: 4px;
}

.day-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.day-number {
  align-self: flex-end;
  padding: 5px;
}

.day-cell.other-month {
  color: #aaa;
  background-color: #f9f9f9;
}

.day-cell.is-today .day-number {
  background-color: #007bff;
  color: white;
  font-weight: bold;
  border-radius: 50%;
  width: 2em;
  height: 2em;
  display: flex;
  align-items: center;
  justify-content: center;
}

.events-wrapper {
  flex-grow: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 4px;
}

.events-wrapper {
  width: 100%;
  justify-content: flex-start;
}
</style>
