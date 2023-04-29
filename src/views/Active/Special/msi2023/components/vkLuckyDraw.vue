<template>
  <section class="vkLucky-draw">
    <div
        v-for="(item, index) in prizesList"
        :key="item.id"
        class="prize-item"
        :class="[item.is_choose  ? 'speed-chose' : '', stopIndex === index ? 'stop' : '']" >
        <div class="bg-box">
          <img :src="item.goods_pic" alt="">
        </div>
        <p class="prize-index text-8px truncate max-w-110px">{{ item.goods_name }}</p>
    </div>
    <div class="btn">
      <button class="bg-img" @click="$emit('onStart')"></button>
      <b>每次消耗<span class="text-#e93323">1</span>张奖券</b>
    </div>
  </section>
</template>

<script>
import Cubic from "@/utils/cubic.js"
export default {
  name: 'vkLuckyDraw',
    props: {
      prizesList: {
        type: Array,
        default: [],
        required: true
      },
      resultIndex: {
        type: Number,
        default: -1,
        required: true
      },
    },
    data() {
      return {
        arrNum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], // 转动顺序
        isRolling:  false, // 是否正在抽奖
        prizeIndex: 0, // 转动指针
        timer1: null, // 定时器1 快速旋转
        timer2: null, // 定时器2 慢速旋转
        stopIndex: -1, // 指针最终的位置 是arrNum[resultIndex] 转动终止的映射
        fastSpeed: 100, // 抽奖动画，经过每个商品的时间
        slowSpeed: 300, // 抽奖动画，经过每个商品的时间
        c: new Cubic(0.25, 0.1, 0.25, 1), // 贝塞尔曲线
        startSetSpeedTime: null,
        totalSpeedTime: 1000,
        progress: 0,
        progressTime: 100, // 计算出减速后的时间
        RAF: null,
      }
    },
    computed:{
      prizes(){
        return [...this.prizesList]
      }
    },
    watch: {
      resultIndex: {
        handler(v){
          // console.log('resultIndex: ', resultIndex);
          if (v !== -1) {
            if (this.arrNum.indexOf(v) !== -1) {
              this.stopIndex = this.arrNum.indexOf(v);
              this.drawPrize();
            }
          } else {
            this.clearPrize();
          }
        },
        immediate: true
      },
    },
    methods:{
      // 抽奖重置
      clearPrize() {
        this.prizes.map((item) => {
          item.is_choose = false;
          return item;
        });

        this.isRolling = false;
        this.stopIndex = -1;
      },

      // 点击抽奖 执行快速转动，2秒后执行慢速转动
      drawPrize() {
        if (!this.isRolling && this.stopIndex !== -1) {
          this.isRolling = true;
          this.timer1 = setInterval(this.fastMove, this.fastSpeed);

          //转三圈之后降速
          this.timer2 = setTimeout(() => {
            clearInterval(this.timer1);
            this.lowSpeed();
          }, this.prizes.length * this.fastSpeed * 3);
        }
      },

      // 抽奖移动函数 纯移动 不终止 直到定时器清除
      fastMove() {
        const { prizes, arrNum, prizeIndex } = this;
        const LEN = prizes.length;

        prizes[arrNum[prizeIndex]].is_choose = 1;
        prizes[arrNum[prizeIndex - 1 < 0 ? LEN - 1 : prizeIndex - 1]].is_choose = 0;
        this.prizeIndex = prizeIndex + 1 === LEN ? 0 : prizeIndex + 1;
      },

      // 抽奖移动函数 如果指针位置prizeIndex与结果位置相同，则抽奖完成，清除所有定时器
      slowMove() {
        console.log("this.progressTime:::", this.progressTime);
        const { prizes, arrNum, prizeIndex, resultIndex, stopIndex } = this;
        const LEN = prizes.length;
        this.prizes[arrNum[prizeIndex]].is_choose = 2;
        this.prizes[arrNum[prizeIndex - 1 < 0 ? LEN - 1 : prizeIndex - 1]].is_choose = 0;

        if (stopIndex !== -1 && stopIndex === prizeIndex) {
          clearInterval(this.timer1);
          clearInterval(this.timer2);
          // this.progress = 0;
          // this.progressTime = 100;
          this.$emit('canShowResultPop');
        } else {
          this.prizeIndex = prizeIndex + 1 === LEN ? 0 : prizeIndex + 1;
        }
      },

      // 抽奖慢速转动 得到抽奖结果，定位好结果奖品的位置，速度降低
      lowSpeed() {
        const { arrNum, resultIndex } = this;
        this.startSetSlowSpeed()
        console.log('this.progressTime:::', this.progressTime)
        this.timer2 = setInterval(this.slowMove, this.slowSpeed);
        // this.timer2 = setInterval(this.slowMove, this.progressTime);
      },

      // 设置慢速时间
      startSetSlowSpeed() {
        this.startSetSpeedTime = performance.now();
        window.requestAnimationFrame(this.anim);
      },

      // time由window.requestAnimationFrame传入 和 performance.now() 相同
      anim(time) {
        const { c, startSetSpeedTime, totalSpeedTime, fastSpeed } = this;
        this.progress = ((time - startSetSpeedTime) / totalSpeedTime)
        if (this.progress >= 1) {
          this.RAF = null;
        } else {
          this.RAF = window.requestAnimationFrame(this.anim)
          this.progressTime =
            fastSpeed > c.solve(this.progress) * 1000
              ? fastSpeed
              : c.solve(this.progress) * 1000
        }
      },

      destroyed() {
        clearInterval(this.timer1);
        clearInterval(this.timer2);
      },
  }
}
</script>

<style lang="less" scoped>
.vkLucky-draw{
  button{
    background-color: transparent;
    border: 0;
    padding: 0;
    &:active{
      opacity: .9;
    }
  }
  // width: 100%;
  margin-left: 15px;
  margin-right: 15px;
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 相当于 1fr 1fr 1fr */
  grid-template-rows: repeat(4, 1fr); /* fr单位可以将容器分为几等份 */
  // grid-gap:12px; /* grid-column-gap 和 grid-row-gap的简写 */
  grid-column-gap:7.5px;
  grid-row-gap:12px;
  grid-auto-flow: row;
  // padding: 58px 20px;
  position: relative;
  .prize-item{
    width: 110px;
    height: 77px;
    color: #101010;
    background-image: url("@/assets/img/active/special/msi2023/raffle-gift-bg.png");
    background-repeat: no-repeat, no-repeat;
    background-size: 100% 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 16px;

    .bg-box{
      flex: 1;
      display: flex;
      align-items: center;
      overflow: hidden;
      img{
        width:80%;
        height: 60%;
        transition: 0.3s;
        vertical-align: middle;
        transform: scale(1);
      }
    }
  }
  .speed-chose{
    background-image: url("@/assets/img/active/special/msi2023/raffle-gift-active-bg.png");;
    background-repeat: no-repeat, no-repeat;
    background-size: 100% 100%;
    background-color: transparent;
    .bg-box{
      img{
        transform: scale(1.1);
      }
    }
  }
  .btn{
    width: 95px;
    height: 153px;
    display: flex;
    position: absolute;
    left: 50%;
    top: 88.5px;
    transform: translateX(-50%);
    .bg-img{
      width: inherit;
      height: inherit;
      background-image: url('@/assets/img/active/special/msi2023/cheers-raffle-btn.png');
      background-repeat: no-repeat, no-repeat;
      background-size: 100% 100%;
      &:hover{
        cursor: pointer;
        // background-image: url('@/assets/vkImg/hover.png');
      }
    }
    b{
      position: absolute;
      font-size: 12px;
      // width: 100%;
      bottom: -20px;
      text-align: center;
    }
  }
}
</style>
<style>

.prize-item:nth-child(4){
  grid-area: 2 / 3 / 2 / 3;
}
.prize-item:nth-child(5){
  grid-area: 3 / 3 / 3 / 3;
}
.prize-item:nth-child(6){
  grid-area: 4 / 3 / 4 / 3;
}
.prize-item:nth-child(7){
  grid-area: 4 / 3 / 4 / 2;
}
.prize-item:nth-child(8){
  grid-area: 4 / 3 /4 / 1;
}
.prize-item:nth-child(9){
  grid-area: 3 / 1 / 3/ 1;
}
</style>
