<template>
  <button
    id="toggle-top-menu-icon"
    @click="toggleSidebar"
    type="button"
    class="inline-flex p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg md:hidden dark:text-gray-400 fixed left-0 top-0"
    aria-label="Toggle Sidebar"
  >
    <svg
      class="w-6 h-6"
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
      />
    </svg>
  </button>
  <aside
    id="tqd-top-menu"
    :class="[
      'fixed top-0 left-0 z-40 w-64 h-screen transition-transform md:translate-x-0 border-r border-gray-200 px-4',
      showSidebar ? 'translate-x-0 bg-slate-50' : '-translate-x-full',
    ]"
    aria-label="Sidebar"
  >
    <div class="h-full px-3 py-4 overflow-y-auto">
      <a href="https://flowbite.com/" class="flex items-center ps-2.5 mb-5">
        <img
          src="https://flowbite.com/docs/images/logo.svg"
          class="h-6 me-3 sm:h-7"
          alt="Flowbite Logo"
        />
        <span class="self-center text-xl font-semibold whitespace-nowrap"
          >Nepack</span
        >
      </a>
      <ul class="space-y-2 font-medium mt-[60px]">
        <li
          v-for="(item, index) in filteredMenuItems"
          :key="index"
          :class="{ 'bg-blue-500 text-white hover:translate-x-4': isItemActive(item.route) }"
          class="py-2 pl-2 rounded-md hover:bg-blue-500 hover:text-white hover:translate-x-4"
        >
          <router-link :to="item.route" class="flex">
            <div v-html="item.icon" class="menu-icon"></div>
            <span class="flex-1 ms-3 whitespace-nowrap">{{ item.name }}</span>
          </router-link>
        </li>
        <div class="fixed bottom-10 w-[80%] cursor-pointer">
          <li v-if="isLoggedIn">
            <span @click="logout" class="header-a group">
              <svg
                class="header-svg"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 18 16"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"
                />
              </svg>
              <span class="flex-1 ms-3 whitespace-nowrap">Đăng xuất</span>
            </span>
          </li>
          <li v-else>
            <router-link :to="{name: 'Login'}" class="header-a group">
              <svg
                class="header-svg"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 18 16"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"
                />
              </svg>

              <span class="flex-1 ms-3 whitespace-nowrap">Đăng nhập</span>
            </router-link>
          </li>
        </div>
      </ul>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "../store/auth.js";

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const user = computed(() => userStore.getUser);
const isLoggedIn = computed(() => !!user.value);

// Trạng thái hiển thị của sidebar
const showSidebar = ref(false);
// Trạng thái active của mục trong sidebar
const activeIndex = ref(null);

// Hàm để chuyển đổi trạng thái của sidebar
const toggleSidebar = () => {
  showSidebar.value = !showSidebar.value;
};

// Hàm đăng xuất
const logout = async () => {
  await userStore.logout();
  router.push("/login");
};

// Hàm xử lý sự kiện nhấp chuột để ẩn sidebar nếu nhấp ra ngoài
const handleClickOutside = (event) => {
  const sidebarElement = document.getElementById("tqd-top-menu");
  const toggleButton = document.getElementById("toggle-top-menu-icon");

  // Kiểm tra nếu người dùng nhấp ra ngoài sidebar và không nhấp vào nút chuyển đổi
  if (
    showSidebar.value &&
    !sidebarElement.contains(event.target) &&
    !toggleButton.contains(event.target)
  ) {
    showSidebar.value = false;
  }
};
const isItemActive = (itemRoute) => {
  return route.path.includes(itemRoute);
};
const updateActiveIndex = () => {
  menuItems.forEach((item, index) => {
    if (isItemActive(item.route)) {
      activeIndex.value = index;
    }
  });
};

watch(() => route.path, updateActiveIndex);
const menuItems = [
  {
    name: "Trang chủ",
    route: "/home",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
  <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
</svg>
`,
  },
  {
    name: "Người dùng",
    route: "/users",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
</svg>

`,
  },
  {
    name: "Ô tô",
    route: "/cars",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
</svg>

`,
  },
  {
    name: "Bộ phận",
    route: "/department",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m1.5.5-1.5-.5M6.75 7.364V3h-3v18m3-13.636 10.5-3.819" />
    </svg>

`,
  },
  {
    name: "Lịch trình",
    route: "/coordinate",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
          </svg>


`,
  },
];
const userRoles = user.value.role; 
console.log(userRoles);
const filteredMenuItems = computed(() => {
  if (userRoles == "admin") {
    return menuItems;
  } else if (userRoles == "quản trị vật tư") {
    return menuItems.filter(item => item.route === "/cars");
  } else if (userRoles == "quản trị công tác") {
    return menuItems.filter(item => item.route === "/coordinate");
  }
  return [];
});

onMounted(async () => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
