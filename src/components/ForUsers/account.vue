<template>
  <body class="bg-gray-100 h-screen flex items-center justify-center">
    <div class="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm">
      <div class="flex items-center justify-between border-b pb-4 mb-4">
        <button class="text-indigo-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h2 class="text-lg font-bold">Thông tin tài khoản</h2>
        <div></div>
      </div>
      <div class="space-y-4">
        <div>
          <label class="block text-gray-700 font-medium">Họ và tên</label>
          <input
            type="text"
            :value="user.name"
            class="mt-1 block w-full bg-gray-200 border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            disabled
          />
        </div>
        <div>
          <label class="block text-gray-700 font-medium">Tên đăng nhập</label>
          <input
            type="text"
            :value="user.username"
            class="mt-1 block w-full bg-gray-200 border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            disabled
          />
        </div>
        <!-- <div>
          <label class="block text-gray-700 font-medium">Ngày sinh</label>
          <input
            type="text"
            value="12/10/2007"
            class="mt-1 block w-full bg-gray-200 border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            disabled
          />
        </div> -->
        <div>
          <label class="block text-gray-700 font-medium">Số điện thoại</label>
          <input
            type="text"
            :value="user.phone"
            class="mt-1 block w-full bg-gray-200 border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            disabled
          />
        </div>
      </div>
    </div>
  </body>
</template>
<script>
import { useUserStore } from "../../store/auth.js";
export default {
  setup() {
    const userStore = useUserStore();

    userStore.fetchUser();

    return {
      user: userStore.user,
    };
  },
};
</script>