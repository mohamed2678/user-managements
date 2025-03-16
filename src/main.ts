import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import './style.css';
import { createPinia } from "pinia";
import Toast from "vue-toastification";
import type { PluginOptions } from "vue-toastification";
import "vue-toastification/dist/index.css";
import 'animate.css';
import i18n from './i18n';

const pinia = createPinia();
const app = createApp(App);

const toastOptions: PluginOptions = {
  transition: "Vue-Toastification__bounce",
  maxToasts: 5,
  newestOnTop: true,
};

app.use(pinia).use(i18n).use(router).use(Toast, toastOptions).mount("#app");
