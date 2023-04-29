<template>
  <div class="font-classic leading-relaxed">
    <HeaderBar>
      <div class="header_title">MSI2023</div>
    </HeaderBar>
    <div class="expand-page msi2023 pb-25px relative">
      <!-- 粒子特效-->
      <DriftPost :baseBubbles="flakeList" :relativeNum="8"
        class="drift-left absolute h-100vh! top--20px left-0 z-0 pointer-events-none" />
      <DriftPost :baseBubbles="flakeList" :relativeNum="8"
        class="drift-right absolute h-100vh! top--20px right-0 z-0 pointer-events-none" />
      <!--弹幕-->
        <Vue3Danmaku
          v-model:danmus="bulletScreen"
          :channels="6"
          :speeds="speeds"
          randomChannel
          useSlot
          class="baberrage absolute! z-2 left-0 top-5px w-100% h-230px pointer-events-none"
        >
          <template v-slot:dm="{ danmu }">
              <div
                  class="win_prize_tip border-#f2dea8! text-12px text-#fff lh-26px pl-10px pr-10px hstack select-none my-3px rd-50px"
              >
                  <img class="avatar rd-50% w-20px h-20px mr-8px" :src="danmu.avatar" alt="" />
                  <div>{{ danmu.msg }}</div>
              </div>
          </template>
        </Vue3Danmaku>
      <dl class="date mt-210px text-center">
        <dt></dt>
        <dd class="text-15px mt-6px color-#fdf6ee">{{ activeData.active_show_time }}</dd>
      </dl>
      <div class="tab-button flex-center m-x-16.5px m-t-10px">
        <button @click="handleChangeTab(true)" :class="[{'active':isDrawView},'tab-left','m-r-18px']"></button>
        <button @click="handleChangeTab(false)" :class="[{'active':!isDrawView},'tab-right']"></button>
      </div>
      <template v-if="isDrawView">
        <dl class="accept-award m-t-25px text-13px text-#fdf6ee">
          <dt class="accept-award-title h-31.5px"></dt>
          <dd class="w-345px h-398px m-auto m-t-12px">
            <div class="p-t-20px px-15px break-all text-13px lh-21px">
              活动期间，会员当日首充≥100元且在电竞场馆 投注【MSI季中邀请赛】中累计有效投注额≥1,000 元，即可领取抽奖机会。
              <router-link to="/finance/deposit" class="text-#e93324">去充值></router-link>
            </div>
            <div class="accept-award-box">
              <dl v-for="(item,i) in activeData.ticket" :key="i">
                <dt>
                  <img class="w-54px h-21px" :src="handleChangeImage(item,i)" alt="">
                </dt>
                <dd>
                  <div :class="['progress-bar',item.status >0 ? 'active':'']">
                    <div class="progress"></div>
                    <div class="bg"></div>
                  </div>
                  <div class="bet-amount">{{item.bet}}</div>
                </dd>
              </dl>
            </div>
            <div class="flex-center m-t-24px">
              <button class="bet-btn m-r-25px w-128px h-47px" @click="toHomeGaming"></button>
              <button class="accept-award-btn w-128px h-47px" @click="extraTicket(1)"></button>
            </div>
            <div class="text-13px text-center m-t-18px">今日累计有效投注额:<span class="text-#e93323">{{activeData.egame_bet}}</span></div>
          </dd>
        </dl>
        <!-- 邀请好友抽奖 -->
        <dl class="invite-draw mt-25px" >
          <dt class="invite-title-bg h-48px"></dt>
          <dd class="invite-draw-bg mt-12px m-auto  w-345px h-450px">
            <dl class="p-t-10.5px">
              <dt class="m-auto text-scroll w-179px h-46px">
                <vue3-seamless-scroll
                  ref="seamlessRef"
                  :list="activeData.roll_tips"
                  direction="left"
                  class="h-38px overflow-hidden w-130px m-auto">
                  <ul class="m-auto flex text-#fdf6ee">
                    <li class="w-130px mx-20px text-center h-38px lh-38px" v-for="(item, index) in activeData.roll_tips" :key="index">
                      <span class="title">{{ item }}</span>
                    </li>
                  </ul>
                </vue3-seamless-scroll>
              </dt>
              <dd class="m-auto relative w-282px h-233.5px content">
                <button class="draw-invite-btn w-101.5px h-67px absolute right-27px bottom-59.5px" @click="extraTicket(2)"></button>
                <div class="draw-arrow w-14px h-25.5px absolute left-95px bottom-63px"></div>
                <div class="absolute w-45px h-20px bottom-25px left-78px overflow-hidden" v-if="drawData.lotteryTicketIcon && drawTicketShow">
                  <img class="w-100% h-100% fade_down_classic" :src="drawData.lotteryTicketIcon" alt="">
                </div>
                <template v-if="drawData.lotteryTicketIcon && drawTicketShow">
                  <div class="w-10px h-10px left-55px bottom-45px b-rd-50% absolute flash"></div>
                  <div class="w-10px h-10px left-55px bottom-15px b-rd-50% absolute flash"></div>
                </template>
                <div class="absolute bottom-18.5px right-29px text-#fdf6ee text-10px">
                  剩余抽奖机会<span class="text-#e93323 text-16px m-l-5px">{{activeData.extra_ticket }}</span><i class="text-#ff704f">次</i>
                </div>
              </dd>
            </dl>
            <div class="invite-text m-t-15px text-#fdf6ee m-l-15px text-12px">
              <dl>
                <dt class="w-85.5px h-14.5px relative font-bold">
                  <div class="absolute w-100% left-0 top--12px text-15px">分享好友</div>
                </dt>
                <dd class="lh-18px w-263px m-t-7px">活动期间每邀请一位好友注册成功， 且完成下注即可领取1次额外抽奖券机会。</dd>
              </dl>
              <dl class="m-t-19px relative">
                <dt class="w-85.5px h-14.5px relative font-bold">
                  <div class="absolute w-100% left-0 top--12px text-15px">额外抽奖券</div>
                </dt>
                <dd class="lh-18px m-t-7px">最高可额外获得<span class="text-#e93324 font-bold">10</span>张抽奖券。</dd>
                <button class="absolute right-19px bottom-0 share w-102px h-31px" @click="handleToShare"></button>
              </dl>
            </div>
          </dd>
        </dl>
        <!-- 助威抽奖 -->
        <dl class="cheer-draw m-t-25px text-#fdf6ee">
          <dt class="cheer-draw-title h-48px"></dt>
          <dd>
            <h2 class="m-t-20px text-13px m-l-14px">当前抽奖券：</h2>
            <div class="cheer-draw-bg w-375px h-443px ">
              <div class=" flex justify-between m-t-32px items-end ">
                <div class="h-25px w-209px winning-times m-l-9px relative">
                  <span class="text-45px text-#fdf6ee absolute left-0 bottom--12px font-bold">
                    {{activeData.my_ticket}}
                  </span>
                  <img 
                    class="w-15px h-13.5px absolute left-35px bottom-6px" 
                    src="@/assets/img/active/special/msi2023/refresh-icon.png" 
                    :class="{'refreshing':refreshLoading,'left-55px':activeData.my_ticket>10,
                      'left-75px':activeData.my_ticket>99
                    }" 
                    @click="refreshActiveData" ref="refreshIcon" alt=""/>
                </div>
                <button class="m-r-30px text-11px decoration-underline font-bold" @click="getDrawRecords">中奖记录</button>
              </div>
              <vkLuckyDraw
                class="m-t-24px"
                :prizesList="activeData.prize_goods"
                :resultIndex="cheerDrawResult"
                @onStart="luckyDrawOnStart"
                @canShowResultPop="CanShowResultPopHandle"/>
            </div>
          </dd>
        </dl>
    </template>
    <!-- 包赔 -->
    <template v-else>
      <div class="reparation m-t-24.5px">
        <dl class="competition w-345px h-275px m-auto">
          <dt class="competition-title h-20px text-center text-14.5px">共88场赛事</dt>
          <dd class="carousel-box m-t-15px relative">
            <van-swipe class="my-swipe" :loop="false" :show-indicators="false" ref="swipeRef">
              <van-swipe-item v-for="item in gameList" :key="item.id">
                <dl>
                  <dt class="competition-box w-290px h-168px my-0 mx-auto">
                    <p class="text-center p-t-10px">{{item.game_name}}</p>
                    <div class="justify-between flex items-center m-t-15px">
                      <div class="text-center flex-center flex-col w-40%">
                        <img class="w-46.5px h-63px" :src="item.l_team_logo" alt="">
                        <span class="m-t-10px">{{item.l_team_name}}</span>
                      </div>
                      <div class="w-70px text-center lh-14px">
                        <template v-if="item.game_status!= 1">
                          {{item.game_status==2 ? '比赛中':'已结束'}}
                        </template>
                        <template v-else>
                          {{item.date_time}}
                        </template>
                      </div>
                      <div class="text-center flex-center flex-col w-40%">
                        <img class="w-46.5px h-63px" :src="item.r_team_logo" alt="">
                        <span class="m-t-10px">{{item.r_team_name}}</span>
                      </div>
                    </div>
                  </dt>
                  <dd>
                    <template v-if="item.game_status == 3">
                      <div class="flex-center m-t-15px">
                        <button @click="apply(item)" class="apply-compensation-btn w-128px h-47px"></button>
                      </div>
                    </template>
                    <template v-else>
                      <div class="text-#fdf6ee text-center m-t-12px">
                        <template v-if="item.game_status==1 && item.showTime">
                          <div>请在<strong class="text-#e93323">
                            {{ formatCountDown(item.down,true,false) }}
                          </strong>内完成活动存款要求</div>
                          <div>点击进入<router-link :to="{path:'/user/finance/'}">财务中心</router-link></div>
                        </template>
                        <template v-else>
                          本比赛活动要求存款时间<br/>
                            {{ useDateFormat(item.deposit_start_time * 1000, "MM.DD HH:mm").value }}-{{
                                useDateFormat(item.deposit_end_time * 1000, "MM.DD HH:mm").value
                            }}
                        </template>
                      </div>
                    </template>
                  </dd>
                </dl>
              </van-swipe-item>
            </van-swipe>
            <button class="absolute top-50px left--8px w-25.5px h-70px competition-left-btn" @click="swipeRef?.prev()"></button>
            <button class="absolute top-50px right--8px w-25.5px h-70px competition-right-btn" @click="swipeRef?.next()"></button>
          </dd>
        </dl>
        <!-- 活动内容 -->
        <dl class="active-introduce m-t-25px">
          <dt class="title h-31.5px"></dt>
          <dd class="m-t-12px">
            <div class="active-introduce-bg px-10px py-20px m-auto w-345px h-408.5px text-#fdf6ee">
              <p class="text-13px lh-16.5px ">
                活动期间，会员在活动存款时间内存款并参与指定电竞
                赛事【MSI季中邀请赛】的盘口投注，若单笔注单
                结算为负盈利，即可申请注单包赔，领取包赔金。
              </p>
              <table class="m-t-10px m-auto text-12px text-#fdf6ee">
                <tr class="th-bg"><th>等级<br>要求</th><th>存款<br>金额(￥)</th><th>单笔注单<br>金额(￥)</th><th>包赔<br>返利</th><th>包赔<br>金额(￥)</th><th>流水<br>要求</th></tr>
                <tr class="hide-border"><td>VIP0-1</td><td rowspan="7">≥500</td><td rowspan="7">≥500</td><td>3%</td><td>88</td><td rowspan="7">3倍电竞</td></tr>
                <tr><td>VIP2-3</td><td>5%</td><td>188</td></tr>
                <tr><td>VIP4-5</td><td>10%</td><td>288</td></tr>
                <tr><td>VIP6-7</td><td>15%</td><td>388</td></tr>
                <tr><td>VIP8-9</td><td>20%</td><td>588</td></tr>
                <tr><td>VIP10-11</td><td>25%</td><td>888</td></tr>
                <tr><td>VIP12</td><td>50%</td><td>3888</td></tr>
              </table>
            </div>
          </dd>
        </dl>
      </div>
    </template>
      <dl class="rules">
        <dt></dt>
        <dd>
          <ul>
            <li>每日未发起提款前的存款都视为首充；场馆要求：小艾电竞、RG电竞、TF电竞、IM电竞。</li>
            <li>会员每日首充≥100元并且投注MSI赛事，累计流水达到对应的额度，即可获得抽奖机会。每日获得的抽奖卷仅限当日使用，隔日则无效。</li>
            <li>分享加码：使用个人中心-推广/分享里的专属推广链接或邀请码，通过QQ、论坛、贴吧、微博等方式分享，成功邀请好友来注册，并且完成下注，即可随机获得1～10张抽奖卷。</li>
            <li>活动的现金奖品系统将自动派发至会员的主钱包中，彩金需完成全站3倍有效流水，活动流水未完成前不可再次申请本活动。奖品领取有效期为：自中奖之日起，15日内有效，若奖品为实物奖品，请您在背包中选择快递到家并填写您的详细收货地址，我们将于次日安排发货，快递单号将会发送站内信通知；除此之外您也可以在背包中自行折现，实物奖品折现后无需流水即可提款。</li>
            <li>有效流水要求：电竞赔率＜1.5、亚洲盘赔率≤0.75、欧洲盘＜1.75、美洲盘≤1.33、马来盘≤0.75且＞0、走盘、注单取消、对冲、未结算、串关、平半盘、实时兑现等不计算为有效流水；PT电子游戏中以下游戏不算有效流水；查看详情。</li>
            <li>邀请人与受邀请人必须为不同身份的真实玩家、每位有效玩家、每个手机号码、电子邮箱、IP地址（包括使用VPN）、每张银行卡、每台设备都会被判定为同一玩家</li>
            <li>每位有效玩家、手机号码、电子邮箱、银行卡、IP地址、每台设备只能参与一次优惠，参与用户必须先绑定银行卡，对违规的用户，VKGAME保留无期限审核，和扣回红利及产生的利润权利。本活动最终解释权归VKGAME所有。</li>
          </ul>
        </dd>
      </dl>
    </div>
     <!-- 中奖信息Dialog-->
    <msi-2023-gift v-model:visible="drawVisible" :giftData="drawData"/>

    <!-- 中奖记录-->
    <van-action-sheet v-model:show="winRecordShow" title="中奖记录">
      <div class="flex lh-50px border-b border-#0000001c font-bold text-16.5px mx-20px">
        <div class="w-50% text-center">获奖日期</div>
        <div class="w-50% text-center">奖品名称</div>
      </div>
      <ul :class="{'globe_loading':drawRecordLoading}" class="flex flex-col overflow-y-auto max-h-60vh mx-20px">
        <template v-if="recordData.total>0">
          <template v-for="(item,index) in recordData.list" :key="index">
            <li class="flex text-center lh-45px border-b border-#0000001c last-b-hidden text-14px">
              <div class="w-50% text-center">{{item.date}}</div>
              <div class="w-50% text-center">{{item.item_name}}</div>
            </li>
          </template>
        </template>
        <template v-else>
          <li class="text-center lh-50vh">暂无数据</li>
        </template>
      </ul>
    </van-action-sheet>
  </div>
</template>

<script setup lang="ts">
import lotteryTicket1 from "@/assets/img/active/special/msi2023/lottery-ticket1.png"
import lotteryTicket2 from "@/assets/img/active/special/msi2023/lottery-ticket2.png"
import lotteryTicket3 from "@/assets/img/active/special/msi2023/lottery-ticket3.png"
import lotteryTicket4 from "@/assets/img/active/special/msi2023/lottery-ticket4.png"
import lotteryTicket5 from "@/assets/img/active/special/msi2023/lottery-ticket5.png"
import lotteryTicket6 from "@/assets/img/active/special/msi2023/lottery-ticket6.png"
import lotteryTicket7 from "@/assets/img/active/special/msi2023/lottery-ticket7.png"
import lotteryTicket8 from "@/assets/img/active/special/msi2023/lottery-ticket8.png"
import lotteryTicket9 from "@/assets/img/active/special/msi2023/lottery-ticket9.png"
import lotteryTicket10 from "@/assets/img/active/special/msi2023/lottery-ticket10.png"

import Vue3Danmaku from "vue3-danmaku"
import { nextTick, reactive, ref } from "vue"
import { useRouter } from "vue-router"
import { HttpPlus } from "@/api/HttpPlus"
import ApiSetting from "@/api/service"
import type { ActiveGetMsi2023Init, ActiveMsi2023GiftData, ActiveMsi2023Competitions, ActiveMsi2023Record } from "@/api/pojo/active/ActiveGetMsi2023Init"
import { RulesValidator } from "@/utils/Validators"
import { formatCountDown } from "@/utils/date"
import { useSysStore } from "@/stores/system"
import { showLoadingToast, showToast } from "vant"
import { useCountDown } from "@vant/use"
import type { SwipeInstance } from 'vant';
import { Vue3SeamlessScroll } from "vue3-seamless-scroll"
import msi2023Gift from "./components/msi2023Gift.vue"
import vkLuckyDraw from "./components/vkLuckyDraw.vue"
import { useDateFormat } from "@vueuse/core"
import { useFireImg } from "@/utils/globalImgs"

const { fireImg1, fireImg2, fireImg3, fireImg4, fireImg5, fireImg6, fireImg7 }: { [propName: string]: string } = useFireImg()
const flakeList: ReadonlyArray<string> = [fireImg1, fireImg2, fireImg3, fireImg4, fireImg5, fireImg6, fireImg7]

const inviteGift: ReadonlyArray<string> = [lotteryTicket1, lotteryTicket2, lotteryTicket3, lotteryTicket4, lotteryTicket5, lotteryTicket6, lotteryTicket7,lotteryTicket8,lotteryTicket9,lotteryTicket10]
  /**
 * 弹幕
 */
type BulletScreen = ActiveGetMsi2023Init["bullet_screen"]

type BulletScreenItem = BulletScreen[number]

type BulletScreenPlay = { id: number; avatar: BulletScreenItem["head_image"]; msg: string }

const systemParams = useSysStore()
const router = useRouter()
// 弹幕list
const bulletScreen = reactive<Array<BulletScreenPlay>>([])
// 弹幕速度
const speeds = ref([15,20,25][Math.floor(Math.random() * 3)])

// push中奖弹幕数据
const addBarrageData = (list: BulletScreen): void => {
    let added = 0
    let bulletTimer: number
    clearInterval(bulletTimer)
    bulletTimer = setInterval(() => {
        bulletScreen.slice(0, 0)
        if (list.length && added <= list.length) {
            const pushNum: number = Math.round(Math.random() * 10)
            for (let i = 0; i < pushNum; i++) {
                if (i + added < list.length - 1) {
                    bulletScreen.push({
                        id: i + 1,
                        avatar: list[i + added].head_image,
                        msg: `恭喜${list[i + added].username}获得${list[i + added].goods_name}！`
                    })
                }
            }
            added += pushNum
            if (added >= list.length) {
                clearInterval(bulletTimer)
            }
        }
    }, 1000 * 10)
}
/**
 * 初始化
 */
// 初始化数据loading
const loading = ref(false)

// 初始化数据
const activeData = ref<Partial<ActiveGetMsi2023Init>>({})

const initActiveData = async (): Promise<void> => {
    showLoadingToast({
        duration: loading.value ? 0 : 1,
        forbidClick: true
    })
    loading.value = true

    try {
        HttpPlus.setUrlOptions(ApiSetting.active.msi2023.activeMsi2022Init)
        const res = await HttpPlus.sendHttpRequest<ActiveGetMsi2023Init>()

        if (res.status === 1) {

            activeData.value = res.data
            addBarrageData(res.data.bullet_screen)
        }
        loading.value = false
    } catch (e: unknown) {
        loading.value = false
        throw e
    }
}

initActiveData()

const isDrawView = ref(true)

const handleChangeTab=(IsDrawView:boolean)=>{
  if(isDrawView.value == IsDrawView) return
  isDrawView.value = IsDrawView
  IsDrawView ? initActiveData() : getGame()
}

//status 0 不可领取 1 可领取 2 已领取
const handleChangeImage = (item: ActiveGetMsi2023Init["ticket"][number], index:number): string =>{
  let img = 'awarded-bg'
  if(item.status == 0){
    img = index < 5 ? 'one-times-disabled' : 'two-times-disabled'
  }else if(item.status == 1){
    img = index < 5 ? 'one-time' : 'two-time'
  }
  
  return new URL(
      `../../../../assets/img/active/special/msi2023/${img}.png`,
      import.meta.url
    ).href
}

const toHomeGaming = () => {
    systemParams.setRouteParams<{ gametype: number }>({ gametype: 1 })
    router.push("/")
}

const drawTicketShow = ref(false)

const drawData = reactive<ActiveMsi2023GiftData>({
  price: '',
  type: 2,
  ticket:10,
  lotteryTicketIcon:inviteGift[2-1],
  icon_url: '',
  goods_name:''
})

/**
 * 领取抽奖机会 / 邀请好友抽奖
 * type 1 领取 2 邀好友
 * @returns {Promise<void>}
 */
const acceptLoading = ref(false);

const extraTicket = async(from=1)=>{
  const rulesValidator = new RulesValidator([
    { validator: loading.value, message: "数据加载中，请稍后..." },
    { validator: activeData.value.is_login === 0, message: "请您先登录" },
    { validator: from==2 && acceptLoading.value, message: '正在抽奖中，请稍后'}
  ])

  if (rulesValidator.status) {
    acceptLoading.value = true
    try {
      HttpPlus.setUrlOptions(ApiSetting.active.msi2023.extraTicket)
      const res = await HttpPlus.sendHttpRequest<ActiveMsi2023GiftData>(null,{from})
      if (res.status === 1) {
        acceptLoading.value = false
        drawData.type = 0
        drawData.ticket = res.data.ticket
        drawData.lotteryTicketIcon = inviteGift[res.data.ticket-1]
        if(from==2){
          initActiveData()
          setTimeout(()=>{
            drawTicketShow.value = true
            drawVisible.value = true
            
            setTimeout(()=>{
              drawTicketShow.value = false
            },2000)
          },1000)
        }else{
          initActiveData()
          drawVisible.value = true
        }
      }
    } catch (e) {
      acceptLoading.value= false
      throw e
    }
  }else{
    acceptLoading.value = false
  }
}


/**
 * 活动页面分享功能
 */
 const handleToShare = (): void => {
    if (!systemParams.isLogin) {
        showToast({ className: "vk-toast-fail", message: "请您先登录", icon: "warning" })
        return
    }
    router.push("/seo")
}

const refreshLoading = ref(false);
const refreshTimer = ref(0)
const refreshActiveData =()=>{
  if (refreshTimer.value==1) return
    refreshLoading.value = true
    initActiveData()
    clearTimeout(refreshTimer.value)
    refreshTimer.value = 0
    refreshTimer.value = setTimeout(() => {
      refreshLoading.value = false
      clearTimeout(refreshTimer.value)
      refreshTimer.value = null
    }, 600)
}

const cheerDrawResult = ref(-1)
const drawVisible = ref(false)

const luckyDrawOnStart = async(type:number=1) => {
  
  const rulesValidator = new RulesValidator([
    { validator: loading.value, message: "数据加载中，请稍后..." },
    { validator: cheerDrawResult.value!=-1, message: "正在抽奖中，请稍后..." },
    { validator: activeData.value.is_login === 0, message: "请您先登录" }
  ])

  if (rulesValidator.status) {
    cheerDrawResult.value = 1
    try {
      HttpPlus.setUrlOptions(ApiSetting.active.msi2023.draw)
      const res = await HttpPlus.sendHttpRequest<ActiveMsi2023GiftData>()
      if (res.status === 1) {
        cheerDrawResult.value = activeData.value.prize_goods.findIndex(e=>e.id==res.data.id);
        initActiveData()
        drawData.type = res.data.type
        drawData.icon_url = res.data.icon_url
        drawData.price = res.data.price
        drawData.goods_name = res.data.goods_name
        console.log(cheerDrawResult,res.data.id)
      }
    } catch (e) {
      throw e
    }
  }
}

const CanShowResultPopHandle = ()=> {
  drawVisible.value = true
  // alert('抽奖成功');
  // 适当时机清楚抽奖记录
  cheerDrawResult.value = -1;
  setTimeout(() => {
    cheerDrawResult.value = -1;
  },200)
}

const gameList = ref<ActiveMsi2023Competitions["data"]>()
const gameListTotal = ref(0)
const gamelistLoading = ref(false)
const getGame = async() =>{
  showLoadingToast({
    duration: gamelistLoading.value ? 0 : 1,
    forbidClick: true
  })
  gamelistLoading.value = true
  try {
    HttpPlus.setUrlOptions(ApiSetting.active.msi2023.getGame)
    const res = await HttpPlus.sendHttpRequest<ActiveMsi2023Competitions["data"]>()
    if (res.status === 1 ) {
      gameListTotal.value = res.data.length
      gameList.value = res.data.map((ele:ActiveMsi2023Competitions["data"][number]) => {
        const count = parseInt(String(Math.abs(ele.deposit_end_time * 1000 - new Date().getTime()) / 1000))
        if (count <= 24 * 60 * 60) {
            const countDown = useCountDown({
                time: count * 1000,
                onFinish: () => {
                  gameList.value = gameList.value.map((item: any) => {
                        if (!item.down.seconds) {
                            return {
                                ...item,
                                showTime: false
                            }
                        }
                    })
                }
            })
            countDown.start()
            return {
                ...ele,
                showTime: true,
                down: countDown.current
            }
        } else {
            return {
                ...ele,
                showTime: false
            }
        }
    })
    }
    gamelistLoading.value = false
  } catch (e) {
    gamelistLoading.value = false
    throw e
  }
}

getGame()

const drawRecordLoading = ref(false)
const recordData = ref<Partial<ActiveMsi2023Record>>({})
const winRecordShow = ref(false)
const getDrawRecords = async()=>{
  const rulesValidator = new RulesValidator([
    { validator: activeData.value.is_login === 0, message: "请您先登录" }
  ])
  
  if (rulesValidator.status) {
    winRecordShow.value = true;
    drawRecordLoading.value = true
    try {
      HttpPlus.setUrlOptions(ApiSetting.active.msi2023.drawRecords)
      const res = await HttpPlus.sendHttpRequest<ActiveMsi2023Record>()
      if (res.status === 1) {
        recordData.value = res.data;
      }
      drawRecordLoading.value = false
    } catch (e) {
      drawRecordLoading.value = false
      throw e
    }
  }else{
    drawRecordLoading.value = false
  }
}
const apply = (item: any) => {

  const rulesValidator = new RulesValidator([
    { validator: loading.value, message: "数据加载中，请稍后..." },
    { validator: activeData.value.is_login === 0, message: "请您先登录" }
  ])

  if (rulesValidator.status) {
    if (item.status == 0) {
        if (item.deposit_status == 0) {
            return showToast({
                className: "vk-toast-fail",
                message: "存款未达到要求！",
                icon: "warning"
            })
        } else {
            systemParams.UpdateKFDialogShow(true)
        }
    } else {
        return showToast({
            className: "vk-toast-fail",
            message: item.status_tip,
            icon: "warning"
        })
    }
  }
}
const swipeRef = ref<SwipeInstance>();

</script>

<style lang="scss" scoped>
button{
  background-color: transparent;
  border: 0;
  padding: 0;
  &:active{
    opacity: .9;
  }
}
.msi2023 {
    overflow: hidden;
    background-image: url("../../../../assets/img/active/special/msi2023/banner.png"),
        url("../../../../assets/img/active/special/msi2023/bg.png");
    background-repeat: no-repeat;
    background-position: center top, center 210px;
    background-size: 100% auto;

    .win_prize_tip {
      border: 1px solid #3099bf !important;
      background-image: linear-gradient(to right, #38b8a2, #3099bf);
    }
    .drift-left {
        clip-path: polygon(0% 0%, 60% 0%, 20% 100%, 0% 100%);
    }
    .drift-right {
        clip-path: polygon(40% 0%, 100% 0%, 100% 100%, 80% 100%);
    }
    .date {
      dt {
          height: 31px;
          background: url("../../../../assets/img/active/special/msi2023/date.png") no-repeat center top;
          background-size: auto 100%;
      }
    }
    .tab-button{
      button{
        width: 162px;
        height: 42.5px;
        background-repeat: no-repeat, no-repeat;
        background-size: 100% 100%;
      }
      .tab-left{
        background-image:  url("../../../../assets/img/active/special/msi2023/tab-left.png");
      }
      .tab-right{
        background-image:  url("../../../../assets/img/active/special/msi2023/tab-right.png");
      }
      .active.tab-left{
          background-image: url("../../../../assets/img/active/special/msi2023/tab-active-left.png");
      }
      .active.tab-right{
          background-image: url("../../../../assets/img/active/special/msi2023/tab-active-right.png");
      }
    }
    .accept-award{
      .accept-award-title{
        background: url("../../../../assets/img/active/special/msi2023/active-introduce-title-bg.png") no-repeat center center;
        background-size: auto 100%;
      }
      dd{
        background: url("../../../../assets/img/active/special/msi2023/accept-award-bg.png") no-repeat center center;
        background-size: 100% 100%;
        .accept-award-box{
          margin: 20px 10px 0 10px;
          display: grid;
          grid-template-columns: repeat(5, 1fr); /* 相当于 1fr 1fr 1fr */
          grid-template-rows: repeat(2, 1fr); /* fr单位可以将容器分为几等份 */
          grid-column-gap: 14px; /* grid-column-gap 和 grid-row-gap的简写 */
          grid-row-gap: 15px;
          dl{
            position: relative;
            &:nth-child(1),&:nth-child(6){
              .progress{
                opacity: 0;
              }
            }
            img{
              width: 54px;
              height: 24px;
            }
            .progress-bar {
              display: flex;
              align-items: center;
              position: absolute;
              left: -28px;
              bottom: 30px;
              &.active{
                .bg{
                  background-image: url("../../../../assets/img/active/special/msi2023/progress-active-bg.png");
                }
                .progress{
                  background-color: #e93324;
                }
              }
              .bg{
                width: 26px;
                height: 15px;
                background-image: url("../../../../assets/img/active/special/msi2023/progress-bg.png");
                background-repeat: no-repeat, no-repeat;
                background-size:100% 100% ;
                margin: 0 2px;
              }
              .progress{
                width: 38px;
                height: 2px;
                background-color: #6d6c6b;
              }
            }
            .bet-amount{
                margin-top: 30px;
                font-size: 13px;
              }
          }
        }
      }
      .bet-btn{
        background-image: url("../../../../assets/img/active/special/msi2023/bet-bg.png");
        background-repeat: no-repeat, no-repeat;
        background-size:100% 100% ;
      }
      .accept-award-btn{
        background-image: url("../../../../assets/img/active/special/msi2023/accept-award-btn.png");
        background-repeat: no-repeat, no-repeat;
        background-size:100% 100% ;
      }
    }
    .invite-draw{
      .invite-title-bg{
        background-image: url("../../../../assets/img/active/special/msi2023/invite-title-bg.png");
        background-repeat: no-repeat, no-repeat;
        background-size:100% 100% ;
      }
      .invite-draw-bg{
        background-image: url("../../../../assets/img/active/special/msi2023/invite-draw-bg.png");
        background-repeat: no-repeat, no-repeat;
        background-size:100% 100%;
        .text-scroll{
          background-image: url("../../../../assets/img/active/special/msi2023/invite-draw-txt-bg.png");
          background-size:100% 100%;
        }
        .content{
          background-image: url("../../../../assets/img/active/special/msi2023/invite-draw-machine-bg.png");
          background-size:100% 100%;
          .draw-arrow{
            background-image: url("../../../../assets/img/active/special/msi2023/draw-arrow.png");
            background-size:100% 100%;
          }
          .draw-invite-btn{
            background-image: url("../../../../assets/img/active/special/msi2023/draw-invite-btn.png");
            background-size:100% 100%;
          }
          @keyframes breath {
            from {
              background: #f85151;
            }
            50% {
              background: #faa966;
            }
            to {
              background: #b9b733;
            }
          }

          .flash{
            overflow: hidden;
            background: #faa966;
            animation-name: breath;
            animation-duration: 0.3s;
            animation-timing-function: ease-in-out;
            animation-iteration-count: infinite;
          }
        }
        .invite-text{
          dt{
            background: linear-gradient(to right, #e93323, transparent);
          }
          .share{
            background-image: url("../../../../assets/img/active/special/msi2023/share-btn.png");
            background-repeat: no-repeat, no-repeat;
            background-size: 100% 100%;
          }
        }
      }
    }
    .cheer-draw{
      .cheer-draw-title{
        background: url("../../../../assets/img/active/special/msi2023/cheers-raffle-title-bg.png") no-repeat center top;
        background-size: auto 100%;
      }
      .cheer-draw-bg{
        background-image: url("../../../../assets/img/active/special/msi2023/cheers-raffle-bg.png");
        background-repeat: no-repeat, no-repeat;
        background-size: 100% 100%;
        .winning-times{
          background: linear-gradient(to right, #e93323, transparent);
        }
        .refreshing{
          @keyframes rotate-animate {
            0% { transform: rotate(0deg);}
            100% { transform: rotate(720deg);}
          }
          animation: rotate-animate .6s linear;
        }
      }
    }

    .reparation{
      .competition{
        background-image: url("../../../../assets/img/active/special/msi2023/competition-bg.png");
        background-repeat: no-repeat, no-repeat;
        background-size: 100% 100%;
        .carousel-box{
          .apply-compensation-btn{
            background-image: url("../../../../assets/img/active/special/msi2023/apply-compensation-btn.png");
            background-repeat: no-repeat, no-repeat;
            background-size: 100% 100%;
          }
          .competition-box{
            
            background-image: url("../../../../assets/img/active/special/msi2023/competition-carousel-bg.png");
            background-repeat: no-repeat, no-repeat;
            background-size: 100% 100%;
          }
          .competition-left-btn{
            background-color:#fdf6ee ;
            background-image: url("../../../../assets/img/active/special/msi2023/arrow-left.png");
            background-repeat: no-repeat, no-repeat;
            background-position: center center;
            &:active{
              background-color:#e93323 ;
            }
          }
          .competition-right-btn{
            background-color:#fdf6ee ;
            background-image: url("../../../../assets/img/active/special/msi2023/arrow-right.png");
            background-repeat: no-repeat, no-repeat;
            background-position: center center;
            &:active{
              background-color:#e93323 ;
            }
          }
        }
        .competition-title{
          background: url("../../../../assets/img/active/special/msi2023/competition-title-bg.png") no-repeat center top;
          background-size: auto 100%;
        }
      }
      .active-introduce{
        .title{
          background: url("../../../../assets/img/active/special/msi2023/active-introduce-title-bg.png") no-repeat center top;
          background-size: auto 100%;
        }
        .active-introduce-bg{
          background-image: url("../../../../assets/img/active/special/msi2023/active-introduce-bg.png");
          background-repeat: no-repeat, no-repeat;
          background-size: 100% 100%;
          table{
            width: 100%;
            .th-bg{
              background-image: url("../../../../assets/img/active/special/msi2023/th-bg.png");
              background-repeat: no-repeat, no-repeat;
              background-size: 100% 100%;
              line-height: 14px;
              height: 47px;
            }
            th,td{
              text-align: center;
              height: 35px;
            }
            td{
              width: 50px;
              border: 1px solid rgba(255,255,255,0.2);
            }
            .hide-border td{
              border-top-width:0;
            }
          }
        }
      }
    }



    .rules{
      width: inherit;
      margin-top: 30px;
      dt{
        height: 31px;
        background: url("../../../../assets/img/active/special/msi2023/rules-title-bg.png") no-repeat center top;
        background-size: auto 100%;
      }
      dd{
        width: 345px;
        height: 686.5px;
        margin: 12px auto auto;
        background-image: url("../../../../assets/img/active/special/msi2023/rules-bg.png");
        background-repeat: no-repeat, no-repeat;
        background-size: 100% 100%;
        padding: 14px 9px 0 20.5px;
        ul{
          li{
            line-height: 19px;
            margin-top: 11px;
            font-size: 13px;
            color: #fdf6ee;
            position: relative;
            &::before{
              content: "";
              position: absolute;
              left: -18px;
              top: 0px;
              width: 14px;
              height: 14px;
              background: url("../../../../assets/img/active/special/msi2023/rules-index.png") no-repeat;
            }
          }
        }
      }
    }
  
}
</style>