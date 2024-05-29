import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/stores/auth.js";
import Login from "@/views/Authentication/SigninView.vue";
import CarOfUser from "@/components/ForUsers/CarOfUser.vue";
import View from "@/components/ForUsers/View.vue";
import account from "@/components/ForUsers/account.vue";
import Car from "@/components/Car/Car.vue";
import EditCar from "@/components/Car/EditCar.vue";
import AddCar from "@/components/Car/AddCar.vue";
import ImportCar from "@/components/Car/ImportCar.vue";
import User from "@/components/User/User.vue";
import AddUser from "@/components/User/addUser.vue";
import EditUser from "@/components/User/EditUser.vue";
import ImportUser from "@/components/User/importUser.vue";
import Department from "@/components/Department/Department.vue";
import AddDepartment from "@/components/Department/AddDepartment.vue";
import EditDepartment from "@/components/Department/EditDepartment.vue";
import ImportDepartment from "@/components/Department/importDepartment.vue";
import Schedule from "@/components/Schedule/Schedule.vue";
import AddSchedule from "@/components/Schedule/AddSchedule.vue";
import EditSchedule from "@/components/Schedule/EditSchedule.vue";
import ImportSchedule from "@/components/Schedule/ImportSchedule.vue";
const Roles = {
  ADMIN: 'admin',
  QUAN_TRI_CONG_TAC: 'quản trị công tác',
  QUAN_TRI_VAT_TU: 'quản trị vật tư',
  USER: 'user',
};

const canAccess = (userRole, roles) => {
  return roles.includes(userRole);
};

const routes = [
  {
    path: "/",
    redirect: "/car"
  },
  {
    path: "/car",
    name: "Car",
    component: Car,
    meta: { requiresAuth: true, roles: [Roles.ADMIN, Roles.QUAN_TRI_VAT_TU] }
  },
  {
    path: "/car/add",
    name: "AddCar",
    component: AddCar,
    meta: { requiresAuth: true, roles: [Roles.ADMIN, Roles.QUAN_TRI_VAT_TU] }
  },
  {
    path: "/car/edit/:id",
    name: "EditCar",
    component: EditCar,
    meta: { requiresAuth: true, roles: [Roles.ADMIN, Roles.QUAN_TRI_VAT_TU] }
  },
  {
    path: "/car/importcar",
    name: "ImportCar",
    component: ImportCar,
    meta: { requiresAuth: true, roles: [Roles.ADMIN, Roles.QUAN_TRI_VAT_TU] }
  },
  {
    path: "/users",
    name: "User",
    component: User,
    meta: { requiresAuth: true, roles: [Roles.ADMIN] }
  },
  {
    path: "/users/add",
    name: "AddUser",
    component: AddUser,
    meta: { requiresAuth: true, roles: [Roles.ADMIN] }
  },
  {
    path: "/users/edit/:id",
    name: "EditUser",
    component: EditUser,
    meta: { requiresAuth: true, roles: [Roles.ADMIN] }
  },
  {
    path: "/users/importuser",
    name: "ImportUser",
    component: ImportUser,
    meta: { requiresAuth: true, roles: [Roles.ADMIN] }
  },
  {
    path: "/department",
    name: "Department",
    component: Department,
    meta: { requiresAuth: true, roles: [Roles.ADMIN] }
  },
  {
    path: "/department/add",
    name: "AddDepartment",
    component: AddDepartment,
    meta: { requiresAuth: true, roles: [Roles.ADMIN] }
  },
  {
    path: "/department/edit/:id",
    name: "EditDepartment",
    component: EditDepartment,
    meta: { requiresAuth: true, roles: [Roles.ADMIN] }
  },
  {
    path: "/department/importdepartment",
    name: "ImportDepartment",
    component: ImportDepartment,
    meta: { requiresAuth: true, roles: [Roles.ADMIN] }
  },
  {
    path: "/schedule",
    name: "Schedule",
    component: Schedule,
    meta: { requiresAuth: true, roles: [Roles.ADMIN, Roles.QUAN_TRI_CONG_TAC] }
  },
  {
    path: "/schedule/add",
    name: "AddSchedule",
    component: AddSchedule,
    meta: { requiresAuth: true, roles: [Roles.ADMIN, Roles.QUAN_TRI_CONG_TAC] }
  },
  {
    path: "/schedule/edit/:id",
    name: "EditSchedule",
    component: EditSchedule,
    meta: { requiresAuth: true, roles: [Roles.ADMIN, Roles.QUAN_TRI_CONG_TAC] }
  },
  {
    path: "/schedule/importschedule",
    name: "ImportSchedule",
    component: ImportSchedule,
    meta: { requiresAuth: true, roles: [Roles.ADMIN, Roles.QUAN_TRI_CONG_TAC] }
  },
  {
    path: "/carsofuser",
    name: "CarOfUser",
    component: CarOfUser,
    meta: { requiresAuth: true, roles: [Roles.USER] }
  },
  {
    path: "/view/:id",
    name: "View",
    component: View,
    meta: { requiresAuth: true, roles: [Roles.USER] }
  },
  {
    path: "/account",
    name: "Account",
    component: account,
    meta: { requiresAuth: true, roles: [Roles.USER] }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();

  if (!userStore.getUser && userStore.getToken) {
    await userStore.fetchUser();
  }

  if (to.meta.requiresAuth) {
    if (!userStore.getToken) {
      next({ name: 'Login' });
    } else {
      const userRole = userStore.user.role;
      if (!canAccess(userRole, to.meta.roles)) {
        if (userRole === Roles.ADMIN || userRole === Roles.QUAN_TRI_VAT_TU) {
          next({ name: 'Car' });
        } else if (userRole === Roles.QUAN_TRI_CONG_TAC) {
          next({ name: 'Coordinate' });
        } else if (userRole === Roles.USER) {
          next({ name: 'CarOfUser' });
        } else {
          next({ name: 'Unauthorized' });
        }
      } else {
        next();
      }
    }
  } else if (to.name === 'Login' && userStore.getToken) {
    const userRole = userStore.user.role;
    if (userRole === Roles.ADMIN || userRole === Roles.QUAN_TRI_VAT_TU) {
      next({ name: 'Car' });
    } else if (userRole === Roles.QUAN_TRI_CONG_TAC) {
      next({ name: 'Coordinate' });
    } else if (userRole === Roles.USER) {
      next({ name: 'CarOfUser' });
    } else {
      next({ name: 'Unauthorized' });
    }
  } else {
    next();
  }
});

export default router;
