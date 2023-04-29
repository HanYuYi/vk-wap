<script setup lang="ts">
import rfsImg from "@/assets/img/vipsystemnew/rfs.png"
import srljImg from "@/assets/img/vipsystemnew/srlj.png"
import jsljImg from "@/assets/img/vipsystemnew/jslj.png"
import ycyhImg from "@/assets/img/vipsystemnew/ycyh.png"
import ytyjImg from "@/assets/img/vipsystemnew/ytyj.png"
import yjyjImg from "@/assets/img/vipsystemnew/yjyj.png"
import zskfImg from "@/assets/img/vipsystemnew/zskf.png"
import cjjImg from "@/assets/img/vipsystemnew/cjj.png"

import { useMarquee } from "@/composable/util"
import { formatNumberSplit } from "@/utils/numberUtils"
import ApiSetting from "@/api/service"
import { HttpPlus } from "@/api/HttpPlus"
import { nextTick, ref, onBeforeUnmount } from "vue"
import { useSysStore } from "@/stores/system"
import { usePlaceImg } from "@/utils/globalImgs"
import { showToast } from "vant"
import type { BackSettingItem, BaseSettingItem, LevelSettingItem, VipGetVipHallInit } from "@/api/pojo/VipGetVipHallInit"
import type { RewardListItem } from "@/api/pojo/VipGetVipHallInit"
import type { SwipeInstance } from "vant"

const { GrayAvatar } = usePlaceImg()
const systemParams = useSysStore()

const initInfo = ref<VipGetVipHallInit>(null)
const rewardsList = ref<string[]>([])
const classRule = ref<LevelSettingItem[]>([]) // 等级详情
const rendered = ref(false)
const currem = ref(100)
const carouselRef = ref<any>(null)
const startIndex = ref(0)
const currentIndex = ref(0)
const upgradeDetailShow = ref(false)
const classRuleShow = ref(false)
const BANNER_LIST = [
    {
        img: rfsImg
    },
    {
        img: srljImg
    },
    {
        img: jsljImg
    },
    {
        img: ycyhImg
    },
    {
        img: ytyjImg
    },
    {
        img: yjyjImg
    },
    {
        img: zskfImg
    },
    {
        img: cjjImg
    }
]
const rewardList = ref<Array<Array<Array<RewardListItem[number]>>>>([])
const activeTiem = ref(0)
const swipeListRef = ref<SwipeInstance | null>(null)
const swipeRef = ref<SwipeInstance | null>(null)
const activeIndex = ref(0)
const btnIndex = ref(0)
const activeName = ref("first")

const getAssetsFile = (index: number): string => {
    return new URL(`../assets/img/vipsystemnew/medal/${index}.png`, import.meta.url).href
}

// 卡片切换
const onSlideChange = (index: number): void => {
    currentIndex.value = index
}

const formatMoney = (num: number): string => {
    return formatNumberSplit(num, 0)
}

const onChangeImg = (index: number): void => {
    if (index == 0 || index == 1 || index == 2) {
        swipeListRef.value?.swipeTo(0)
        activeTiem.value = 0
        activeIndex.value = index
    } else if (index == 3 || index == 4 || index == 5) {
        swipeListRef.value?.swipeTo(1)
        activeTiem.value = 1
        switch (index) {
            case 3:
                activeIndex.value = 0
                break
            case 4:
                activeIndex.value = 1
                break
            case 5:
                activeIndex.value = 2
                break
        }
    } else if (index == 6 || index == 7 || index == 8) {
        swipeListRef.value?.swipeTo(2)

        activeTiem.value = 2
        switch (index) {
            case 6:
                activeIndex.value = 0
                break
            case 7:
                activeIndex.value = 1
                break
            case 8:
                activeIndex.value = 2
                break
        }
    } else {
        swipeListRef.value?.swipeTo(3)
        activeTiem.value = 3
        activeIndex.value = 1
    }
}

const onChange = (index: number): void => {
    btnIndex.value = index
}

const activeImg = (index: number): void => {
    if (btnIndex.value == 0) {
        activeTiem.value = 0
        activeIndex.value = index
        swipeRef.value?.swipeTo(index)
    } else if (btnIndex.value == 1) {
        activeTiem.value = 1
        switch (index) {
            case 0:
                swipeRef.value?.swipeTo(3)
                activeIndex.value = 0
                break
            case 1:
                swipeRef.value?.swipeTo(4)
                activeIndex.value = 1
                break
            case 2:
                swipeRef.value?.swipeTo(5)
                activeIndex.value = 2
                break
        }
    } else if (btnIndex.value == 2) {
        activeTiem.value = 2
        switch (index) {
            case 0:
                swipeRef.value?.swipeTo(6)
                activeIndex.value = 0
                break
            case 1:
                swipeRef.value?.swipeTo(7)
                activeIndex.value = 1
                break
            case 2:
                swipeRef.value?.swipeTo(8)
                activeIndex.value = 2
                break
        }
    } else {
        activeTiem.value = 3
        swipeRef.value?.swipeTo(9)
        activeIndex.value = 0
    }
}

const ajaxLoad = ref(false)

interface DepostDialogData {
    show: boolean
    bouns: number
    item: Partial<RewardListItem[number]>
}

const depostDialogData = ref<DepostDialogData>({
    show: false,
    bouns: 0,
    item: {}
})
const dialogData = ref({
    show: false,
    txt: "",
    bouns: 0,
    classname: "",
    unit: "元"
})
// 领取
const apply = async (item: RewardListItem[number]): Promise<void> => {
    if (ajaxLoad.value) {
        return
    }
    let data: Partial<Pick<RewardListItem[number], "id" | "level">> = {}
    // 生日礼金
    if (item.card_en == "birth") {
        data = { id: item.id }
    }
    // 晋级礼金
    if (item.card_en == "upgrade") {
        data = { level: item.level }
    }
    if (item.url_type == 1 && item.status == 1) {
        if (item.card_en == "deposit") {
            depostDialogData.value = {
                show: true,
                bouns: item.bonus,
                item: item
            }
        } else {
            ajaxLoad.value = true
            try {
                HttpPlus.setUrlOptions({ url: item.url })
                const res = await HttpPlus.sendHttpRequest(data)
                ajaxLoad.value = false
                if (res.status === 1) {
                    item.status = 2
                    if (item.card_en != "deposit") {
                        dialogData.value = {
                            show: true,
                            txt: item.card_name,
                            bouns: item.bonus,
                            classname: item.card_en,
                            unit: item.bonus_type ? item.bonus_type : "元"
                        }
                    }
                }
            } catch (error: unknown) {
                ajaxLoad.value = false
                throw error
            }
        }
    } else {
        if (item.card_en == "birth") {
            showToast({ className: "vk-toast-fail", message: "未达到生日礼金领取资格!", icon: "warning" })
        } else {
            if (item.btn_tips) {
                showToast({ className: "vk-toast-fail", message: item.btn_tips, icon: "warning" })
            } else if (item.tips) {
                showToast({ className: "vk-toast-fail", message: item.tips, icon: "warning" })
            }
        }
    }
}

// 领取月存优惠
const depositApply = async (): Promise<void> => {
    HttpPlus.setUrlOptions({ url: depostDialogData.value.item.url })
    const res = await HttpPlus.sendHttpRequest()
    depostDialogData.value.show = false

    if (res.status === 1) {
        showToast({ className: "vk-toast-success", message: res.message, icon: "checked" })

        rewardList.value[currentIndex.value][btnIndex.value] = rewardList.value[currentIndex.value][btnIndex.value].map(
            (item: RewardListItem[number]) => {
                if (item.card_en == "deposit") {
                    return { ...item, status: 2 }
                } else {
                    return item
                }
            }
        )
    }
}

// 查看当前等级
const toCurLeval = (): void => {
    const timer = setTimeout(() => {
        clearTimeout(timer)
        carouselRef.value?.goSlide(initInfo.value.level)
    }, 400)
}

// 数拆分为3个一组的小数组
const group = (array: RewardListItem[number][], subGroupLength: number): Array<RewardListItem[number][]> => {
    let index = 0
    const newArray: Array<RewardListItem[number][]> = []

    while (index < array.length) {
        newArray.push(array.slice(index, (index += subGroupLength)))
    }

    return newArray
}

const vipExclu = ref<Array<BaseSettingItem>>([])
const vipAchienement = ref<VipGetVipHallInit["month_achievement_award"]>([])
const vipBack = ref<Array<BackSettingItem>>([])
const vipTransfer = ref<VipGetVipHallInit["transfer_setting"]>([])
const vipExper = ref<VipGetVipHallInit["privilege_setting"]>([])
const vipRescue = ref<VipGetVipHallInit["month_rescue_setting"]>([])

// 初始化
const initVipHall = async (): Promise<void> => {
    HttpPlus.setUrlOptions(ApiSetting.active.getVipHallInit)
    const res = await HttpPlus.sendHttpRequest<VipGetVipHallInit>()

    if (res.status === 1 && res.data) {
        initInfo.value = res.data
        getRewardsMsg()
        const {
            level_setting,
            is_login,
            back_setting,
            base_setting,
            transfer_setting,
            privilege_setting,
            month_rescue_setting,
            month_achievement_award
        } = res.data
        if (month_rescue_setting) {
            vipRescue.value = month_rescue_setting
        }
        if (privilege_setting) {
            vipExper.value = privilege_setting
        }
        if (transfer_setting) {
            vipTransfer.value = transfer_setting
        }
        if (back_setting) {
            vipBack.value = back_setting
        }
        if (level_setting.length) {
            classRule.value = level_setting
        }
        if (base_setting) {
            vipExclu.value = base_setting
        }
        if (month_achievement_award) {
            vipAchienement.value = month_achievement_award
        }
        initInfo.value.reward_list.forEach((item: RewardListItem) => {
            const tema: RewardListItem[number][] = []
            for (let key in item) {
                tema.push(item[key])
            }
            tema.sort((a, b) => {
                return a.sort - b.sort
            })
            const minlist: Array<Array<RewardListItem[number]>> = group(tema, 3)

            rewardList.value.push(minlist)
        })
        if (is_login) {
            startIndex.value = res.data.level
        } else {
            startIndex.value = 12
        }
        currentIndex.value = startIndex.value
        await nextTick()
        rendered.value = true
    }
}

const getRewardsMsg = async (): Promise<void> => {
    HttpPlus.setUrlOptions(ApiSetting.active.getRewardsMsg)
    const res = await HttpPlus.sendHttpRequest<string[]>()
    if (res.status === 1 && res.data) {
        rewardsList.value = res.data
    }
}

initVipHall()
currem.value = parseFloat(document.querySelector("html").style.fontSize)
// 计算跑马灯过渡时间，速度默认是90
const { marqueeDuration } = useMarquee(130)

onBeforeUnmount(() => {
    systemParams.ActiveMoreRules.isShow = false
})
</script>

<template>
    <div class="vip-page">
        <HeaderBar>
            <div class="header_title">VIP重磅升级</div>
        </HeaderBar>

        <div class="page-wrapper expand-page w-full overflow-x-hidden">
            <!-- 滚奖公告 -->
            <div class="h-23px bg-#0f121f text-#929292">
                <Vue3Marquee :delay="1" :duration="marqueeDuration">
                    <span v-for="(notice, index) in rewardsList" :key="index" class="mx-20px select-none leading-23px">
                        {{ notice }}
                    </span>
                </Vue3Marquee>
            </div>
            <!--等级卡片-->
            <div class="card_box w-full mt-107px h-300px relative">
                <carousel-3d
                    v-if="classRule.length && rendered"
                    ref="carouselRef"
                    class="vip_card"
                    :perspective="0"
                    :space="currem * 1"
                    :width="currem * 2.47"
                    :inverseScaling="currem * 0.6"
                    :startIndex="startIndex"
                    :display="3"
                    :height="currem * 3"
                    border="0"
                    :controlsVisible="true"
                    @after-slide-change="onSlideChange"
                >
                    <slide
                        class="item_card"
                        :class="['card_' + item.level_type]"
                        v-for="(item, index) in classRule"
                        :index="index"
                        :key="index"
                    >
                        <div class="light" v-show="rendered"></div>
                        <div class="card_info">
                            <p class="lv_cnname">{{ item.level_name }}勋章</p>
                            <img class="lv_img" :src="getAssetsFile(index)" alt="" />
                            <div class="info_mask" v-show="rendered"></div>
                        </div>
                        <div class="card_face">
                            <!--小于用户等级-->
                            <div class="before_lv other_lv" v-show="index < initInfo.level && initInfo.is_login">
                                <div class="before_lv_icon other_lv_icon"></div>
                                <p class="yellow">{{ item.level }}会员</p>
                            </div>
                            <!--大于用户等级-->
                            <div class="after_lv other_lv" v-show="index > initInfo.level || !initInfo.is_login">
                                <div class="after_lv_icon other_lv_icon"></div>
                                <p class="yellow">{{ item.level }}会员</p>
                            </div>

                            <p class="back_cur" v-show="index != initInfo.level && initInfo.is_login" @click="toCurLeval()">
                                回到当前等级
                            </p>

                            <!--用户当前等级-->
                            <div class="base flex" v-show="index == initInfo.level && initInfo.is_login">
                                <img
                                    class="headimg fl"
                                    v-lazy="{
                                        src: initInfo.head_image,
                                        error: GrayAvatar,
                                        loading: GrayAvatar
                                    }"
                                    alt=""
                                />
                                <div class="fl">
                                    <p>
                                        <em class="nickname van-ellipsis yellow" :title="initInfo.nickname">
                                            {{ initInfo.nickname }}
                                        </em>
                                        &nbsp;您好!
                                    </p>
                                    <p>
                                        VIP{{ initInfo.level }}会员第
                                        <span class="yellow">{{ initInfo.keep_day }}</span>
                                        天
                                    </p>
                                </div>
                            </div>
                            <div
                                class="progress"
                                v-show="index == initInfo.level && initInfo.is_login"
                                @click="upgradeDetailShow = true"
                            >
                                <div class="pro_line" v-show="initInfo.level > 0">
                                    <b>保级</b>
                                    &nbsp;(还剩
                                    <span class="yellow">{{ initInfo.valid_day }}天</span>
                                    )
                                    <p class="fr cuerp">
                                        <span class="text_de">已完成</span>
                                        <span class="text_de yellow">{{ initInfo.percent_relegation }}%</span>
                                    </p>
                                </div>

                                <div v-show="initInfo.level < 12">
                                    <b>升级</b>
                                    &nbsp;到
                                    <span class="yellow">VIP{{ initInfo.level + 1 }}</span>
                                    <p class="fr cuerp">
                                        <span class="text_de">已完成</span>
                                        <span class="text_de yellow">{{ initInfo.percent_upgrade }}%</span>
                                    </p>
                                </div>
                                <p class="mydetail yellow text_de">我的升保级明细</p>
                            </div>
                        </div>
                        <img
                            v-show="index > 1 && rendered"
                            class="shinning_img shinning_img1"
                            src="@/assets/img/vipsystemnew/shining.png"
                        />

                        <img
                            v-show="index >= 11 && rendered"
                            class="shinning_img shinning_img2"
                            src="@/assets/img/vipsystemnew/shining.png"
                        />

                        <img
                            v-show="index == 12 && rendered"
                            class="shinning_img shinning_img3"
                            src="@/assets/img/vipsystemnew/shining.png"
                        />
                    </slide>
                </carousel-3d>
                <van-loading class="ab-center" v-else type="spinner" />
            </div>
            <!--升级保级表按钮-->
            <div class="upgradetxt">
                <p>等级晋升后开启90天保级期，保级期内完成存款和流水要求则保级成功，未完成则降一级。</p>
                <div class="to_show_detail" @click="classRuleShow = true">查看升保级明细></div>
            </div>
            <!--能获取的优惠-->
            <div class="siledr">
                <div class="siledr_block">
                    <van-swipe
                        loop
                        autoplay="3000"
                        indicator-color="#fff"
                        ref="swipeRef"
                        height="2.555rem"
                        class="home_swipe"
                        :show-indicators="false"
                        @change="onChangeImg"
                    >
                        <van-swipe-item v-for="(item, index) in BANNER_LIST" :key="index" class="home_swipe_item">
                            <img :src="item.img" />
                        </van-swipe-item>
                    </van-swipe>
                </div>
            </div>
            <div class="siledr_box">
                <div class="siledr_block_box">
                    <van-swipe
                        ref="swipeListRef"
                        indicator-color="#e3b789"
                        height="2.555rem"
                        class="home_swipe_box"
                        @change="onChange"
                    >
                        <van-swipe-item
                            class="home_swipe_item_box"
                            :class="{ active_silder: index == activeTiem }"
                            v-for="(item, index) in rewardList[currentIndex]"
                            :key="index"
                        >
                            <section>
                                <ul class="can_discount">
                                    <li
                                        v-for="(receItme, indexs) in item"
                                        :key="indexs"
                                        :class="{
                                            got: receItme.url_type == 1 && receItme.status == 2,
                                            canshow: receItme.is_show
                                        }"
                                    >
                                        <div
                                            class="detail"
                                            @click="activeImg(indexs)"
                                            :class="{ active_cak: indexs == activeIndex }"
                                        >
                                            <div class="type_icon" :class="receItme.card_en"></div>
                                            <!--晋级礼金、游戏体验金-->
                                            <p v-if="receItme.card_en == 'upgrade' || receItme.card_en == 'privilege'">
                                                {{ receItme.max_bonus }}
                                                <span>元</span>
                                            </p>
                                            <!--生日礼金-->
                                            <p v-if="receItme.card_en == 'birth'">
                                                {{ receItme.max_bonus }}
                                                <span>{{ receItme.bonus_type }}</span>
                                            </p>
                                            <!--返水-->
                                            <p v-if="receItme.card_en == 'back'">
                                                {{ receItme.max_bonus }}
                                            </p>
                                            <!--月存优惠/月救援金-->
                                            <p v-if="receItme.card_en == 'deposit' || receItme.card_en == 'rescue'">
                                                <span v-show="receItme.status == 0 || receItme.status == 3">最高</span>
                                                {{
                                                    receItme.status == 0 || receItme.status == 3
                                                        ? receItme.max_bonus
                                                        : receItme.bonus
                                                }}
                                                <span>元</span>
                                            </p>
                                            <!--月成就奖-->
                                            <p v-if="receItme.card_en == 'achienement'">
                                                最高{{ receItme.max_bonus }}
                                                <span>元</span>
                                            </p>

                                            <p>{{ receItme.card_name }}</p>

                                            <p v-if="receItme.tips && receItme.card_en == 'kf_service'">
                                                {{ receItme.tips }}
                                            </p>
                                            <p class="detail_txt" v-if="receItme.tips && receItme.card_en != 'kf_service'">
                                                {{ receItme.tips }}
                                            </p>
                                            <div class="mask"></div>
                                        </div>
                                        <!--按钮-->
                                        <transition name="fade-in-linear">
                                            <div
                                                class="get_btn"
                                                v-show="initInfo.is_login && receItme.url_type == 2 && receItme.status == 1"
                                                @click="systemParams.UpdateKFDialogShow(true)"
                                            >
                                                联系客服
                                            </div>
                                        </transition>
                                        <!--0  不可领取   1  可领取    2已领取   3不显示-->
                                        <!--等于当前等级，0、1显示为“申请领取”, 小于或者大于当前等级 1显示为“申请领取” -->
                                        <transition name="fade-in-linear">
                                            <div
                                                @click="apply(receItme)"
                                                class="get_btn"
                                                v-show="
                                                    (initInfo.is_login && receItme.url_type == 1 && receItme.status == 1) ||
                                                    (initInfo.is_login &&
                                                        receItme.url_type == 1 &&
                                                        receItme.level == initInfo.level &&
                                                        receItme.status == 0)
                                                "
                                            >
                                                申请领取
                                            </div>
                                        </transition>
                                        <!--所有等级, 2显示为“已领取”-->
                                        <transition name="fade-in-linear">
                                            <div
                                                class="get_btn"
                                                v-show="initInfo.is_login && receItme.url_type == 1 && receItme.status == 2"
                                            >
                                                已领取
                                            </div>
                                        </transition>
                                    </li>
                                </ul>
                            </section>
                        </van-swipe-item>
                    </van-swipe>
                </div>
            </div>
            <!--规则-->
            <h3 class="rule_h3">活动规则</h3>
            <van-tabs v-model:active="activeName">
                <van-tab name="first">
                    <template #title>
                        <div>
                            VIP
                            <br />
                            专属优惠
                        </div>
                    </template>
                    <div class="table_box first">
                        <table class="table_con" v-if="vipExclu.length">
                            <tr>
                                <td>等级</td>
                                <td>
                                    单日
                                    <br />
                                    提款额度
                                </td>
                                <td>生日礼金</td>
                                <td>晋级礼金</td>
                                <td>专属客服</td>
                                <td>极速提款</td>
                                <td>
                                    特殊节日
                                    <br />
                                    礼品
                                </td>
                                <td>
                                    V币商城每
                                    <br />
                                    日兑换次数
                                </td>
                                <td>
                                    年度私
                                    <br />
                                    人定制海岛游
                                </td>
                                <td>
                                    威客公主
                                    <br />
                                    空降伴游
                                </td>
                            </tr>
                            <tr v-for="i in 13" :key="i">
                                <td>
                                    {{ vipExclu[i - 1].level }}
                                    <div class="cur_clo" v-show="initInfo.level == i - 1 && initInfo.is_login"></div>
                                </td>
                                <td>{{ vipExclu[i - 1].withdraw_limit }}</td>
                                <td>{{ vipExclu[i - 1].brithday_bonus }}</td>
                                <td>{{ vipExclu[i - 1].upgrade_bonus }}</td>
                                <td>{{ vipExclu[i - 1].cs_type }}</td>

                                <td>
                                    {{ vipExclu[i - 1].is_fast_withdraw == 1 ? "支持" : "-" }}
                                </td>
                                <td>
                                    {{ vipExclu[i - 1].is_festival_gift == 1 ? "支持" : "-" }}
                                </td>
                                <td>
                                    {{ vipExclu[i - 1].vmall_day_times == 0 ? "无限" : vipExclu[i - 1].vmall_day_times }}
                                </td>
                                <td>
                                    {{ vipExclu[i - 1].island_tour == "" ? "-" : vipExclu[i - 1].island_tour }}
                                </td>
                                <td>{{ vipExclu[i - 1].is_vk_girl == 1 ? "支持" : "-" }}</td>
                            </tr>
                        </table>
                    </div>
                    <p class="rule_item_title">专属优惠说明</p>
                    <p>
                        1.晋级礼金：VIP会员每次完成等级的晋升即可在活动页面自助领取晋级礼金，每个VIP等级的晋级礼金仅限领取一次，奖金需完成全站3倍有效流水。
                        <br />
                        2.生日礼金：生日礼金领取有效期为7天，从生日当日起，7日内可以领取。生日礼金需完成1倍全站有效流水，此礼金每年仅限领取1次。若VIP会员在注册的三个月内过生日，今年则不可领取生日礼金。
                        <br />
                        3.专属客服：VIP用户可享有对应的专属客服，当VIP用户联系在线客服时，系统将自动为会员匹配对应的专属客服。
                        <br />
                        4.极速提款：等级≥VIP8的会员，将享有优先出款的待遇。
                        <br />
                        5.特殊节日礼品：每年特殊节假日，等级≥VIP8的会员将获得精美节日礼品一份，具体节日礼品派发，请以客服站内信通知为准。
                        <br />
                        6.V币商城每日兑换次数：VIP会员可享有对应的V币商城每日兑换次数。
                        <br />
                        7.年度私人定制：等级≥VIP11的会员，即可联系在线客服进行申请东南亚三天两夜海岛游。此优惠每年仅限申请一次，无法折现。若VIP会员今年没有进行申请，则视为自动放弃。
                        <br />
                        8.威客公主空降伴游：等级达到VIP12的会员，即可联系在线客服进行申请空降嫩模一枚。此优惠每年仅限申请一次，无法折现。若VIP会员今年没有进行申请，则视为自动放弃。
                        <br />
                        9.以上所有VIP等级权益最终解释权归VKGAME所有。
                    </p>
                </van-tab>
                <van-tab name="second">
                    <template #title>
                        <div>
                            VIP
                            <br />
                            日返水
                        </div>
                    </template>

                    <div class="table_box second">
                        <table class="table_con table_bg" v-if="vipBack.length">
                            <tr>
                                <td>等级</td>
                                <td>
                                    小艾
                                    <br />
                                    电竞
                                </td>
                                <td>
                                    IM
                                    <br />
                                    电竞
                                </td>
                                <td>
                                    RG
                                    <br />
                                    电竞
                                </td>
                                <td>
                                    威客
                                    <br />
                                    &FB
                                    <br />
                                    体育
                                </td>
                                <td>
                                    皇冠
                                    <br />
                                    体育
                                </td>
                                <td>
                                    BTI
                                    <br />
                                    体育
                                </td>
                                <td>
                                    其他
                                    <br />
                                    体育
                                </td>
                                <td>真人</td>
                                <td>棋牌</td>
                                <td>
                                    电子
                                    <br />
                                    游戏
                                </td>
                            </tr>
                            <tr v-for="i in 13" :key="i">
                                <!-- <tr v-for="i in 13" :key="i"> -->

                                <td>
                                    {{ vipBack[i - 1].level }}
                                    <div class="cur_clo" v-show="initInfo.level == i - 1 && initInfo.is_login"></div>
                                </td>
                                <td>{{ vipBack[i - 1].egame_back }}</td>
                                <td>{{ vipBack[i - 1].imgame_back }}</td>
                                <td>{{ vipBack[i - 1].other_egame_back }}</td>
                                <td>{{ vipBack[i - 1].sport_back }}</td>
                                <td>{{ vipBack[i - 1].crown_back }}</td>
                                <td>{{ vipBack[i - 1].bti_back }}</td>
                                <td>{{ vipBack[i - 1].pb_sport_back }}</td>
                                <!-- <td>{{ vipBack[i-1].pb_sport_back}}</td> -->
                                <td>{{ vipBack[i - 1].live_game_back }}</td>
                                <td>{{ vipBack[i - 1].chess_back }}</td>
                                <td>{{ vipBack[i - 1].slots_back }}</td>
                            </tr>
                        </table>
                        <p class="data_unit">数据单位:%</p>
                    </div>
                    <p class="rule_item_title">活动规则</p>
                    <p>
                        1.小艾电竞包含自走棋。其它体育包括：平博体育、IM体育、沙巴体育。真人包括：AG真人、PM真人、欧博真人、PT真人。棋牌包括：乐游棋牌、开元棋牌、凯旋棋牌、博乐棋牌。电子游戏包括：PT电子游戏、PG电子游戏。
                        <br />
                        2.电竞/体育返水每日18:00左右自动派发，其余游戏返水每日凌晨0:30左右自动派发、无需申请。返现奖金无最低派发额度，无上限，此奖金需完成活动规定的1倍全站有效流水。返水计算周期为：昨日0点至今日0点的返水报表。
                        <br />
                        3.电竞赔率&lt;1.5、亚洲盘赔率&lt;0.75、欧洲盘&lt;1.75、美洲盘≤-133、马来盘≤0.75且>0、走盘、注单取消、对冲、未结算、串关、平半盘、实时兑现等不计算为有效流水。
                        <br />
                        4.所有轮盘类游戏、牛牛、骰宝、捕鱼王、空战世纪将不享受返水优惠；PT电子游戏中以下游戏不享受返水优惠：
                        <span class="yellow" @click="systemParams.ActiveMoreRules.isShow = true">点击查看</span>
                        。
                        <br />
                        5.每位有效玩家、手机号码、电子邮箱、银行卡、IP地址、每台设备只能使用一个账号享受优惠。对违规的用户，VKGAME保留无限期审核，
                        和扣回红利及所产生的利润权利。
                        <br />
                        6.VKGAME对本活动保有最终解释权。
                    </p>
                </van-tab>
                <van-tab name="third">
                    <template #title>
                        <div>
                            VIP
                            <br />
                            月存优惠
                        </div>
                    </template>

                    <div class="table_box third">
                        <table class="table_con table_bg table_con2" v-if="vipTransfer.length">
                            <tr>
                                <td>等级</td>
                                <td>最高彩金</td>
                                <td>单笔要求</td>
                                <td>优惠比例</td>
                                <td>流水要求</td>
                            </tr>
                            <tr>
                                <td>
                                    {{ vipTransfer[0].level }}
                                    <div class="cur_clo" v-show="initInfo.level == 0 && initInfo.is_login"></div>
                                </td>
                                <td>
                                    {{ vipTransfer[0].bonus ? vipTransfer[0].bonus + "元" : "-" }}
                                </td>
                                <td>
                                    {{ vipTransfer[0].deposit ? "≥" + vipTransfer[0].deposit + "元" : "-" }}
                                </td>
                                <td>
                                    {{ Math.floor(vipTransfer[0].percent * 100) ? vipTransfer[0].percent + "%" : "-" }}
                                </td>
                                <td>
                                    {{ Math.floor(vipTransfer[0].limit * 100) ? "(本金+彩金)*" + vipTransfer[0].limit : "-" }}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    {{ vipTransfer[1].level }}
                                    <div class="cur_clo" v-show="initInfo.level == 1 && initInfo.is_login"></div>
                                </td>
                                <td>
                                    {{ vipTransfer[1].bonus ? vipTransfer[1].bonus + "元" : "-" }}
                                </td>
                                <td rowspan="3">
                                    {{ vipTransfer[1].deposit ? "≥" + vipTransfer[1].deposit + "元" : "-" }}
                                </td>
                                <td rowspan="3">
                                    {{ Math.floor(vipTransfer[1].percent * 100) ? vipTransfer[1].percent + "%" : "-" }}
                                </td>
                                <td rowspan="3">
                                    {{ Math.floor(vipTransfer[1].limit * 100) ? "(本金+彩金)*" + vipTransfer[1].limit : "-" }}
                                </td>
                            </tr>
                            <tr v-for="i in 2" :key="i">
                                <td>
                                    {{ vipTransfer[i + 1].level }}
                                    <div class="cur_clo" v-show="initInfo.level == i + 1 && initInfo.is_login"></div>
                                </td>
                                <td>
                                    {{ vipTransfer[i + 1].bonus ? vipTransfer[i + 1].bonus + "元" : "-" }}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    {{ vipTransfer[4].level }}
                                    <div class="cur_clo" v-show="initInfo.level == 4 && initInfo.is_login"></div>
                                </td>
                                <td>
                                    {{ vipTransfer[4].bonus ? vipTransfer[4].bonus + "元" : "-" }}
                                </td>
                                <td rowspan="5">
                                    {{ vipTransfer[4].deposit ? "≥" + vipTransfer[4].deposit + "元" : "-" }}
                                </td>
                                <td rowspan="5">
                                    {{ Math.floor(vipTransfer[4].percent * 100) ? vipTransfer[4].percent + "%" : "-" }}
                                </td>
                                <td rowspan="5">
                                    {{ Math.floor(vipTransfer[4].limit * 100) ? "(本金+彩金)*" + vipTransfer[4].limit : "-" }}
                                </td>
                            </tr>
                            <tr v-for="i in 4" :key="i">
                                <td>
                                    {{ vipTransfer[i + 4].level }}
                                    <div class="cur_clo" v-show="initInfo.level == i + 4 && initInfo.is_login"></div>
                                </td>
                                <td>
                                    {{ vipTransfer[i + 4].bonus ? vipTransfer[i + 4].bonus + "元" : "-" }}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    {{ vipTransfer[9].level }}
                                    <div class="cur_clo" v-show="initInfo.level == 9 && initInfo.is_login"></div>
                                </td>
                                <td>
                                    {{ vipTransfer[9].bonus ? vipTransfer[9].bonus + "元" : "-" }}
                                </td>
                                <td rowspan="4">
                                    {{ vipTransfer[9].deposit ? "≥" + vipTransfer[9].deposit + "元" : "-" }}
                                </td>
                                <td rowspan="4">
                                    {{ Math.floor(vipTransfer[9].percent * 100) ? vipTransfer[9].percent + "%" : "-" }}
                                </td>
                                <td rowspan="4">
                                    {{ Math.floor(vipTransfer[9].limit * 100) ? "(本金+彩金)*" + vipTransfer[9].limit : "-" }}
                                </td>
                            </tr>
                            <tr v-for="i in 3" :key="i">
                                <td>
                                    {{ vipTransfer[i + 9].level }}
                                    <div class="cur_clo" v-show="initInfo.level == i + 9 && initInfo.is_login"></div>
                                </td>
                                <td>
                                    {{ vipTransfer[i + 9].bonus ? vipTransfer[i + 9].bonus + "元" : "-" }}
                                </td>
                            </tr>
                        </table>
                    </div>
                    <p class="rule_item_title">活动规则</p>
                    <p>
                        1.每个自然月内单笔存款符合条件的VIP会员可在VIP页面或优惠活动页面申请一次“VIP月存款优惠”，此优惠彩金需完成对应的有效流水。
                        <br />
                        例：VIP3会员单笔存款500，申请本月VIP月存款活动优惠，此时需完成（500+500X15%）x12=6900 的全站有效流水
                        <br />
                        2.会员存款后需在活动页面申请，若用户在申请此优惠前将存款从主钱包转出或发起提款，则不可申请月存优惠，会员申请成功后，奖金将会主动添加至用户的主钱包。
                        <br />
                        3.VIP会员单笔存款要求以及对应优惠彩金以会员申请后充值到账时间所对应的VIP等级为准。
                        <br />
                        4.VIP月存款优惠不与新用户首存优惠活动、全站每日存款活动共享，活动规定的彩金流水未完成前不可再次申请，此优惠活动当月未申请则视为自动放弃。
                        <br />
                        5.电竞赔率&lt;1.5、亚洲盘赔率&lt;0.75、欧洲盘&lt;1.75、美洲盘≤-133、马来盘≤0.75且>0、走盘、注单取消、对冲、未结算、串关、平半盘、实时兑现等不计算为有效流水；PT电子游戏中以下游戏不算有效流水：
                        <span class="yellow" @click="systemParams.ActiveMoreRules.isShow = true">点击查看</span>
                        。
                        <br />
                        6.每位有效玩家、手机号码、电子邮箱、银行卡、IP地址、每台设备只能使用一个账号享受优惠。对违规的用户，VKGAME保留无限期审核，
                        和扣回红利及所产生的利润权利。
                        <br />
                        7.VKGAME官方对本活动保有最终解释权。
                    </p>
                </van-tab>
                <van-tab name="fourth">
                    <template #title>
                        <div>
                            VIP
                            <br />
                            月体验金
                        </div>
                    </template>

                    <div class="table_box fourth">
                        <table class="table_con table_bg table_con3" v-if="vipExper.length">
                            <tr>
                                <td>等级</td>
                                <td>体验金</td>
                                <td>流水要求</td>
                            </tr>
                            <tr>
                                <td>
                                    {{ vipExper[0].level }}
                                    <div class="cur_clo" v-show="initInfo.level == 0 && initInfo.is_login"></div>
                                </td>
                                <td>
                                    {{ vipExper[0].bonus ? vipExper[0].bonus + "元" : "-" }}
                                </td>
                                <td rowspan="13">全站3倍有效流水</td>
                            </tr>
                            <tr v-for="i in 12" :key="i">
                                <td>
                                    {{ vipExper[i].level }}
                                    <div class="cur_clo" v-show="initInfo.level == i && initInfo.is_login"></div>
                                </td>
                                <td>
                                    {{ vipExper[i].bonus ? vipExper[i].bonus + "元" : "-" }}
                                </td>
                            </tr>
                        </table>
                    </div>
                    <p class="rule_item_title">活动规则</p>
                    <p>
                        1.当月累计存款≥500的VIP会员即可领取一次专属游戏体验金，此优惠需完成对应的3倍有效流水。
                        <br />
                        2.游戏体验金需在VIP页面或优惠活动页面自助领取，此活动当月未领取则视为自动放弃。
                        <br />
                        3.电竞赔率&lt;1.5、亚洲盘赔率&lt;0.75、欧洲盘&lt;1.75、美洲盘≤-133、马来盘≤0.75且>0、走盘、注单取消、对冲、未结算、串关、平半盘、实时兑现等不计算为有效流水；PT电子游戏中以下游戏不算有效流水：
                        <span class="yellow" @click="systemParams.ActiveMoreRules.isShow = true">点击查看</span>
                        。
                        <br />
                        4.每位有效玩家、手机号码、电子邮箱、银行卡、IP地址、每台设备只能使用一个账号享受优惠。对违规的用户，VKGAME保留无限期审核，
                        和扣回红利及所产生的利润权利。
                        <br />
                        5.VKGAME对本活动保有最终解释权。
                    </p>
                </van-tab>

                <van-tab name="fifth">
                    <template #title>
                        <div>
                            VIP
                            <br />
                            月救援金
                        </div>
                    </template>

                    <div class="table_box fifth">
                        <table class="table_con table_bg table_con3" v-if="vipRescue.length">
                            <tr>
                                <td>等级</td>
                                <td>
                                    月总
                                    <br />
                                    负盈利
                                </td>
                                <td>
                                    救援金
                                    <br />
                                    比例
                                </td>
                                <td>
                                    救援金
                                    <br />
                                    最高
                                </td>
                                <td>流水要求</td>
                            </tr>
                            <tr v-for="i in 13" :key="i">
                                <td>
                                    {{ vipRescue[i - 1].level }}
                                    <div class="cur_clo" v-show="initInfo.level == i - 1 && initInfo.is_login"></div>
                                </td>
                                <td>{{ vipRescue[i - 1].loss }}</td>
                                <td>{{ vipRescue[i - 1].percent }}</td>
                                <td>{{ vipRescue[i - 1].bonus }}</td>
                                <td rowspan="13" v-if="i == 1">全站1倍有效流水</td>
                            </tr>
                        </table>
                    </div>
                    <p class="rule_item_title">活动规则</p>
                    <p>
                        1.月总负盈利计算周期为一个自然月，若当月负盈利≥200000即可在VIP页面或优惠活动页面申请领取此优惠。
                        <br />
                        2.当月救援金需于次月1-3号自助领取，月救援金需完成全站1倍有效流水，此活动逾期未领取则视为自动放弃。
                        <br />
                        3.电竞赔率&lt;1.5、亚洲盘赔率&lt;0.75、欧洲盘&lt;1.75、美洲盘≤-133、马来盘≤0.75且>0、走盘、注单取消、对冲、未结算、串关、平半盘、实时兑现等不计算为有效流水；PT电子游戏中以下游戏不算有效流水：
                        <span class="yellow" @click="systemParams.ActiveMoreRules.isShow = true">点击查看</span>
                        。
                        <br />
                        4.每位有效玩家、手机号码、电子邮箱、银行卡、IP地址、每台设备只能使用一个账号享受优惠。对违规的用户，VKGAME保留无限期审核，
                        和扣回红利及所产生的利润权利。
                        <br />
                        5.VKGAME对本活动保有最终解释权。
                    </p>
                </van-tab>

                <van-tab name="achienement">
                    <template #title>
                        <div>
                            VIP
                            <br />
                            月成就奖
                        </div>
                    </template>

                    <div class="table_box achienement">
                        <table class="table_con table_bg table_con3" v-if="vipAchienement.length">
                            <tr>
                                <td>等级</td>
                                <td>
                                    会员
                                    <br />
                                    勋章
                                </td>
                                <td>
                                    月总
                                    <br />
                                    盈利
                                </td>
                                <td>成就奖</td>
                                <td>流水要求</td>
                            </tr>
                            <tr v-for="i in 13" :key="i">
                                <td>
                                    {{ vipAchienement[i - 1].level }}
                                    <div class="cur_clo" v-show="initInfo.level == i - 1 && initInfo.is_login"></div>
                                </td>
                                <td>{{ vipAchienement[i - 1].level_name }}</td>
                                <td>
                                    {{
                                        vipAchienement[i - 1].total_profit == "-"
                                            ? vipAchienement[i - 1].total_profit
                                            : "≥" + vipAchienement[i - 1].total_profit
                                    }}
                                </td>
                                <td>{{ vipAchienement[i - 1].bonus }}</td>
                                <td rowspan="13" v-if="i == 1">全站1倍有效流水</td>
                            </tr>
                        </table>
                    </div>
                    <p class="rule_item_title">活动规则</p>
                    <p>
                        1.月总盈利计算周期为一个自然月，若当月总盈利≥300000即可在VIP页面或优惠活动页面申请领取此优惠。
                        <br />
                        2.当月成就奖需于次月1-3号自助领取，月成就奖需完成全站1倍有效流水，此活动逾期未领取则视为自动放弃。
                        <br />
                        3.电竞赔率&lt;1.5、亚洲盘赔率&lt;0.75、欧洲盘&lt;1.75、美洲盘≤-133、马来盘≤0.75且>0、走盘、注单取消、对冲、未结算、串关、平半盘、实时兑现等不计算为有效流水；PT电子游戏中以下游戏不算有效流水：
                        <span class="yellow" @click="systemParams.ActiveMoreRules.isShow = true">点击查看</span>
                        。
                        <br />
                        4.每位有效玩家、手机号码、电子邮箱、银行卡、IP地址、每台设备只能使用一个账号享受优惠。对违规的用户，VKGAME保留无限期审核，
                        和扣回红利及所产生的利润权利。
                        <br />
                        5.VKGAME对本活动保有最终解释权。
                    </p>
                </van-tab>
            </van-tabs>
        </div>
        <!-- 升保级弹窗 -->
        <van-dialog
            teleport="body"
            closeOnClickOverlay
            :overlayStyle="{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }"
            v-model:show="upgradeDetailShow"
            :show-confirm-button="false"
            className="vip-level-dialog text-white"
        >
            <h3 class="text-#e6e5e5 text-16px font-bold text-center mb-10px">我的升保级明细</h3>
            <div class="vipsystem_upgrade_detail">
                <h5 v-show="initInfo.level < 12">升级到VIP{{ initInfo.level + 1 }}：</h5>
                <p v-show="initInfo.level < 12">
                    存款&nbsp;&nbsp;
                    <span class="yellow">{{ formatMoney(initInfo.upgrade_deposit) }}</span>
                    / {{ formatMoney(initInfo.upgrade_requrie_deposit) }}
                    <br />
                    流水&nbsp;&nbsp;
                    <span class="yellow">{{ formatMoney(initInfo.upgrade_bet) }}</span>
                    / {{ formatMoney(initInfo.upgrade_requrie_bet) }}
                </p>
                <div class="dasline" v-show="initInfo.level > 0 && initInfo.level < 12"></div>
                <h5 v-show="initInfo.level > 0">保级：</h5>
                <p v-show="initInfo.level > 0">
                    存款&nbsp;&nbsp;
                    <span class="yellow">
                        {{ formatMoney(initInfo.relegation_deposit) }}
                    </span>
                    / {{ formatMoney(initInfo.relegation_requrie_deposit) }}
                    <br />
                    流水&nbsp;&nbsp;
                    <span class="yellow">
                        {{ formatMoney(initInfo.relegation_bet) }}
                    </span>
                    / {{ formatMoney(initInfo.relegation_requrie_bet) }}
                </p>
            </div>
            <div class="t_close" @click="upgradeDetailShow = false"></div>
        </van-dialog>
        <!--升级保级表-->
        <van-dialog
            teleport="body"
            closeOnClickOverlay
            :overlayStyle="{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }"
            v-model:show="classRuleShow"
            :show-confirm-button="false"
            className="vip-level-dialog text-white"
        >
            <h3 class="text-#e6e5e5 text-16px font-bold text-center mb-10px">升保级明细表</h3>
            <table class="table_con table_rule" @click.stop v-if="classRule.length">
                <tr>
                    <td rowspan="2">
                        会员
                        <br />
                        等级
                    </td>
                    <td rowspan="2">
                        会员
                        <br />
                        勋章
                    </td>
                    <td colspan="2">升级（累计）</td>
                    <td colspan="2">保级（累计）</td>
                </tr>
                <tr>
                    <td>存款</td>
                    <td>流水</td>
                    <td>存款</td>
                    <td>流水</td>
                </tr>
                <tr v-for="i in 12" :key="i">
                    <td>
                        {{ classRule[i].level }}
                        <div class="cur_clo" v-show="initInfo.level == i && initInfo.is_login"></div>
                    </td>
                    <td>{{ classRule[i].level_name }}</td>
                    <td>{{ classRule[i].upgrade_deposit }}</td>
                    <td>{{ classRule[i].upgrade_bet }}</td>
                    <td>{{ classRule[i].relegation_deposit }}</td>
                    <td>{{ classRule[i].relegation_bet }}</td>
                </tr>
                <tr class="class_rule_desc">
                    <td colspan="6">注意：IM电竞游戏不计算在VIP升降级的有效流水中。</td>
                </tr>
            </table>
            <div class="t_close" @click="classRuleShow = false"></div>
        </van-dialog>
        <van-dialog
            teleport="body"
            closeOnClickOverlay
            :overlayStyle="{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }"
            v-model:show="dialogData.show"
            :show-confirm-button="false"
            className="vip-level-dialog"
        >
            <div class="vip_dialog_box" :class="dialogData.classname">
                <div class="colse" @click="dialogData.show = false"></div>
                <h1 class="success_txt">恭喜成功领取</h1>
                <h1>{{ dialogData.txt }}</h1>
                <h3 class="bouns">
                    <span>{{ dialogData.bouns }}</span>
                    <span class="unit">{{ dialogData.unit }}</span>
                </h3>
                <div class="vip_btn" @click="dialogData.show = false">我知道了</div>
            </div>
        </van-dialog>
        <!--月存优惠领取之前确认-->
        <van-dialog
            teleport="body"
            closeOnClickOverlay
            :overlayStyle="{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }"
            v-model:show="depostDialogData.show"
            :show-confirm-button="false"
            className="vip-level-dialog top-45%!"
        >
            <div class="vip_dialog_box deposit pt-86px!">
                <div class="colse" @click="depostDialogData.show = false"></div>
                <h1 class="success_txt">您当前可领取</h1>
                <h1>月优惠存款</h1>
                <h3 class="bouns">
                    <span>{{ depostDialogData.bouns }}</span>
                    <span class="unit">元</span>
                </h3>
                <div class="vip_btn" @click="depositApply()">立即领取</div>
            </div>
        </van-dialog>
    </div>
</template>

<style lang="scss" scoped>
.fade-in-linear-enter-active,
.fade-in-linear-leave-active {
    transition: opacity 200ms linear;
}
.fade-in-linear-enter-from,
.fade-in-linear-leave-to {
    opacity: 0;
}
@keyframes randomShining {
    0% {
        opacity: 1;
        transform: scale(0.5) translateX(-50%);
    }
    20% {
        opacity: 0;
    }
    40% {
        opacity: 1;
        transform: scale(0.8) translateX(-50%);
    }
    60% {
        opacity: 0;
    }
    80% {
        opacity: 1;
        transform: scale(1) translateX(-50%);
    }
    100% {
        opacity: 0;
        transform: scale(1) translateX(-50%);
    }
}

.yellow {
    color: #f7bc86;
}
.text_de {
    text-decoration: underline;
}
.vip-page {
    font-size: 12px;
    .page-wrapper {
        padding-bottom: 0.5rem;
        background: url("@/assets/img/vipsystemnew/bg.png") no-repeat center top;
        background-size: 100% 4.965rem;
        background-color: #101731;
        position: relative;
    }
    .rule_h3 {
        width: 100%;
        height: 0.25rem;
        padding: 0.03rem 0;
        margin-bottom: 0.1rem;
        font-size: 0.14rem;
        background: url("@/assets/img/vipsystemnew/title2.png") no-repeat;
        background-size: 100% 100%;
        color: #f7bc86;
        text-align: center;
        line-height: normal;
        font-weight: bold;
    }
    :deep(.van-tabs__nav) {
        width: 3.45rem;
        height: 0.4rem;
        background-color: #0c1125;
        border-radius: 0.025rem;
        padding: 0;
    }

    :deep(.van-tab) {
        color: #bbbbbb;
    }
    :deep(.van-tab--active) {
        color: #edbe8d;
    }
    :deep(.van-tab__text) {
        line-height: 1.2;
        font-weight: bold;
        font-size: 0.13rem;
    }
    :deep(.van-tabs__line) {
        height: 2px;
        background-image: linear-gradient(to right, #ffe0ac, #eebc76);
        bottom: 0;
        width: 20% !important;
    }
    :deep(.van-tab) {
        flex: 0 0 20%;
        flex-basis: 20% !important;
        padding: 0.05rem;
        line-height: 0.4rem;
    }
    :deep(.van-tabs--line .van-tabs__wrap) {
        margin-bottom: 0.135rem;
        height: 0.44rem;
    }
    :deep(.van-hairline--top-bottom::after, .van-hairline-unset--top-bottom::after) {
        border-width: 0;
    }

    .van-tabs {
        width: 3.45rem;
        margin: 0 auto;
        .table_box {
            width: 100%;
            border-radius: 0.05rem;
            margin-bottom: 0.17rem;
        }
        p {
            font-size: 0.12rem;
            color: #bbbbbb;
            line-height: 1.5;
            &.data_unit {
                color: #606882;
                margin-top: 0.05rem;
                text-align: right;
            }
        }
        .rule_item_title {
            font-weight: bold;
            text-align: center;
            color: #fff;
        }
        .table_con {
            line-height: 1.6;
            width: 3.45rem;
            border-collapse: separate;
            border-spacing: 0;
            border-top: solid 1px rgba(253, 220, 166, 0.25);
            border-left: solid 1px rgba(253, 220, 166, 0.25);
            border-radius: 0.05rem;

            tr {
                td {
                    height: 0.28rem;
                    text-align: center;
                    font-size: 0.12rem;
                    color: #929292;
                    border-right: rgba(253, 220, 166, 0.25) 1px solid;
                    border-bottom: rgba(253, 220, 166, 0.25) 1px solid;
                    position: relative;
                    &:first-child {
                        color: #fff;
                    }
                }

                &:first-child td {
                    color: #fff;
                }
                &:first-child td:first-child {
                    border-top-left-radius: 0.05rem;
                }
                &:first-child td:last-child {
                    border-top-right-radius: 0.05rem;
                }
                &:last-child td:first-child {
                    border-bottom-left-radius: 0.05rem;
                }
                &:last-child td:last-child {
                    border-bottom-right-radius: 0.05rem;
                }
            }
            &.table_con2 tr {
                &:last-child td:last-child {
                    border-bottom-right-radius: 0;
                }
                &:nth-child(11) td:last-child {
                    border-bottom-right-radius: 0.05rem;
                }
            }
            &.table_con3 tr {
                &:last-child td:last-child {
                    border-bottom-right-radius: 0;
                }
                &:nth-child(2) td:last-child {
                    border-bottom-right-radius: 0.05rem;
                }
            }
            &.table_rule {
                background-color: rgba(16, 23, 49, 0.8);
                border-radius: 10px;
                border: solid 1px #e3b789;
                tr:nth-child(2) td {
                    color: #fff;
                }
            }
        }
    }
    .vip_card {
        width: 100%;
        height: 3rem;
        overflow: visible;
        .item_card {
            overflow: visible;
            width: 2.47rem;
            height: 2.965rem;
            background: url("@/assets/img/vipsystemnew/card-bg.png") no-repeat center bottom;
            background-size: 2.095rem 1.955rem;

            &.current {
                .light {
                    opacity: 1;
                }
                .shinning_img {
                    visibility: visible;
                    animation: randomShining 3s linear infinite;
                }
                .card_info {
                    .info_mask {
                        opacity: 0;
                    }
                }
                .card_face {
                    .back_cur {
                        display: block;
                    }
                }
            }
            .light {
                width: 3.75rem;
                height: 4.03rem;
                background: url("@/assets/img/vipsystemnew/light.png") no-repeat;
                background-size: 100% 100%;
                position: absolute;
                // top: -0.47rem;
                bottom: -0.56rem;
                left: 50%;
                transform: translateX(-50%);
                z-index: 1;
                opacity: 0;
            }
            &.card_zero {
                .card_info {
                    background-image: url("@/assets/img/vipsystemnew/card/card0.png");
                    .lv_cnname {
                        color: #fff;
                    }
                }
            }
            &.card_classic {
                .card_info {
                    background-image: url("@/assets/img/vipsystemnew/card/card1.png");
                    .lv_cnname {
                        color: #abe5f3;
                    }
                }
            }
            &.card_gold {
                .shinning_img1 {
                    top: 0.9rem;
                    left: 47%;
                }
                .card_info {
                    background-image: url("@/assets/img/vipsystemnew/card/card2-4.png");
                    .lv_cnname {
                        color: #ffeeac;
                    }
                }
            }
            &.card_platinum {
                .shinning_img1 {
                    top: 0.9rem;
                    left: 46%;
                }
                .card_info {
                    background-image: url("@/assets/img/vipsystemnew/card/card5-7.png");
                    .lv_cnname {
                        color: #b6f6ff;
                    }
                }
            }
            &.card_diamond {
                .shinning_img1 {
                    top: 0.95rem;
                    left: 42%;
                }
                .card_info {
                    background-image: url("@/assets/img/vipsystemnew/card/card7-10.png");
                    .lv_cnname {
                        color: #eadfff;
                    }
                    .lv_img {
                        height: 1.95rem;
                        width: 2.13rem;
                    }
                }
            }
            &.card_honour {
                .shinning_img1 {
                    top: 0.9rem;
                    left: 38%;
                }
                .shinning_img2 {
                    top: 1.42rem;
                    left: 50%;
                }
                .card_info {
                    background-image: url("@/assets/img/vipsystemnew/card/card11.png");
                    .lv_cnname {
                        color: #fff4b7;
                    }
                }
            }
            &.card_premier {
                .shinning_img1 {
                    top: 0.9rem;
                    left: 35%;
                }
                .shinning_img2 {
                    top: 1.45rem;
                    left: 50%;
                }
                .shinning_img3 {
                    top: 0.6rem;
                    left: 50%;
                }
                .card_info {
                    background-image: url("@/assets/img/vipsystemnew/card/card12.png");
                    .lv_cnname {
                        color: #eddad0;
                    }
                    .lv_img {
                        top: 0.13rem;
                        height: 1.8rem;
                        width: 2.016rem;
                    }
                }
            }
            .shinning_img {
                position: absolute;
                width: 0.35rem;
                height: 0.35rem;
                visibility: hidden;
                z-index: 4;
                transform-origin: left;
            }
            .card_info {
                position: absolute;
                bottom: 0.05rem;
                left: 50%;
                transform: translateX(-50%);
                z-index: 2;
                width: 1.88rem;
                height: 2.965rem;
                background-size: 100% 100%;
                background-repeat: no-repeat;
                .lv_cnname {
                    text-align: center;
                    font-size: 0.14rem;
                    margin: 0.1rem 0;
                    font-weight: bold;
                }
                .lv_img {
                    position: absolute;
                    top: 0.11rem;
                    left: 50%;
                    transform: translateX(-50%);
                    height: 2rem;
                    width: 2.24rem;
                    z-index: 1;
                }
                .info_mask {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    border-radius: 0.08rem;
                    background: rgba(0, 0, 0, 0.65);
                    z-index: 3;
                }
            }
            .card_face {
                position: absolute;
                bottom: 0;
                left: 50%;
                transform: translateX(-50%);
                z-index: 3;
                width: 2.085rem;
                height: 2.1rem;
                background: url("@/assets/img/vipsystemnew/card-face.png") no-repeat;
                background-size: 100% 100%;
                padding: 0.88rem 0.12rem 0;
                color: #fff;
                font-size: 0.12rem;
                line-height: 1.9;
                .base {
                    overflow: hidden;
                    .headimg {
                        width: 0.4rem;
                        height: 0.4rem;
                        border-radius: 50%;
                        border: 2px solid #f6dcc0;
                        margin-right: 0.1rem;
                    }
                    .nickname {
                        max-width: 0.9rem;
                        display: inline-block;
                        vertical-align: middle;
                    }
                }
                .progress {
                    height: 0.8rem;
                    border-top: 1px dashed rgba(146, 146, 146, 0.2);
                    margin-top: 0.02rem;
                    line-height: 1.5;
                    position: relative;
                    .pro_line {
                        margin-top: 0.02rem;
                    }
                    .mydetail {
                        position: absolute;
                        width: 60%;
                        bottom: 0.15rem;
                        left: 50%;
                        font-size: 0.12rem;
                        transform-origin: left center;
                        transform: scale(0.9) translateX(-50%);
                    }
                }
                .other_lv {
                    text-align: center;
                    margin-top: 0.15rem;
                    p {
                        margin-top: -0.05rem;
                    }
                    .other_lv_icon {
                        width: 0.3rem;
                        height: 0.3rem;
                        display: inline-block;
                        background-size: 100% 100%;
                        background-repeat: no-repeat;
                    }
                }
                .after_lv {
                    color: #929292;
                }
                .before_lv_icon {
                    background-image: url("@/assets/img/vipsystemnew/before_lv.png");
                }
                .after_lv_icon {
                    background-image: url("@/assets/img/vipsystemnew/lock.png");
                }
                .back_cur {
                    position: absolute;
                    text-decoration: underline;
                    bottom: 0.1rem;
                    left: 50%;
                    transform: translateX(-50%);
                    font-size: 0.12rem;
                    color: #929292;
                    display: none;
                }
            }
        }
    }
    .upgradetxt {
        margin-top: 0.2rem;
        color: #929292;
        padding: 0 0.12rem;
        position: relative;
        p {
            line-height: 2;
        }
        .to_show_detail {
            position: absolute;
            right: 0.12rem;
            bottom: 0;
            width: 1.105rem;
            padding: 0.02rem 0;
            border-radius: 19.9px;
            box-shadow: -1px 2.8px 7px 0 rgba(0, 0, 0, 0.28);
            background-image: linear-gradient(to right, #f3e0c7, #d4b396);
            text-align: center;
            font-size: 0.12rem;
            font-weight: bold;
            color: #101731;
            line-height: normal;
        }
    }

    .can_discount {
        // height: 240px;
        margin: 0.25rem 0 0;
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        padding: 0 0.05rem;
        justify-content: space-around;
        line-height: normal;
        li {
            height: 1.29rem;
            position: relative;
            &:last-child {
                margin-right: 0;
            }
            &:active .get_btn {
                color: #101731;
            }
            &.canshow {
                .mask {
                    display: none;
                }
                .get_btn {
                    display: block;
                }
            }
            &.got {
                &:active .get_btn {
                    color: #78482f;
                }
                .get_btn {
                    &:active {
                        color: #78482f;
                    }
                    &:before {
                        display: block;
                    }
                }
            }
            p {
                transform: scale(0.8);
                line-height: 1;
            }

            .detail {
                width: 1.08rem;
                height: 0.89rem;
                text-align: center;
                border-radius: 0.05rem;
                border: solid 1px #e3b789;
                background-color: #101731;
                cursor: pointer;
                font-size: 0.12rem;
                color: #f7bc86;
                padding-top: 0.07rem;
                position: relative;
                .mask {
                    position: absolute;
                    z-index: 1;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);

                    border-radius: 0.05rem;
                    width: 1.08rem;
                    height: 0.89rem;
                    cursor: default;
                    background: rgba(16, 23, 49, 0.58);
                }
            }
            .detail_txt {
                position: absolute;
                width: 150%;
                bottom: 0.01rem;
                left: 50%;
                color: #929292;
                transform: scale(0.7) translateX(-50%) translateZ(0);
                transform-origin: left;
                line-height: normal;
            }
            .get_btn {
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
                top: 1rem;
                width: 0.8rem;
                padding: 0.04rem 0;
                border-radius: 0.12rem;
                box-shadow: -1px 2.8px 7px 0 rgba(0, 0, 0, 0.28);
                background-image: linear-gradient(to right, #f8dfc4, #dbb292);
                color: #78482f;
                text-align: center;
                font-size: 0.12rem;
                font-weight: bold;
                display: none;
                cursor: pointer;
                &:active {
                    color: #101731;
                }
                &:before {
                    content: "";
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    left: 0;
                    top: 0;
                    background: rgba(16, 23, 49, 0.58);
                    display: none;
                }
            }
            .type_icon {
                width: 0.28rem;
                height: 0.28rem;
                margin: 0 auto;
                background-repeat: no-repeat;
                background-size: 100% 100%;
                margin-bottom: 0.03rem;
                &.upgrade {
                    background-image: url("@/assets/img/vipsystemnew/icon3.png");
                }
                &.birth {
                    background-image: url("@/assets/img/vipsystemnew/icon2.png");
                }
                &.deposit {
                    background-image: url("@/assets/img/vipsystemnew/icon4.png");
                }
                &.privilege {
                    background-image: url("@/assets/img/vipsystemnew/icon5.png");
                }
                &.back {
                    background-image: url("@/assets/img/vipsystemnew/icon1.png");
                }
                &.rescue {
                    background-image: url("@/assets/img/vipsystemnew/icon6.png");
                }
                &.kf_service {
                    background-image: url("@/assets/img/vipsystemnew/icon7.png");
                }
                &.achienement {
                    background-image: url("@/assets/img/vipsystemnew/icon8.png");
                }
            }
        }
    }
    .siledr {
        width: 94%;
        margin: 0px auto;
        margin-top: 0.13rem;
        height: 2.64rem;
        border: solid 0.01rem #edb582;
        border-radius: 0.1rem;
        display: flex;
        justify-content: center;
        align-items: center;
        //  margin-bottom: 0.2rem;

        .siledr_block {
            height: 2.555rem;
            border-radius: 0.1rem;
            .home_swipe {
                height: 2.535rem;
                width: 3.33rem;
                border-radius: 0.1rem;
                border: 0.01rem dashed #edb582;

                .home_swipe_item {
                    height: 100%;

                    img {
                        width: 100%;
                        height: 100%;
                    }
                }
            }
        }
    }
    .siledr_box {
        width: 100%;
        margin-bottom: 0.11rem;

        .siledr_block_box {
            width: 100%;

            .home_swipe_box {
                width: 3.55rem;
                margin: 0px auto;
                :deep(.van-swipe__indicators) {
                    bottom: 0.02rem;
                }
                .home_swipe_item_box {
                    width: 3.55rem;
                    margin-bottom: 0.15rem;
                }

                .active_silder {
                    .active_cak {
                        box-shadow: 2px 2px 10px 0 #edb582, -1px -1px 10px 0 #edb582 !important;
                    }
                }
            }
        }
    }
}
</style>
<style lang="scss">
.carousel-3d-container.vip_card {
    .carousel-3d-controls {
        background-color: red;
        .next {
            width: 0.175rem !important;
            height: 0.31rem !important;
            cursor: pointer;
            span {
                display: none;
            }
            right: 0.35rem;
            background: url("@/assets/img/vipsystemnew/arrow_r.png") no-repeat;
            background-size: 100% 100%;
            &:active {
                background: url("@/assets/img/vipsystemnew/arrow_r_h.png") no-repeat;
                background-size: 100% 100%;
            }
        }
        .prev {
            width: 0.175rem !important;
            height: 0.31rem !important;
            cursor: pointer;
            span {
                display: none;
            }
            left: 0.35rem;
            background: url("@/assets/img/vipsystemnew/arrow_l.png") no-repeat;
            background-size: 100% 100%;
            &:active {
                background: url("@/assets/img/vipsystemnew/arrow_l_h.png") no-repeat;
                background-size: 100% 100%;
            }
        }
    }
}
.vip-level-dialog.van-dialog {
    width: 355px;
    max-width: 100vw;
    border-radius: 0;
    line-height: 1.6;
    font-size: 12px;
    overflow: visible;
    .t_close {
        margin: auto;
        width: 18px;
        height: 18px;
        margin-top: 20px;
        background: url("@/assets/img/template/july/leftnav_closeicon.png") no-repeat;
        background-size: 100% 100%;
        margin-bottom: 6px;
    }
    .table_con {
        width: 3.45rem;
        border-collapse: separate;
        border-spacing: 0;
        border-top: solid 1px rgba(253, 220, 166, 0.25);
        border-left: solid 1px rgba(253, 220, 166, 0.25);
        border-radius: 0.05rem;

        tr {
            td {
                height: 0.28rem;
                text-align: center;
                font-size: 0.12rem;
                color: #929292;
                border-right: rgba(253, 220, 166, 0.25) 1px solid;
                border-bottom: rgba(253, 220, 166, 0.25) 1px solid;
                position: relative;
                &:first-child {
                    color: #fff;
                }
            }

            &:first-child td {
                color: #fff;
            }
            &:first-child td:first-child {
                border-top-left-radius: 0.05rem;
            }
            &:first-child td:last-child {
                border-top-right-radius: 0.05rem;
            }
            &:last-child td:first-child {
                border-bottom-left-radius: 0.05rem;
            }
            &:last-child td:last-child {
                border-bottom-right-radius: 0.05rem;
            }
        }
        &.table_con2 tr {
            &:last-child td:last-child {
                border-bottom-right-radius: 0;
            }
            &:nth-child(11) td:last-child {
                border-bottom-right-radius: 0.05rem;
            }
        }
        &.table_con3 tr {
            &:last-child td:last-child {
                border-bottom-right-radius: 0;
            }
            &:nth-child(2) td:last-child {
                border-bottom-right-radius: 0.05rem;
            }
        }
        &.table_rule {
            background-color: rgba(16, 23, 49, 0.8);
            border-radius: 10px;
            border: solid 1px #e3b789;
            tr:nth-child(2) td {
                color: #fff;
            }
        }
    }
    .class_rule_desc td {
        color: #929292 !important;
        text-align: left;
        padding-left: 0.1rem;
    }
    .yellow {
        color: #e3b789;
    }
    .vipsystem_upgrade_detail {
        width: 3.55rem;
        border-radius: 10px;
        border: solid 1px #e3b789;
        background-color: rgba(16, 23, 49, 0.8);
        color: #fff;
        padding: 0.2rem 0.34rem;
        h5 {
            line-height: 2;
            font-size: 13px;
            font-weight: bold;
        }
        .dasline {
            width: 100%;
            height: 0;
            border-bottom: 2px dashed rgba(253, 220, 166, 0.25);
            margin: 0.1rem 0;
        }
    }
    .vip_dialog_box {
        width: 3.15rem;
        margin: auto;
        height: 3.325rem;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        position: relative;
        font-size: 0.12rem;
        color: #78482f;
        text-align: center;
        padding-top: 80px;
        h1 {
            line-height: 1.2;
            font-size: 24px;
            font-weight: bold;
        }
        .bouns {
            margin-top: 0.05rem;
            font-size: 0.2rem;
            color: #bd7539;
            font-weight: bold;
        }
        .unit {
            font-size: 0.14rem;
            margin-left: 0.01rem;
        }
        .colse {
            position: absolute;
            bottom: -0.1rem;
            left: 50%;
            transform: translateX(-50%);
            width: 0.16rem;
            height: 0.16rem;
            background: url("@/assets/img/vipsystemnew/close.png") no-repeat;
            background-size: 100% 100%;
            cursor: pointer;
            &:active {
                background: url("@/assets/img/vipsystemnew/close_h.png") no-repeat;
                background-size: 100% 100%;
            }
        }
        .vip_btn {
            width: 1.5rem;
            height: 0.35rem;
            line-height: 0.35rem;
            border-radius: 0.17rem;
            box-shadow: -1px 2.8px 7px 0 rgba(0, 0, 0, 0.28);
            background-image: linear-gradient(to top, #dbb292, #f8dfc4);
            font-size: 0.12rem;
            color: #78482f;
            font-weight: bold;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            bottom: 0.55rem;
            &:active {
                opacity: 0.9;
            }
        }
    }
    .upgrade {
        background-image: url("@/assets/img/vipsystemnew/upgrade.png");
    }
    .birth {
        background-image: url("@/assets/img/vipsystemnew/birth.png");
    }
    .deposit {
        background-image: url("@/assets/img/vipsystemnew/deposit.png");
    }
    .privilege {
        background-image: url("@/assets/img/vipsystemnew/privilege.png");
    }
    .rescue {
        background-image: url("@/assets/img/vipsystemnew/rescue.png");
    }
    .achienement {
        background-image: url("@/assets/img/vipsystemnew/upgrade.png");
    }
}
</style>
