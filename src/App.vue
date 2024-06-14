<template>
  <RouterView/>
</template>

<script setup>
import {useUserStore} from '@/stores/auth.js'

const userStore = useUserStore()

// onMounted(async () => {
//   await userStore.fetchUser()
//   await post();
// })
// const post = async () => {
//   try {
//     await axios.post('/send-oneSignal', {
//       onesignal_id: a,
//       user_id: userStore.user.id,
//     })
//   } catch (e) {
//     console.error('Error:', e)
//   }
// }
</script>
