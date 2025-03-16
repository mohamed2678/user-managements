<template>
  <div :class="theme">
    <header class="page">
      <button @click="toggleTheme">{{ theme === 'dark' ? 'Light Mode' : 'Dark Mode' }}</button>
      <button @click="changeLanguage('en')">English</button>
      <button @click="changeLanguage('ar')">العربية</button>
    </header>
    <router-view :theme="theme" />
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';

const theme = ref('light');

const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light';
  document.documentElement.classList.toggle('dark', theme.value === 'dark');
};

const { locale } = useI18n();

const changeLanguage = (lang: string) => {
  locale.value = lang;
};

// Apply the initial theme
watchEffect(() => {
  document.documentElement.classList.toggle('dark', theme.value === 'dark');
});
</script>

<style>
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

.page {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  background-color: var(--bg-color);
  color: var(--text-color);
}

.page button {
  background-color: var(--bg-color);
  color: var(--text-color);
  border: 1px solid var(--text-color);
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

button:hover {
  background-color: var(--text-color);
  color: var(--bg-color);
}
</style>