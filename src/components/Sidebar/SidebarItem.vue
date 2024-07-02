<script lang="ts" setup>
import {useSidebarStore} from '@/stores/sidebar'
import {useRoute} from 'vue-router'
import SidebarDropdown from './SidebarDropdown.vue'

const sidebarStore = useSidebarStore()

const props = defineProps(['item', 'index'])
const currentPage = useRoute().name

interface SidebarItem {
  label: string
}

const handleItemClick = () => {
  const pageName = sidebarStore.page === props.item.label ? '' : props.item.label
  sidebarStore.page = pageName

  if (props.item.children) {
    return props.item.children.some((child: SidebarItem) => sidebarStore.selected === child.label)
  }
}
</script>

<template>
  <li>
    <router-link
        :class="{
        'bg-primary-dark dark:bg-meta-4': sidebarStore.page === item.label
      }"
        :to="item.route"
        class="group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-primary-dark dark:hover:bg-meta-4"
        @click.prevent="handleItemClick"
    >
      <span v-html="item.icon"></span>

      {{ item.label }}

      <svg
          v-if="item.children"
          :class="{ 'rotate-180': sidebarStore.page === item.label }"
          class="absolute right-4 top-1/2 -translate-y-1/2 fill-current"
          fill="none"
          height="20"
          viewBox="0 0 20 20"
          width="20"
          xmlns="http://www.w3.org/2000/svg"
      >
        <path
            clip-rule="evenodd"
            d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
            fill=""
            fill-rule="evenodd"
        />
      </svg>
    </router-link>

    <!-- Dropdown Menu Start -->
    <div v-show="sidebarStore.page === item.label" class="translate transform overflow-hidden">
      <SidebarDropdown
          v-if="item.children"
          :currentPage="currentPage"
          :items="item.children"
          :page="item.label"
      />
      <!-- Dropdown Menu End -->
    </div>
  </li>
</template>
