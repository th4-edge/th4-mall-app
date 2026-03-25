import { createSSRApp } from "vue";
import App from "./App.vue";
import "@/th4/mall/starter"
export function createApp() {
  const app = createSSRApp(App);
  return {
    app,
  };
}
