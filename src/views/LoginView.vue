<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white p-8 rounded shadow-md w-full max-w-md">
      <h2 class="text-2xl font-semibold mb-6">Login</h2>
      <form @submit.prevent="login">
        <div class="mb-4">
          <label class="block text-gray-700">Email</label>
          <input v-model="email" type="email" class="border p-2 rounded-md w-full" required />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Password</label>
          <input v-model="password" type="password" class="border p-2 rounded-md w-full" required />
        </div>
        <div class="flex justify-end">
          <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Login</button>
        </div>
      </form>
      <div v-if="error" class="text-red-500 mt-4">{{ error }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/authStore';
import { useToast } from 'vue-toastification';

const email = ref('');
const password = ref('');
const error = ref<string | null>(null);
const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

const login = async () => {
  try {
    await authStore.login({ email: email.value, password: password.value });
    toast.success('Login successful!');
    router.push('/');
  } catch (err) {
    error.value = 'Invalid email or password';
    toast.error('Invalid email or password');
  }
};
</script>