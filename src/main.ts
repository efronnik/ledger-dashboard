import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

// Стили
import './assets/main.css';
import './style.css';
import 'vue-toastification/dist/index.css';
import Toast, { POSITION } from 'vue-toastification';

// Создаём приложение
const app = createApp(App);

// Подключаем плагины
app.use(createPinia());
app.use(router);
app.use(Toast, {
  position: POSITION.TOP_RIGHT,
  timeout: 3000,
  closeOnClick: true,
  pauseOnHover: true,
});

// Монтируем
app.mount('#app');
