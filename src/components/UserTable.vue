<template>
  <div class="p-4" role="main">
    <div class="mb-4 flex gap-4">
      <!-- Search Input -->
       <label for="search">
        search
       </label>
      <input v-model="search" :placeholder="$t('search')" class="border p-2 rounded-md" aria-label="Search" />

      <!-- Role Filter -->
      <Listbox v-model="roleFilter">
        <div class="relative">
          <ListboxButton class="w-40 cursor-default rounded-md bg-white py-2 pl-3 pr-10 text-left border focus:outline-none focus:ring-2 focus:ring-indigo-500" aria-haspopup="listbox">
            {{ roles.find(r => r.value === roleFilter)?.name || $t('selectRole') }}
          </ListboxButton>
          <ListboxOptions class="absolute mt-1 w-full bg-white shadow-lg max-h-60 rounded-md overflow-auto border" role="listbox">
            <ListboxOption v-for="role in roles" :key="role.value" :value="role.value" as="template" v-slot="{ active, selected }">
              <li :class="['cursor-pointer select-none p-2', active ? 'bg-indigo-500 text-white' : 'text-gray-900']" role="option" :aria-selected="selected">
                <span :class="['block truncate', selected ? 'font-medium' : 'font-normal']">
                  {{ role.name }}
                </span>
              </li>
            </ListboxOption>
          </ListboxOptions>
        </div>
      </Listbox>

      <!-- Status Filter -->
      <Listbox v-model="statusFilter">
        <div class="relative">
          <ListboxButton class="w-40 cursor-default rounded-md bg-white py-2 pl-3 pr-10 text-left border focus:outline-none focus:ring-2 focus:ring-indigo-500" aria-haspopup="listbox">
            {{ statuses.find(s => s.value === statusFilter)?.name || $t('selectStatus') }}
          </ListboxButton>
          <ListboxOptions class="absolute mt-1 w-full bg-white shadow-lg max-h-60 rounded-md overflow-auto border" role="listbox">
            <ListboxOption v-for="status in statuses" :key="status.value" :value="status.value" as="template" v-slot="{ active, selected }">
              <li :class="['cursor-pointer select-none p-2', active ? 'bg-indigo-500 text-white' : 'text-gray-900']" role="option" :aria-selected="selected">
                <span :class="['block truncate', selected ? 'font-medium' : 'font-normal']">
                  {{ status.name }}
                </span>
              </li>
            </ListboxOption>
          </ListboxOptions>
        </div>
      </Listbox>
    </div>

    <!-- Table -->
    <table class="min-w-full divide-y divide-gray-300" role="table">
      <thead class="bg-gray-50">
        <tr role="row">
          <th class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900" role="columnheader">{{ $t('name') }}</th>
          <th class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900" role="columnheader">{{ $t('email') }}</th>
          <th class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900" role="columnheader">{{ $t('role') }}</th>
          <th class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900" role="columnheader">{{ $t('status') }}</th>
          <th class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900" role="columnheader">{{ $t('createdAt') }}</th>
          <th class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900" role="columnheader">{{ $t('actions') }}</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 bg-white" role="rowgroup">
        <tr v-if="loading" role="row">
          <td colspan="6" class="text-center py-4" role="cell">{{ $t('loading') }}</td>
        </tr>
        <tr v-else-if="error" role="row">
          <td colspan="6" class="text-center py-4 text-red-500" role="cell">{{ error }}</td>
        </tr>
        <tr v-else-if="filteredUsers.length === 0" role="row">
          <td colspan="6" class="text-center py-4 text-gray-500" role="cell">{{ $t('noResults') }}</td>
        </tr>
        <tr v-else v-for="user in filteredUsers" :key="user.id" role="row">
          <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900" role="cell">
            <router-link :to="{ name: 'UserDetail', params: { id: user.id } }" class="text-blue-600 hover:underline">
              {{ user.name }}
            </router-link>
          </td>
          <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500" role="cell">{{ user.email }}</td>
          <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500" role="cell">{{ user.role }}</td>

          <!-- زرار تغيير الحالة -->
          <td class="whitespace-nowrap px-3 py-4 text-sm" role="cell">
            <button
              @click="toggleStatus(user)"
              :class="getStatusClass(user.status)"
              class="px-3 py-1 rounded-full text-xs font-semibold transition duration-300 ease-in-out"
            >
              {{ user.status }}
            </button>
          </td>

          <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500" role="cell">
            {{ new Date(user.createdAt).toLocaleDateString() }}
          </td>

          <td class="whitespace-nowrap px-3 py-4 text-sm flex gap-2" role="cell">
            <button @click="$emit('edit', user)" class="text-blue-600 hover:underline">{{ $t('edit') }}</button>
            <button @click="deleteUser(user.id)" class="text-red-600 hover:underline">{{ $t('delete') }}</button>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- Pagination -->
    <div class="flex justify-center mt-4 gap-2">
      <button @click="prevPage" :disabled="currentPage === 1" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50">
        {{ $t('previous') }}
      </button>
      <button
        v-for="page in totalPages"
        :key="page"
        @click="goToPage(page)"
        :class="['px-4 py-2 rounded', currentPage === page ? 'bg-blue-700 text-white' : 'bg-blue-500 text-white hover:bg-blue-700']"
      >
        {{ page }}
      </button>
      <button @click="nextPage" :disabled="currentPage === totalPages" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50">
        {{ $t('next') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "../store/userStore";
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue';
import { useToast } from 'vue-toastification';

const store = useUserStore();
const { users, loading, error, currentPage, pageSize, totalUsers } = storeToRefs(store);

const search = ref("");
const roleFilter = ref("");
const statusFilter = ref("");

const toast = useToast();

onMounted(() => {
  store.fetchUsers();
});

watch([search, roleFilter, statusFilter, currentPage], () => {
  store.fetchUsers(search.value, roleFilter.value, statusFilter.value);
});

const filteredUsers = computed(() => {
  return users.value.filter(user => {
    return (
      (!search.value || user.name.toLowerCase().includes(search.value.toLowerCase())) &&
      (!roleFilter.value || user.role === roleFilter.value) &&
      (!statusFilter.value || user.status === statusFilter.value)
    );
  });
});

const roles = [
  { name: 'All Roles', value: '' },
  { name: 'Admin', value: 'Admin' },
  { name: 'Manager', value: 'Manager' },
  { name: 'Viewer', value: 'Viewer' },
];

const statuses = [
  { name: 'All Statuses', value: '' },
  { name: 'Active', value: 'Active' },
  { name: 'Inactive', value: 'Inactive' },
];

// تحديث حالة المستخدم
const getStatusClass = (status: string) => {
  return status === "Active"
    ? "bg-green-100 text-green-700 border border-green-500 hover:bg-green-200"
    : "bg-red-100 text-red-700 border border-red-500 hover:bg-red-200";
};

const toggleStatus = (user: any) => {
  const newStatus = user.status === "Active" ? "Inactive" : "Active";
  store.updateUserStatus(user.id, newStatus);
};

const deleteUser = async (userId: number) => {
  await store.deleteUser(userId);
  toast.error('User deleted successfully!');
};

const totalPages = computed(() => Math.ceil(totalUsers.value / pageSize.value));

const prevPage = () => {
  if (currentPage.value > 1) {
    store.changePage(currentPage.value - 1);
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    store.changePage(currentPage.value + 1);
  }
};

const goToPage = (page: number) => {
  store.changePage(page);
};
</script>

<style scoped>
button {
  transition: all 0.3s ease-in-out;
}
</style>
