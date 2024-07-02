<template>
  <DefaultLayout
  >
    <div class="mx-auto w-[90%] md:w-[50%]">
      <div class="flex items-center justify-between py-7">
        <div>
          <h1 class="text-2xl hidden md:block font-semibold leading-relaxed text-gray-800">
            Thêm thông tin lịch trình bằng excel
          </h1>
        </div>
        <button
            class="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring"
            @click="downloadFile"
        >
          Tải file mẫu
        </button>
      </div>
      <DefaultCard cardTitle="Tải tệp">
        <div class="flex flex-col gap-5.5 p-6.5">
          <form enctype="multipart/form-data" method="POST" @submit.prevent="handleSubmit">
            <label class="mb-3 block text-sm font-medium text-black dark:text-white">
              Gắn tệp
            </label>
            <input
                class="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent font-medium outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                type="file"
                @change="handleFileChange"
            />
            <button
                class="bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark focus:outline-none focus:ring mt-5"
                type="submit"
            >
              <svg
                  class="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
              >
                <path
                    d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12-3-3m0 0-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
              </svg>
            </button>
          </form>
        </div>
      </DefaultCard>
    </div>
  </DefaultLayout>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import axios from 'axios'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import DefaultCard from '@/components/Forms/DefaultCard.vue'

import {useUserStore} from '@/stores/auth.js'
import {useRouter} from 'vue-router'

const router = useRouter()
const selectedFile = ref(null)
const userStore = useUserStore()

onMounted(async () => {
  // await userStore.fetchUser()
})

const handleFileChange = (event) => {
  selectedFile.value = event.target.files[0]
  console.log(selectedFile.value)
}

const handleSubmit = async () => {
  if (selectedFile.value) {
    const formData = new FormData()
    formData.append('file', selectedFile.value)

    try {
      const response = await axios.post('/schedule/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      })

      console.log(response.data)

      // Nếu tải lên thành công, điều hướng người dùng trở về trang trước đó
      router.back()
    } catch (error) {
      console.error('Error uploading file:', error)
    }
  } else {
    console.error('No file selected.')
  }
}

const downloadFile = () => {
  const link = document.createElement('a')
  link.href = '/Schedule.xlsx'
  link.download = 'Schedule.xlsx'
  link.click()
}
</script>

