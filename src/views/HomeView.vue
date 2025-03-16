<template>
  <div class="p-4">
    <div class="flex justify-between mb-4">
      <h2 class="text-xl font-semibold">User Management</h2>
      <div class="btn-parent">
        <button
        v-if="hasPermission('write')"
        @click="isAddModalOpen = true"
        class="bg-blue-600 text-white mx-4 px-4 py-2 rounded hover:bg-blue-700"
      >
        Add User
      </button>
      <button @click="logout" class=" bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
        Logout
      </button>
      </div>
    </div>

    <!-- جدول المستخدمين -->
    <UserTable @edit="openEditModal" @delete="deleteUser" @changepage="changePage" />

    <!-- مودال إضافة المستخدم -->
    <UserModal 
      v-if="isAddModalOpen" 
      @close="isAddModalOpen = false" 
      @save="addUser" 
    />

    <!-- مودال تعديل المستخدم -->
    <EditUserModal 
      v-if="isEditModalOpen" 
      :user="selectedUser" 
      @close="isEditModalOpen = false" 
      @update="updateUser" 
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../store/userStore";
import { useAuthStore } from "../store/authStore";
import { storeToRefs } from "pinia";
import UserTable from "@/components/UserTable.vue";
import UserModal from "@/components/UserModal.vue";
import EditUserModal from "@/components/EditUserModal.vue";
import { useToast } from 'vue-toastification';

const userStore = useUserStore();
const authStore = useAuthStore();
const { users } = storeToRefs(userStore);

const isAddModalOpen = ref(false);
const isEditModalOpen = ref(false);
const selectedUser = ref(null);

const router = useRouter();
const toast = useToast();

onMounted(() => {
  userStore.fetchUsers();
});

// إضافة مستخدم جديد
const addUser = async (newUser) => {
  await userStore.addUser(newUser);
  isAddModalOpen.value = false;
  toast.success('User added successfully!');
};

// فتح مودال التعديل
const openEditModal = (user) => {
  selectedUser.value = { ...user };
  isEditModalOpen.value = true;
};

// تعديل بيانات المستخدم
const updateUser = async (updatedUser) => {
  await userStore.updateUser(updatedUser);
  isEditModalOpen.value = false;
  toast.success('User updated successfully!');
};

// حذف مستخدم
const deleteUser = async (userId) => {
  await userStore.deleteUser(userId);
  toast.error('User deleted successfully!');
};

// تغيير الصفحة
const changePage = (page) => {
  userStore.changePage(page);
};

// تسجيل الخروج
const logout = () => {
  authStore.logout();
  router.push('/login');
  toast.success('Good bye sir!');
};

// التحقق من الصلاحيات
const hasPermission = (permission) => {
  return authStore.user?.permissions.includes(permission);
};
</script>
