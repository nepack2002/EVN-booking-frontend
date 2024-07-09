<template>
  <header
      v-if="userStore.user"
      class="flex shadow-md py-4 px-4 sm:px-10 bg-white font-sans min-h-[70px] tracking-wide relative z-50"
  >
    <div class="flex flex-wrap items-center justify-around gap-4 w-full">
      <div id="logo" class="w-20 cursor-none"><img alt="" src="../../public/img/Asset 1 1.png"></div>

      <div
          id="collapseMenu"
          class="max-lg:hidden lg:!block max-lg:before:fixed max-lg:before:bg-black max-lg:before:opacity-50 max-lg:before:inset-0 max-lg:before:z-50"
      >
        <button
            id="toggleClose"
            class="lg:hidden fixed top-2 right-4 z-[100] rounded-full bg-white p-3"
            @click="handleClick"
        >
          <svg
              class="w-4 fill-black"
              viewBox="0 0 320.591 320.591"
              xmlns="http://www.w3.org/2000/svg"
          >
            <path
                d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
                data-original="#000000"
            ></path>
            <path
                d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
                data-original="#000000"
            ></path>
          </svg>
        </button>

        <ul
            class="lg:flex gap-x-36 max-lg:space-y-3 max-lg:fixed max-lg:bg-white max-lg:w-1/2 max-lg:min-w-[300px] max-lg:top-0 max-lg:left-0 max-lg:p-6 max-lg:h-full max-lg:shadow-md max-lg:overflow-auto z-50"
        >
          <li class="max-lg:border-b max-lg:py-3 px-3">
            <router-link
                :to="{ name: 'CarOfUser' }"
                class="hover:text-[#007bff] text-gray-600 font-bold block text-base"
            >Trang chủ
            </router-link
            >
          </li>
          <li class="max-lg:border-b max-lg:py-3 px-3">
            <router-link
                :to="{ name: 'Account' }"
                class="hover:text-[#007bff] text-gray-600 font-bold block text-base"
            >Tài khoản
            </router-link
            >
          </li>
        </ul>
      </div>

      <div class="flex items-center space-x-10 cursor-pointer">
        <div v-if="userStore.user" class="relative">
          <svg
              class="cursor-pointer hover:fill-[#007bff] inline"
              fill="none"
              height="20px"
              stroke="currentColor"
              stroke-width="1.5"
              viewBox="0 0 24 24"
              width="20px"
              xmlns="http://www.w3.org/2000/svg"
              @click="toggleNotifications"
          >
            <path
                d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
          </svg>

          <span
              class="absolute left-auto -ml-1 top-0 rounded-full bg-red-500 px-1 py-0 text-xs text-white"
          >{{ notificationUnRead }}</span
          >

          <!-- Danh sách thông báo -->
          <div
              v-if="showNotifications"
              class="absolute top-full -left-[150px] mt-2 bg-white border border-gray-200 shadow-md rounded-md w-52"
          >
            <ul>
              <h1 class="text-xl font-medium px-4 py-2">Thông báo</h1>
              <li
                  v-for="notification in notifications"
                  :key="notification.id"
                  class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  @click="markNotificationAsRead(notification.id)"
              >
                <div class="flex items-center">
                  <div class="w-[90%]">{{ notification.message }}</div>
                  <div
                      v-if="notification.read == 0"
                      class="w-3 h-3 bg-blue-600 rounded-full"
                  ></div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="">
          <div v-if="isLoggedIn">
            <span @click="logout">
              <span
                  class="hover:text-[#007bff] text-gray-600 font-bold block text-base"
              >Đăng xuất</span
              >
            </span>
          </div>
          <div v-else>
            <router-link :to="{ name: 'Login' }">
              <span
                  class="hover:text-[#007bff] text-gray-600 font-bold block text-base"
              >Đăng nhập</span
              >
            </router-link>
          </div>
        </div>
        <button id="toggleOpen" class="lg:hidden !ml-7" @click="handleClick">
          <svg
              class="w-7 h-7"
              fill="#000"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
          >
            <path
                clip-rule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                fill-rule="evenodd"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import {computed, onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import {useUserStore} from "@/stores/auth.js";
import axios from "axios";

const router = useRouter();
const userStore = useUserStore();
if (userStore) {
  // userStore.fetchUser();
}

const user = computed(() => userStore.getUser);
const isLoggedIn = computed(() => !!user.value);

// Hàm đăng xuất
const logout = async () => {
  await userStore.logout();
  router.push("/login");
};
// Trạng thái hiển thị của danh sách thông báo
const showNotifications = ref(false);

// Danh sách thông báo
const notifications = ref([]);
const notificationUnRead = ref();

// Hàm lấy danh sách thông báo
const fetchNotifications = async () => {
  try {
    const response = await axios.get(
        `/users/notification/${userStore.user.id}`
    );
    notifications.value = response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
  }
};

const fetchNotificationUnRead = async () => {
  try {
    const response = await axios.get(
        `users/notificationUnRead/${userStore.user.id}`
    );
    notificationUnRead.value = response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
  }
};
const markNotificationAsRead = async (notificationId) => {
  try {
    await axios.put(
        `/notifications/${notificationId}/mark-as-read`,
        {
          read: true,
        }
    );
    fetchNotificationUnRead();
    fetchNotifications();
  } catch (error) {
    console.error("Error marking notification as read:", error);
  }
};

// Hàm toggle hiển thị danh sách thông báo
const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
};

// Lấy danh sách thông báo khi component được mounted
if (userStore.user) {
  onMounted(async () => {
    await fetchNotificationUnRead();
    await fetchNotifications();
  });
}


// Hàm xử lý hiển thị menu
const handleClick = () => {
  const collapseMenu = document.getElementById("collapseMenu");
  if (collapseMenu.style.display === "block") {
    collapseMenu.style.display = "none";
  } else {
    collapseMenu.style.display = "block";
  }
};
</script>

<style>
.header-a {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #000;
  transition: color 0.3s;
}

.header-a:hover {
  color: #007bff;
}

.header-svg {
  width: 20px;
  height: 20px;
}
</style>
