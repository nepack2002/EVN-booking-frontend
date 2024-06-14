<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import { useUserStore } from '@/stores/auth.js'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

const userStore = useUserStore()
const schedules = ref([])
const currentPage = ref(1) // Trang hiện tại
const totalPages = ref(0) // Tổng số trang
const showDeleteSuccess = ref(false)
const searchQuery = ref('')
// Hàm để lấy danh sách phong ban với phân trang
const fetchSchedules = async (page = 1) => {
  try {
    const response = await axios.get(`/schedules?page=${page}&query=${searchQuery.value}`, {
      headers: {
        Authorization: `Bearer ${userStore.token}`
      }
    })

    // Lưu trữ dữ liệu trả về và thông tin phân trang
    schedules.value = response.data.data
    currentPage.value = response.data.current_page
    totalPages.value = response.data.last_page
    if (schedules.value.length === 0 && currentPage.value > 1) {
      // Nếu không còn người dùng trên trang hiện tại và không phải là trang đầu tiên
      // Chuyển về trang trước đó
      currentPage.value -= 1
      console.log('hết')
      await fetchSchedules(currentPage.value)
    }
  } catch (error) {
    console.error('Error fetching users:', error)
  }
}
// Khi giá trị của searchQuery thay đổi, gọi fetchUsers
watch(searchQuery, () => {
  fetchSchedules(currentPage.value)
})

// Gọi fetchUsers khi component được mounted
onMounted(() => {
  fetchSchedules(currentPage.value)
})

// Hàm để chuyển trang
const changePage = async (newPage) => {
  if (newPage > 0 && newPage <= totalPages.value) {
    await fetchSchedules(newPage)
  }
}
// Hàm để xóa người dùng
const deleteUser = async (id) => {
  try {
    // Hiển thị cửa sổ xác nhận
    const confirmed = confirm(`Bạn có muốn xóa người dùng có id là ${id} không?`)

    if (confirmed) {
      await axios.delete(`/schedules/${id}`, {
        headers: {
          Authorization: `Bearer ${userStore.token}`
        }
      })

      await fetchSchedules(currentPage.value)

      // Hiển thị thông báo xóa thành công
      showDeleteSuccess.value = true

      setTimeout(() => {
        showDeleteSuccess.value = false
      }, 2000)
    }
  } catch (error) {
    console.error('Error deleting user:', error)
  }
}
</script>
<template>
  <DefaultLayout>
    <main class="flex-1 mx-auto">
      <div
        v-if="showDeleteSuccess"
        class="fixed inset-0 animate-slideDown2 flex items-center justify-center bg-black bg-opacity-0"
      >
        <div class="bg-green-500 text-white py-2 px-4 rounded-md">Đã xóa thành công!</div>
      </div>

      <div
        class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
      >
        <div class="py-6 px-4 md:px-6 xl:px-7.5 relative">
          <h4 class="text-xl font-bold text-black dark:text-white hidden md:block">
            Danh sách lịch trình
          </h4>
          <div
            class="md:absolute md:right-5 md:top-[50%] md:-translate-y-[50%] flex gap-5 flex-col md:flex-row items-center"
          >
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Tìm kiếm..."
              class="py-2 px-4 border border-black rounded-lg"
            />
            <div class="flex gap-5">
              <router-link :to="{ name: 'AddSchedule' }" class="inline-flex py-3 px-4 whitespace-nowrap text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 focus:outline-none text-sm font-semibold"
              >Thêm lịch trình</router-link
              >
              <router-link
                  :to="{ name: 'ImportSchedule' }"
                  class="inline-flex py-3 px-4 whitespace-nowrap text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 focus:outline-none text-sm font-semibold tracking-wide"
              ><svg
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
                    d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12-3-3m0 0-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                /></svg
              ></router-link>
            </div>
          </div>
        </div>

        <!-- Table Header -->
        <div
          class="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark dark:text-white dark:bg-meta-4 sm:grid-cols-8 md:px-6 2xl:px-7.5 text-black"
        >
          <div class="col-span-2 md:col-span-2 flex items-center">
            <p class="font-bold">Lịch trình</p>
          </div>

          <div class="col-span-2 flex items-center justify-center">
            <p class="font-bold">Địa điểm</p>
          </div>
          <div class="col-span-2 flex items-center justify-center">
            <p class="font-bold">Thời gian</p>
          </div>
          <div class="col-span-2 flex items-center justify-center">
            <p class="font-bold text-nowrap">Hành động</p>
          </div>
        </div>

        <!-- Table Rows -->
        <div
          v-for="schedule in schedules"
          :key="schedule.id"
          class="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
        >
          <div class="col-span-2 md:col-span-2 flex items-center">
            <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
              <p class="text-base font-medium text-black dark:text-white">
                {{ schedule.program }}
              </p>
            </div>
          </div>

          <div class="col-span-2 md:col-span-2 flex items-center justify-center">
            <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
              <p class="text-base font-medium text-black dark:text-white">
                {{ schedule.location }}
              </p>
            </div>
          </div>
          <div class="col-span-2 md:col-span-2 flex items-center justify-center">
            <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
              <p class="text-base font-medium text-black dark:text-white">
                {{ schedule.datetime }}
              </p>
            </div>
          </div>
          <div class="col-span-2 flex items-center justify-center">
            <div class="flex items-center space-x-10">
              <router-link
                :to="{ name: 'EditSchedule', params: { id: schedule.id } }"
                class="hover:text-primary"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                  />
                </svg>
              </router-link>

              <button class="hover:text-primary" @click="deleteUser(schedule.id)">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!--====== Điều khiển phân trang ======-->
      <div class="flex justify-center my-4">
        <button
          class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg mx-1 disabled:opacity-50 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
          @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1"
        >
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
              d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
            />
          </svg>
        </button>
        <span class="px-4 py-2 text-gray-700"> Trang {{ currentPage }} trên {{ totalPages }} </span>
        <button
          class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg mx-1 disabled:opacity-50 disabled:bg-gray-200 disabled:hover:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === totalPages"
        >
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
              d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
            />
          </svg>
        </button>
      </div>
      <!--====== Điều khiển phân trang ======-->
    </main>
  </DefaultLayout>
</template>