import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";

// Стили
import "./assets/main.css";
import "./style.css";

// Создаём приложение
const app = createApp(App);

// Подключаем плагины
app.use(createPinia());
app.use(router);

// Монтируем
app.mount("#app");
