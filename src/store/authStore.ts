import { defineStore } from 'pinia';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  permissions: string[];
}

const users: User[] = [
  {
    id: 1,
    name: 'Admin',
    email: 'admin@example.com',
    role: 'Admin',
    permissions: ['read', 'write', 'delete'],
  },
  {
    id: 2,
    name: 'Manager',
    email: 'manager@example.com',
    role: 'Manager',
    permissions: ['read', 'write'],
  },
  {
    id: 3,
    name: 'Viewer',
    email: 'viewer@example.com',
    role: 'Viewer',
    permissions: ['read'],
  },
];

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    user: null as User | null,
  }),
  actions: {
    async login(credentials: { email: string; password: string }) {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const foundUser = users.find(user => user.email === credentials.email && credentials.password === 'password');
      if (foundUser) {
        this.isAuthenticated = true;
        this.user = foundUser;
      } else {
        throw new Error('Invalid email or password');
      }
    },
    logout() {
      this.isAuthenticated = false;
      this.user = null;
    },
  },
});