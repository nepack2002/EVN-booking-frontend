<template>
  <DefaultLayout>
    <div class="mx-auto w-[80%]">
      <div class="col-span-5 xl:col-span-3">
        <div
          class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
        >
          <div class="border-b border-stroke py-4 px-7 dark:border-strokedark">
            <h3 class="font-medium text-black dark:text-white">Thông tin người dùng</h3>
          </div>

          <div class="p-7">
            <form @submit.prevent="handleSubmit" enctype="multipart/form-data" method="post">
              <!-- Full Name Section -->
              <div class="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                <div class="w-full sm:w-1/2">
                  <label
                    :class="{
                      'text-red': errorMessage.name
                    }"
                    class="mb-3 block text-sm font-medium text-black dark:text-white"
                    for="fullName"
                    >Tên</label
                  >
                  <div class="">
                    <input
                      v-model="form.name"
                      class="w-full rounded border border-stroke bg-gray py-3 px-5 pr-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="text"
                      placeholder="nepack"
                    />
                  </div>
                </div>

                <!-- Phone Number Section -->
                <div class="w-full sm:w-1/2">
                  <label
                    :class="{
                      'text-red': errorMessage.username
                    }"
                    class="mb-3 block text-sm font-medium text-black dark:text-white"
                    for="phoneNumber"
                    >Tên người dùng</label
                  >
                  <input
                    class="w-full rounded border border-stroke bg-gray py-3 px-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    id="email"
                    v-model="form.username"
                  />
                </div>
              </div>

              <!-- Email Address Section -->
              <div class="mb-5.5">
                <label
                  :class="{
                    'text-red': errorMessage.role
                  }"
                  class="mb-3 block text-sm font-medium text-black dark:text-white"
                  for="emailAddress"
                  >Vai trò</label
                >
                <div class="relative">
                  <select
                    id="role"
                    class="w-full rounded border border-stroke bg-gray py-3 px-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    v-model="form.role"
                  >
                    <option value="admin">1 - Admin</option>
                    <option value="quản trị công tác">2 - Quản trị công tác</option>
                    <option value="quản trị vật tư">3 - Quản trị vật tư</option>
                    <option value="user">4 - User</option>
                  </select>
                </div>
              </div>

              <!-- Username Section -->
              <div class="mb-5.5">
                <label
                  :class="{
                    'text-red': errorMessage.phone
                  }"
                  class="mb-3 block text-sm font-medium text-black dark:text-white"
                  for="Username"
                  >Số điện thoại</label
                >
                <input
                  v-model="form.phone"
                  class="w-full rounded border border-stroke bg-gray py-3 px-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                  type="text"
                />
              </div>
              <div class="mb-5.5">
                <label
                  :class="{
                    'text-red': errorMessage.department_id
                  }"
                  class="mb-3 block text-sm font-medium text-black dark:text-white"
                  for="Username"
                  >Phòng ban</label
                >
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

              <div class="w-[100%] flex justify-end gap-5">
                <button
                  class="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                >
                  <router-link :to="{ name: 'User' }">Hủy</router-link>
                </button>
                <button
                  type="submit"
                  class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded"
                >
                  Cập nhật
                </button>
              </div>
              <p v-if="showAddSuccess" class="text-green-500 ml-10 font-semibold text-md">
                Cập nhật thành công
              </p>
              <div v-if="messages" class="w-[100%] bg-red-400 text-white rounded-md p-2 my-5">
                {{ messages }}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/auth.js'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

const errorMessage = ref({})
const showAddSuccess = ref(false)
const form = ref({
  name: '',
  username: '',
  role: '',
  phone: null,
  department_id: ''
})
const userStore = useUserStore()
onMounted(() => {
  // userStore.fetchUser()
  fetchDepartments()
})
const departments = ref([])
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
const route = useRoute()
const getUsers = async () => {
  try {
    const response = await axios.get(`/users/${route.params.id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }) // Sử dụng route.params.id để lấy ID từ URL
    form.value = response.data // Cập nhật giá trị của reactivity object form với thông tin của chiếc xe
  } catch (error) {
    console.error('Lỗi khi lấy thông tin xe:', error)
  }
}
const handleSubmit = async (event) => {
  event.preventDefault()

  try {
    const formData = new FormData()
    formData.append('name', form.value.name)
    formData.append('username', form.value.username)
    formData.append('role', form.value.role)
    formData.append('department_id', form.value.department_id)
    if (form.value.phone) {
      formData.append('phone', form.value.phone)
    }
    await axios.post(`/users/${route.params.id}`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
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
onMounted(() => {
  getUsers()
})
</script>
