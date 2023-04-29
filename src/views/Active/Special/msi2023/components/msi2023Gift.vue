<template>
  <van-dialog
    style="border-radius: 0"
    v-model:show="_visible"
    width="3.1rem"
    :show-confirm-button="false"
    :close-on-click-overlay="true"
    className="msi2023-dialog">
    <div class="dialog-main w-313px h-238px reactive" :class="{'isInfo':props.giftData.type==0}">

      <div class="header-title h-28px"></div>

      <i class="close absolute w-22px h-19px top-4.5px right-7px" @click="close"></i>

      <div class="gift-box overflow-hidden relative m-auto m-t-8px w-109.5px h-109.5px"> 
        <template v-if="props.giftData.type==0">
          <img :src="props.giftData.lotteryTicketIcon" class="w-100% absolute left-0 top-50% translate-y--50%">
        </template>
        <template v-else>
          <img :src="props.giftData.icon_url" class="absolute left-0 top-50% translate-y--50%">
        </template>
      </div>
      <template v-if="props.giftData.type==0">
        <h2 class="m-t-15px text-13px text-center">恭喜您获得<span class="text-#e93323">{{ props.giftData.ticket }}</span>张抽奖卷~</h2>
      </template>
      <template v-else>
        <h2 v-if="props.giftData.type === 2" class="text-13px m-t-2px text-center">恭喜您获得<span class="text-#e93323">{{ props.giftData.price }}</span>V币</h2>
        <h2 v-else-if="props.giftData.type === 4" class="text-13px text-center">恭喜您获得<span class="text-#e93323">{{ props.giftData.price }}</span>元现金红包</h2>
        <h2 v-else class="text-13px m-t-2px text-center">恭喜您获得<span class="text-#e93323">{{ props.giftData.goods_name }}</span></h2>

        <p v-if="props.giftData.type === 2" class="text-13px text-center lh-14px">已发放至您的V币账户中，请注意查收！</p>
        <p v-else-if="props.giftData.type === 4" class="text-13px text-center lh-14px">已发放至您的账户中，请注意查收！</p>
        <p v-else class="text-13px text-center lh-14px">已发放至您的背包中，请注意查收！</p>
      </template>
      <button @click="close" class="msi2023-primary-btn absolute bottom-10px left-50% translate-x--50% w-120.5px h-39px"></button> 
    </div>
  </van-dialog>
</template>

<script setup lang="ts">
import type { ActiveMsi2023GiftData } from "@/api/pojo/active/ActiveGetMsi2023Init"
import { computed } from "vue"

/**
 * Props
 */
export interface Props {
    visible: boolean
    giftData: Partial<ActiveMsi2023GiftData>
}

const props = defineProps<Props>()

console.log(props.giftData)
/**
 * Emits
 */
export interface Emits {
    (e: "update:visible", value: boolean): void
}

const emit = defineEmits<Emits>()

const _visible = computed({
    get: () => props.visible,
    set: (bool: boolean) => emit("update:visible", bool)
})

const close = (): void => {
    emit("update:visible", false)
}
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
.dialog-main {
  background: url("../../../../../assets/img/active/special/msi2023/dialog-bg.png");

  .header-title{
    background: url("../../../../../assets/img/active/special/msi2023/win-notice-head-bg.png") no-repeat center 11px;
    background-size: 130px 14px;
  }

  .close {
    
    transition: background 0.3s;
    background: url("../../../../../assets/img/active/special/msi2023/dialog-close.png") no-repeat;
    background-size: 100% 100%;
  }
      .gift-box {

        background-size: 90px 77px;
        background-position: center 31px;

        @keyframes rotate-animate {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }
        &::before {
          content: "";
          position: absolute;
          width: inherit;
          height: inherit;
          top: 0;
          left: 0;
          background: url("../../../../../assets/img/active/special/msi2023/gift-box-bg.png");
          background-size: 100% 100%;
          animation: rotate-animate 5s linear infinite;
        }
      }

    .msi2023-primary-btn {
      background: url("../../../../../assets/img/active/special/msi2023/dialog-btn-bg.png");
      background-size: 100% 100%;
    }
}
</style>