<script lang="ts" setup>
import {ref} from 'vue'

const switcherToggle = ref<boolean>(false)
</script>

<template>
  <div>
    <label class="flex cursor-pointer select-none items-center" for="toggle4">
      <div class="relative">
        <input
            id="toggle4"
            class="sr-only"
            type="checkbox"
            @change="switcherToggle = !switcherToggle"
        />
        <div
            :class="switcherToggle && '!bg-primary'"
            class="block h-8 w-14 rounded-full bg-black"
        ></div>
        <div
            :class="switcherToggle && '!right-1 !translate-x-full'"
            class="absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white transition"
        ></div>
      </div>
    </label>
  </div>
</template>
