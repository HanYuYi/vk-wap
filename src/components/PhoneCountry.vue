<script setup lang="ts">
import { ref } from "vue"
import { useClickAway } from "@vant/use"
import { useSysStore } from "@/stores/system"

const systemParams = useSysStore()

const rootRef = ref<HTMLElement>(null)
const showCountryPopup = ref(false)

useClickAway(rootRef, () => {
    if (showCountryPopup.value) {
        showCountryPopup.value = false
    }
})

systemParams.getAreaCode()
</script>

<template>
    <div class="country_code relative" @click.stop="showCountryPopup = !showCountryPopup">
        <i class="phone_icon"></i>
        +{{ systemParams.countryCode.number }}
        <i class="select_caret" :class="{ open: showCountryPopup }"></i>
        <transition name="slide">
            <ul ref="rootRef" v-show="showCountryPopup" class="global_country_select">
                <li
                    v-for="(item, index) in systemParams.countryCodeList"
                    :key="index"
                    @click="systemParams.countryCode = item"
                    :class="{ active: systemParams.countryCode.code === item.code }"
                >
                    <i class="icon" :style="{ backgroundImage: `url(${item.icon})` }"></i>
                    <p class="txt">
                        <span>{{ item.cn }}</span>
                        <span>+{{ item.number }}</span>
                    </p>
                </li>
            </ul>
        </transition>
    </div>
</template>

<style lang="scss" scoped>
.slide-enter-active {
    transition: all 0.2s ease;
}

.slide-leave-active {
    transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-enter-from,
.slide-leave-to {
    transform: translateY(-10px);
    opacity: 0;
}
.country_code {
    width: 90px;
    height: 44px;
    color: #8b9ab4;
    line-height: 44px;
    font-size: 14.5px;
    .phone_icon {
        display: inline-block;
        width: 0.24rem;
        height: 0.24rem;
        background-image: url("@/assets/img/login/phone_icon.png");
        background-size: 100% 100%;
        vertical-align: middle;
        margin-left: 0.1rem;
    }

    .select_caret {
        display: inline-block;
        width: 0.08rem;
        height: 0.055rem;
        background-image: url("@/assets/img/login/select_caret.png");
        background-size: 100% 100%;
        vertical-align: middle;
        transition: transform 0.2s;

        &.open {
            transform: rotate(180deg);
        }
    }
    &:after {
        content: "";
        position: absolute;
        height: 0.15rem;
        width: 0.01rem;
        right: 0;
        top: 0.15rem;
        background-color: #8492ab;
    }
}
.global_country_select {
    padding: 0.04rem 0;
    width: calc(100vw - 0.48rem);
    height: 2.6rem;
    border-radius: 0.04rem;
    box-shadow: 0 0.035rem 0.1rem 0 rgba(0, 0, 0, 0.16);
    position: absolute;
    top: 0.48rem;
    left: -0.01rem;
    background-color: #515f77;
    overflow-x: hidden;
    overflow-y: auto;
    z-index: 100;

    li {
        width: calc(100% - 0.08rem);
        height: 0.36rem;
        padding: 0 0.12rem;
        line-height: 0.36rem;
        margin: 0 0 0 0.04rem;
        border-radius: 0.04rem;
        color: #fff;
        font-size: 0.135rem;
        display: flex;

        .icon {
            display: inline-block;
            width: 0.24rem;
            height: 0.24rem;
            margin: 0.06rem 0.12rem 0 0;
            background-size: cover;
        }

        .txt {
            flex: 1;
            display: flex;
            justify-content: space-between;
        }

        &.active {
            background-color: #222432;
            color: #07f1b7;
        }
    }

    &::-webkit-scrollbar {
        display: block;
        background-color: transparent;
        width: 0.04rem;
    }

    &::-webkit-scrollbar-track {
        border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        background-color: #00f5b3;
    }

    * {
        /*ie浏览器*/
        scrollbar-arrow-color: transparent;
        /**/
        /*三角箭头的颜色*/
        scrollbar-face-color: #333;
        /**/
        /*立体滚动条的颜色*/
        scrollbar-3dlight-color: transparent;
        /**/
        /*立体滚动条亮边的颜色*/
        scrollbar-highlight-color: transparent;
        /**/
        /*滚动条空白部分的颜色*/
        scrollbar-shadow-color: transparent;
        /**/
        /*立体滚动条阴影的颜色*/
        scrollbar-darkshadow-color: transparent;
        /**/
        /*立体滚动条强阴影的颜色*/
        //scrollbar-track-color: rgba(0, 0, 0, .3); /**//*立体滚动条背景颜色*/
        scrollbar-base-color: #333;
        /**/
        /*滚动条的基本颜色*/
        /*火狐浏览器*/
        scrollbar-width: auto;
        scrollbar-color: #333 rgba(0, 0, 0, 0.3);
    }
}
</style>
