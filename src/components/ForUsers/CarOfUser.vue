<template>
  <div class="m-10">
    <div v-if="isLoading" class="flex justify-center items-center my-28">
      <p class="text-xl font-semibold">Đang tải...</p>
    </div>
    <div class="relative flex flex-col items-center">
      <div
        class="w-[80%] bg-blue-700 rounded-xl h-[300px] text-white relative"
        v-if="car"
      >
        <div class="p-5">
          <p class="font-semibold text-2xl">{{ car.ten_xe }}</p>
          <p class="font-semibold text-2xl">{{ car.mau_xe }}</p>
          <p class="">{{ car.bien_so_xe }}</p>
        </div>
        <div class="absolute right-10 top-5 rounded-lg overflow-hidden">
          <img :src="imageUrl" alt="" width="250px" />
        </div>
      </div>
      <div
        class="absolute w-[80%] top-[200px] bg-white shadow-xl rounded-xl p-5"
        v-if="car"
      >
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
          <span class="font-semibold"
            >{{ car.so_dau_xang_tieu_thu }}L/100KM</span
          >
        </div>
        <div>
          <span class="text-gray-400 font-semibold"
            >Ngày bảo dưỡng gần nhất:
          </span>
          <span class="font-semibold">{{ car.ngay_bao_duong_gan_nhat }}</span>
        </div>
        <div>
          <span class="text-gray-400 font-semibold"
            >Hạn đăng kiểm tiếp theo:
          </span>
          <span class="font-semibold">{{ car.han_dang_kiem_tiep_theo }}</span>
        </div>
      </div>
    </div>

    <div
      v-for="(schedule, date) in schedules"
      :key="date"
      class="mt-20 w-[80%] mx-auto"
      :class="{ 'opacity-50 pointer-events-none': isFutureDate(date) }"
    >
      <div class="font-semibold text-xl my-5">{{ date }}</div>
      <div v-for="scheduleDate in schedule" :key="scheduleDate.id">
        <div class="flex items-center gap-[50px]">
          <div>{{ formatTime(scheduleDate.datetime) }}</div>
          <router-link
            :to="{ name: 'View', params: { id: scheduleDate.id } }"
            class="w-[100%] rounded-xl p-5 my-3"
            :class="[
              scheduleDate.status === '1'
                ? 'bg-blue-700 text-white'
                : 'text-black shadow-lg border-[1px] ',
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
                  :class="[
                    scheduleDate.status == '1'
                      ? 'border-white'
                      : 'border-black',
                  ]"
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
              <div class="flex flex-col items-center gap-9">
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
      <img src="../../../public/img/Asset 1 1.png" alt="" class="w-[200px]" />
      <p class="text-xl font-semibold">Bạn chưa được phân công lịch nào</p>
    </div>
    <div
      v-for="(schedule, date) in schedules"
      :key="date"
      class="mt-20 w-[80%] mx-auto"
    >
      <div v-for="scheduleDate in schedule" :key="scheduleDate.id" class="">
        <div
          class="border-2 flex justify-between p-5"
          v-if="scheduleDate.status == '1'"
          @click="handleStopButton(scheduleDate.status)"
        >
          <div>
            <span>Bạn đang trong chuyến đi tới </span>
            <span class="font-semibold">{{ scheduleDate.location_2 }}</span>
            <p class="text-4xl font-bold">{{ displayTime }}</p>
          </div>
          <div class="flex items-center">
            <button
              class="h-[70%] text-white hover:bg-red-600 px-8 rounded-lg bg-red-500"
              @click="handleStopButton(scheduleDate.status)"
            >
              Kết thúc
            </button>
          </div>
        </div>
      </div>
    </div>
    <confirm-modal
      :is-visible="isModalVisible"
      @confirm="confirmStop"
      @cancel="cancelStop"
    ></confirm-modal>
  </div>
</template>
<script>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { useUserStore } from "../../store/auth.js";
import ConfirmModal from "./Confirm.vue";
export default {
  components: {
    ConfirmModal,
  },
  setup() {
    const schedules = ref([]);
    const car = ref("");
    const imageUrl = ref("");
    const savedTime = ref(null);
    const userStore = useUserStore();
    const isLoading = ref(true);
    const isModalVisible = ref(false);

    userStore.fetchUser();
    const fetchSchedules = async () => {
      try {
        const response = await axios.get(
          `/users/${userStore.user.id}/schedulesDate`
        );
        schedules.value = response.data;
        console.log(schedules.value);
        const currentDate = new Date();
        const scheduleDate = new Date("2024-05-18");
        console.log(scheduleDate);
        console.log(currentDate);
        console.log(scheduleDate > currentDate);
      } catch (e) {
        console.log(e);
      } finally {
        isLoading.value = false; // Đặt isLoading thành false sau khi hoàn tất quá trình tải
      }
    };
    function isFutureDate(datetime) {
      const scheduleDate = new Date(datetime);
      const currentDate = new Date();
      scheduleDate.setHours(0, 0, 0, 0);
      currentDate.setHours(0, 0, 0, 0);

      return scheduleDate > currentDate;
    }
    const fetchCar = async () => {
      try {
        const response = await axios.get(
          `/schedule/car/${userStore.user.id}`
        );
        car.value = response.data;
        imageUrl.value = `http://127.0.0.1:8000/${response.data.anh_xe}`;
      } catch (e) {
        console.log(e);
      }
    };

    function formatTime(datetime) {
      const date = new Date(datetime);
      return date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    const formatTimes = (totalSeconds) => {
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      const paddedHours = hours.toString().padStart(2, "0");
      const paddedMinutes = minutes.toString().padStart(2, "0");
      const paddedSeconds = seconds.toString().padStart(2, "0");

      return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
    };
    const displayTime = computed(() => {
      return savedTime.value !== null
        ? formatTimes(savedTime.value)
        : "00:00:00";
    });
    const endSchedule = async (id) => {
      try {
        await axios.post(`/cars/update/${id}`, {
          status: "2",
        });
        await fetchSchedules();
      } catch (error) {
        console.error("Error ending schedule:", error);
      }
    };
    onMounted(async () => {
      await fetchSchedules();
      await fetchCar();
      const storedElapsedSeconds = localStorage.getItem("elapsedSeconds");
      if (storedElapsedSeconds) {
        savedTime.value = storedElapsedSeconds;
      }
    });
    const handleStopButton = (a) => {
      if (a == "1") {
        isModalVisible.value = true;
      } else {
        endSchedule("1");
      }
    };

    const confirmStop = () => {
      endSchedule("2");
      isModalVisible.value = false;
    };

    const cancelStop = () => {
      isModalVisible.value = false;
    };
    return {
      schedules,
      car,
      imageUrl,
      formatTime,
      isFutureDate,
      displayTime,
      endSchedule,
      isLoading,
      handleStopButton,
      confirmStop,
      cancelStop,
      isModalVisible,
    };
  },
};
</script>