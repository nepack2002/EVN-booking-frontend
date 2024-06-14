<!-- eslint-disable vue/multi-word-component-names -->
<!-- ConfirmModal.vue -->
<template>
  <div v-if="isVisible" class="fixed inset-0 z-50 flex items-center justify-center bg-black-59">
    <div class="bg-white dark:bg-boxdark  dark:text-white rounded-lg p-6 text-center text-black">
      <div class="text-orange-500 text-3xl mb-4">
        <i class="fas fa-bell"></i>
      </div>
      <h2 class="text-xl font-bold mb-2">Xác nhận</h2>
      <p class="mb-4">Bạn chắc chắn muốn kết thúc chuyến đi?</p>
      <div class="flex justify-around">
        <button
            @click="confirm"
            class="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
        >
          Đồng ý
        </button>
        <button
            @click="cancel"
            class="py-2 px-4 bg-red text-white text-gray-700 rounded-lg hover:bg-gray-400 focus:outline-none ml-2"
        >
          Hủy
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['confirm', 'cancel'],
  methods: {
    confirm() {
      this.$emit('confirm');
    },
    cancel() {
      this.$emit('cancel');
    },
  },
};
</script>

<style scoped>
.fixed {
  position: fixed;
}
</style>
