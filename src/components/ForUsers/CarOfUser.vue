<template>
  <DefaultLayoutForUser>
  <div class="m-10">
    <div v-if="isLoading" class="flex justify-center items-center my-28">
      <p class="text-xl font-semibold">Đang tải...</p>
    </div>
    <div class="relative flex flex-col items-center">
      <div class="w-[80%] bg-blue-700 rounded-xl h-[300px] text-white relative" v-if="car">
        <div class="p-5">
          <p class="font-semibold text-2xl">{{ car.ten_xe }}</p>
          <p class="font-semibold text-2xl">{{ car.mau_xe }}</p>
          <p class="">{{ car.bien_so_xe }}</p>
        </div>
        <div class="absolute right-10 top-5 rounded-lg overflow-hidden">
          <img :src="imageUrl" alt="" width="250px" />
        </div>
      </div>
      <div class="absolute w-[80%] top-[200px] bg-white dark:bg-boxdark dark:text-white shadow-xl rounded-xl p-5" v-if="car">
        <div>
          <span class="text-gray-400 font-semibold">Số khung: </span>
          <span class="font-semibold uppercase">{{ car.so_khung }}</span>
        </div>
        <div>
          <span class="text-gray-400 font-semibold">Số chỗ: </span>
          <span class="font-semibold">{{ car.so_cho }}</span>
        </div>
        <div>
          <span class="text-gray-400 font-semibold">Mức tiêu thụ: </span>
          <span class="font-semibold">{{ car.so_dau_xang_tieu_thu }}L/100KM</span>
        </div>
        <div>
          <span class="text-gray-400 font-semibold">Ngày bảo dưỡng gần nhất: </span>
          <span class="font-semibold">{{ car.ngay_bao_duong_gan_nhat }}</span>
        </div>
        <div>
          <span class="text-gray-400 font-semibold">Hạn đăng kiểm tiếp theo: </span>
          <span class="font-semibold">{{ car.han_dang_kiem_tiep_theo }}</span>
        </div>
      </div>
    </div>

    <div
      v-for="(schedule, date) in schedules"
      :key="date"
      class="mt-25 w-[80%] mx-auto dark:text-white"
      :class="{ 'opacity-50 pointer-events-none': isFutureDate(date) }"
    >
      <div class="font-semibold text-xl my-5">{{ date }}</div>
      <div v-for="scheduleDate in schedule" :key="scheduleDate.id">
        <div class="flex items-center gap-[50px]">
          <div>{{ formatTime(scheduleDate.datetime) }}</div>
          <router-link
            :to="{ name: 'View', params: { id: scheduleDate.id } }"
            class="w-[100%] rounded-xl p-5 my-3 "
            :class="[
              scheduleDate.status === '1'
                ? 'bg-blue-700 text-white '
                : 'text-black shadow-lg border-[1px] dark:bg-boxdark dark:text-white'
            ]"
          >
            <div class="flex items-center gap-5">
              <div class="flex flex-col items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                  />
                </svg>
                <div
                  class="border-l-2 h-12"
                  :class="[scheduleDate.status == '1' ? 'border-white ' : 'border-black dark:border-white']"
                ></div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                  />
                </svg>
              </div>
              <div class="flex flex-col gap-9">
                <div>
                  <p>{{ scheduleDate.location }}</p>
                  <p>
                    {{ scheduleDate.lat_location }},
                    {{ scheduleDate.long_location }}
                  </p>
                </div>
                <div>
                  <p>{{ scheduleDate.location_2 }}</p>
                  <p>
                    {{ scheduleDate.lat_location_2 }},
                    {{ scheduleDate.long_location_2 }}
                  </p>
                </div>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
    <div
      v-if="schedules == '' && isLoading == false"
      class="flex flex-col justify-center items-center my-28 pb-16"
    >
      <img src="@/assets/images/logo/Asset.png" alt="" class="w-[200px]" />
      <p class="text-xl font-semibold">Bạn chưa được phân công lịch nào</p>
    </div>
    <div v-for="(schedule, date) in schedules" :key="date" class="mt-20 w-[80%] mx-auto">
      <div v-for="scheduleDate in schedule" :key="scheduleDate.id" class="">
        <div
          class="border-2 flex justify-between p-5 text-lg text-black dark:text-white dark:bg-boxdark"
          v-if="scheduleDate.status == '1'"
        >
          <div>
            <span>Bạn đang trong chuyến đi tới </span>
            <span class="font-semibold text-black dark:text-white underline">{{ scheduleDate.location_2 }}</span>
            <p class="text-4xl font-bold">{{ displayTime }}</p>
          </div>
          <div class="flex items-center">
            <button
              class="h-[70%] text-white hover:bg-rose-500 px-8 rounded-lg bg-red"
              @click="endSchedule(scheduleDate.id)"
            >
              KẾT THÚC
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</DefaultLayoutForUser>

</template>
<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useUserStore } from '@/stores/auth.js'
import DefaultLayoutForUser from './DefaultLayoutForUser.vue';
import {useOneSignal} from "@onesignal/onesignal-vue3";
    const schedules = ref([])
    const car = ref('')
    const imageUrl = ref('')
    const savedTime = ref(null)
    const userStore = useUserStore()
    const isLoading = ref(true)

    userStore.fetchUser()
    const fetchSchedules = async () => {
      try {
        const response = await axios.get(`/users/${userStore.user.id}/schedulesDate`)
        schedules.value = response.data
      } catch (e) {
        console.log(e)
      } finally {
        isLoading.value = false
      }
    }
    function isFutureDate(datetime) {
      const scheduleDate = new Date(datetime)
      const currentDate = new Date()
      scheduleDate.setHours(0, 0, 0, 0)
      currentDate.setHours(0, 0, 0, 0)

      return scheduleDate > currentDate
    }
    const fetchCar = async () => {
      try {
        const response = await axios.get(`/schedule/car/${userStore.user.id}`)
        car.value = response.data
        imageUrl.value = `${import.meta.env.VITE_API_URL.replace('/api','/')}${response.data.anh_xe}`
      } catch (e) {
        console.log(e)
      }
    }

    function formatTime(datetime) {
      const date = new Date(datetime)
      return date.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }
    const formatTimes = (totalSeconds) => {
      const hours = Math.floor(totalSeconds / 3600)
      const minutes = Math.floor((totalSeconds % 3600) / 60)
      const seconds = totalSeconds % 60

      const paddedHours = hours.toString().padStart(2, '0')
      const paddedMinutes = minutes.toString().padStart(2, '0')
      const paddedSeconds = seconds.toString().padStart(2, '0')

      return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`
    }
    const displayTime = computed(() => {
      return savedTime.value !== null ? formatTimes(savedTime.value) : '00:00:00'
    })
    const endSchedule = async (id) => {
      try {
        await axios.post(`/cars/update/${id}`, {
          status: '2'
        })
        await fetchSchedules()
      } catch (error) {
        console.error('Error ending schedule:', error)
      }
    }
    onMounted(async () => {
      await fetchSchedules()
      await fetchCar()
      const storedElapsedSeconds = localStorage.getItem('elapsedSeconds')
      if (storedElapsedSeconds) {
        savedTime.value = storedElapsedSeconds
      }

      let oneSignal = useOneSignal()
      oneSignal.User.pushSubscription.addEventListener("change", () => {
        console.log(oneSignal.User.PushSubscription.id)
      });
    })


</script>