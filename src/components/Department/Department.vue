<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import { useUserStore } from '@/stores/auth.js'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

const userStore = useUserStore()
const departments = ref([])
const currentPage = ref(1) // Trang hiện tại
const totalPages = ref(0) // Tổng số trang
const showDeleteSuccess = ref(false)
const searchQuery = ref('')
// Hàm để lấy danh sách phong ban với phân trang
const fetchDepartments = async () => {
  try {
    const response = await axios.get(`/departments2`, {
      headers: {
        Authorization: `Bearer ${userStore.token}`
      }
    })

    // Lưu trữ dữ liệu trả về và thông tin phân trang
    departments.value = response.data
    console.log(departments.value)
    // currentPage.value = response.data.current_page
    // totalPages.value = response.data.last_page
    // if (departments.value.length === 0 && currentPage.value > 1) {
    //   // Nếu không còn người dùng trên trang hiện tại và không phải là trang đầu tiên
    //   // Chuyển về trang trước đó
    //   currentPage.value -= 1
    //   console.log('hết')
    //   await fetchDepartments(currentPage.value)
    // }
  } catch (error) {
    console.error('Error fetching users:', error)
  }
}
// Khi giá trị của searchQuery thay đổi, gọi fetchUsers
watch(searchQuery, () => {
  fetchDepartments(currentPage.value)
})

// Gọi fetchUsers khi component được mounted
onMounted(() => {
  fetchDepartments(currentPage.value)
})

// Hàm để chuyển trang
const changePage = async (newPage) => {
  if (newPage > 0 && newPage <= totalPages.value) {
    await fetchDepartments(newPage)
  }
}
// Hàm để xóa người dùng
const deleteDepartment = async (id) => {
  try {
    // Hiển thị cửa sổ xác nhận
    const confirmed = confirm(`Bạn có muốn xóa người dùng có id là ${id} không?`)

    if (confirmed) {
      await axios.delete(`/departments/${id}`, {
        headers: {
          Authorization: `Bearer ${userStore.token}`
        }
      })

      await fetchDepartments(currentPage.value)

      // Hiển thị thông báo xóa thành công
      showDeleteSuccess.value = true

      setTimeout(() => {
        showDeleteSuccess.value = false
      }, 2000)
    }
  } catch (error) {
    console.error('Error deleting department:', error)
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
            Danh sách phòng ban
          </h4>
          <div
            class="md:absolute md:right-5 md:top-[50%] md:-translate-y-[50%] flex gap-5 flex-col md:flex-row items-center"
          >
            <div class="flex gap-5">
              <button
                class="inline-flex py-4 px-4 whitespace-nowrap text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 focus:outline-none"
              >
                <router-link :to="{ name: 'AddDepartment' }" class="text-sm font-semibold"
                  >Thêm phòng ban</router-link
                >
              </button>
              <button
                class="inline-flex py-4 px-4 whitespace-nowrap text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 focus:outline-none"
              >
                <router-link
                  :to="{ name: 'ImportDepartment' }"
                  class="text-sm font-semibold tracking-wide"
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
              </button>
            </div>
          </div>
        </div>

        <!-- Table Rows -->
        <ul class="list-none px-10 mt-10">
          <ul v-for="department in departments" :key="department.id" class="my-2">
            <div class="flex relative">
              <!-- Cột cho full_name -->
              <router-link  :to="{ name: 'EditDepartment', params: { id: department.id } }" :style="{ paddingLeft: department.level * 30 + 'px' }" class="flex-1 my-2 hover:underline hover:text-indigo-600">
                <span class="text-lg font-semibold">{{ department.full_name }}</span>
              </router-link>
              <!-- Cột cho các nút -->
              <div class="flex items-center space-x-5 absolute left-[50%]">
              
                <button class="hover:text-primary" @click="deleteDepartment(department.id)">
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
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </ul>
        </ul>
      </div>
    </main>
  </DefaultLayout>
</template>