<script lang="ts" setup>
import {ref} from 'vue'

const checkboxToggle = ref<boolean>(false)
</script>

<template>
  <div>
    <label class="flex cursor-pointer select-none items-center" for="checkboxLabelOne">
      <div class="relative">
        <input
            id="checkboxLabelOne"
            class="sr-only"
            type="checkbox"
            @change="checkboxToggle = !checkboxToggle"
        />
        <div
            :class="checkboxToggle && 'border-primary bg-gray dark:bg-transparent'"
            class="mr-4 flex h-5 w-5 items-center justify-center rounded border"
        >
          <span :class="checkboxToggle && 'bg-primary'" class="h-2.5 w-2.5 rounded-sm"></span>
        </div>
      </div>
      Checkbox Text
    </label>
  </div>
</template>
