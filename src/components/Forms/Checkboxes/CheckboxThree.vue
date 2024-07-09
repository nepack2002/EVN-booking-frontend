<script lang="ts" setup>
import {ref} from 'vue'

const checkboxToggle = ref<boolean>(false)
</script>

<template>
  <div>
    <label class="flex cursor-pointer select-none items-center" for="checkboxLabelThree">
      <div class="relative">
        <input
            id="checkboxLabelThree"
            class="sr-only"
            type="checkbox"
            @change="checkboxToggle = !checkboxToggle"
        />
        <div
            :class="checkboxToggle && 'border-primary bg-gray dark:bg-transparent'"
            class="box mr-4 flex h-5 w-5 items-center justify-center rounded border"
        >
          <span :class="checkboxToggle && '!opacity-100'" class="text-primary opacity-0">
            <svg
                class="h-3.5 w-3.5 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
              <path
                  d="M6 18L18 6M6 6l12 12"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
              ></path>
            </svg>
          </span>
        </div>
      </div>
      Checkbox Text
    </label>
  </div>
</template>
