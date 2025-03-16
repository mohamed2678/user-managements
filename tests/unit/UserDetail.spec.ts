import { mount } from "@vue/test-utils";
import UserDetail from '../../src/components/UserDetail.vue';
import { createTestingPinia } from "@pinia/testing";
import { useUserStore } from '../../src/store/userStore';

describe('UserDetail.vue', () => {
  it('renders user details', async () => {
    const wrapper = mount(UserDetail, {
      global: {
        plugins: [createTestingPinia()],
      },
    });

    const userStore = useUserStore();
    userStore.users = [{ id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active', createdAt: '' }];
    userStore.fetchUsers = jest.fn().mockResolvedValue([]);

    await wrapper.vm.$nextTick();

    expect(wrapper.find('h3').text()).toBe('John Doe');
  });
});