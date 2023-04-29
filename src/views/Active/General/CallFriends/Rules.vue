<script setup lang="ts">
import { useSysStore } from "@/stores/system"

const systemParams = useSysStore()
/**
 * Props
 */
interface Props {
    tab: number
}
const props = withDefaults(defineProps<Props>(), {
    tab: 0
})
</script>

<template>
    <div class="table-block">
        <div class="rect"></div>
        <div class="main-title">活动规则</div>
        <div class="btn gz-arrow"></div>
        <div class="gz-text scgz" v-if="props.tab == 0">
            <ol>
                <li>
                    每日未发起提款前的存款都视为首充，每个通过您推广链接进行注册，并完成相应首存的用户，您将获得对应的邀请礼金；每个受邀请人完成对应首存，在单周邀请人能最高可获得1468元。
                </li>
                <li>
                    您每邀请一位新会员，从注册的日期开始算起，可享受
                    <span class="text-#b8995e large-text">4次</span>
                    推荐礼金，每个自然周一 00:00 刷新1次，期间每个礼金阶段都可以领取一次；逾期将会视为自动放弃。
                </li>
                <li>
                    例如：用户邀请一位好友已绑定手机号和首存100元，可获取8元；若想获取下一档位38元，则需再首存1000元；礼金将会自动派发至主钱包，并需要完成1倍有效流水。
                </li>
                <li>普通VIP会员账号变更成代理账号时，该活动将无法参加；已经参加活动的账号变成代理账号，会即刻终止发放礼金。</li>
                <li>
                    电竞赔率&lt;1.5、亚洲盘赔率&lt;0.75、欧洲盘&lt;1.75、美洲盘≤-133、马来盘≤0.75且>0、走盘、注单取消、对冲、未结算、串关、平半盘、实时兑现等不计算为有效流水；PT电子游戏中以下游戏不算有效流水：
                    <span
                        class="text-#b8995e underline"
                        @click="
                            () => {
                                systemParams.ActiveMoreRules.classname = 'callfriends'
                                systemParams.ActiveMoreRules.isShow = true
                            }
                        "
                    >
                        查看详情
                    </span>
                    。
                </li>
                <li>
                    邀请人与受邀请人必须为不同身份的真实玩家，邀请人VIP等级需大于等于1级，每位有效玩家、每个手机号码、电子邮箱、IP地址(包括使用VPN)、每张银行卡、每台设备都会被判定为同一玩家。
                </li>
                <li>
                    凡使用作弊手段，恶意套取奖金者，我们将保留无限期审核扣回红利及所产生的利润权利，严重者将冻结所有关联账号，VKGAME官方对本活动保有最终解释权。
                </li>
            </ol>
        </div>
        <div class="gz-text zcgz" v-if="props.tab == 1">
            <ol>
                <li>
                    每个通过您的推广链接进行注册，并达到周累计存款≥5000元的用户，您和受邀请人均可获得该累计存款金额 1%
                    的新人奖励。
                </li>
                <li>
                    您每邀请一位新会员，从注册的日期开始算起，可享
                    <span class="text-#b8995e large-text">4次</span>
                    邀请周累存送，符合获取条件礼金的会员，将会在每个自然周一 00:00:00 - 23:59:59
                    内系统自动派发至主钱包，活动礼金需完成1倍有效流水，并更新剩余获取礼金次数；逾期将会视为自动放弃。
                </li>
                <li>普通VIP会员账号变更成代理账号时，该活动将无法参加；已经参加活动的账号变成代理账号，会即刻终止发放礼金。</li>
                <li>
                    电竞赔率&lt;1.5、亚洲盘赔率&lt;0.75、欧洲盘&lt;1.75、美洲盘≤-133、马来盘≤0.75且>0、走盘、注单取消、对冲、未结算、串关、平半盘、实时兑现等不计算为有效流水；PT电子游戏中以下游戏不算有效流水：
                    <span
                        class="text-#b8995e underline"
                        @click="
                            () => {
                                systemParams.ActiveMoreRules.classname = 'callfriends'
                                systemParams.ActiveMoreRules.isShow = true
                            }
                        "
                    >
                        查看详情
                    </span>
                    。
                </li>
                <li>
                    邀请人与受邀请人必须为不同身份的真实玩家，邀请人VIP等级需大于等于1级，每位有效玩家、每个手机号码、电子邮箱、IP地址(包括使用VPN)、每张银行卡、每台设备都会被判定为同一玩家。
                </li>
                <li>
                    凡使用作弊手段，恶意套取奖金者，我们将保留无限期审核扣回红利及所产生的利润权利，严重者将冻结所有关联账号，VKGAME官方对本活动保有最终解释权。
                </li>
            </ol>
        </div>
        <div class="gz-text flgz" v-if="props.tab == 2">
            <ol>
                <li>活动有效投注额返利期限为：15天，即：从您好友注册时间开始算起。</li>
                <li>
                    有效投注额返利解锁：单个用户有效投注额返利＜15元时，返利处于锁定状态，无法领取；单个用户有效投注额返利≥15元时，返利处于解锁状态，系统将自动发放到主钱包；若返利处于锁定状态持续到第二天未解锁，该返利＜15元
                    将会继续保存累计 至 返利 ≥15元，处于解锁状态自动派发，但只限于有效时间15天内计算；逾期将会视为自动放弃。
                </li>
                <li>
                    每日有效投注返利结算发放时间为：次日下午 18:00 左右自动派发（发放前一日的有效投注返利）;
                    提款需要完成1倍全站有效流水。
                </li>
                <li>
                    普通VIP会员账号变更成代理账号时，该活动将无法参加；已经参加活动的账号变成代理账号，有效投注额返利会即刻终止发放。
                </li>
                <li>
                    电竞赔率&lt;1.5、亚洲盘赔率&lt;0.75、欧洲盘&lt;1.75、美洲盘≤-133、马来盘≤0.75且>0、走盘、注单取消、对冲、未结算、串关、平半盘、实时兑现等不计算为有效流水；PT电子游戏中以下游戏不算有效流水：
                    <span
                        class="text-#b8995e underline"
                        @click="
                            () => {
                                systemParams.ActiveMoreRules.classname = 'callfriends'
                                systemParams.ActiveMoreRules.isShow = true
                            }
                        "
                    >
                        查看详情
                    </span>
                    。
                </li>
                <li>
                    邀请人与受邀请人必须为不同身份的真实玩家，邀请人VIP等级需大于等于1级，每位有效玩家、每个手机号码、电子邮箱、IP地址(包括使用VPN)、每张银行卡、每台设备都会被判定为同一玩家。
                </li>
                <li>
                    凡使用作弊手段，恶意套取奖金者，我们将保留无限期审核扣回红利及所产生的利润权利，严重者将冻结所有关联账号，VKGAME官方对本活动保有最终解释权。
                </li>
            </ol>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "callfriends.scss";
.gz-arrow {
    width: 0.2rem;
    height: 0.13rem;
    background-image: url("@/assets/img/active/invitefriends/down-arrow.png");
}
.btn {
    cursor: pointer;
    user-select: none;
    color: #fff;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
}

.gz-text {
    margin-top: 0.2rem;
    text-align: left;
    width: 3rem;
    font-size: 0.14rem;
    color: #fff;

    ol {
        padding-left: 0.16rem;
        list-style: decimal;

        li {
            list-style: decimal;
            margin-bottom: 0.12rem;
        }
    }

    .large-text {
        margin: 0 0.04rem;
    }
}
</style>
