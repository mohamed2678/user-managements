import { defineStore } from "pinia";
import { mockApi } from "../api/mockApi";
import type { User } from "../api/mockApi";

type UserError = {
  message: string;
  code?: number;
};

export const useUserStore = defineStore("user", {
  state: () => ({
    users: JSON.parse(localStorage.getItem('users') || '[]') as User[],
    loading: false,
    error: null as UserError | null,
    currentPage: 1,
    pageSize: 10,
    totalUsers: 0,
  }),

  actions: {
    saveUsersToLocalStorage() {
      localStorage.setItem('users', JSON.stringify(this.users));
    },

    async fetchUsers(search = "", role = "", status = "") {
      this.loading = true;
      this.error = null;
      try {
        const response = await mockApi.getUsers(search, role, status, this.currentPage, this.pageSize);
        this.users = response.users;
        this.totalUsers = response.total;
        this.saveUsersToLocalStorage();
      } catch (err) {
        console.error("Error fetching users:", err);
        this.error = { message: "Failed to load users" };
      } finally {
        this.loading = false;
      }
    },

    async addUser(user: Omit<User, "id" | "createdAt">) {
      this.loading = true;
      this.error = null;
      try {
        await mockApi.addUser(user);
        await this.fetchUsers();
      } catch (err) {
        console.error("Error adding user:", err);
        this.error = { message: "Failed to add user" };
      } finally {
        this.loading = false;
      }
    },

    async updateUserStatus(userId: number, newStatus: "Active" | "Inactive") {
      this.loading = true;
      this.error = null;
      try {
        await mockApi.updateUserStatus(userId, newStatus);
        await this.fetchUsers();
      } catch (err) {
        console.error("Error updating user status:", err);
        this.error = { message: "Failed to update status" };
      } finally {
        this.loading = false;
      }
    },

    async updateUser(updatedUser: User) {
      this.loading = true;
      this.error = null;
      try {
        await mockApi.updateUser(updatedUser);
        await this.fetchUsers();
      } catch (err) {
        console.error("Error updating user:", err);
        this.error = { message: "Failed to update user" };
      } finally {
        this.loading = false;
      }
    },

    async deleteUser(userId: number) {
      this.loading = true;
      this.error = null;
      try {
        await mockApi.deleteUser(userId);
        await this.fetchUsers();
      } catch (err) {
        console.error("Error deleting user:", err);
        this.error = { message: "Failed to delete user" };
      } finally {
        this.loading = false;
      }
    },

    async changePage(page: number) {
      this.currentPage = page;
      await this.fetchUsers();
    }
  },
});
