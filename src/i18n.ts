import { createI18n } from 'vue-i18n';

const messages = {
  en: {
    welcome: 'Welcome',
    name: 'Name',
    email: 'Email',
    role: 'Role',
    status: 'Status',
    permissions: 'Permissions',
    save: 'Save',
    saving: 'Saving...',
    back: 'Back',
    createdAt: 'createdAt',
    actions: 'actions'
  },
  ar: {
    welcome: 'مرحبا',
    name: 'الاسم',
    email: 'البريد الإلكتروني',
    role: 'الدور',
    status: 'الحالة',
    permissions: 'الصلاحيات',
    save: 'حفظ',
    saving: 'جارٍ الحفظ...',
    back: 'رجوع',
    createdAt: 'انشاء من',
    actions: 'وظائف'
  },
};

const i18n = createI18n({
  locale: 'en',
  messages,
});

export default i18n;