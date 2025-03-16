import { mount } from '@vue/test-utils';
import UserTable from '../../src/components/UserTable.vue';
import { createTestingPinia } from '@pinia/testing';

describe('UserTable.vue', () => {
  it('renders correctly', () => {
    const wrapper = mount(UserTable, {
      global: {
        plugins: [createTestingPinia()],
      },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('displays users correctly', async () => {
    const wrapper = mount(UserTable, {
      global: {
        plugins: [createTestingPinia({
          initialState: {
            userStore: {
              users: [
                { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active', createdAt: '2023-01-01' },
              ],
            },
          },
        })],
      },
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.find('td').text()).toContain('John Doe');
  });
});