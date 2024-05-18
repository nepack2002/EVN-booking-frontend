<template>
  <div class="mx-auto md:ml-64 lg:mx-auto">
    <div class="flex justify-center">
      <div class="w-[100%] md:w-[600px]">
        <form @submit.prevent="login" class="p-8 relative" v-if="!user">
          <div class="flex items-center w-full justify-center mb-10">
            <img
              src="../../public/img/Frame.png"
              class="w-[400px] object-cover"
              alt=""
            />
          </div>

          <h1
            class="text-center mb-5 text-2xl font-bold leading-[21px] tracking-wide"
          >
            ĐĂNG NHẬP
          </h1>
          <div
            v-if="errors"
            class="w-[100%] bg-red-400 text-white rounded-md p-2 my-5"
          >
            {{ errors }}
          </div>

          <div class="form-group mb-5 relative">
            <input
              type="text"
              id="username"
              class="input2"
              v-model="username"
              @invalid="preventDefault"
              required
            />
            <label
              for="username"
              class="absolute left-[10px] text-gray-400 top-[50%] translate-y-[-50%] pointer-events-none bg-white"
              >Tên tài khoản</label
            >
          </div>
          <div class="mb-5 form-group relative">
            <input
              type="password"
              id="password"
              class="input2"
              v-model="password"
              required
            />
            <label
              for="password"
              class="absolute left-[10px] text-gray-400 top-[50%] translate-y-[-50%] pointer-events-none bg-white"
              >Mật khẩu</label
            >
          </div>

          <div class="grid">
            <button
              type="submit"
              class="bg-blue-700 hover:bg-blue-400 text-white font-medium py-2 px-4 rounded"
              name="login"
            >
              ĐĂNG NHẬP
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<style>
.form-group input:focus + label,
.form-group input:valid + label {
  top: 0px !important;
  color: black;
  font-size: 14px !important;
  transition: 0.3s ease-in-out;
}
</style>
<script>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../store/auth.js";

export default {
  setup() {
    const router = useRouter();
    const userStore = useUserStore();
    const username = ref("");
    const password = ref("");
    const login = async () => {
      try {
        await userStore.login(username.value, password.value);
        if (user.value) {
          router.push("/cars");
        }
      } catch (error) {
        console.log("lỗi");
      }
    };
    const logout = async () => {
      await userStore.logout();
    };
    const preventDefault = (event) => {
      event.preventDefault();
    };
    // const token = computed(() => userStore.getToken);
    const user = computed(() => userStore.getUser);
    const error = computed(() => userStore.getErrorMessage);
    const errors = computed(() => userStore.getError);
    onMounted(async () => {
      await userStore.fetchUser();
    });

    return {
      username,
      password,
      login,
      logout,
      user,
      error,
      errors,
      preventDefault,
    };
  },
};
</script>


