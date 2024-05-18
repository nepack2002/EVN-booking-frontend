<template>
  <div class="mx-auto w-[100%] sm:ml-64">
    <div
      class="flex items-center justify-between py-7 px-10 border-y border-gray-200"
    >
      <div>
        <h1 class="text-2xl font-semibold leading-relaxed text-gray-800">
          CẬP NHẬT THÔNG TIN LỊCH TRÌNH
        </h1>
        <p class="text-sm font-medium text-gray-500">
          Quản lý lịch trình trong công ty
        </p>
      </div>
      <button
        class="inline-flex gap-x-2 items-center py-2.5 px-4 text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
      >
        <router-link
          :to="{ name: 'Coordinate' }"
          class="text-sm font-semibold tracking-wide"
          >Trở lại</router-link
        >
      </button>
    </div>
    <div class="flex justify-center py-16">
      <div class="w-[90%] md:w-[600px]">
        <form
          @submit.prevent="handleSubmit"
          class="p-8 border border-gray-300 shadow-md rounded-lg relative"
          enctype="multipart/form-data"
          method="post"
        >
          <div>
            <label
              class="input"
              
              >Phòng ban</label
            >
            <select class="input2" v-model="form.department_id">
              <option
                v-for="department in departments"
                :key="department.id"
                :value="department.id"
              >
                {{ department.id }} - {{ department.name }}
              </option>
            </select>
            <span
              v-if="errorMessage.department_id"
              class="text-red-500 text-sm"
              >{{ errorMessage.department_id[0] }}</span
            >
          </div>
          <div>
            <label
              class="input"
              :class="{
                'text-red-500': errorMessage.datetime,
              }"
              >Thời gian</label
            >
            <input
              type="datetime"
              class="input2"
              v-model="form.datetime"
              placeholder="Phòng ban..."
            />
            <span v-if="errorMessage.datetime" class="text-red-500 text-sm">{{
              errorMessage.datetime[0]
            }}</span>
          </div>
          <div>
            <label
              class="input"
              :class="{
                'text-red-500': errorMessage.location,
              }"
              >Địa điểm bắt đầu:</label
            >
            <input
              type="text"
              class="input2"
              v-model="form.location"
              placeholder="Type to get suggestions..."
              @input="showSuggestions"
            />
            <span v-if="errorMessage.location" class="text-red-500 text-sm">{{
              errorMessage.location[0]
            }}</span>
            <div>
              <ul class="divide-y divide-gray-300">
                <li
                  v-for="prediction in predictions"
                  :key="prediction"
                  @click="selectSuggestion(prediction.description)"
                  class="cursor-pointer py-2 px-4 hover:bg-gray-200"
                >
                  {{ prediction.description }}
                </li>
              </ul>
            </div>
            <div class="flex gap-5 my-2">
              <div>
                <label class="input">Vĩ độ bắt đầu:</label>
                <input
                  v-model="form.lat_location"
                  class="input2"
                  placeholder="Latitude"
                  readonly
                />
              </div>
              <div>
                <label class="input">kinh độ bắt đầu:</label>
                <input
                  v-model="form.long_location"
                  class="input2"
                  placeholder="Longitude"
                  readonly
                />
              </div>
            </div>

            <div>
              <label
                class="input"
                :class="{
                  'text-red-500': errorMessage.location,
                }"
                >Địa điểm kết thúc:</label
              >
              <input
                type="text"
                class="input2"
                v-model="form.location_2"
                placeholder="Type to get suggestions..."
                @input="showSuggestions_2"
              />
              <span v-if="errorMessage.location" class="text-red-500 text-sm">{{
                errorMessage.location[0]
              }}</span>
              <div>
                <ul class="divide-y divide-gray-300">
                  <li
                    v-for="prediction in predictions_2"
                    :key="prediction"
                    @click="selectSuggestion_2(prediction.description)"
                    class="cursor-pointer py-2 px-4 hover:bg-gray-200"
                  >
                    {{ prediction.description }}
                  </li>
                </ul>
              </div>
            </div>
            <div class="flex gap-5 my-2">
              <div>
                <label class="input">Vĩ độ kết thúc:</label>
                <input
                  v-model="form.lat_location_2"
                  class="input2"
                  placeholder="Latitude_2"
                  readonly
                />
              </div>
              <div>
                <label class="input">Kinh độ kết thúc:</label>
                <input
                  v-model="form.long_location_2"
                  class="input2"
                  placeholder="Longitude_2"
                  readonly
                />
              </div>
            </div>
            <div>
              <label
                class="input"
                :class="{
                  'text-red-500': errorMessage.car_id,
                }"
                >Loại phương tiên</label
              >
              <select class="input2" v-model="form.car_id">
                <option
                  v-for="car in cars"
                  :key="car.car_id"
                  :value="car.car_id"
                >
                  {{ car.car_id }} - {{ car.name }} -
                  {{ roundedDistance(car.distance) }} KM
                </option>
              </select>
              <span v-if="errorMessage.car_id" class="text-red-500 text-sm">{{
                errorMessage.car_id[0]
              }}</span>
            </div>
            <div>
              <label
                class="input"
                :class="{
                  'text-red-500': errorMessage.participants,
                }"
                >Người tham gia</label
              >
              <input
                type="text"
                class="input2"
                v-model="form.participants"
                placeholder="Người tham gia..."
              />
              <span
                v-if="errorMessage.participants"
                class="text-red-500 text-sm"
                >{{ errorMessage.participants[0] }}</span
              >
            </div>
            <div>
              <label
                class="input"
                :class="{
                  'text-red-500': errorMessage.program,
                }"
                >Chương trình công tác</label
              >
              <input
                type="text"
                class="input2"
                v-model="form.program"
                placeholder="Chương trình công tác..."
              />
              <span v-if="errorMessage.program" class="text-red-500 text-sm">{{
                errorMessage.program[0]
              }}</span>
            </div>
          </div>
          <div>
            <div class="flex items-center mt-3">
              <button
                type="submit"
                class="btn bg-gray-600 hover:bg-gray-500 text-white font-medium py-2 px-4 rounded"
              >
                Cập nhật
              </button>
              <p
                v-if="showAddSuccess"
                class="text-green-500 ml-10 font-semibold text-md"
              >
                Cập nhật lịch trình thành công
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useUserStore } from "../../store/auth.js";
import { useRoute } from "vue-router";
import axios from "axios";
const errorMessage = ref({});
const showAddSuccess = ref(false);
const form = ref({
  department_id: "",
  datetime: "",
  location: "",
  lat_location: "",
  long_location: "",
  location_2: "",
  lat_location_2: "",
  long_location_2: "",
  car_id: "",
  participants: "",
  program: "",
});
const predictions = ref([]);
const predictions_2 = ref([]);
const departments = ref([]);
const cars = ref([]);
const userStore = useUserStore();
const route = useRoute();
onMounted(async () => {
  await userStore.fetchUser();
  await fetchDepartments();
  await getDepartments();
  fetchCars();
});
const getDepartments = async () => {
  try {
    const response = await axios.get(
      `http://127.0.0.1:8000/api/schedules/${route.params.id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    form.value = response.data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin xe:", error);
  }
};
const fetchDepartments = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/api/departments", {
      headers: {
        Authorization: `Bearer ${userStore.token}`,
      },
    });
    departments.value = response.data.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách phòng ban:", error);
  }
};
const fetchCars = async () => {
  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/api/coordinates",
      {
        lat: form.value.lat_location,
        long: form.value.long_location,
      },
      {
        headers: {
          Authorization: `Bearer ${userStore.token}`,
        },
      }
    );
    console.log(form.value.lat_location);
    cars.value = response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách xe:", error);
  }
};
const handleSubmit = async (event) => {
  event.preventDefault();

  try {
    await axios.post(
      `http://127.0.0.1:8000/api/schedules/${route.params.id}`,
      form.value,
      {
        headers: {
          Authorization: `Bearer ${userStore.token}`,
        },
      }
    );
    showAddSuccess.value = true;
    errorMessage.value = [];
    setTimeout(() => {
      showAddSuccess.value = false;
    }, 2000);
  } catch (error) {
    errorMessage.value = error.response.data.errors;
  }
};

async function showSuggestions() {
  const apiKey = "RCVIYChDbq94jwTbS8nAaqJJ1WBC5QvDyj3pEle9";
  const url = `https://rsapi.goong.io/Place/AutoComplete?api_key=${apiKey}&input=${encodeURIComponent(
    form.value.location
  )}`;
  if (form.value.location.length > 0) {
    try {
      const response = await fetch(url);
      const data = await response.json();
      predictions.value = data.predictions;
    } catch (error) {
      console.error("Error:", error);
    }
  } else {
    predictions.value = "";
    form.value.lat_location = "";
    form.value.long_location = "";
  }
}
async function showSuggestions_2() {
  const apiKey = "RCVIYChDbq94jwTbS8nAaqJJ1WBC5QvDyj3pEle9";
  const url = `https://rsapi.goong.io/Place/AutoComplete?api_key=${apiKey}&input=${encodeURIComponent(
    form.value.location_2
  )}`;
  if (form.value.location_2.length > 0) {
    try {
      const response = await fetch(url);
      const data = await response.json();
      predictions_2.value = data.predictions;
    } catch (error) {
      console.error("Error:", error);
    }
  } else {
    predictions_2.value = "";
    form.value.lat_location_2 = "";
    form.value.long_location_2 = "";
  }
}

async function selectSuggestion(selectedDescription) {
  const selectedPrediction = predictions.value.find(
    (prediction) => prediction.description === selectedDescription
  );
  //   console.log(selectedPrediction);
  if (selectedPrediction) {
    const placeId = selectedPrediction.place_id;
    const apiKey = "RCVIYChDbq94jwTbS8nAaqJJ1WBC5QvDyj3pEle9";
    const placeDetailUrl = `https://rsapi.goong.io/Place/Detail?place_id=${placeId}&api_key=${apiKey}`;

    try {
      const response = await fetch(placeDetailUrl);
      const data = await response.json();
      form.value.lat_location = data.result.geometry.location.lat;
      form.value.long_location = data.result.geometry.location.lng;
      form.value.location = data.result.formatted_address;
      predictions.value = "";
      await fetchCars();
      console.log("Coordinates sent successfully to Laravel.");
    } catch (error) {
      console.error("Error:", error);
    }
  } else {
    console.error("Selected prediction not found.");
  }
}
async function selectSuggestion_2(selectedDescription) {
  const selectedPrediction = predictions_2.value.find(
    (prediction) => prediction.description === selectedDescription
  );
  if (selectedPrediction) {
    const placeId = selectedPrediction.place_id;
    const apiKey = "RCVIYChDbq94jwTbS8nAaqJJ1WBC5QvDyj3pEle9";
    const placeDetailUrl = `https://rsapi.goong.io/Place/Detail?place_id=${placeId}&api_key=${apiKey}`;

    try {
      const response = await fetch(placeDetailUrl);
      const data = await response.json();
      form.value.lat_location_2 = data.result.geometry.location.lat;
      form.value.long_location_2 = data.result.geometry.location.lng;
      form.value.location_2 = data.result.formatted_address;
      predictions_2.value = "";
    } catch (error) {
      console.error("Error:", error);
    }
  } else {
    console.error("Selected prediction not found.");
  }
}
function roundedDistance(distance) {
  return Math.round(distance);
}
</script>
