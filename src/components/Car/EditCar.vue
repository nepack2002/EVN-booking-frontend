<template>
  <DefaultLayout>
    <div class="mx-auto w-[80%]">
      <div class="col-span-5 xl:col-span-3">
        <div
            class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
        >
          <div class="border-b border-stroke py-4 px-7 dark:border-strokedark">
            <h3 class="font-medium text-black dark:text-white">Thông tin ô tô</h3>
          </div>

          <div class="p-7">
            <form @submit.prevent="handleSubmit" enctype="multipart/form-data" method="post">
              <!-- Full Name Section -->
              <div class="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                <div class="w-full sm:w-1/2">
                  <label
                      :class="{
                      'text-red': errorMessage.ten_xe
                    }"
                      class="mb-3 block text-sm font-medium text-black dark:text-white"
                      for="fullName"
                  >Tên xe</label
                  >
                  <div class="">
                    <input
                        v-model="form.ten_xe"
                        class="w-full rounded border border-stroke bg-gray py-3 px-5 pr-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="fullName"
                        id="fullName"
                        placeholder="Tên xe"
                    />
                  </div>
                </div>

                <!-- Phone Number Section -->
                <div class="w-full sm:w-1/2">
                  <label
                      :class="{
                      'text-red': errorMessage.user_id
                    }"
                      class="mb-3 block text-sm font-medium text-black dark:text-white"
                      for="phoneNumber"
                  >Tài xế</label
                  >
                  <select
                      class="w-full rounded border border-stroke bg-gray py-3 px-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      v-model="form.user_id"
                  >
                    <option v-for="user in users" :key="user.id" :value="user.id">
                      {{ user.id }} - {{ user.name }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="mb-5.5">
                <input
                    v-model="form.theo_doi_vi_tri"
                    class="mr-3"
                    type="checkbox"
                    name="theo_doi_vi_tri"
                    id="theo_doi_vi_tri"
                    :true-value="1"
                    :false-value="0"
                />
                <label
                    :class="{
                    'text-red': errorMessage.theo_doi_vi_tri
                  }"
                    class="mb-3 text-sm font-medium text-black dark:text-white"
                    for="theo_doi_vi_tri"
                >Cho phép theo dõi vị trí</label>
              </div>
              <!-- Email Address Section -->
              <div class="mb-5.5">
                <label
                    :class="{
                    'text-red': errorMessage.mau_xe
                  }"
                    class="mb-3 block text-sm font-medium text-black dark:text-white"
                    for="mauxe"
                >Màu xe</label
                >
                <div class="relative">
                  <input
                      v-model="form.mau_xe"
                      class="w-full rounded border border-stroke bg-gray py-3 px-5 pr-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="text"
                      name="mauxe"
                      id="mauxe"
                      placeholder="Màu xe"
                  />
                </div>
              </div>

              <!-- Username Section -->
              <div class="mb-5.5">
                <label
                    :class="{
                    'text-red': errorMessage.bien_so_xe
                  }"
                    class="mb-3 block text-sm font-medium text-black dark:text-white"
                    for="biensoxe"
                >Biển số xe</label
                >
                <input
                    v-model="form.bien_so_xe"
                    class="w-full rounded border border-stroke bg-gray py-3 px-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    name="biensoxe"
                    id="biensoxe"
                    placeholder="Biển số xe"
                />
              </div>
              <div class="mb-5.5">
                <label
                    :class="{
                    'text-red': errorMessage.so_khung
                  }"
                    class="mb-3 block text-sm font-medium text-black dark:text-white"
                    for="sokhung"
                >Số khung</label
                >
                <input
                    v-model="form.so_khung"
                    class="w-full rounded border border-stroke bg-gray py-3 px-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    name="sokhung"
                    id="sokhung"
                    placeholder="Số khung"
                />
              </div>
              <div class="mb-5.5">
                <label
                    :class="{
                    'text-red': errorMessage.so_may
                  }"
                    class="mb-3 block text-sm font-medium text-black dark:text-white"
                    for="so_may"
                >Số máy</label
                >
                <input
                    v-model="form.so_may"
                    class="w-full rounded border border-stroke bg-gray py-3 px-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    name="so_may"
                    id="so_may"
                    placeholder="Số máy"
                />
              </div>
              <div class="mb-5.5">
                <label
                    :class="{
                    'text-red': errorMessage.so_cho
                  }"
                    class="mb-3 block text-sm font-medium text-black dark:text-white"
                    for="socho">Số chỗ</label
                >
                <input
                    v-model="form.so_cho"
                    class="w-full rounded border border-stroke bg-gray py-3 px-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    name="socho"
                    id="socho"
                    placeholder="Số chỗ"
                />
              </div>
              <div class="mb-5.5">
                <label
                    :class="{
                    'text-red': errorMessage.so_dau_xang_tieu_thu
                  }"
                    class="mb-3 block text-sm font-medium text-black dark:text-white"
                    for="tieuthu"
                >Số xăng, dầu tiêu thụ (L/100KM)</label
                >
                <input
                    v-model="form.so_dau_xang_tieu_thu"
                    class="w-full rounded border border-stroke bg-gray py-3 px-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="number"
                    name="tieuthu"
                    id="tieuthu"
                    placeholder="L/100KM"
                />
              </div>
              <div class="mb-5.5">
                <label
                    :class="{
                    'text-red': errorMessage.ngay_bao_duong_gan_nhat
                  }"
                    class="mb-3 block text-sm font-medium text-black dark:text-white"
                    for="ngay_bao_duong"
                >Ngày bảo dưỡng gần nhất</label
                >
                <date-picker-one v-model="form.ngay_bao_duong_gan_nhat"/>
              </div>
              <div class="mb-5.5">
                <label
                    :class="{
                    'text-red': errorMessage.han_dang_kiem_tiep_theo
                  }"
                    class="mb-3 block text-sm font-medium text-black dark:text-white"
                    for="han_dang_kiem_tiep_theo"
                >Hạn đăng kiểm tiếp theo</label
                >
                <date-picker-one v-model="form.han_dang_kiem_tiep_theo"/>
              </div>
              <div class="mb-5.5">
                <label
                    :class="{
                    'text-red': errorMessage.ngay_sua_chua_lon_gan_nhat
                  }"
                    class="mb-3 block text-sm font-medium text-black dark:text-white"
                    for="ngay_sua_chua_lon_gan_nhat"
                >Ngày sửa chữa lớn gần nhất</label>
                <date-picker-one v-model="form.ngay_sua_chua_lon_gan_nhat"/>
              </div>
              <div class="mb-5.5">
                <label
                    :class="{
                    'text-red': errorMessage.anh_xe
                  }"
                    class="mb-3 block text-sm font-medium text-black dark:text-white"
                    for="Username"
                >Ảnh xe</label
                >
                <input
                    type="file"
                    id="anh_xe"
                    class="w-full rounded border border-stroke bg-gray py-3 px-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    @change="handleFileUpload"
                />
                <!-- Hiển thị ảnh đã chọn -->
                <div v-if="form.anh_xe">
                  <img :src="form.anh_xe" alt=""/>
                </div>
                <div v-if="form.anh_xe_preview">
                  <img :src="form.anh_xe_preview" alt=""/>
                </div>
              </div>
              <div class="mb-5.5">
                <label
                    :class="{
                    'text-red': errorMessage.location
                  }"
                    class="mb-3 block text-sm font-medium text-black dark:text-white"
                >Vị trí hiện tại</label
                >
                <div class="relative">
                  <input
                      type="text"
                      class="w-full rounded border border-stroke bg-gray py-3 px-4.5 font-normal text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      v-model="form.location"
                      placeholder="Điền địa chỉ để hiển thị gợi ý..."
                      @input="handleShowSuggestion"
                  />
                  <ul class="mb-5.5">
                    <li
                        v-for="prediction in predictions"
                        :key="prediction"
                        @click="selectSuggestion(prediction.description)"
                        class="cursor-pointer py-2 px-4 hover:bg-gray-200"
                    >
                      {{ prediction.description }}
                    </li>
                  </ul>
                </div>
              </div>
              <div class="w-[100%] flex justify-end gap-5">
                <button
                    class="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                >
                  <router-link :to="{ name: 'Car' }">Hủy</router-link>
                </button>
                <button
                    type="submit"
                    class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded"
                >
                  Cập nhật
                </button>
              </div>
              <p v-if="showAddSuccess" class="text-green-500 ml-10 font-semibold text-md">
                Cập nhật thành công
              </p>
              <div v-if="messages" class="w-[100%] bg-red-400 text-white rounded-md p-2 my-5">
                {{ messages }}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import {onMounted, ref} from "vue";
import {useUserStore} from "@/stores/auth.js";
import axios from "axios";
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import {useRoute} from "vue-router";
import DatePickerOne from "@/components/Forms/DatePicker/DatePickerOne.vue";
import debounce from "lodash.debounce";

const errorMessage = ref({});
const messages = ref('');
const showAddSuccess = ref(false);
const form = ref({
  ten_xe: "",
  mau_xe: "",
  user_id: "",
  bien_so_xe: "",
  so_khung: "",
  so_cho: "",
  dac_diem_mac_dinh: "",
  so_dau_xang_tieu_thu: "",
  ngay_bao_duong_gan_nhat: "",
  han_dang_kiem_tiep_theo: "",
  anh_xe: "",
  ngay_sua_chua_lon_gan_nhat: '',
  so_may: '',
  theo_doi_vi_tri: 1,
});
const predictions = ref([])

const users = ref([]);
const userStore = useUserStore();
onMounted(async () => {
  // await userStore.fetchUser();
});

const fetchUsers = async () => {
  try {
    const response = await axios.get("/drivers", {
      headers: {
        Authorization: `Bearer ${userStore.token}`,
      },
    });
    users.value = response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách người lái:", error);
  }
};
const route = useRoute();
const getCars = async () => {
  try {
    const response = await axios.get(
        `/cars/${route.params.id}`,
        {
          headers: {
            Authorization: `Bearer ${userStore.token}`,
          },
        }
    );
    form.value = response.data; // Cập nhật giá trị của reactivity object form với thông tin của chiếc xe
  } catch (error) {
    console.error("Lỗi khi lấy thông tin xe:", error);
  }
};
const handleSubmit = async (event) => {
  event.preventDefault(); // Ngăn chặn form gửi đi mặc định

  try {
    const formData = new FormData();
    // Thêm các trường vào FormData
    formData.append("ten_xe", form.value.ten_xe);
    formData.append("mau_xe", form.value.mau_xe);
    formData.append("user_id", form.value.user_id);
    formData.append("bien_so_xe", form.value.bien_so_xe);
    formData.append("so_khung", form.value.so_khung);
    formData.append("so_cho", form.value.so_cho);
    formData.append('so_may', form.value.so_may)
    formData.append("dac_diem_mac_dinh", form.value.dac_diem_mac_dinh);
    formData.append(
        "so_dau_xang_tieu_thu",
        form.value.so_dau_xang_tieu_thu
    );
    formData.append(
        "ngay_bao_duong_gan_nhat",
        form.value.ngay_bao_duong_gan_nhat
    );
    formData.append(
        "han_dang_kiem_tiep_theo",
        form.value.han_dang_kiem_tiep_theo
    );
    formData.append('ngay_sua_chua_lon_gan_nhat', form.value.ngay_sua_chua_lon_gan_nhat)
    formData.append('theo_doi_vi_tri', form.value.theo_doi_vi_tri)
    if (form.value.anh_xe) {
      formData.append("anh_xe", form.value.anh_xe);
    }
    const response = await axios.post(
        `/cars/${route.params.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${userStore.token}`,
          },
        } // Gửi dữ liệu form lên máy chủ
    );
    console.log(formData);
    showAddSuccess.value = true;
    // Tự động ẩn thông báo sau 2 giây
    setTimeout(() => {
      showAddSuccess.value = false;
    }, 2000);
    messages.value = null;
    console.log(response.data); // Log response từ máy chủ
    // Reset form hoặc thực hiện các hành động khác sau khi cập nhật thành công
  } catch (error) {
    if (error.response && error.response.status === 409) {
      messages.value = error.response.data.messages;
    } else {
      errorMessage.value = error.response.data.errors;
      messages.value = null;
    }
  }
};
onMounted(() => {
  fetchUsers();
  getCars();
});
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  form.value.anh_xe = file;
  console.log(form.value.anh_xe);
  const reader = new FileReader();
  reader.onload = () => {
    form.value.anh_xe_preview = reader.result;
  };
  reader.readAsDataURL(file);
}

const handleShowSuggestion = debounce(() => showSuggestions(), 1000)

async function showSuggestions() {
  const apiKey = import.meta.env.VITE_KEY
  const url = `https://rsapi.goong.io/Place/AutoComplete?api_key=${apiKey}&input=${encodeURIComponent(
      form.value.location
  )}`
  if (form.value.location.length > 0) {
    try {
      const response = await fetch(url)
      const data = await response.json()
      predictions.value = data.predictions
    } catch (error) {
      console.error('Error:', error)
    }
  } else {
    predictions.value = []
    form.value.lat_location = ''
    form.value.long_location = ''
  }
}
async function selectSuggestion(selectedDescription) {
  const selectedPrediction = predictions.value.find(
      (prediction) => prediction.description === selectedDescription
  )
  //   console.log(selectedPrediction);
  if (selectedPrediction) {
    const placeId = selectedPrediction.place_id
    const apiKey = import.meta.env.VITE_KEY
    const placeDetailUrl = `https://rsapi.goong.io/Place/Detail?place_id=${placeId}&api_key=${apiKey}`

    try {
      const response = await fetch(placeDetailUrl)
      const data = await response.json()
      form.value.lat_location = data.result.geometry.location.lat
      form.value.long_location = data.result.geometry.location.lng
      form.value.location = data.result.formatted_address
      predictions.value = [];
      console.log('Coordinates sent successfully to Laravel.')
    } catch (error) {
      console.error('Error:', error)
    }
  } else {
    console.error('Selected prediction not found.')
  }
}
</script>

