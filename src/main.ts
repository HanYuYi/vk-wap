import { createApp } from "vue"
import { createPinia } from "pinia"
import { ConfigProvider, Toast, Dialog, Lazyload, ImagePreview } from "vant"
import Vue3Marquee from "vue3-marquee"
import "vue3-marquee/dist/style.css"
import Vue3TouchEvents from "vue3-touch-events"
import Carousel3d from "vue3-carousel-3d"
import "vue3-carousel-3d/dist/index.css"
import { Swiper, SwiperSlide } from "swiper/vue"
import "swiper/css"
import "swiper/css/autoplay"
import "swiper/css/navigation"
import "swiper/css/pagination"
import App from "./App.vue"
import router from "./router"
import "uno.css"
import "./assets/style/reset.css"
import "./assets/style/animate.css"
import "./assets/style/common.scss"
import "./assets/fonts/fonts.css"
import "vant/es/toast/style"
import "vant/es/dialog/style"
import "vant/es/image-preview/style"

import "@/utils/amfeFlexible"

if ("domainName" in window) {
    window.domainName._WAP_TO_PC = window.domainName!._WAP_TO_PC.split("?")[0]
}
const app: ReturnType<typeof createApp> = createApp(App)

app.use(createPinia())
    .use(router)
    // @ts-ignore
    .use(Vue3Marquee)
    .use(Vue3TouchEvents)
    // @ts-ignore
    .use(Carousel3d)
    .use(ConfigProvider)
    .use(Toast)
    .use(Dialog)
    .use(ImagePreview)
    .use(Lazyload, {
        lazyComponent: true
    })
    .component("swiper", Swiper)
    .component("swiper-slide", SwiperSlide)

app.mount("#app")
