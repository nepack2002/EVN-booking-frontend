<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <h2 class="text-2xl font-bold mb-4">Chi tiết lịch trình</h2>
    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <div class="flex items-center justify-between">
        <div class="px-4 py-5 sm:px-6">
          <h3 class="text-lg font-medium leading-6 text-gray-900">
            Thông tin lịch trình
          </h3>
          <p class="mt-1 max-w-2xl text-sm text-gray-500">
            Thông tin chi tiết về lịch trình
          </p>
        </div>
        <div class="pr-5" v-if="schedule.status">
          <button
            @click="updateRun(schedule.status == '2' ? '1' : '2')"
            class="py-2.5 px-4 text-white bg-green-500 rounded-xl hover:bg-green-600 focus:outline-none mx-2"
          >
            {{ schedule.status == 1 ? "Stop" : "Start" }}
          </button>
          {{ message }}
          <button
            class="py-2.5 px-4 text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 focus:outline-none mx-2"
          >
            <router-link
              :to="{ name: 'CarOfUser' }"
              class="text-sm font-semibold tracking-wide"
              >Trở lại</router-link
            >
          </button>
          <div>Thời gian đã trôi qua: {{ formattedTime }}</div>
        </div>
      </div>
    </div>
    <h2 class="text-2xl font-bold mb-4">Danh sách địa điểm</h2>
    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Địa điểm
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
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
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";
import { useUserStore } from "../../store/auth.js";

export default {
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
    const formattedTime = computed(() => formatTime(elapsedSeconds.value));
    if (userStore) {
      userStore.fetchUser();
    }
    const fetchLocations = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/users/ScheduleLocation/${route.params.id}`
        );
        locations.value = response.data;
        console.log(locations.value);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };
    const status = ref([]);
    const fetchStatus = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/users/${userStore.user.id}/schedules`
        );
        status.value = response.data;
      } catch (e) {
        console.log(e);
      }
    };

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
            `http://127.0.0.1:8000/api/cars/update/${route.params.id}`,
            { status: newValue }
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
          `http://127.0.0.1:8000/api/users/schedule/${route.params.id}`
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
          `http://127.0.0.1:8000/api/schedule/location/${route.params.id}`,
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

    return {
      schedule,
      updateRun,
      message,
      elapsedSeconds,
      formattedTime,
      locations,
    };
  },
};
</script>
