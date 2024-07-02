<script lang="ts" setup>
import {ref} from 'vue'

const switcherToggle = ref<boolean>(false)
</script>

<template>
  <div>
    <label class="flex cursor-pointer select-none items-center" for="toggle2">
      <div class="relative">
        <input
            id="toggle2"
            class="sr-only"
            type="checkbox"
            @change="switcherToggle = !switcherToggle"
        />
        <div class="h-5 w-14 rounded-full bg-meta-9 shadow-inner dark:bg-[#5A616B]"></div>
        <div
            :class="switcherToggle && '!right-0 !translate-x-full !bg-primary dark:!bg-white'"
            class="dot absolute left-0 -top-1 h-7 w-7 rounded-full bg-white shadow-switch-1 transition"
        ></div>
      </div>
    </label>
  </div>
</template>
