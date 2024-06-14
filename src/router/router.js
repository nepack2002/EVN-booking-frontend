import {createRouter, createWebHistory} from "vue-router";
import {useUserStore} from "./store/auth.js";
import Car from "./components/Car/Car.vue";
import AddCar from "./components/Car/AddCar.vue";
import EditCar from "./components/Car/edit.vue";
import ImportCar from "./components/Car/ImportExcel.vue";
import User from "./components/User/User.vue";
import AddUser from "./components/User/addUser.vue";
import EditUser from "./components/User/EditUser.vue";
import ImportUser from "./components/User/importUser.vue";
import Department from "./components/Department/Department.vue";
import AddDepartment from "./components/Department/AddDepartment.vue";
import EditDepartment from "./components/Department/EditDepartment.vue";
import ImportDepartment from "./components/Department/importDepartment.vue";
import Coordinate from "./components/Coordinate/Coordinate.vue";
import AddCoordiante from "./components/Coordinate/AddCoordiante.vue";
import EditCoordinate from "./components/Coordinate/EditCoordinate.vue";
import ImportCoordinate from "./components/Coordinate/ImportCoordinate.vue";
import login from "./Auth/login.vue";
import Unauthorized from "./components/Unauthorized.vue";
import ForgotPassword from "./Auth/ForgotPassword.vue";
import CarOfUser from "./components/ForUsers/CarOfUser.vue";
import View from "./components/ForUsers/View.vue";
import account from "./components/ForUsers/account.vue";
import Home from "./components/Home.vue";

const Roles = {
    ADMIN: 'admin',
    QUAN_TRI_CONG_TAC: 'quản trị công tác',
    QUAN_TRI_VAT_TU: 'quản trị vật tư',
    USER: 'user',
}

const canAccess = (userRole, roles) => {
    return roles.includes(userRole);
}

const routes = [
    {
        path: "/",
        redirect: "/cars"
    },
    {
        path: "/unauthorized",
        name: "Unauthorized",
        component: Unauthorized
    },
    {
        path: "/cars",
        name: "Car",
        component: Car,
        meta: {requiresAuth: true, roles: [Roles.ADMIN, Roles.QUAN_TRI_VAT_TU]}
    },
    {
        path: "/cars/add",
        name: "AddCar",
        component: AddCar,
        meta: {requiresAuth: true, roles: [Roles.ADMIN, Roles.QUAN_TRI_VAT_TU]}
    },
    {
        path: "/cars/edit/:id",
        name: "Edit",
        component: EditCar,
        meta: {requiresAuth: true, roles: [Roles.ADMIN, Roles.QUAN_TRI_VAT_TU]}
    },
    {
        path: "/cars/importexcel",
        name: "ImportExcel",
        component: ImportCar,
        meta: {requiresAuth: true, roles: [Roles.ADMIN, Roles.QUAN_TRI_VAT_TU]}
    },
    {
        path: "/users",
        name: "User",
        component: User,
        meta: {requiresAuth: true, roles: [Roles.ADMIN]}
    },
    {
        path: "/users/add",
        name: "AddUser",
        component: AddUser,
        meta: {requiresAuth: true, roles: [Roles.ADMIN]}
    },
    {
        path: "/users/edit/:id",
        name: "EditUser",
        component: EditUser,
        meta: {requiresAuth: true, roles: [Roles.ADMIN]}
    },
    {
        path: "/users/importuser",
        name: "ImportUser",
        component: ImportUser,
        meta: {requiresAuth: true, roles: [Roles.ADMIN]}
    },
    {path: "/login", name: "Login", component: login},
    {
        path: "/forgot-password",
        name: "ForgotPassword",
        component: ForgotPassword
    },
    {
        path: "/home",
        name: "Home",
        component: Home,
        // meta: { requiresAuth: true, roles: [Roles.ADMIN, Roles.USER] }
    },
    {
        path: "/department",
        name: "Department",
        component: Department,
        meta: {requiresAuth: true, roles: [Roles.ADMIN]}
    },
    {
        path: "/department/add",
        name: "AddDepartment",
        component: AddDepartment,
        meta: {requiresAuth: true, roles: [Roles.ADMIN]}
    },
    {
        path: "/department/edit/:id",
        name: "EditDepartment",
        component: EditDepartment,
        meta: {requiresAuth: true, roles: [Roles.ADMIN]}
    },
    {
        path: "/department/importdepartment",
        name: "ImportDepartment",
        component: ImportDepartment,
        meta: {requiresAuth: true, roles: [Roles.ADMIN]}
    },
    {
        path: "/coordinate",
        name: "Coordinate",
        component: Coordinate,
        meta: {requiresAuth: true, roles: [Roles.ADMIN, Roles.QUAN_TRI_CONG_TAC]}
    },
    {
        path: "/coordinate/add",
        name: "AddCoordinate",
        component: AddCoordiante,
        meta: {requiresAuth: true, roles: [Roles.ADMIN, Roles.QUAN_TRI_CONG_TAC]}
    },
    {
        path: "/coordinate/edit/:id",
        name: "EditCoordinate",
        component: EditCoordinate,
        meta: {requiresAuth: true, roles: [Roles.ADMIN, Roles.QUAN_TRI_CONG_TAC]}
    },
    {
        path: "/coordinate/importcoordinate",
        name: "ImportCoordinate",
        component: ImportCoordinate,
        meta: {requiresAuth: true, roles: [Roles.ADMIN, Roles.QUAN_TRI_CONG_TAC]}
    },
    {
        path: "/carsofuser",
        name: "CarOfUser",
        component: CarOfUser,
        // meta: { requiresAuth: true, roles: [Roles.USER] }
    },
    {
        path: "/view/:id",
        name: "View",
        component: View,
        // meta: { requiresAuth: true, roles: [Roles.USER] }
    },
    {
        path: "/account",
        name: "Account",
        component: account,
        // meta: { requiresAuth: true, roles: [Roles.USER] }
    }

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
            next({name: 'Login'});
        } else {
            const userRole = userStore.user.role;

            if (!canAccess(userRole, to.meta.roles)) {
                if (userRole === Roles.ADMIN) {
                    next({name: 'User'});
                } else if (userRole === Roles.QUAN_TRI_CONG_TAC) {
                    next({name: 'Coordinate'});
                } else if (userRole === Roles.QUAN_TRI_VAT_TU) {
                    next({name: 'Car'});
                } else if (userRole === Roles.USER) {
                    next({name: 'CarOfUser'});
                } else {
                    next({name: 'Unauthorized'});
                }
            } else {
                next();
            }
        }
    } else {
        next();
    }
});


export default router;
