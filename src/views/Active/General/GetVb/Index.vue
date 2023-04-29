<template>
    <div class="font-classic leading-relaxed bg-#e8f1ef">
        <HeaderBar>
            <div class="header_title">V币活动</div>
        </HeaderBar>
        <div class="expand-page getvb-page">
            <!-- banner-->
            <div class="banner">
                <img src="@/assets/img/active/general/getvb/banner.jpg" alt="" />
            </div>
            <div class="active_wrapper px-15px">
                <section>
                    <div class="section_title">什么是V币？</div>
                    <div class="section_content">
                        V币是VKGAME赠与玩家的虚拟币，持有V币的玩家还可以用V币兑换一定比例的RMB现金投注额、在V币商城兑换超值物品等。
                    </div>
                </section>
                <div class="vk_comfire_btn w-150px mx-auto">
                    <van-button class="vk-btn" block to="/task">做任务 领V币</van-button>
                </div>
                <section class="howget">
                    <div class="section_title">如何获得V币？</div>
                    <div class="section_content">
                        <p class="text-#7c839f">以下奖励为自动派发至V币钱包，无需人工申请。</p>
                        <div class="t-table">
                            <div class="t-header">
                                <span>一次性获取</span>
                            </div>
                            <div class="t-body">
                                <div class="t-row">
                                    <span class="t">方法1: 注册礼包</span>
                                    <span class="t t2">
                                        +
                                        <em>100</em>
                                        V币
                                    </span>
                                </div>
                                <div class="t-row">
                                    <span class="t">方法2: 设置昵称和头像</span>
                                    <span class="t2 t">
                                        +
                                        <em>30</em>
                                        V币
                                    </span>
                                </div>
                                <div class="t-row">
                                    <span class="t">方法3: 设置密保</span>
                                    <span class="t2 t">
                                        +
                                        <em>50</em>
                                        V币
                                    </span>
                                </div>
                                <div class="t-row">
                                    <span class="t">方法4: 设置交易密码</span>
                                    <span class="t2 t">
                                        +
                                        <em>50</em>
                                        V币
                                    </span>
                                </div>
                                <div class="t-row">
                                    <span class="t">方法5:绑定银行卡</span>
                                    <span class="t2 t">
                                        +
                                        <em>100</em>
                                        V币
                                    </span>
                                </div>
                                <div class="t-row">
                                    <span class="t">方法6: 绑定手机号码</span>
                                    <span class="t2 t">
                                        +
                                        <em>100</em>
                                        V币
                                    </span>
                                </div>
                                <div class="t-row">
                                    <span class="t">方法7: 创建ROLL房间且饰品价值>100</span>
                                    <span class="t2 t">
                                        +
                                        <em>200</em>
                                        V币
                                    </span>
                                </div>
                                <div class="t-row">
                                    <span class="t">方法8: 用户推广首次充值</span>
                                    <span class="t2 t">
                                        +
                                        <em>200</em>
                                        V币
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="t-table">
                            <div class="t-header">
                                <span>无限次数</span>
                            </div>
                            <div class="t-body">
                                <div class="t-row">
                                    <span class="t">方法1: 每日首次登录</span>
                                    <span class="t2 t">
                                        +
                                        <em>10</em>
                                        V币
                                    </span>
                                </div>
                                <div class="t-row">
                                    <span class="t">方法2: 流水获取</span>
                                    <span class="t2 t">
                                        30流水+
                                        <em>1</em>
                                        V币
                                    </span>
                                </div>

                                <!-- <div class="t-row">
                    <span class="t">{{$t("methods")}}3: 小艾彩池电竞投注10次</span><span class="t2 t">+<em>100</em>{{$t("v_coin")}}</span>
                  </div>-->
                                <div class="t-row">
                                    <span class="t">方法3: 每月完成问卷调查</span>
                                    <span class="t2 t">
                                        +
                                        <em>1888</em>
                                        V币
                                    </span>
                                </div>
                                <div class="t-row sign">
                                    <span class="t t1">方法4: 连续签到</span>
                                    <span class="t2 t">
                                        <div class="t_row_row">
                                            <span class="table_desc">首日签到</span>
                                            +
                                            <em>10</em>
                                            V币
                                        </div>
                                        <div class="t_row_row">
                                            <span class="table_desc">连续第二天签到</span>
                                            +
                                            <em>20</em>
                                            V币
                                        </div>
                                        <div class="t_row_row third">
                                            <span class="table_desc">连续第三天以及以后的每天签到</span>
                                            <span class="num">
                                                +
                                                <em>30</em>
                                                V币
                                            </span>
                                        </div>
                                    </span>
                                </div>
                                <div class="t-row">
                                    <span class="t">方法5: 每日充值≥500</span>
                                    <span class="t2 t">
                                        +
                                        <em>100</em>
                                        V币
                                    </span>
                                </div>
                                <div class="t-row">
                                    <span class="t">方法6: 每日满足任意游戏流水≥1000</span>
                                    <span class="t2 t">
                                        +
                                        <em>20</em>
                                        V币
                                    </span>
                                </div>
                                <div class="t-row">
                                    <span class="t">方法7: 每日满足任意游戏流水≥10000</span>
                                    <span class="t2 t">
                                        +
                                        <em>50</em>
                                        V币
                                    </span>
                                </div>
                                <div class="t-row">
                                    <span class="t" style="line-height: 0.2rem; padding: 0.06rem 0">
                                        方法8: 每日参与两种以上不同类型的游戏并完成流水≥500
                                    </span>
                                    <span class="t2 t">
                                        +
                                        <em>50</em>
                                        V币
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.vk_comfire_btn {
    .vk-btn {
        border-radius: 30px;
        height: 0.3rem;
        font-size: 0.15rem;
        font-weight: 600;
        color: #000;
        background: linear-gradient(to right, #07e9f1, #07f1b7);
        box-shadow: 0px 2px 6px 0px rgb(0 0 0 / 35%);
        border: none;
        &.van-button--disabled {
            background: rgba(124, 131, 159, 0.1);
            color: #53586b;
            opacity: 1;
        }
    }
}
.getvb-page {
    padding-bottom: 20px;
    .banner {
        width: 100%;
        height: 210px;
        position: relative;
        img {
            width: inherit;
            pointer-events: none;
        }
    }
    section {
        margin-top: 0.2rem;
        margin-bottom: 0.2rem;
        font-size: 0.14rem;
        .section_title {
            font-size: 0.17rem;
            line-height: 0.17rem;
            font-weight: bold;
        }
        .section_content {
            margin-top: 10px;
            p {
                margin-bottom: 0.05rem;
            }
        }
    }
    .howget .t-table {
        border: 1px solid #7c839f;
        margin-bottom: 0.2rem;
    }
    .howget .t-table span.t {
        display: inline-block;
        /* width: 50%; */
        color: #000;
        line-height: 0.36rem;
        box-sizing: border-box;
        font-size: 0.14rem;
    }
    .howget .t-table span.t2 {
        text-align: center;
        color: #e34d12;
        text-align: right;
        min-width: 0.9rem;
    }
    .howget .t-table .t-row {
        border-bottom: 1px solid #7c839f;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 0.1rem;
    }
    .howget .t-table .t-row em {
        font-style: normal;
        font-size: 0.2rem;
        font-weight: bold;
    }
    .howget .t-table .t-row:last-child {
        border-bottom: none;
    }
    .howget .t-table .t-header {
        line-height: 0.46rem;
        font-weight: bold;
        text-align: center;
        border-bottom: 1px solid #7c839f;
    }
    .howget .t-table .t-header span {
        color: #27bc74;
        font-size: 0.18rem;
    }

    .howget .t-table .t-row.sign {
        line-height: 1rem;
    }
    .howget .t-table .t-row.sign span {
        line-height: normal;
        vertical-align: middle;
    }
    .howget .t-table .t-row.sign span.t1 {
        width: 40%;
    }
    .howget .t-table .t-row.sign span.t2 {
        width: 60%;
        padding: 0.05rem 0 0.05rem 0;
    }
    .howget .t-table .t-row.sign span.t2 span {
        line-height: normal;
        color: #e34d12;
    }
    .howget .t-table .t-row.sign span.t2 .table_desc {
        display: inline-block;
        width: 1rem;
        padding: 0.05rem 0;
    }
}
</style>
