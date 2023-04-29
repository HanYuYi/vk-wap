<script setup lang="ts">
import { computed } from "vue"

/**
 * Props
 */
interface Props {
    title: string

    titleLable?: string

    label?: string

    disable?: boolean

    showlabel?: boolean

    labelRobot?: boolean

    greenTitle?: boolean
}
const props = withDefaults(defineProps<Props>(), {
    title: "",

    titleLable: "",

    label: "",

    disable: false,

    showlabel: true,

    labelRobot: false,

    greenTitle: false
})

const arrowStyle = computed(() => {
    if (props.disable) {
        return { visibility: "hidden" }
    } else {
        return {}
    }
})
</script>

<template>
    <div class="block-wrapper" :class="{ 'block-disable': props.disable, 'van-haptics-feedback': !props.disable }">
        <div class="single-box">
            <slot name="lefticon"></slot>
            <div class="input-box">
                <div class="title">
                    {{ props.title }}
                    <span class="title-babel" :class="{ 'title-babel-green': props.greenTitle }" v-if="props.titleLable">
                        {{ props.titleLable }}
                    </span>
                </div>
                <div class="hstack">
                    <slot name="label">
                        <div
                            v-if="props.showlabel"
                            class="label"
                            :class="{ 'label-noset': !props.label, 'font-robot': props.labelRobot }"
                        >
                            {{ props.label ? props.label : "暂未设置" }}
                        </div>
                    </slot>
                    <div :style="arrowStyle" class="right-arrow-icon"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.block-wrapper {
    background: white;
    box-shadow: 0 2px 6px 0 rgba(52, 166, 202, 0.05);
    padding-left: 12px;
    margin-left: 12px;
    margin-right: 12px;
    &.only {
        border-radius: 8px;
        .single-box {
            .input-box {
                border-bottom: none;
            }
        }
    }
    &:first-child {
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
    }
    &:last-child {
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
        .single-box {
            .input-box {
                border-bottom: none;
            }
        }
    }

    .single-box {
        width: 100%;
        height: 60px;
        display: flex;
        align-items: center;
        .right-arrow-icon {
            width: 10px;
            height: 10px;
            background: url("@/assets/img/template/july/my/set/icon/right-arrow-icon.png") no-repeat center;
            background-size: contain;
        }

        :deep(.left-icon) {
            width: 20px;
            height: 20px;
            margin-right: 12px;
            background-repeat: no-repeat;
            background-size: contain;
            background-position: center;

            &.avatar-icon {
                background-image: url("@/assets/img/template/july/my/set/icon/avatar.png");
            }
            &.user-icon {
                background-image: url("@/assets/img/template/july/my/set/icon/user.png");
            }
            &.personal-icon {
                background-image: url("@/assets/img/template/july/my/set/icon/personal.png");
            }
            &.nickname-icon {
                background-image: url("@/assets/img/template/july/my/set/icon/nickname.png");
            }
            &.birth-icon {
                background-image: url("@/assets/img/template/july/my/set/icon/birth.png");
            }
            &.safe-icon {
                background-image: url("@/assets/img/template/july/my/set/icon/safe.png");
            }
            &.sign-icon {
                background-image: url("@/assets/img/template/july/my/set/icon/sign.png");
            }
            &.notice-icon {
                background-image: url("@/assets/img/template/july/my/set/icon/notice.png");
            }
            &.guide-icon {
                background-image: url("@/assets/img/template/july/my/set/icon/guide.png");
            }
            &.about-icon {
                background-image: url("@/assets/img/template/july/my/set/icon/about.png");
            }
            &.pass-icon {
                background-image: url("@/assets/img/template/july/my/set/icon/safe/pass.png");
            }
            &.pass-money-icon {
                background-image: url("@/assets/img/template/july/my/set/icon/safe/pass-money.png");
            }
            &.question-icon {
                background-image: url("@/assets/img/template/july/my/set/icon/safe/question.png");
            }
            &.phone-icon {
                background-image: url("@/assets/img/template/july/my/set/icon/safe/phone.png");
            }
        }

        .input-box {
            width: 307px;
            height: 100%;
            border-bottom: solid 1px #e6ecee;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-right: 12px;
            .title {
                font-size: 14px;
                font-weight: bold;
                color: var(--vk-primary-text-color);
                .title-babel {
                    font-weight: normal;
                    margin-left: 8px;
                    background-color: #dcdcdd;
                    border-radius: 12px;
                    font-size: 11px;
                    color: white;
                    padding-top: 3px;
                    padding-bottom: 3px;
                    padding-left: 4px;
                    padding-right: 4px;

                    &.title-babel-green {
                        background-color: #8be7c0;
                    }
                }
            }

            .label {
                font-size: 14px;
                color: #666;
                margin-right: 10px;
                &.label-noset {
                    color: #bbbbbc;
                }
            }
        }
    }
}
</style>
