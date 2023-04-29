<script setup lang="ts">
import { useSysStore } from "@/stores/system"
import { onBeforeRouteLeave } from "vue-router"
import { usePlaceImg } from "@/utils/globalImgs"

const { lazyPack140, lazyLogo }: Record<string, string> = usePlaceImg()
const systemParams = useSysStore()

onBeforeRouteLeave(() => {
    systemParams.setRouteParams<{}>({})
})
</script>

<template>
    <div class="rollroom-prizedetail-page bg-#e8f1ef font-classic">
        <HeaderBar>
            <div class="header_title">饰品详情</div>
        </HeaderBar>
        <div class="expand-page px-12px py-20px">
            <div class="package_item_img_box">
                <img
                    v-lazy="{
                        src: systemParams.routeParams?.icon_url,
                        error: lazyPack140,
                        loading: lazyPack140
                    }"
                    alt=""
                />
            </div>
            <div class="package_item_name" :style="{ color: '#' + systemParams.routeParams.name_color }">
                {{ systemParams.routeParams.market_name }}
            </div>
            <div class="package_item_part">
                <div class="package_item_type_icon">
                    <img
                        v-lazy="{
                            src: systemParams.routeParams?.game_icon,
                            error: lazyLogo,
                            loading: lazyLogo
                        }"
                        alt=""
                    />
                </div>
                <p class="package_game_name">
                    {{ systemParams.routeParams.game_name }}
                </p>
                <p class="package_game_type">{{ systemParams.routeParams.type }}</p>
            </div>
            <div
                class="package_item_text_info"
                v-show="!Array.isArray(systemParams.routeParams.desc)"
                v-html="systemParams.routeParams.desc"
            ></div>
            <div class="package_item_text_info" v-show="Array.isArray(systemParams.routeParams.desc)">
                <div
                    class="package_item_info_list"
                    v-for="(desc, index) in systemParams.routeParams.desc"
                    :key="index"
                    :style="{ color: '#' + desc.color }"
                >
                    <div v-if="desc.type === 'html'" v-html="desc.value"></div>
                    <div v-else>{{ desc.value }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.rollroom-prizedetail-page {
    .expand-page {
        background: url("@/assets/img/template/july/roll/rolldetail_bg.png") no-repeat top;
        background-size: 100% auto;
        background-color: #1b1b1f;
        font-size: 0.14rem;
        overflow-x: hidden;
        overflow-y: auto;
        line-height: 1.6;
        font-size: 12px;
        .package_item_img_box {
            text-align: center;
            width: 60%;
            margin: 0 auto;
            img {
                width: 100%;
            }
        }
        .package_item_name {
            margin: 0.2rem 0;
            font-size: 0.16rem;
            text-align: center;
        }
        .package_item_part {
            display: flex;
            justify-content: center;
            align-items: center;
            color: #999;
            .package_item_type_icon {
                width: 0.3rem;
                height: 0.3rem;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
            .package_game_name {
                margin: 0 0.1rem;
            }
        }
        .package_item_text_info {
            color: #999;
            margin-top: 0.12rem;
        }
    }
}
</style>
