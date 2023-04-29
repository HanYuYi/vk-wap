<script setup lang="ts">
import { useSysStore } from "@/stores/system"
import { ref } from "vue"

const systemParams = useSysStore()

const showBottom = ref(false)
</script>

<template>
    <div class="main">
        <div class="richpay_head">V富通转账红包</div>
        <div class="richpay_content">
            <div class="table-panel">
                <table cellspacing="0">
                    <caption>
                        活动期间，将余额从V富通转出≥100元到主钱包时，即可获得V富通转账红包，单日赠送上限
                        <span class="text-#83f9fd">588</span>
                        元。
                        <a class="text-#83f9fd" @click="showBottom = true">查看完整活动规则</a>
                    </caption>
                    <tr>
                        <td>
                            充值
                            <br />
                            时间
                        </td>
                        <td>07:01至23:00</td>
                        <td>23:01至次日07:00</td>
                    </tr>
                    <tr>
                        <td>
                            充值
                            <br />
                            渠道
                        </td>
                        <td colspan="2">虚拟币充值</td>
                    </tr>
                    <tr>
                        <td>
                            转账
                            <br />
                            加码
                        </td>
                        <td>2.00%+0.5‰</td>
                        <td>2.50%+0.5‰</td>
                    </tr>
                    <tr>
                        <td>
                            单日
                            <br />
                            赠送
                        </td>
                        <td colspan="2">上限588元（转账金额+红利）1倍全站流水</td>
                    </tr>
                    <tr>
                        <td>
                            存放
                            <br />
                            时间
                        </td>
                        <td colspan="2">6小时+</td>
                    </tr>
                    <tr>
                        <td>
                            <div class="packing">
                                额外
                                <br />
                                加码
                            </div>
                        </td>
                        <td colspan="2">
                            <div class="packing" style="top: 0.1rem">
                                随机加码 0.1 ~ 0.5‰
                                <i class="rule-txt" @click="$emit('storeextras')">?</i>
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
        <van-popup v-model:show="showBottom" class="richpay-bottom-popup" round position="bottom" :style="{ height: '80%' }">
            <div>
                <div class="text-16px font-bold text-center">活动规则</div>
                <div class="mt-10px text-15px">
                    <ul>
                        <li>
                            本活动充值渠道判定方式为：以用户历史最后一笔的充值渠道来源为准；若用户在选择参与V富通转账红包前将存款从主钱包发起提款，则当日无法领取此优惠活动。
                        </li>
                        <li>
                            V富通转账加码：将金额从V富通钱包转出时，即可选择
                            是否领取加码和存放额外加码：将金额从V富通钱包转出时，若满足存放时间要求，还可领取额外随机加码，最低转出金额≥100元，才能计算派发。
                        </li>
                        <li>
                            双重加码%可叠加计算领取V富通转出红包，按照“虚拟币充值”渠道的存款时间，转入V富通→存放 6小时以上→
                            再转出至主钱包，才能享受两种额外加码福利。
                        </li>
                        <li>
                            此活动与虚拟币存送优惠活动共享，单日共享优惠额度累计上限最高为588元，用户在选择领取V富通转账红包优惠活动成功时，则需完成(转出金额+彩金)
                            1倍全站流水。例：会员当日在虚拟币存送优惠活动中累计领取了100元好运金，最后在V富通转账红包送优惠活动中只能领取488元。
                        </li>
                        <li>
                            电竞赔率&lt;1.5、亚洲盘赔率&lt;0.75、欧洲盘&lt;1.75、美洲盘≤-133、马来盘≤0.75且>0、走盘、注单取消、对冲、未结算、串关、平半盘、实时兑现等不计算为有效流水；PT电子游戏中以下游戏不算有效流水：
                            <span
                                class="text-#83f9fd"
                                style="text-decoration: underline"
                                @click="systemParams.ActiveMoreRules.isShow = true"
                            >
                                查看详情
                            </span>
                            。
                        </li>
                        <li>
                            每位有效玩家、每一手机号码、电子邮箱、相同银行卡、每一个IP地址、每一台电脑者只能享受一次优惠，如发现有违规者我们将保留无限期审核扣回红利及所产生的利润权利。VKGAME对本活动保有最终解释权。
                        </li>
                    </ul>
                </div>
            </div>
        </van-popup>
    </div>
</template>

<style lang="scss" scoped>
.table-panel {
    border-top: 1px solid transparent;
    margin-bottom: 0.195rem;

    & > table {
        width: 100%;
        color: #ffffff;
        border-top: 1px solid rgba(131, 249, 253, 0.5);
        border-bottom: 0;

        caption {
            width: 100%;
            padding: 0.28rem;
            font-size: 0.15rem;
            text-align: left;
            line-height: 1.6;

            a {
                text-decoration: underline;
            }
        }

        tr {
            td {
                height: 0.4rem;
                width: calc(100% / 6);
                font-size: 0.12rem;
                line-height: 0.16rem;
                text-align: center;

                &:first-child {
                    width: 10%;
                    font-size: 0.15rem;
                }

                &:last-child {
                    border-right: 0;
                }

                border-bottom: 1px solid rgba(131, 249, 253, 0.5);
                border-right: 1px solid rgba(131, 249, 253, 0.5);
            }

            &:last-child {
                td {
                    height: 0.2rem;
                    line-height: 0.2rem;
                    border-bottom: 0;
                    position: relative;

                    .packing {
                        position: absolute;
                        z-index: 1;
                        width: 100%;
                        top: 0;

                        .rule-txt {
                            display: inline-block;
                            width: 0.15rem;
                            height: 0.15rem;
                            line-height: 0.13rem;
                            text-align: center;
                            border: 1px solid #fff;
                            border-radius: 50%;
                            margin-left: 0.08rem;

                            &:active {
                                color: #83f9fd;
                                border: 1px solid #83f9fd;
                            }
                        }
                    }

                    &:first-child {
                        .packing:before {
                            position: absolute;
                            content: "";
                            right: -1px;
                            bottom: 0;
                            width: 1px;
                            height: 0.2rem;
                            border-right: 1px solid rgba(131, 249, 253, 0.5);
                        }
                    }
                }
            }
        }
    }
}
</style>
<style lang="scss">
.van-popup.richpay-bottom-popup {
    line-height: 20px;
    font-family: -apple-system-font, "Helvetica Neue", sans-serif;
    background: #232656;
    border-radius: 10px;
    padding: 30px 35px 30px 48px;
    ul {
        li {
            list-style: decimal;
            margin-top: 0.07rem;
        }
    }
}
</style>
