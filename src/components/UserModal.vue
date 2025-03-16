<template>
    <div class="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-50 backdrop-blur-sm animate-fadeIn">
      <div class="bg-white p-8 rounded-lg shadow-xl border w-full max-w-md transform transition-all scale-95 animate-scaleUp">
        <h2 class="text-2xl font-semibold text-gray-800 mb-6 text-center">Add User</h2>
  
        <form @submit.prevent="saveUser" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Name</label>
            <input 
              v-model="user.name"
              class="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              
            />
          </div>
  
          <div>
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email"
              v-model="user.email"
              class="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              
            />
          </div>
  
          <div>
            <label class="block text-sm font-medium text-gray-700">Role</label>
            <select 
              v-model="user.role"
              class="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Viewer">Viewer</option>
            </select>
          </div>
  
          <div class="flex justify-end gap-3 mt-6">
            <button 
              type="button" 
              @click="$emit('close')" 
              class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, defineEmits } from "vue";
  import { useUserStore } from "@/store/userStore";
  import { useToast } from "vue-toastification"; // استدعاء التوست
  
  const store = useUserStore();
  const toast = useToast();
  const emit = defineEmits(["close"]);
  
  const user = ref({
    name: "",
    email: "",
    role: "Viewer",
    status: "Active",
  });
  
  const saveUser = async () => {
    if (!user.value.name || !user.value.email) {
      toast.error("Please fill all fields!", { timeout: 3000 });
      return;
    }
  
    const newUser = {
      id: Date.now(),
      name: user.value.name,
      email: user.value.email,
      role: user.value.role,
      status: "Active",
    };
  
    await store.addUser(newUser);
    toast.success("User added successfully! ✅", { timeout: 3000 }); // عرض إشعار النجاح
    emit("close");
  };
  </script>
  
  <style scoped>
  /* أنيميشن الظهور */
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes scaleUp {
    from { transform: scale(0.9); }
    to { transform: scale(1); }
  }
  .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
  .animate-scaleUp { animation: scaleUp 0.3s ease-out; }
  </style>
  