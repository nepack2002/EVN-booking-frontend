<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <DefaultLayoutForUser>
    <div class="max-w-4xl mx-auto px-4 py-8 dark:text-white">
      <h2 class="text-2xl font-bold mb-4">Chi tiết lịch trình</h2>
      <div class="bg-white shadow overflow-hidden sm:rounded-lg dark:bg-boxdark">
        <div class="flex items-center justify-between ">
          <div class="px-4 py-5 sm:px-6 ">
            <h3 class="text-lg font-medium leading-6 text-gray-900">
              Thông tin lịch trình
            </h3>

          </div>
          <div class="pr-5" v-if="schedule.status">
            <button
                @click="handleStopButton"
                class="py-2.5 px-4 text-white bg-green-500 rounded-xl hover:bg-green-600 focus:outline-none mx-2"
            >
              {{ schedule.status == 1 ? "Stop" : "Start" }}
            </button>
            {{ message }}
            <button
                class="py-2.5 px-4 text-white bg-primary rounded-xl hover:bg-primary-dark focus:outline-none mx-2"
            >
              <router-link
                  :to="{ name: 'CarOfUser' }"
                  class="text-sm font-semibold tracking-wide"
              >Trở lại
              </router-link
              >
            </button>

          </div>
        </div>
      </div>
      <div v-if="schedule.status == 1" class="my-5">Thời gian đã trôi qua: {{ formattedTime }}</div>
      <h2 class="text-2xl font-bold my-4">Danh sách địa điểm</h2>
      <div class="bg-white shadow overflow-hidden sm:rounded-lg dark:bg-boxdark">
        <table class="min-w-full divide-y-2 divide-boxdark-2">
          <thead class="bg-gray-50">
          <tr>
            <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Địa điểm
            </th>
          </tr>
          </thead>
          <tbody class="bg-white divide-y-2 divide-boxdark-2 dark:bg-boxdark">
          <tr v-for="location in locations" :key="location.id">
            <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
            >
              {{ location.location }}
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <confirm-modal
          :is-visible="isModalVisible"
          @confirm="confirmStop"
          @cancel="cancelStop"
      ></confirm-modal>
    </div>
  </DefaultLayoutForUser>

</template>

<script>
import {computed, onMounted, onUnmounted, ref} from "vue";
import axios from "axios";
import {useRoute} from "vue-router";
import {useUserStore} from "@/stores/auth.js";
import ConfirmModal from "./Confirm.vue";
import DefaultLayoutForUser from "./DefaultLayoutForUser.vue";

export default {
  components: {
    ConfirmModal,
    DefaultLayoutForUser,
  },
  setup() {
    const schedule = ref({});
    const route = useRoute();
    const latitude = ref(null);
    const longitude = ref(null);
    const location = ref(null);
    const locations = ref([]);
    let timerInterval;
    const userStore = useUserStore();
    const message = ref(null);
    const elapsedSeconds = ref(0);
    let intervalId;
    const isModalVisible = ref(false);
    const formattedTime = computed(() => formatTime(elapsedSeconds.value));
    if (userStore) {
      // userStore.fetchUser();
    }
    const fetchLocations = async () => {
      try {
        const response = await axios.get(
            `/users/ScheduleLocation/${route.params.id}`
        );
        locations.value = response.data;

      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };
    const status = ref([]);
    const fetchStatus = async () => {
      try {
        const response = await axios.get(
            `/users/${userStore.user.id}/schedules`
        );
        status.value = response.data;
      } catch (e) {
        console.log(e);
      }
    };
    const sendLastLocation = async () => {
      try {

        await axios.post(
            `/schedule/sendLastLocation/${route.params.id}`,
            {
              location_2: location.value,
              lat_location_2: latitude.value,
              long_location_2: longitude.value,
            }
        );
        console.log('oke');
      } catch (error) {
        console.error("Error sending last location:", error);
      }
    }

    const updateRun = async (newValue) => {
      let hasActiveSchedule = false;
      for (let i = 0; i < status.value.length; i++) {
        let stringNumber = String(status.value[i].id);
        if (
            status.value[i].status === "1" &&
            stringNumber !== route.params.id
        ) {
          hasActiveSchedule = true;
          break;
        }
      }
      if (!hasActiveSchedule) {
        try {
          await axios.post(
              `/cars/update/${route.params.id}`,
              {status: newValue}
          );
          if (newValue === "1") {
            elapsedSeconds.value = 0;
            intervalId = setInterval(() => {
              elapsedSeconds.value++;
            }, 1000);
            startLocationTimer();
          } else if (newValue === "2") {
            clearInterval(intervalId);
            clearInterval(timerInterval);
            updatePosition();
            sendLastLocation();
            message.value = null;
          }
          await fetchSchedules();
          await fetchLocations(); // Gọi lại fetchLocations sau khi cập nhật trạng thái
        } catch (error) {
          console.error("Error updating car run:", error);
        }
      } else {
        message.value = "Đang có xe khác đang chạy!";
        setTimeout(function () {
          message.value = null;
        }, 5000);
      }
    };

    const fetchSchedules = async () => {
      try {
        const response = await axios.get(
            `/users/schedule/${route.params.id}`
        );
        schedule.value = response.data;
      } catch (e) {
        console.log(e);
      }
    };

    const formatTime = (totalSeconds) => {
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      const paddedHours = hours.toString().padStart(2, "0");
      const paddedMinutes = minutes.toString().padStart(2, "0");
      const paddedSeconds = seconds.toString().padStart(2, "0");

      return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
    };

    const getAddressFromCoordinates = async (latitude, longitude) => {
      try {
        const apiUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data && data.display_name) {
          return data.display_name;
        } else {
          throw new Error("Địa chỉ không tìm thấy");
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin địa điểm:", error);
        return null;
      }
    };

    function getCurrentPosition() {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
    }

    async function updatePosition() {
      try {
        const position = await getCurrentPosition();
        latitude.value = position.coords.latitude;
        longitude.value = position.coords.longitude;
        location.value = await getAddressFromCoordinates(
            latitude.value,
            longitude.value
        );
        sendLocation(latitude.value, longitude.value, location.value);
      } catch (error) {
        console.error("Error getting current position:", error);
      }
    }

    const startLocationTimer = async () => {
      updatePosition();
      timerInterval = setInterval(updatePosition, 180000);
    };

    const sendLocation = async (latitude, longitude, location) => {
      try {
        await axios.post(
            `/schedule/location/${route.params.id}`,
            {
              lat_location: latitude,
              long_location: longitude,
              location: location,
            }
        );
        await fetchLocations(); // Gọi lại fetchLocations sau khi gửi vị trí
      } catch (error) {
        console.error("Error sending location:", error);
      }
    };

    onUnmounted(() => {
      localStorage.setItem("elapsedSeconds", elapsedSeconds.value);
      clearInterval(timerInterval);
      clearInterval(intervalId);
    });

    onMounted(async () => {
      await fetchStatus();
      await fetchSchedules();
      await fetchLocations();
      const storedElapsedSeconds = localStorage.getItem("elapsedSeconds");
      if (schedule.value.status === "1" && storedElapsedSeconds) {
        elapsedSeconds.value = storedElapsedSeconds;
        intervalId = setInterval(() => {
          elapsedSeconds.value++;
          localStorage.setItem("elapsedSeconds", elapsedSeconds.value);
        }, 1000);
      }
    });

    const handleStopButton = () => {
      if (schedule.value.status == "1") {
        isModalVisible.value = true;
      } else {
        updateRun("1");
      }
    };

    const confirmStop = () => {
      updateRun("2");
      isModalVisible.value = false;
    };

    const cancelStop = () => {
      isModalVisible.value = false;
    };

    return {
      schedule,
      updateRun,
      message,
      elapsedSeconds,
      formattedTime,
      locations,
      handleStopButton,
      confirmStop,
      cancelStop,
      isModalVisible,
    };
  },
};
</script>
