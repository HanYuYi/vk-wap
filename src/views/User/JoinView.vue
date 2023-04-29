<script setup lang="ts">
import useClipboard from "vue-clipboard3"
import { showToast } from "vant"
import ApiSetting from "@/api/service"
import { animateCSS } from "@/composable/util"
import { useSysStore } from "@/stores/system"
import { nextTick, onBeforeMount, onMounted, ref } from "vue"
import { useRouter } from "vue-router"
import type { Router } from "vue-router"
import { formatterStr } from "@/composable/validate"
import { HttpPlus } from "@/api/HttpPlus"
import type { ProxyApplyGetInfoInit } from "@/api/pojo/ProxyApplyGetInfoInit"

const systemParams = useSysStore()
const router: Router = useRouter()

const { toClipboard } = useClipboard()

const doCopy = async (text: string): Promise<void> => {
    if (text) {
        try {
            await toClipboard(text)
            showToast({
                className: "vk-toast-success",
                message: "复制成功",
                icon: "checked"
            })
        } catch (e) {
            console.error(e)
        }
    }
}

const baseInfo = ref<Partial<ProxyApplyGetInfoInit>>({})
const contact_info = ref<Partial<ProxyApplyGetInfoInit["contact_info"]>>({})
const dialogStep = ref(1)
const showDialog = ref(false)
const qq = ref("")
const fly = ref("")
const telegram = ref("")
const content = ref("")
const btnloading = ref(false)

const apply = (): void => {
    if (!systemParams.isLogin) {
        router.push("/login")
    } else {
        if (baseInfo.value.isProxy) {
            showToast({
                className: "vk-toast-success",
                message: "恭喜您申请成功，我们会尽快与您联系",
                icon: "checked"
            })
        }
        if (baseInfo.value.isApplying) {
            dialogStep.value = 2
            showDialog.value = true
        }
        showDialog.value = true
        qq.value = ""
        fly.value = ""
        telegram.value = ""
        content.value = ""
    }
}

const toLink = (link: string): void => {
    showDialog.value = false
    router.push(link)
}

type SubmitParameters = {
    qq: typeof qq
    fly: typeof fly.value
    telegram: typeof telegram.value
    content: typeof content.value
}

const onSubmit = async (values: SubmitParameters): Promise<void> => {
    const { qq, fly, telegram, content } = values
    if (!baseInfo.value.hasBank) {
        showToast({
            className: "vk-toast-fail",
            message: "请先绑定银行卡",
            icon: "warning"
        })
        return
    }
    if (!baseInfo.value.hasTel) {
        showToast({
            className: "vk-toast-fail",
            message: "请先绑定手机号",
            icon: "warning"
        })
        return
    }
    if ((!qq && !fly && !telegram) || !content) {
        showToast({
            className: "vk-toast-fail",
            message: "请填写完整信息",
            icon: "warning"
        })
        return
    }
    const params = {
        qq,
        flygram: fly,
        telegram: telegram,
        content: content
    }
    btnloading.value = true
    try {
        HttpPlus.setUrlOptions(ApiSetting.ProxyApply)
        const res = await HttpPlus.sendHttpRequest<{}, typeof params>(params)
        btnloading.value = false

        if (res.status === 1) {
            init()
            dialogStep.value = 2
        } else {
            if (res.message) {
                showToast({
                    className: "vk-toast-fail",
                    message: res.message,
                    icon: "warning"
                })
            }
        }
    } catch (error: unknown) {
        btnloading.value = false
        console.error(error)
    }
}

const init = async (): Promise<void> => {
    HttpPlus.setUrlOptions(ApiSetting.getProxyInfoInit)
    const res = await HttpPlus.sendHttpRequest<ProxyApplyGetInfoInit>()

    if (res.status === 1 && res.data) {
        baseInfo.value = res.data
        contact_info.value = res.data.contact_info
        if (res.data.proxy_cs_link) {
            systemParams.KFProxyUrl = res.data.proxy_cs_link
        }
    }
}

onBeforeMount(() => {
    init()
})

onMounted(() => {
    nextTick(() => {
        animateCSS(".concat", "fade_up_classic")
        animateCSS(".proportion", "fade_up_classic")
    })
})
</script>

<template>
    <div class="join-page">
        <HeaderBar>
            <div class="header_title">合作加盟</div>
        </HeaderBar>
        <div class="expand-page relative pt-35px px-10px">
            <div class="bg_boll"></div>
            <div class="bg_tit"></div>
            <div class="apply_btn headShake" @click="apply">立即申请代理</div>
            <ul class="step slideInLeft leading-normal">
                <li>
                    <div class="circle"></div>
                    <p>更安全</p>
                </li>
                <li>
                    <div class="circle"></div>
                    <p>更专业</p>
                </li>
                <li>
                    <div class="circle"></div>
                    <p>更多样</p>
                </li>
                <li>
                    <div class="circle"></div>
                    <p>更效率</p>
                </li>
            </ul>
            <!--合营计划-->
            <section class="concat">
                <div class="proportion_title"></div>
                <div class="concat-top">
                    <p class="concat-btn" @click="systemParams.UpdateProxyKFDialogShow(true)">在线咨询</p>
                    <p class="concat-time">代理专员工作时间：12:00—21:00</p>
                </div>
                <ul class="concat-bottom">
                    <li class="skype">
                        <p>
                            Skype账号：
                            <a :href="contact_info.skype_link" target="_blank">{{ contact_info.skype_user }}</a>
                        </p>
                        <span @click="doCopy(contact_info.skype_user)">复制</span>
                    </li>
                    <li class="telegram">
                        <p>
                            Telegram账号：
                            <a :href="contact_info.telegram_link" target="_blank">{{ contact_info.telegram_user }}</a>
                        </p>
                        <span @click="doCopy(contact_info.telegram_user)">复制</span>
                    </li>
                    <li class="letstalk">
                        <p>
                            Letstalk账号：
                            <a href="javascript:void(0)" @click="doCopy(contact_info.letstalk_user)">
                                {{ contact_info.letstalk_user }}
                            </a>
                        </p>
                        <span @click="doCopy(contact_info.letstalk_user)">复制</span>
                    </li>
                    <li class="mosGram">
                        <p>
                            MosGram账号：
                            <a href="javascript:void(0)" @click="doCopy(contact_info.mosgram_user)">
                                {{ contact_info.mosgram_user }}
                            </a>
                        </p>
                        <span @click="doCopy(contact_info.mosgram_user)">复制</span>
                    </li>
                </ul>
            </section>
            <!--佣金占比-->
            <section class="proportion">
                <div class="proportion_title"></div>
                <table border="0">
                    <tr class="tr_th">
                        <td>盈利</td>
                        <td width="13%">
                            <span>
                                活跃
                                <br />
                                玩家
                            </span>
                        </td>
                        <td width="13%"><span>佣金比</span></td>
                        <td width="15%">
                            <span>
                                二次
                                <br />
                                充值会员
                            </span>
                        </td>
                        <td width="14%">
                            <span>
                                奖励
                                <br />
                                佣金比
                            </span>
                        </td>
                        <td width="14%">
                            <span>
                                奖励后
                                <br />
                                佣金比
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td><span>800,001以上</span></td>
                        <td>≥30</td>
                        <td>50%</td>
                        <td>≥55</td>
                        <td>3%</td>
                        <td>53%</td>
                    </tr>
                    <tr>
                        <td><span>500,001~800,000</span></td>
                        <td>≥25</td>
                        <td>45%</td>
                        <td>≥40</td>
                        <td>3%</td>
                        <td>48%</td>
                    </tr>
                    <tr>
                        <td><span>300,001~500,000</span></td>
                        <td>≥15</td>
                        <td>40%</td>
                        <td>≥25</td>
                        <td>3%</td>
                        <td>43%</td>
                    </tr>
                    <tr>
                        <td><span>80,001~300,000</span></td>
                        <td>≥10</td>
                        <td>35%</td>
                        <td>≥15</td>
                        <td>3%</td>
                        <td>38%</td>
                    </tr>
                    <tr>
                        <td><span>1～80,000</span></td>
                        <td>≥5</td>
                        <td>30%</td>
                        <td>≥8</td>
                        <td>3%</td>
                        <td>33%</td>
                    </tr>
                </table>
            </section>
            <!--佣金计算 -->
            <section class="equation">
                <div>
                    <div class="proportion_title"></div>
                    <p class="shli">以下为示例</p>
                    <div class="formula">
                        <p class="gray_bg">
                            <span>游戏总输赢</span>
                            <span>10000</span>
                        </p>
                        <p class="block_bg">
                            <span>- 平台费</span>
                            <span>-1500</span>
                        </p>
                        <p class="no_bg"><span>平台费=游戏总输赢x15%</span></p>
                        <p class="block_bg">
                            <span>- 红利</span>
                            <span>-20</span>
                        </p>
                        <p class="no_bg"><span>返水,红利,存提手续费后台可见明细</span></p>
                        <p class="block_bg block_bg1">
                            <span>=净利润</span>
                            <span>8480</span>
                        </p>
                        <p class="block_bg block_bg2">
                            <span>x佣金比例</span>
                            <span>x33%</span>
                        </p>
                        <p class="gray_bg">
                            <span>总佣金</span>
                            <span>2798.4</span>
                        </p>
                    </div>
                </div>
                <div class="proportion_im">
                    <b>完整数据后台</b>
                    <p>随时查询佣金出入详情</p>
                </div>
            </section>
            <!--结算规则-->
            <section class="account">
                <div class="proportion_title"></div>
                <div class="eqcon">
                    <span>
                        <b>结算时间</b>
                        ：本站每月1日00:00开始计算，到月底24:00，每月结算一次。
                    </span>
                    <br />
                    <span>
                        <b>到账时间</b>
                        ：本站每月7号统一发放代理薪资。
                    </span>
                    <br />
                    <span>
                        <b>结算规则</b>
                        ：5个活跃玩家计算佣金。
                    </span>
                </div>
                <div class="eqcon eqcontw">
                    <b>活跃玩家定义</b>
                    <p>
                        <span>当月存款≥500，流水≥1000为一个活跃玩家。如在每期结算时利润出现</span>
                        <br />
                        <span>负值，所负金额由本网先垫付给客户，负盈利将会累积入下期的结算中。</span>
                    </p>
                </div>
            </section>
            <!--责任与条款-->
            <section class="duty">
                <div class="proportion_title"></div>
                <p class="rule">
                    1. 代理有责任去推广自己的站点，开发市场及寻找优质客户。
                    <br />
                    2. 代理不能作出任何损害本站声誉的行为。
                    <br />
                    3. 代理在未经本站同意下，不能以本网的名义发布任何有关本网站的消息。
                    <br />
                    4. 代理若违反了任何一条合作条款，本网有权利立即终止合作关系，并取消其可获得的一切薪资。
                    <br />
                    5.
                    代理有责任监察其下线客户的一切活动，如发现代理的下线客户对本站做出违反本站用户条款的行为，本站有权冻结处理代理及代理下线客户账户，有权取消代理账户的佣金。
                    <br />
                    6. 代理相关条款最终解释权归VKGAME所有。
                </p>
            </section>
        </div>
        <!-- 申请弹窗 -->
        <van-dialog
            teleport="body"
            close-on-click-overlay
            v-model:show="showDialog"
            :show-confirm-button="false"
            :className="[
                'jointly-dialog',
                {
                    'jointly-dialog-step2': dialogStep === 2
                }
            ]"
        >
            <div class="close" @click="showDialog = false"></div>
            <template v-if="dialogStep === 1">
                <div class="text-14px tracking-2.4px text-center font-bold leading-normal">合作加盟申请</div>
                <div class="form-box">
                    <div class="label">VKGAME账户</div>
                    <div text="#7d839d">{{ baseInfo.username }}</div>
                </div>
                <div class="form-box">
                    <div class="label">银行卡</div>
                    <div class="right" v-if="baseInfo.hasBank">已绑定</div>
                    <div v-else>
                        <span class="link" @click="toLink('/bankcard')">去绑定</span>
                        <span class="tips">（请先绑定银行卡再申请）</span>
                    </div>
                </div>
                <div class="form-box">
                    <div class="label">手机号</div>
                    <div class="right" v-if="baseInfo.hasTel">已绑定</div>
                    <div v-else>
                        <span class="link" @click="toLink('/modifyphone')">去绑定</span>
                        <span class="tips">（请先绑定手机号再申请）</span>
                    </div>
                </div>
                <van-form class="join-form" :label-align="'right'" @submit="onSubmit">
                    <van-field
                        v-model="qq"
                        type="digit"
                        clearable
                        name="qq"
                        label="QQ号"
                        autocomplete="off"
                        placeholder="请输入您的QQ号"
                        :formatter="formatterStr"
                    />
                    <van-field
                        v-model="fly"
                        clearable
                        name="fly"
                        label="Mosgram"
                        autocomplete="off"
                        placeholder="请输入您的Mosgram账号"
                        :formatter="formatterStr"
                    />
                    <van-field
                        v-model="telegram"
                        clearable
                        name="telegram"
                        label="Telegram"
                        autocomplete="off"
                        placeholder="请输入您的Telegram账号"
                        :formatter="formatterStr"
                    />
                    <van-field
                        v-model="content"
                        clearable
                        name="content"
                        label="推广方式"
                        autocomplete="off"
                        placeholder="请输入内容"
                    />
                    <div class="w-180px mx-auto mt-16px">
                        <van-button
                            class="button_primary_2022 rounded-15px! border-none h-34px! leading-34px! text-14px!"
                            round
                            block
                            type="primary"
                            :loading="btnloading"
                            native-type="submit"
                        >
                            确定加入
                        </van-button>
                    </div>
                </van-form>
            </template>
            <template v-if="dialogStep === 2">
                <div class="text-14px tracking-2.4px font-bold leading-normal">申请成功 请耐心等待审核</div>
                <div class="text-#7c839f text-11px mt-10px mb-20px leading-relaxed">代理合作详情请联系客服</div>
                <div class="w-180px m-auto">
                    <van-button
                        @click="
                            () => {
                                showDialog = false
                                systemParams.UpdateProxyKFDialogShow(true)
                            }
                        "
                        class="button_primary_2022 rounded-15px! border-none h-34px! leading-34px! text-14px!"
                        block
                    >
                        联系客服
                    </van-button>
                </div>
            </template>
        </van-dialog>
    </div>
</template>

<style lang="scss" scoped>
.join-page {
    background-image: linear-gradient(to top, #1a1b22, #151565);
    font-size: 12px;
    overflow: hidden;
    .bg_boll {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 3.16rem;
        background: url("@/assets/img/template/july/my/newjointly/bg-boll.png") no-repeat;
        background-size: 100% 100%;
    }
    .bg_tit {
        position: relative;
        z-index: 1;
        width: 3.06rem;
        margin: auto;
        height: 0.82rem;
        background: url("@/assets/img/template/july/my/newjointly/bg_tit.png") no-repeat;
        background-size: 100% 100%;
    }
    .apply_btn {
        position: relative;
        z-index: 1;
        width: 1.55rem;
        margin: 0.2rem auto 0;
        border-radius: 0.18rem;
        box-shadow: 0px 6px 4px 0 rgba(25, 26, 73, 0.54);
        background-image: linear-gradient(to right, #71e6ef, #75edbb);
        color: #1a166b;
        font-weight: bold;
        font-size: 0.17rem;
        line-height: normal;
        padding: 0.08rem 0;
        text-align: center;

        &:active {
            color: #fff;
        }
    }
    .step {
        position: relative;
        z-index: 1;
        margin: 0.3rem auto 0;
        overflow: hidden;
        display: flex;
        justify-content: center;

        li {
            width: 0.69rem;
            height: 1.1rem;
            margin-right: 0.2rem;
            color: #fff;
            text-align: center;
            font-size: 0.12rem;

            &:last-child {
                margin-right: 0;
            }

            .circle {
                width: 0.69rem;
                height: 0.79rem;
                margin-bottom: 0.12rem;
                background-size: 100% 100%;
                background-position: center center;
                background-repeat: no-repeat;
            }

            &:nth-child(1) .circle {
                background-image: url("@/assets/img/template/july/my/newjointly/adv1.png");
            }

            &:nth-child(2) .circle {
                background-image: url("@/assets/img/template/july/my/newjointly/adv2.png");
            }

            &:nth-child(3) .circle {
                background-image: url("@/assets/img/template/july/my/newjointly/adv3.png");
            }

            &:nth-child(4) .circle {
                background-image: url("@/assets/img/template/july/my/newjointly/adv4.png");
            }
        }
    }

    .proportion_title {
        width: 0.825rem;
        height: 0.16rem;
        background-size: 100% 100%;
        background-repeat: no-repeat;
    }

    .concat {
        margin-top: 0.28rem;

        .proportion_title {
            width: 1.55rem;
            height: 0.16rem;
            background-image: url("@/assets/img/template/july/my/newjointly/title0.png");
            margin-bottom: 0.18rem;
        }

        .concat-top {
            width: 100%;
            display: flex;
            justify-content: space-around;
            align-items: center;

            .concat-btn {
                width: 1.2rem;
                height: 0.37rem;
                background: linear-gradient(to right, #71e6ef, #75edbb);
                border-radius: 0.2rem;
                font-size: 0.16rem;
                color: #1a166b;
                font-weight: bold;
                text-align: center;
                line-height: 0.37rem;
            }

            .concat-time {
                font-size: 0.12rem;
                color: #fff;
            }
        }

        .concat-bottom {
            margin-top: 0.2rem;
            width: 3.55rem;
            height: 1.93rem;
            border-radius: 0.025rem;
            background: #272932;
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            li {
                display: flex;
                width: 3.07rem;
                height: 0.22rem;
                line-height: 0.22rem;
                margin-left: 0.24rem;
                padding-left: 0.345rem;
                box-sizing: border-box;
                font-size: 0.12rem;
                color: #fff;
                position: relative;
                background-position: left top;
                background-repeat: no-repeat;
                background-size: 0.225rem 0.22rem;
                &.skype {
                    background-image: url("@/assets/img/template/july/my/newjointly/skype.png");
                }
                &.telegram {
                    background-image: url("@/assets/img/template/july/my/newjointly/telegram.png");
                }
                &.letstalk {
                    background-image: url("@/assets/img/template/july/my/newjointly/letstalk.png");
                }
                &.mosGram {
                    background-image: url("@/assets/img/template/july/my/newjointly/mosGram.png");
                }
            }
            p {
                width: 2.42rem;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                a {
                    text-decoration: underline;
                }
            }
            span {
                color: #75ecbf;
                text-decoration: underline;
                position: absolute;
                right: 0rem;
            }
        }
    }

    .proportion {
        margin-top: 0.28rem;

        .proportion_title {
            background-image: url("@/assets/img/template/july/my/newjointly/title1.png");
            margin-bottom: 0.18rem;
        }

        table {
            width: 100%;
            text-align: center;
            border-spacing: 2px;
            border-collapse: separate;
            font-size: 0.12rem;
            line-height: normal;

            td {
                letter-spacing: 0px;
                padding: 0.07rem 0;
                background-color: var(--vk-old-text-color);
                box-sizing: border-box;
                border-radius: 5px;
                border-left: 1px solid transparent;
                border-bottom: 1px solid transparent;
                color: #e4e4e4;
                cursor: pointer;
                position: relative;
                vertical-align: middle;

                span {
                    position: relative;
                    z-index: 1;
                }
            }

            .tr_th td {
                background-color: #3f4456;
                color: #ffffff;
                font-weight: bold;
                padding: 0.1rem 0;
                text-align: center;
                padding-left: 0px;

                span {
                    display: inline-block;
                    transform: scale(0.9);
                }
            }
        }
    }

    .equation {
        position: relative;
        color: #fff;
        margin-top: 0.3rem;
        line-height: normal;

        .proportion_title {
            background-image: url("@/assets/img/template/july/my/newjointly/title2.png");
            margin-bottom: 0.16rem;
        }

        .shli {
            transform: scale(0.9);
            transform-origin: left center;
        }

        .formula {
            letter-spacing: 2.2px;
            margin-top: 0.04rem;
            width: 1.8rem;

            p {
                padding: 0.02rem 0;
                display: flex;
                justify-content: center;
                border-radius: 5px;
                align-items: center;

                span {
                    white-space: nowrap;
                    transform: scale(0.9);
                    box-sizing: border-box;

                    &:first-child {
                        flex: 5;
                        text-align: right;
                        padding-right: 0.15rem;
                    }

                    &:last-child {
                        flex: 4;
                        text-align: left;
                        padding-left: 0.15rem;
                    }
                }
            }

            .gray_bg {
                background-color: #3f4456;
                color: #fff;
                font-weight: bold;
            }

            .block_bg {
                background-color: var(--vk-old-text-color);
                color: #fff;

                &.block_bg1 {
                    border-bottom-left-radius: 0;
                    border-bottom-right-radius: 0;
                }

                &.block_bg2 {
                    border-top-left-radius: 0;
                    border-top-right-radius: 0;
                }
            }

            .no_bg {
                color: #a6a8ad;

                span {
                    transform: scale(0.7);
                }
            }
        }

        .proportion_im {
            position: absolute;
            right: 0;
            bottom: 0;
            width: 1.7rem;
            height: 1.6rem;
            background: url("@/assets/img/template/july/my/newjointly/data.png") no-repeat;
            background-size: 100% 1.2rem;
            text-align: center;
            color: #efefee;
            overflow: hidden;
            padding-top: 1.2rem;
            box-sizing: border-box;
            line-height: 1.6;

            p,
            b {
                display: block;
                transform: scale(0.9);
            }
        }
    }

    .account {
        margin-top: 0.3rem;

        .proportion_title {
            background-image: url("@/assets/img/template/july/my/newjointly/title3.png");
            margin-bottom: 0.18rem;
        }

        .eqcon {
            width: 100%;
            height: 0.8rem;
            box-sizing: border-box;
            padding: 0.15rem 0 0 0.2rem;
            border-radius: 5px;
            background-color: var(--vk-old-text-color);
            color: #d2d2d2;
            line-height: 0.19rem;
            white-space: nowrap;

            span {
                display: inline-block;
                transform: scale(0.84);
                transform-origin: left center;
            }
        }

        .eqcontw {
            padding: 0.14rem 0 0 0;
            text-align: center;
            margin-top: 0.07rem;

            p {
                padding-left: 0.2rem;
                text-align: justify;
            }
        }
    }

    .duty {
        margin: 0.3rem 0 0.2rem;

        .proportion_title {
            width: 0.99rem;
            background-image: url("@/assets/img/template/july/my/newjointly/title4.png");
            margin-bottom: 0.18rem;
        }

        .rule {
            text-align: justify;
            line-height: 2;
            color: #d2d2d2;
        }
    }

    @keyframes headShake {
        0% {
            transform: translateX(0);
        }

        6.5% {
            transform: translateX(-6px) rotateY(-9deg);
        }

        18.5% {
            transform: translateX(5px) rotateY(7deg);
        }

        31.5% {
            transform: translateX(-3px) rotateY(-5deg);
        }

        43.5% {
            transform: translateX(2px) rotateY(3deg);
        }

        50% {
            transform: translateX(0);
        }
    }

    .headShake {
        animation: headShake 1s 0.8s ease-in-out;
    }

    @keyframes slideInLeft {
        from {
            transform: translate3d(150%, 0, 0);
            visibility: visible;
        }

        to {
            transform: translate3d(0, 0, 0);
        }
    }

    .slideInLeft {
        animation: slideInLeft 1.5s;
    }
}
</style>
<style lang="scss">
.van-dialog.jointly-dialog {
    width: 360px;
    max-width: 100vw;
    color: #fff;
    background: url("@/assets/img/template/july/my/newjointly/dialog.png") no-repeat center;
    background-size: 100% 100%;
    height: 385px;
    border-radius: 0;
    overflow: visible;
    padding-top: 30px;
    &.jointly-dialog-step2 {
        height: 162px;
        padding-top: 25px;
        text-align: center;
    }
    .close {
        width: 0.3rem;
        height: 0.3rem;
        position: absolute;
        right: 0;
        top: -0.28rem;
        background: url("@/assets/img/template/july/my/newjointly/close.png") no-repeat right center;
        background-size: 0.16rem 0.16rem;

        &:active {
            background: url("@/assets/img/template/july/my/newjointly/close_hover.png") no-repeat right center;
            background-size: 0.16rem 0.16rem;
        }
    }
    .form-box {
        font-size: 12px;
        white-space: nowrap;
        line-height: 3;
        overflow: hidden;
        display: flex;
        align-items: center;
        .label {
            flex: 0 0 30%;
            text-align: right;
            margin-right: 22px;
        }
        .right {
            color: #7c839f;
        }
        .tips {
            display: inline-block;
            color: #686d82;
            transform: scale(0.7);
            transform-origin: left center;
        }
        .link {
            color: #07f1b7;
            text-decoration: underline;
            cursor: pointer;
        }
    }
    .van-form.join-form {
        .van-cell {
            background: transparent;
            padding-top: 5px;
            padding-bottom: 5px;
            &::after {
                content: none;
            }
            .van-field__label {
                color: #fff;
                font-size: 12px;
                width: 92px;
                margin-right: 22px;
            }
            input {
                width: 150px;
                border: 1px solid #7c839f;
                border-radius: 12px;
                color: #fff;
                font-size: 12px;
                padding: 0 5px;
                &::placeholder {
                    color: #505465;
                    font-size: 12px;
                }
            }
        }
    }
}
</style>
