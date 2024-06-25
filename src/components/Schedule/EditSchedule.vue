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
              <div v-if="form.status === '1'" class="mb-5.5 text-red">Lịch trình này đang được chạy</div>
              <div v-if="form.status === '2'" class="mb-5.5 text-red">Lịch trình này đã kết thúc</div>
              <div v-if="form.status === '3'" class="mb-5.5 text-red">Lịch trình này đang tạm dừng</div>
              <!-- Full Name Section -->
              <div class="mb-5.5">
                <label
                    :class="{
                      'text-red': errorMessage.program
                    }"
                    class="mb-3 block text-sm font-medium text-black dark:text-white"
                >Chương trình công tác</label
                >
                <input
                    type="text"
                    class="w-full rounded border border-stroke bg-gray py-3 px-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    v-model="form.program"
                    placeholder="Chương trình công tác"
                    :disabled="form.status !== '0'"
                />
              </div>
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
                        :disabled="form.status !== '0'"
                    >
                      <option
                          v-for="department in departments"
                          :key="department.id"
                          :value="department.id"
                      >
                        {{ department.full_name }}
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
                  >Thời gian</label>
                  <datetime-picker-one  v-model="form.datetime"
                                        :disabled="form.status !== '0'"
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
                      placeholder="Điền địa chỉ để hiển thị gợi ý..."
                      @input="handleShowSuggestion"
                      :disabled="form.status !== '0'"
                  />
                  <ul class="mb-5.5">
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

              <!-- Username Section -->
              <div class="mb-5.5">
                <label
                    :class="{
                    'text-red': errorMessage.location_2
                  }"
                    class="mb-3 block text-sm font-medium text-black dark:text-white"
                >Địa điểm kết thúc</label>
                <input
                    type="text"
                    class="w-full rounded border border-stroke bg-gray py-3 px-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    v-model="form.location_2"
                    placeholder="Điền địa chỉ để hiển thị gợi ý..."
                    @input="handleShowSuggestion_2"
                    :disabled="form.status !== '0'"
                />
                <ul class="mb-5.5">
                  <li
                      v-for="prediction in predictions_2"
                      :key="prediction"
                      @click="selectSuggestion_2(prediction.description)"
                      class="cursor-pointer py-2 px-4 hover:bg-gray-200"
                  >
                    {{ prediction.description }}
                  </li>
                </ul>
                <div class="mb-5.5">
                  <label
                      :class="{
                      'text-red': errorMessage.car_id
                    }"
                      class="mb-3 block text-sm font-medium text-black dark:text-white"
                      for="Username"
                  >Loại phương tiện</label>
                  <select
                      class="w-full rounded border border-stroke bg-gray py-3 px-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      v-model="form.car_id"
                      :disabled="form.status !== '0'"
                  >
                    <option v-for="car in cars" :key="car.car_id" :value="car.car_id">
                      {{ car.name }} ({{car.so_cho}} chỗ) (Cách điểm bắt đầu {{ car.distance.toFixed(2) }} KM)
                    </option>
                  </select>
                </div>
                <div class="mb-5.5">
                  <label
                      :class="{
                      'text-red': errorMessage.participants
                    }"
                      class="mb-3 block text-sm font-medium text-black dark:text-white"
                  >Người tham gia <span class="text-red">({{soNguoiThamGia}} người)</span></label>
                  <small>Tên người tham gia cách nhau bằng dấu <b>,</b></small>
                  <input
                      type="text"
                      class="w-full rounded border border-stroke bg-gray py-3 px-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      v-model="form.participants"
                      placeholder="Người tham gia"
                      :disabled="form.status !== '0'"
                  />
                </div>

                <div class="mb-5.5">
                  <label
                      :class="{
                    'text-red': errorMessage.tai_lieu
                  }"
                      class="mb-3 block text-sm font-medium text-black dark:text-white"
                      for="Username"
                  >Tài liệu đính kèm</label
                  >
                  <div class="my-2" v-if="form.ten_tai_lieu">
                    <a class="text-primary" :href="form.tai_lieu" download target="_blank">{{form.ten_tai_lieu}}</a>
                  </div>
                  <input
                      :disabled="form.status !== '0'"
                      accept="application/pdf"
                      type="file"
                      id="tai_lieu"
                      @change="handleFileUpload"
                      class="w-full rounded border border-stroke bg-gray py-3 px-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>

              <div class="w-[100%] flex justify-end items-center gap-5" v-if="form.status === '0'">
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
                    class="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded"
                    :class="{ 'bg-red pointer-events-none': form.status !== '0' }"
                >
                  Cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <h2 class="text-2xl font-bold my-4">Lộ trình</h2>
      <div class="bg-white shadow sm:rounded-lg dark:bg-boxdark px-6 py-4 mb-2 text-sm">
        Tiêu thụ tổng: ~ {{locations.reduce((partialSum, a) => partialSum + a.so_dau_xang_tieu_thu, 0)}}L xăng/dầu
      </div>
      <div class="bg-white shadow sm:rounded-lg dark:bg-boxdark">
        <div class="px-6 py-4 gap-2 text-sm font-medium text-gray-900 flex items-center">
          <div class="relative before:content-[''] before:absolute before:w-[2px] before:bg-bodydark before:h-[20px] before:left-1/2 before:-translate-x-[2px] before:-top-full after:content-[''] after:absolute after:w-[2px] after:bg-bodydark after:h-[20px] after:left-1/2 after:-translate-x-[2px]">
            <img src="@/assets/images/location_on_24px.svg" alt="location"/>
          </div>
          <div class="flex-1 break-words text-primary">
            {{ form.location }}
            <div class="text-bodydark text-xs">
              {{form.lat_location}}, {{form.long_location}}
            </div>
          </div>
        </div>
        <div v-for="location in locations" :key="location.id" class="px-6 py-4 gap-2 text-sm font-medium text-gray-900 flex items-center">
          <div class="relative before:content-[''] before:absolute before:w-[2px] before:bg-bodydark before:h-[20px] before:left-1/2 before:-translate-x-[2px] before:-top-full after:content-[''] after:absolute after:w-[2px] after:bg-bodydark after:h-[20px] after:left-1/2 after:-translate-x-[2px]">
            <img src="@/assets/images/location_on_24px.svg" alt="location"/>
          </div>
          <div class="flex-1 break-words">
            {{ location.location }}
            <div class="text-bodydark">
              Tiêu thụ: ~ {{ location.so_dau_xang_tieu_thu }}L
            </div>
            <div class="text-bodydark text-xs">
              {{location.lat}}, {{location.long}}
            </div>
          </div>
        </div>

        <div v-if="form.status === '2'" class="px-6 py-4 gap-2 text-sm font-medium text-gray-900 flex items-center">
          <div class="relative before:content-[''] before:absolute before:w-[2px] before:bg-bodydark before:h-[20px] before:left-1/2 before:-translate-x-[2px] before:-top-full after:content-[''] after:absolute after:w-[2px] after:bg-bodydark after:h-[20px] after:left-1/2 after:-translate-x-[2px]">
            <img src="@/assets/images/location_on_24px.svg" alt="location"/>
          </div>
          <div class="flex-1 break-words text-primary">
            {{ form.location_2 }}
            <div class="text-bodydark text-xs">
              {{form.lat_location_2}}, {{form.long_location_2}}
            </div>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>
<script setup>
import {computed, onMounted, ref, watch} from 'vue'
import {useUserStore} from '@/stores/auth.js'
import {useRoute} from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import axios from 'axios'
import DatetimePickerOne from "@/components/Forms/DatePicker/DatetimePickerOne.vue";
import debounce from "lodash.debounce";

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
  program: '',
  tai_lieu: null
})
const predictions = ref([])
const predictions_2 = ref([])
const departments = ref([])
const cars = ref([])
const userStore = useUserStore()
const route = useRoute();

const handleShowCarsSuggestion = debounce(() => fetchCars(), 1000)
const soNguoiThamGia = computed(() => !form.value.participants ? 0 : form.value.participants.split(',').length);
watch(soNguoiThamGia, handleShowCarsSuggestion);

onMounted(async () => {
  // await userStore.fetchUser()
  await fetchDepartments()
  await getDepartments()
  await fetchLocations()
  fetchCars()
})

const handleFileUpload = (event) => {
  form.value.ten_tai_lieu = '';
  form.value.tai_lieu = event.target.files[0]
}

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
        Authorization: `Bearer ${userStore.token}`
      }
    })
    form.value = response.data
    form.value.tai_lieu = response.data.tai_lieu ? `${import.meta.env.VITE_BACKEND_URL}${response.data.tai_lieu}` : null
  } catch (error) {
    console.error('Lỗi khi lấy thông tin xe:', error)
  }
}
const fetchDepartments = async () => {
  try {
    const response = await axios.get('/departments2', {
      headers: {
        Authorization: `Bearer ${userStore.token}`
      }
    })
    departments.value = response.data
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
          long: form.value.long_location,
          so_cho: soNguoiThamGia.value,
        },
        {
          headers: {
            Authorization: `Bearer ${userStore.token}`
          }
        }
    )
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
        'Content-Type': 'multipart/form-data',
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
const handleShowSuggestion = debounce(() => showSuggestions(), 1000)
const handleShowSuggestion_2 = debounce(() => showSuggestions_2(), 1000)
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
    predictions.value = []
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
    predictions_2.value = []
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
      predictions.value = []
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
      predictions_2.value = []
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
