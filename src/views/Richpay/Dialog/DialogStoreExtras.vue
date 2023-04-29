<script setup lang="ts">
const addChipsList = [
    ["例：", "V富通余额6000，满足存放时间6小时金额3000，全额转出时"],
    ["转账加码", "=6000*V富通转账加码比例"],
    ["额外加码", "=3000*（0.1‰~0.5‰）"],
    ["流水要求", "=6000+转账加码+额外加码"]
]
</script>

<template>
    <div class="cus-add-chips">
        <ul>
            <li v-for="(txt, index) in addChipsList" :key="index">
                <small v-if="index > 0">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</small>
                <small v-else></small>
                <span>{{ txt[0] }}</span>
                {{ txt[1] }}
            </li>
        </ul>
    </div>
</template>

<style lang="scss" scoped>
.cus-add-chips {
    overflow: hidden;

    ul {
        width: calc(100% - 0.66rem);
        margin: 0.47rem auto 0;

        li {
            margin-top: 0.2rem;
            font-size: 0.15rem;
            line-height: 0.19rem;
            text-align: left;
            color: #fff;
            white-space: nowrap;

            span {
                color: #83f9fd;
            }

            &:first-child {
                white-space: normal;
                display: flex;
            }
        }
    }
}
</style>
