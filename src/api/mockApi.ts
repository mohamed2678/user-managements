export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

let users: User[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: ["Admin", "Manager", "Viewer"][i % 3],
  status: ["Active", "Inactive"][i % 2],
  createdAt: new Date().toISOString(),
}));

export const mockApi = {
  async getUsers(search: string, role: string, status: string, currentPage: number, pageSize: number): Promise<{ users: User[], total: number }> {
    await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 300)); // Simulate latency
    let filteredUsers = users.filter(user =>
      (!search || user.name.toLowerCase().includes(search.toLowerCase())) &&
      (!role || user.role === role) &&
      (!status || user.status === status)
    );
    const total = filteredUsers.length;
    filteredUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    return { users: filteredUsers, total };
  },
  async getUser(id: number): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 300)); // Simulate latency
    const user = users.find(user => user.id === id);
    if (!user) throw new Error("User not found");
    return user;
  },
  async addUser(user: Omit<User, "id" | "createdAt">): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 300)); // Simulate latency
    const newUser: User = { ...user, id: Date.now(), createdAt: new Date().toISOString() };
    users.push(newUser);
  },
  async updateUser(updatedUser: User): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 300)); // Simulate latency
    const index = users.findIndex(user => user.id === updatedUser.id);
    if (index === -1) throw new Error("User not found");
    users[index] = { ...updatedUser };
  },
  async deleteUser(id: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 300)); // Simulate latency
    users = users.filter(user => user.id !== id);
  },
  async updateUserStatus(id: number, newStatus: "Active" | "Inactive"): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 300)); // Simulate latency
    const user = users.find(user => user.id === id);
    if (!user) throw new Error("User not found");
    user.status = newStatus;
  }
};
