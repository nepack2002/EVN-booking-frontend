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
            <form enctype="multipart/form-data" method="post" @submit.prevent="handleSubmit">
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
                    v-model="form.program"
                    class="w-full rounded border border-stroke bg-gray py-3 px-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    placeholder="Chương trình công tác"
                    type="text"
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
                        v-model="form.department_id"
                        class="w-full rounded border border-stroke bg-gray py-3 px-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
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
                  >Thời gian</label
                  >
                  <datetime-picker-one v-model="form.datetime"/>
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
                      v-model="form.location"
                      class="w-full rounded border border-stroke bg-gray py-3 px-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      placeholder="Điền địa chỉ để hiển thị gợi ý..."
                      type="text"
                      @input="handleShowSuggestion"
                  />
                  <ul class="mb-5.5">
                    <li
                        v-for="prediction in predictions"
                        :key="prediction"
                        class="cursor-pointer py-2 px-4 hover:bg-gray-200"
                        @click="selectSuggestion(prediction.description)"
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
                >Địa điểm kết thúc</label
                >
                <input
                    v-model="form.location_2"
                    class="w-full rounded border border-stroke bg-gray py-3 px-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    placeholder="Điền địa chỉ để hiển thị gợi ý..."
                    type="text"
                    @input="handleShowSuggestion_2"
                />
                <ul class="mb-5.5">
                  <li
                      v-for="prediction in predictions_2"
                      :key="prediction"
                      class="cursor-pointer py-2 px-4 hover:bg-gray-200"
                      @click="selectSuggestion_2(prediction.description)"
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
                  >Loại phương tiện</label
                  >
                  <select
                      v-model="form.car_id"
                      class="w-full rounded border border-stroke bg-gray py-3 px-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                  >
                    <option v-for="car in cars" :key="car.car_id" :value="car.car_id">
                      {{ car.name }} ({{ car.so_cho }} chỗ) (Cách điểm bắt đầu {{ car.distance.toFixed(2) }} KM)
                    </option>
                  </select>
                </div>
                <div class="mb-5.5">
                  <label
                      :class="{
                      'text-red': errorMessage.participants
                    }"
                      class="mb-3 block text-sm font-medium text-black dark:text-white"
                  >Người tham gia <span class="text-red">({{ soNguoiThamGia }} người)</span></label>
                  <small>Tên người tham gia cách nhau bằng dấu <b>,</b></small>
                  <input
                      v-model="form.participants"
                      class="w-full rounded border border-stroke bg-gray py-3 px-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      placeholder="Người tham gia"
                      type="text"
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
                  <input
                      id="tai_lieu"
                      accept="application/pdf"
                      class="w-full rounded border border-stroke bg-gray py-3 px-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="file"
                      @change="handleFileUpload"
                  />
                </div>
              </div>

              <div class="w-[100%] flex justify-end gap-5">
                <button
                    class="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                >
                  <router-link :to="{ name: 'Schedule' }">Hủy</router-link>
                </button>
                <button
                    class="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded"
                    type="submit"
                >
                  Thêm mới
                </button>
              </div>
              <p v-if="showAddSuccess" class="text-green-500 ml-10 font-semibold text-md">
                Thêm lịch trình thành công
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>
<script setup>
import {computed, onMounted, ref, watch} from 'vue'
import {useUserStore} from '@/stores/auth.js'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import axios from 'axios'
import DatetimePickerOne from "@/components/Forms/DatePicker/DatetimePickerOne.vue";
import debounce from "lodash.debounce";

const errorMessage = ref({})
const showAddSuccess = ref(false)
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

const handleShowCarsSuggestion = debounce(() => fetchCars(), 1000)
const soNguoiThamGia = computed(() => !form.value.participants ? 0 : form.value.participants.split(',').length);
watch(soNguoiThamGia, handleShowCarsSuggestion);

const handleFileUpload = (event) => {
  form.value.tai_lieu = event.target.files[0]
}

onMounted(async () => {
  // await userStore.fetchUser()
  fetchDepartments()
  fetchCars()
})
const fetchDepartments = async () => {
  try {
    const response = await axios.get('/departments2')
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
        }
    )
    cars.value = response.data
  } catch (error) {
    console.error('Lỗi khi lấy danh sách xe:', error)
  }
}
const handleSubmit = async () => {
  console.log(form.value.car_id)
  try {
    await axios.post('/schedules', form.value, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    })

    showAddSuccess.value = true
    errorMessage.value = []
    setTimeout(() => {
      showAddSuccess.value = false
    }, 2000)
    resetForm()
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

function resetForm() {
  form.value = {
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
    tai_lieu: null,
  }
}
</script>
