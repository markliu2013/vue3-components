import { createApp } from "vue";
import App from "./app.vue";
import markliu2013 from "@markliu2013/components";

const app = createApp(App);
app.use(markliu2013);

app.mount("#app");