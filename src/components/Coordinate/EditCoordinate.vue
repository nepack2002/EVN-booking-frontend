<template>
  <div class="mx-auto w-[100%] sm:ml-64">
    <div
      class="flex items-center justify-between py-7 px-10 border-y border-gray-200"
    >
      <div>
        <h1 class="text-2xl font-semibold leading-relaxed text-gray-800">
          ADD SCHEDULE INFORMATION
        </h1>
        <p class="text-sm font-medium text-gray-500">
          Manage schedules in the company
        </p>
      </div>
      <button
        class="inline-flex gap-x-2 items-center py-2.5 px-4 text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
      >
        <router-link
          :to="{ name: 'Coordinate' }"
          class="text-sm font-semibold tracking-wide"
          >Back</router-link
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
              :class="{
                'text-red-500': errorMessage.department_id,
              }"
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
              type="date"
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
              >Location:</label
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
            <div id="suggestions">
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
                <label class="input">Latitude:</label>
                <input
                  v-model="form.lat_location"
                  class="input2"
                  placeholder="Latitude"
                  readonly
                />
              </div>
              <div>
                <label class="input">Longitude:</label>
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
                  'text-red-500': errorMessage.car_id,
                }"
                >Loại phương tiên</label
              >
              <select class="input2" v-model="form.car_id">
                <option v-for="car in cars" :key="car.id" :value="car.id">
                  {{ car.id }} - {{ car.ten_xe }}
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
                Update schedule succesfully to the database
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
  car_id: "",
  participants: "",
  program: "",
});
const predictions = ref([]);
const departments = ref([]);
const cars = ref([]);
const userStore = useUserStore();
const route = useRoute();
onMounted(async () => {
  await userStore.fetchUser();
  fetchDepartments();
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
onMounted(() => {
  getDepartments();
});
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
    const response = await axios.get("http://127.0.0.1:8000/api/cars", {
      headers: {
        Authorization: `Bearer ${userStore.token}`,
      },
    });
    cars.value = response.data.data;
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
      //   console.log(data);
      form.value.lat_location = data.result.geometry.location.lat;
      form.value.long_location = data.result.geometry.location.lng;
      form.value.location = data.result.formatted_address;
      predictions.value = "";
    } catch (error) {
      console.error("Error:", error);
    }
  } else {
    console.error("Selected prediction not found.");
  }
}
</script>
