<script setup lang="ts">
import ApiSetting from "@/api/service"
import { useRouter } from "vue-router"
import { useSysStore } from "@/stores/system"
import { ref } from "vue"
import { showToast } from "vant"
import { BaseActiveStruct } from "@/api/pojo/BaseStruct"
import { HttpPlus } from "@/api/HttpPlus"

const router = useRouter()
const systemParams = useSysStore()

class ActiveGetGoodLuckUpgradeInit extends BaseActiveStruct {
    setting:
        | {
              vir_time_one: string
              vir_percent_one: string
              vir_time_two: string
              vir_percent_two: string
              day_max_bouns: number
          }
        | {} = {}
}

const initInfo = ref<ActiveGetGoodLuckUpgradeInit>(new ActiveGetGoodLuckUpgradeInit())

const toDepositPage = (): void => {
    if (initInfo.value.is_login) {
        router.push("/finance/deposit")
    } else {
        showToast({
            className: "vk-toast-fail",
            message: "请您先登录",
            icon: "warning"
        })
    }
}

const init = async (): Promise<void> => {
    HttpPlus.setUrlOptions(ApiSetting.active.goodLuckUpgradeInit)
    const res = await HttpPlus.sendHttpRequest<ActiveGetGoodLuckUpgradeInit>()
    if (res.status === 1 && res.data) {
        initInfo.value = res.data
    }
}

init()
</script>

<template>
    <div class="deposit-active">
        <h2>{{ initInfo.active_show_time }}</h2>

        <p>
            活动期间，会员每日在规定时间内首充并使用虚拟币进行存款，充值成功的会员笔笔存款都送好运金，单日上限最高{{
                initInfo.setting.day_max_bouns
            }}元。
        </p>

        <table class="table" border="0" cellspacing="0" width="100%">
            <tr>
                <th width="25%">每日充值时间</th>
                <th width="25%">充值渠道</th>
                <th width="25%">返还彩金比</th>
                <th>好运金单日赠送上限</th>
            </tr>
            <tr>
                <td>{{ initInfo.setting.vir_time_one }}</td>
                <td>虚拟币充值</td>
                <td>{{ initInfo.setting.vir_percent_one }}</td>
                <td rowspan="2">{{ initInfo.setting.day_max_bouns }}</td>
            </tr>
            <tr>
                <td>{{ initInfo.setting.vir_time_two }}</td>
                <td>虚拟币充值</td>
                <td>{{ initInfo.setting.vir_percent_two }}</td>
            </tr>
        </table>

        <button @click="toDepositPage" class="deposit-active-btn">立即参与：虚拟币充值</button>

        <ol class="rules">
            <li>本活动仅计算每日在规定时间段内使用“虚拟币充值”渠道的有效存款，存款成功后，该存款红利与存款同时到账。</li>
            <li>VIP会员每日未提款前的存款都视为首充，参与此活动的会员需绑定银行卡。</li>
            <li>本活动有效充值不包含已参与虚拟币首存活动的第一笔虚拟币存款</li>
            <li>
                此活动与V富通2.0活动共享，单日共享优惠额度累计上限最高为{{
                    initInfo.setting.day_max_bouns
                }}元，提款为1倍流水。例：会员当日在V富通2.0优惠活动中累计领取了388元好运金，在虚拟币存送优惠活动中只能领取200元。
            </li>
            <li>
                电竞赔率&lt;1.5、亚洲盘赔率&lt;0.75、欧洲盘&lt;1.75、美洲盘≤-133、马来盘≤0.75且>0、走盘、注单取消、对冲、未结算、串关、平半盘、实时兑现等不计算为有效流水；PT电子游戏中以下游戏不算有效流水：
                <span class="text-#27bc74" @click="systemParams.ActiveMoreRules.isShow = true">查看详情</span>
                。
            </li>
            <li>
                每位有效玩家、每一手机号码、电子邮箱、相同银行卡、每一个IP地址、每一台电脑者只能享受一次优惠，如发现有违规者我们将保留无限期审核扣回红利及所产生的利润权利。VKGAME对本活动保有最终解释权。
            </li>
        </ol>
    </div>
</template>

<style lang="scss" scoped>
.deposit-active {
    h2,
    p {
        font-size: 0.15rem;
        color: #3a4040;
        line-height: 0.13rem;
    }
    h2 {
        text-align: center;
        margin-top: 0.19rem;
        font-weight: normal;
    }
    p {
        text-align: left;
        line-height: 0.18rem;
        margin: 0.04rem 0.28rem 0;
    }
    table {
        width: calc(100% - 0.2rem);
        margin: 0.2rem 0.1rem 0;
        font-size: 0.11rem;
        color: #717171;
        border-top: #c8c8c8 1px solid;
        border-right: #c8c8c8 1px solid;
        tr {
            background-color: #ffffff;
            td,
            th {
                height: 0.44rem;
                //line-height: 0.88rem;
                border-left: #c8c8c8 1px solid;
                border-bottom: #c8c8c8 1px solid;
                text-align: center;
            }
            th {
                color: #ffffff;
                font-weight: normal;
            }
            &:first-child {
                background-image: linear-gradient(to right, #4da58c, #32705f);
            }
        }
    }
    .deposit-active-btn {
        display: block;
        width: auto;
        height: 0.32rem;
        line-height: 0.32rem;
        padding: 0 0.16rem;
        margin: 0.12rem auto 0;
        border-radius: 99px;
        border: 0;
        outline: 0;
        font-size: 0.15rem;
        color: #ffffff;
        touch-action: pan-y;
        background-image: linear-gradient(to right, #4da58c, #32705f);
    }
    .rules {
        list-style: decimal;
        background-color: #fff;
        padding: 0.1rem 0.1rem 0.1rem 0.26rem;
        margin: 0.25rem 0.1rem 0.2rem;
        border: 1px solid #c8c6c1;
        font-size: 0.15rem;
        color: #717171;
        &:before {
            display: block;
            content: "活动规则";
            text-align: center;
            margin-left: -0.1rem;
            font-size: 0.17rem;
            line-height: 0.17rem;
            color: #3a4040;
        }
        li {
            list-style: decimal;
            line-height: 0.22rem;
            &:first-child {
                margin-top: 0.1rem;
            }
        }
    }
}
</style>
