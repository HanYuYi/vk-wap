<script setup lang="ts">
import ApiSetting from "@/api/service"
import { useSysStore } from "@/stores/system"
import { ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { HttpPlus } from "@/api/HttpPlus"
import type { UserOrderDetail } from "@/api/pojo/UserOrderDetail"

const route = useRoute()
const router = useRouter()
const systemParams = useSysStore()

const data = ref<UserOrderDetail | null>(null)

const init = async (): Promise<void> => {
    HttpPlus.setUrlOptions(ApiSetting.user.getTradingRecordDetail)
    const res = await HttpPlus.sendHttpRequest<UserOrderDetail, { id: string }>({
        id: route.query?.id as string
    })

    if (res.status === 1) {
        data.value = res.data
    }
}

if (route.query?.id) {
    init()
} else {
    router.replace({ path: "/tradingrecord" })
}
</script>

<template>
    <div class="tranrecord-detail-page bg-light-green">
        <HeaderBar>
            <div class="header_title">{{ data?.title }}</div>
        </HeaderBar>

        <div class="expand-page px-12px leading-normal">
            <div class="record_money text-center text-44px py-22px van-hairline--bottom">
                <MoneySplit :amount="data?.amount" />
            </div>
            <!-- 处理进度 -->
            <div
                class="record_timeline text-16px py-12px van-hairline--bottom"
                v-if="
                    data?.order_type_id == 1 || data?.order_type_id == 4 || data?.order_type_id == 5 || data?.order_type_id == 6
                "
            >
                <div class="title">处理进度</div>
                <div v-if="data && data.process" class="timeline_box py-20px pl-30px">
                    <div class="first_step step_box success">
                        <div class="left_icon"></div>
                        <span class="step_text">{{ data.process[0][0] }}</span>
                        <span class="step_time">{{ data.process[0][1] }}</span>
                    </div>

                    <div class="second_step step_box success" v-if="data?.process[1]">
                        <div class="left_icon"></div>
                        <span class="step_text">{{ data.process[1][0] }}</span>
                        <span class="step_time"></span>
                    </div>

                    <div
                        class="third_step step_box"
                        :class="{
                            error: data.status == 2,
                            success: data.status == 1
                        }"
                        v-if="data?.process[2]"
                    >
                        <div class="left_icon"></div>
                        <span class="step_text">{{ data.process[2][0] }}</span>
                        <span class="step_time">{{ data.process[2][2] }}</span>
                    </div>
                </div>
            </div>
            <div class="record_timeline text-16px py-12px van-hairline--bottom" v-else>
                <div class="success_box pt-20px text-#27bc74 text-center">
                    <img class="w-70px mb-6px" src="@/assets/img/login/icon-hook.png" alt="" />
                    <p>交易成功</p>
                </div>
                <div class="title">处理进度</div>
            </div>
            <!--交易时间  编号-->
            <div class="record_info text-16px py-12px van-hairline--bottom">
                <div class="hstack justify-between h-32px text-16px">
                    <span class="box_title">交易时间</span>
                    <span class="text-#aba8a9">{{ data?.time }}</span>
                </div>
                <div class="hstack justify-between h-32px text-16px">
                    <span class="box_title">订单编号</span>
                    <span class="text-#aba8a9">{{ data?.order_no }}</span>
                </div>
            </div>
            <div class="py-15px mt-20px text-center text-#aba8a9 text-12px">
                <p>对此订单有疑问？联系</p>
                <span class="text-16px text-#000 mt-5px underline block" @click="systemParams.UpdateKFDialogShow(true)">
                    在线客服
                </span>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.MoneySplit {
    :deep(.small-num) {
        font-size: 22px;
    }
}
.step_box {
    height: 0.4rem;
    display: flex;
    align-items: center;
    margin-top: 0.4rem;

    .left_icon {
        width: 0.4rem;
        height: 100%;
        background-position: center center;
        background-repeat: no-repeat;
        background-size: 0.32rem 0.32rem;
        position: relative;

        &::before {
            content: "";
            position: absolute;
            left: 50%;
            top: -0.44rem;
            width: 2px;
            height: 0.48rem;
            transform: translateX(-1px);
            background-color: #27bc74;
        }
    }

    .step_text {
        flex: 1;
        margin-left: 0.1rem;
    }

    .step_time {
        color: #aba8a9;
    }

    &.success {
        .step_text {
            color: #27bc74;
        }
    }

    &.error {
        .step_text {
            color: #e31212;
        }
    }

    &.first_step {
        margin-top: 0;

        .left_icon {
            background-image: url("@/assets/img/template/july/finance/timeline-icon-deposite.png");

            &::before {
                display: none;
            }
        }
    }

    &.second_step {
        .left_icon {
            background-image: url("@/assets/img/template/july/finance/timeline-icon-doing.png");
        }
    }

    &.third_step {
        .left_icon {
            background-image: url("@/assets/img/template/july/finance/timeline-icon-sucsess.png");
        }

        &.error {
            .left_icon {
                background-image: url("@/assets/img/template/july/finance/timeline-icon-error.png");
            }
        }
    }
}
</style>
