<script setup>
import DarkModeSwitcher from './DarkModeSwitcher.vue'
import DropdownNotification from './DropdownNotification.vue'
import DropdownUser from './DropdownUser.vue'
import { useUserStore } from '@/stores/auth.js'

const userStore = useUserStore()

userStore.fetchUser()
</script>

<template>
  <header
    class="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none"
    v-if="userStore.user"
  >
    <div class="flex flex-grow items-center justify-between py-4 px-4 shadow-2 md:px-6 2xl:px-11">
      <router-link class="hidden lg:block flex-shrink-0" to="/">
        <img src="@/assets/images/logo/Asset.png" alt="Logo" class="w-20" />
      </router-link>

      <ul class="flex gap-x-0 lg:gap-x-36">
        <li class="max-lg:py-3 px-2">
          <router-link
            :to="{ name: 'CarOfUser' }"
            class="hover:text-[#007bff] text-black dark:text-white font-semibold block text-sm lg:text-base text-nowrap"
            >Trang chủ</router-link
          >
        </li>
        <li class="max-lg:py-3 px-2">
          <router-link
            :to="{ name: 'Account' }"
            class="hover:text-[#007bff] text-black dark:text-white font-semibold block text-sm lg:text-base text-nowrap"
            >Tài khoản</router-link
          >
        </li>
      </ul>

      <div class="flex items-center gap-3 2xsm:gap-7">
        <ul class="flex items-center gap-2 2xsm:gap-4">
          <li>
            <!-- Dark Mode Toggler -->
            <DarkModeSwitcher />
            <!-- Dark Mode Toggler -->
          </li>

          <!-- Notification Menu Area -->
          <DropdownNotification />
          <!-- Notification Menu Area -->
        </ul>

        <!-- User Area -->
        <DropdownUser />
        <!-- User Area -->
      </div>
    </div>
  </header>
</template>