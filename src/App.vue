<script>
import Header from "./components/Header.vue";
import HeaderUsser from "./components/HeaderUsser.vue";
import { computed, onMounted, ref } from "vue";
import { useUserStore } from "./store/auth.js";

export default {
  components: {
    Header,
    HeaderUsser,
  },
  setup() {
    const userStore = useUserStore();
    const isReady = ref(false); // Biến kiểm tra trạng thái sẵn sàng của dữ liệu người dùng

  
    const IsUser = computed(() => {
      const user = userStore.getUser;
      return !user || (user && user.role === "user");
    });

    onMounted(async () => {
      await userStore.fetchUser(); 
      isReady.value = true;
    });

    // Tạo một computed để quản lý lớp điều kiện
    const containerClass = computed(() => {
      return IsUser.value ? "" : "flex";
    });

    return {
      IsUser,
      isReady,
      containerClass,
    };
  },
};
</script>

<template>
  <div
    :class="[
      'w-full min-h-screen font-sans text-gray-900 bg-gray-50',
      containerClass,
    ]"
  >
    <!-- Khi isReady là true thì mới hiển thị Header tương ứng -->
    <HeaderUsser v-if="IsUser && isReady" />
    <Header v-else-if="!IsUser" />
    <router-view></router-view>
  </div>
</template>
