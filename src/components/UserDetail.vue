<template>
  <div class="p-4 animate__animated animate__fadeIn">
    <h2 class="text-xl font-semibold mb-4">{{ $t('welcome') }}</h2>
    <div v-if="loading" class="text-center py-4">Loading...</div>
    <div v-else-if="userError" class="text-center py-4 text-red-500">{{ userError }}</div>
    <div v-else>
      <div class="flex items-center mb-4">
        <h3 class="text-lg font-semibold">{{ user.name }}</h3>
      </div>
      <form @submit.prevent="updateUserHandler">
        <div class="mb-4 animate__animated animate__fadeInLeft">
          <label class="block text-gray-700">{{ $t('name') }}</label>
          <input v-model="user.name" type="text" class="border p-2 rounded-md w-full" required />
        </div>
        <div class="mb-4 animate__animated animate__fadeInRight">
          <label class="block text-gray-700">{{ $t('email') }}</label>
          <input v-model="user.email" type="email" class="border p-2 rounded-md w-full" required />
        </div>
        <div class="mb-4 animate__animated animate__fadeInLeft">
          <label class="block text-gray-700">{{ $t('role') }}</label>
          <select v-model="user.role" @change="updatePermissions" class="border p-2 rounded-md w-full" required>
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="Viewer">Viewer</option>
          </select>
        </div>
        <div class="mb-4 animate__animated animate__fadeInRight">
          <label class="block text-gray-700">{{ $t('status') }}</label>
          <select v-model="user.status" class="border p-2 rounded-md w-full" required>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <div class="mb-4 animate__animated animate__fadeInLeft">
          <label class="block text-gray-700">{{ $t('permissions') }}</label>
          <div class="flex flex-wrap gap-2">
            <label v-for="permission in allPermissions" :key="permission" class="flex items-center">
              <input type="checkbox" v-model="user.permissions" :value="permission" class="mr-2" />
              {{ permission }}
            </label>
          </div>
        </div>
        <div class="flex justify-end">
          <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" :disabled="updating">
            {{ updating ? $t('saving') : $t('save') }}
          </button>
          <button type="button" class="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 ml-2" @click="router.back()">{{ $t('back') }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "../store/userStore";
import { useToast } from 'vue-toastification';
import "animate.css";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  permissions: string[];
}

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const { users, loading } = storeToRefs(userStore);
const toast = useToast();

const userError = ref<string | null>(null);
const updating = ref(false);

const user = ref<User>({
  id: 0,
  name: "",
  email: "",
  role: "Viewer",
  status: "Inactive",
  createdAt: "",
  permissions: [],
});

const allPermissions = ["read", "write", "delete"];
const rolePermissions: { [key: string]: string[] } = {
  Admin: ["read", "write", "delete"],
  Manager: ["read", "write"],
  Viewer: ["read"],
};

const updatePermissions = () => {
  const defaultPermissions = rolePermissions[user.value.role] || [];
  user.value.permissions = user.value.permissions.filter((perm) => defaultPermissions.includes(perm));
};

onMounted(async () => {
  const userId = Number(route.params.id);
  if (isNaN(userId)) {
    userError.value = "Invalid user ID";
    toast.error("Invalid user ID");
    return;
  }

  try {
    if (!users.value.length) await userStore.fetchUsers();
    const foundUser = users.value.find((u) => u.id === userId);
    if (foundUser) {
      user.value = { ...foundUser, permissions: foundUser.permissions || [] as string[] };
    } else {
      userError.value = "User not found";
      toast.error("User not found");
    }
  } catch (err) {
    userError.value = "Failed to load user data";
    toast.error("Failed to load user data");
  }
});

const updateUserHandler = async () => {
  updating.value = true;
  try {
    await userStore.updateUser(user.value);
    toast.success("User updated successfully!");
    router.push("/");
  } catch (err) {
    userError.value = "Failed to update user";
    toast.error("Failed to update user");
  } finally {
    updating.value = false;
  }
};

watch(() => user.value.role, updatePermissions);
</script>

<style scoped>
button {
  transition: all 0.3s ease-in-out;
}
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

:root {
  --bg-color: #ffffff;
  --text-color: #000000;
}

.dark {
  --bg-color: #000000;
  --text-color: #ffffff;
}

body {
  background-color: var(--bg-color);
  color: var(--text-color);
  transition: background-color 0.3s, color 0.3s;
}

h2, h3, label, input, select, button {
  color: var(--text-color);
}
</style>