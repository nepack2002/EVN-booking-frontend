<script setup>
import {useSidebarStore} from '@/stores/sidebar'
import DarkModeSwitcher from './DarkModeSwitcher.vue'
import DropdownUser from './DropdownUser.vue'
import {useUserStore} from '@/stores/auth.js'

const {isSidebarOpen, toggleSidebar} = useSidebarStore()
const userStore = useUserStore()

// userStore.fetchUser()
</script>

<template>
  <header
      v-if="userStore.user"
      class="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none"
  >
    <div class="flex flex-grow items-center justify-between py-4 px-4 shadow-2 md:px-6 2xl:px-11">
      <div class="flex items-center gap-2 sm:gap-4">
        <!-- Hamburger Toggle BTN -->
        <button
            class="z-99999 lg:hidden block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark"
            @click="
            () => {
              console.log('Toggling Sidebar')
              toggleSidebar()
            }
          "
        >
          <span class="relative block h-5.5 w-5.5 cursor-pointer">
            <span class="du-block absolute right-0 h-full w-full">
              <span
                  :class="{ '!w-full delay-300': !isSidebarOpen }"
                  class="relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-[0] duration-200 ease-in-out dark:bg-white"
              ></span>
              <span
                  :class="{ '!w-full delay-400': !isSidebarOpen }"
                  class="relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-150 duration-200 ease-in-out dark:bg-white"
              ></span>
              <span
                  :class="{ '!w-full delay-500': !isSidebarOpen }"
                  class="relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-200 duration-200 ease-in-out dark:bg-white"
              ></span>
            </span>
            <span class="du-block absolute right-0 h-full w-full rotate-45">
              <span
                  :class="{ '!h-0 delay-[0]': !isSidebarOpen }"
                  class="absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-black delay-300 duration-200 ease-in-out dark:bg-white"
              ></span>
              <span
                  :class="{ '!h-0 dealy-200': !isSidebarOpen }"
                  class="delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-black duration-200 ease-in-out dark:bg-white"
              ></span>
            </span>
          </span>
        </button>
        <!-- Hamburger Toggle BTN -->
        <router-link class="flex-shrink-0" to="/">
          <img alt="Logo" class="w-15" src="@/assets/images/logo/Asset.png"/>
        </router-link>
      </div>
      <div class="hidden sm:block"></div>

      <div class="flex items-center gap-3 2xsm:gap-7">
        <ul class="flex items-center gap-2 2xsm:gap-4">
          <li>
            <!-- Dark Mode Toggler -->
            <DarkModeSwitcher/>
            <!-- Dark Mode Toggler -->
          </li>
        </ul>

        <!-- User Area -->
        <DropdownUser/>
        <!-- User Area -->
      </div>
    </div>
  </header>
</template>
