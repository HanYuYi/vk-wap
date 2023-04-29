<script setup lang="ts">
import { ref } from "vue"

let collapse = ref(true)
</script>

<template>
    <div class="main">
        <div class="richpay_head" :class="{ richpay_head_collapse: collapse }" @click="collapse = !collapse">
            钱包常见问题
            <i class="fold_icon" :class="{ open: !collapse }"></i>
        </div>
        <transition name="slide-fade">
            <div class="richpay_content" v-if="!collapse">
                <div class="table-panel">
                    <ol>
                        <li>
                            <dl>
                                <dt>如何转入资金？</dt>
                                <dd>
                                    只要您登录威客任何一个域名或是使用威客手机APP登录后，将您主账户上可提款额度转入至“威客V富通钱包”即可。
                                </dd>
                            </dl>
                        </li>
                        <li>
                            <dl>
                                <dt>如何转出资金？</dt>
                                <dd>要您登录威客任何一个域名或是使用威客手机APP登录后，将“威客V富通钱包”里的钱转出至主账户。</dd>
                            </dl>
                        </li>
                        <li>
                            <dl>
                                <dt>多久才能有收益？</dt>
                                <dd>
                                    资金转入“威客V富通钱包”满足每1小时派发一次利息，您可随时提出利息收益到主钱包，无需流水即可提款。
                                </dd>
                            </dl>
                        </li>
                        <li>
                            <dl>
                                <dt>存入时间有限制吗？</dt>
                                <dd>无任何限制，24小时随时存入。</dd>
                            </dl>
                        </li>
                        <li>
                            <dl>
                                <dt>利息收益和资金转出是否有流水要求？</dt>
                                <dd>
                                    利息和资金转出到主钱包后提款无任何流水要求。这里建议资金转入V富通钱包后至少保证1个小时的派息期，不足1个小时没有利息哦。
                                </dd>
                            </dl>
                        </li>
                        <li>
                            <dl>
                                <dd>
                                    因不可抗力或其他原因发生变动，威客电竞有权进行任何调整，以保证提供给会员更优质的收益环境。
                                </dd>
                            </dl>
                        </li>
                    </ol>
                </div>
            </div>
        </transition>
    </div>
</template>

<style lang="scss" scoped>
.table-panel {
    border-top: 1px solid transparent;
    width: 100%;

    ol {
        margin: 0.28rem 0.2rem 0.28rem 0.3rem;

        li {
            list-style: disc;
            font-size: 0.15rem;
            line-height: 0.21rem;
            margin-top: 0.05rem;
            color: #fff;

            dl {
                dt {
                    font-weight: bold;
                }
            }

            &:last-child {
                font-weight: bold;
                padding-bottom: 0.085rem;

                dl {
                    dd {
                        font-weight: bold;
                    }
                }
            }
        }
    }
}
</style>
