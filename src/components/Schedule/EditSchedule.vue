<template>
  <DefaultLayout>
    <div class="mx-auto w-[80%]">
      <div class="col-span-5 xl:col-span-3">
        <div
          class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
        >
          <div class="border-b border-stroke py-4 px-7 dark:border-strokedark">
            <h3 class="font-medium text-black dark:text-white">Thông tin lịch trình</h3>
          </div>

          <div class="p-7">
            <form @submit.prevent="handleSubmit" enctype="multipart/form-data" method="post">
              <div v-if="form.status == 1" class="mb-5.5 text-red">Lịch trình này đang được chạy</div>
              <!-- Full Name Section -->
              <div class="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                
                <div class="w-full sm:w-1/2">
                  <label
                    :class="{
                      'text-red': errorMessage.department_id
                    }"
                    class="mb-3 block text-sm font-medium text-black dark:text-white"
                    >Tên phòng ban</label
                  >
                  <div class="">
                    <select
                      class="w-full rounded border border-stroke bg-gray py-3 px-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      v-model="form.department_id"
                    >
                      <option
                        v-for="department in departments"
                        :key="department.id"
                        :value="department.id"
                      >
                        {{ department.id }} - {{ department.name }}
                      </option>
                    </select>
                  </div>
                </div>

                <!-- Phone Number Section -->
                <div class="w-full sm:w-1/2">
                  <label
                    :class="{
                      'text-red': errorMessage.datetime
                    }"
                    class="mb-3 block text-sm font-medium text-black dark:text-white"
                    >Thời gian</label
                  >
                  <input
                    class="w-full rounded border border-stroke bg-gray py-3 px-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    id="email"
                    type="datetime"
                    v-model="form.datetime"
                  />
                </div>
              </div>

              <!-- Email Address Section -->
              <div class="mb-5.5">
                <label
                  :class="{
                    'text-red': errorMessage.location
                  }"
                  class="mb-3 block text-sm font-medium text-black dark:text-white"
                  >Địa điểm bắt đầu</label
                >
                <div class="relative">
                  <input
                    type="text"
                    class="w-full rounded border border-stroke bg-gray py-3 px-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    v-model="form.location"
                    placeholder="Type to get suggestions..."
                    @input="showSuggestions"
                  />
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
                </div>
              </div>

              <!-- Username Section -->
              <div class="mb-5.5">
                <label
                  :class="{
                    'text-red': errorMessage.phone
                  }"
                  class="mb-3 block text-sm font-medium text-black dark:text-white"
                  >Vĩ độ 1</label
                >
                <input
                  v-model="form.lat_location"
                  class="w-full rounded border border-stroke bg-gray py-3 px-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                  placeholder="Latitude"
                  readonly
                />
              </div>
              <div class="mb-5.5">
                <label
                  :class="{
                    'text-red': errorMessage.department_id
                  }"
                  class="mb-3 block text-sm font-medium text-black dark:text-white"
                  >Kinh độ 1</label
                >
                <input
                  v-model="form.long_location"
                  class="w-full rounded border border-stroke bg-gray py-3 px-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                  placeholder="Longitude"
                  readonly
                />
              </div>
              <div class="mb-5.5">
                <label
                  :class="{
                    'text-red': errorMessage.password
                  }"
                  class="mb-3 block text-sm font-medium text-black dark:text-white"
                  >Địa điểm kết thúc</label
                >
                <input
                  type="text"
                  class="w-full rounded border border-stroke bg-gray py-3 px-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                  v-model="form.location_2"
                  placeholder="Type to get suggestions..."
                  @input="showSuggestions_2"
                />
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
                <div class="my-5.5">
                  <label
                    :class="{
                      'text-red': errorMessage.phone
                    }"
                    class="mb-3 block text-sm font-medium text-black dark:text-white"
                    >Vĩ độ 2</label
                  >
                  <input
                    v-model="form.lat_location_2"
                    class="w-full rounded border border-stroke bg-gray py-3 px-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    placeholder="Latitude"
                    readonly
                  />
                </div>
                <div class="mb-5.5">
                  <label
                    :class="{
                      'text-red': errorMessage.department_id
                    }"
                    class="mb-3 block text-sm font-medium text-black dark:text-white"
                    for="Username"
                    >Kinh độ 2</label
                  >
                  <input
                    v-model="form.long_location_2"
                    class="w-full rounded border border-stroke bg-gray py-3 px-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    placeholder="Longitude"
                    readonly
                  />
                </div>
                <div class="mb-5.5">
                  <label
                    :class="{
                      'text-red': errorMessage.department_id
                    }"
                    class="mb-3 block text-sm font-medium text-black dark:text-white"
                    for="Username"
                    >Loại phương tiện</label
                  >
                  <select
                    class="w-full rounded border border-stroke bg-gray py-3 px-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    v-model="form.car_id"
                  >
                    <option v-for="car in cars" :key="car.car_id" :value="car.car_id">
                      {{ car.car_id }} - {{ car.name }} - {{ roundedDistance(car.distance) }} KM
                    </option>
                  </select>
                </div>
                <div class="mb-5.5">
                  <label
                    :class="{
                      'text-red': errorMessage.department_id
                    }"
                    class="mb-3 block text-sm font-medium text-black dark:text-white"
                    >Người tham gia</label
                  >
                  <input
                    type="text"
                    class="w-full rounded border border-stroke bg-gray py-3 px-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    v-model="form.participants"
                    placeholder="Người tham gia..."
                  />
                </div>
                <div class="mb-5.5">
                  <label
                    :class="{
                      'text-red': errorMessage.department_id
                    }"
                    class="mb-3 block text-sm font-medium text-black dark:text-white"
                    >Chương trình công tác</label
                  >
                  <input
                    type="text"
                    class="w-full rounded border border-stroke bg-gray py-3 px-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    v-model="form.program"
                    placeholder="Người tham gia..."
                  />
                </div>
              </div>

              <div class="w-[100%] flex justify-end items-center gap-5">
                <p v-if="showAddSuccess" class="text-green-500 ml-10 font-semibold text-md">
                  Cập nhật thành công
                </p>
                <button
                  class="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                >
                  <router-link :to="{ name: 'Schedule' }">Hủy</router-link>
                </button>
                <button
                  type="submit"
                  class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded"
                  :class="{ 'bg-red pointer-events-none': form.status == 1 }"
                >
                  Cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
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
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ location.location }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </DefaultLayout>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/auth.js'
import { useRoute } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import axios from 'axios'
const errorMessage = ref({})
const showAddSuccess = ref(false)
const locations = ref([])
const form = ref({
  department_id: '',
  datetime: '',
  location: '',
  lat_location: '',
  long_location: '',
  location_2: '',
  lat_location_2: '',
  long_location_2: '',
  car_id: '',
  participants: '',
  program: ''
})
const predictions = ref([])
const predictions_2 = ref([])
const departments = ref([])
const cars = ref([])
const userStore = useUserStore()
const route = useRoute()
onMounted(async () => {
  await userStore.fetchUser()
  await fetchDepartments()
  await getDepartments()
  await fetchLocations()
  fetchCars()
})
const fetchLocations = async () => {
  try {
    const response = await axios.get(`/users/ScheduleLocation/${route.params.id}`)
    locations.value = response.data
  } catch (error) {
    console.error('Error fetching locations:', error)
  }
}
const getDepartments = async () => {
  try {
    const response = await axios.get(`/schedules/${route.params.id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    form.value = response.data
  } catch (error) {
    console.error('Lỗi khi lấy thông tin xe:', error)
  }
}
const fetchDepartments = async () => {
  try {
    const response = await axios.get('/departments', {
      headers: {
        Authorization: `Bearer ${userStore.token}`
      }
    })
    departments.value = response.data.data
  } catch (error) {
    console.error('Lỗi khi lấy danh sách phòng ban:', error)
  }
}
const fetchCars = async () => {
  try {
    const response = await axios.post(
      '/coordinates',
      {
        lat: form.value.lat_location,
        long: form.value.long_location
      },
      {
        headers: {
          Authorization: `Bearer ${userStore.token}`
        }
      }
    )
    console.log(form.value.lat_location)
    cars.value = response.data
  } catch (error) {
    console.error('Lỗi khi lấy danh sách xe:', error)
  }
}
const handleSubmit = async (event) => {
  event.preventDefault()

  try {
    await axios.post(`/schedules/${route.params.id}`, form.value, {
      headers: {
        Authorization: `Bearer ${userStore.token}`
      }
    })
    showAddSuccess.value = true
    errorMessage.value = []
    setTimeout(() => {
      showAddSuccess.value = false
    }, 2000)
  } catch (error) {
    errorMessage.value = error.response.data.errors
  }
}

async function showSuggestions() {
  const apiKey = import.meta.env.VITE_KEY
  const url = `https://rsapi.goong.io/Place/AutoComplete?api_key=${apiKey}&input=${encodeURIComponent(
    form.value.location
  )}`
  if (form.value.location.length > 0) {
    try {
      const response = await fetch(url)
      const data = await response.json()
      predictions.value = data.predictions
    } catch (error) {
      console.error('Error:', error)
    }
  } else {
    predictions.value = ''
    form.value.lat_location = ''
    form.value.long_location = ''
  }
}
async function showSuggestions_2() {
  const apiKey = import.meta.env.VITE_KEY
  const url = `https://rsapi.goong.io/Place/AutoComplete?api_key=${apiKey}&input=${encodeURIComponent(
    form.value.location_2
  )}`
  if (form.value.location_2.length > 0) {
    try {
      const response = await fetch(url)
      const data = await response.json()
      predictions_2.value = data.predictions
    } catch (error) {
      console.error('Error:', error)
    }
  } else {
    predictions_2.value = ''
    form.value.lat_location_2 = ''
    form.value.long_location_2 = ''
  }
}

async function selectSuggestion(selectedDescription) {
  const selectedPrediction = predictions.value.find(
    (prediction) => prediction.description === selectedDescription
  )
  //   console.log(selectedPrediction);
  if (selectedPrediction) {
    const placeId = selectedPrediction.place_id
    const apiKey = import.meta.env.VITE_KEY
    const placeDetailUrl = `https://rsapi.goong.io/Place/Detail?place_id=${placeId}&api_key=${apiKey}`

    try {
      const response = await fetch(placeDetailUrl)
      const data = await response.json()
      form.value.lat_location = data.result.geometry.location.lat
      form.value.long_location = data.result.geometry.location.lng
      form.value.location = data.result.formatted_address
      predictions.value = ''
      await fetchCars()
      console.log('Coordinates sent successfully to Laravel.')
    } catch (error) {
      console.error('Error:', error)
    }
  } else {
    console.error('Selected prediction not found.')
  }
}
async function selectSuggestion_2(selectedDescription) {
  const selectedPrediction = predictions_2.value.find(
    (prediction) => prediction.description === selectedDescription
  )
  if (selectedPrediction) {
    const placeId = selectedPrediction.place_id
    const apiKey = import.meta.env.VITE_KEY
    const placeDetailUrl = `https://rsapi.goong.io/Place/Detail?place_id=${placeId}&api_key=${apiKey}`

    try {
      const response = await fetch(placeDetailUrl)
      const data = await response.json()
      form.value.lat_location_2 = data.result.geometry.location.lat
      form.value.long_location_2 = data.result.geometry.location.lng
      form.value.location_2 = data.result.formatted_address
      predictions_2.value = ''
    } catch (error) {
      console.error('Error:', error)
    }
  } else {
    console.error('Selected prediction not found.')
  }
}
function roundedDistance(distance) {
  return Math.round(distance)
}
</script>
