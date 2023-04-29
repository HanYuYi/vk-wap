<script setup lang="ts">
import ios1 from "@/assets/img/template/july/my/guide/appInstall/ios_first_1.png"
import ios2 from "@/assets/img/template/july/my/guide/appInstall/ios_first_2.png"
import ios3 from "@/assets/img/template/july/my/guide/appInstall/ios_first_3.png"
import iosother1 from "@/assets/img/template/july/my/guide/appInstall/ios_other_1.png"
import iosother2 from "@/assets/img/template/july/my/guide/appInstall/ios_other_2.png"
import iosother3 from "@/assets/img/template/july/my/guide/appInstall/ios_other_3.png"
import iosother4 from "@/assets/img/template/july/my/guide/appInstall/ios_other_4.png"
import hw1 from "@/assets/img/template/july/my/guide/appInstall/android_install_hw_1.png"
import hw2 from "@/assets/img/template/july/my/guide/appInstall/android_install_hw_2.png"
import hw3 from "@/assets/img/template/july/my/guide/appInstall/android_install_hw_3.png"
import v1 from "@/assets/img/template/july/my/guide/appInstall/android_install_vivo_1.png"
import v2 from "@/assets/img/template/july/my/guide/appInstall/android_install_vivo_2.png"
import oppo1 from "@/assets/img/template/july/my/guide/appInstall/android_install_oppo_1.png"
import oppo2 from "@/assets/img/template/july/my/guide/appInstall/android_install_oppo_2.png"
import mz1 from "@/assets/img/template/july/my/guide/appInstall/android_install_meizu_1.png"
import andother1 from "@/assets/img/template/july/my/guide/appInstall/android_install_other_1.png"
import andother2 from "@/assets/img/template/july/my/guide/appInstall/android_install_other_2.png"
import andanti1 from "@/assets/img/template/july/my/guide/appInstall/android_antiVirus_meizu_5.png"
import andanti2 from "@/assets/img/template/july/my/guide/appInstall/android_antiVirus_meizu_6.png"
import andanti3 from "@/assets/img/template/july/my/guide/appInstall/android_antiVirus_meizu_7.png"
import andanti4 from "@/assets/img/template/july/my/guide/appInstall/android_antiVirus_meizu_8.png"
import andanti5 from "@/assets/img/template/july/my/guide/appInstall/android_antiVirus_meizu_1.png"
import andanti6 from "@/assets/img/template/july/my/guide/appInstall/android_antiVirus_meizu_2.png"
import andanti7 from "@/assets/img/template/july/my/guide/appInstall/android_antiVirus_meizu_3.png"
import andanti8 from "@/assets/img/template/july/my/guide/appInstall/android_antiVirus_meizu_4.png"

import { ref } from "vue"

const active = ref(0)

const pageNavList = [
    {
        id: 1,
        name: "IOS安装指引",
        childIndex: 0,
        childBarList: [
            {
                title: "首次安装",
                guideList: [
                    {
                        desc: "点击下载威客电竞APP，在IOS中运行超级签名的应用时，会弹出这样的提示：",
                        img: ios1
                    },
                    {
                        desc: "若要运行应用，可以按照下面的步骤来设置。在系统中打开 <span class='highlight'>设置 - 通用 - 设备管理</span>。然后，点击对应描述文件进入后，再点击安装，根据提示完成安装描述文件即可。如图所示：",
                        img: ios2
                    },
                    {
                        desc: '返回到APP下载页面，<span class="highlight">点击安装</span>，即可成功安装威客电竞APP。',
                        img: ios3
                    }
                ]
            },
            {
                title: "非首次安装",
                guideList: [
                    {
                        desc: "若用户之前安装过威客电竞APP，当再次安装时，会提示以下信息，如图所示：",
                        img: iosother1
                    },
                    {
                        desc: '用户需要在系统中打开 <span class="highlight">设置 - 通用 - 设备管理</span>。然后，点击对应描述文件进入后，再点击移除管理，即可删除旧版本的超级签名描述文件。如图所示：',
                        img: iosother2
                    },
                    {
                        desc: '再次下载威客电竞APP，并在系统中打开 <span class="highlight">设置 - 通用 - 设备管理</span>。然后，点击对应描述文件进入后，再点击安装，根据提示完成安装描述文件即可。如图所示：',
                        img: iosother3
                    },
                    {
                        desc: '返回到APP下载页面，<span class="highlight">点击安装</span>，即可成功安装威客电竞APP。',
                        img: iosother4
                    }
                ]
            }
        ]
    },
    {
        id: 2,
        name: "Android安装指引",
        childIndex: 0,
        childBarList: [
            {
                title: "华为",
                guideList: [
                    {
                        desc: '下载后会弹出风险框，请不用担心，本APP没有任何病毒，请点击<span class="highlight">「暂不处理」</span>',
                        img: hw1
                    },
                    {
                        desc: '安装后打开<span class="highlight">「信任此应用」</span>',
                        img: hw2
                    },
                    {
                        desc: '华为自带的<span class="highlight">「手机管家」</span>中会检测出敏感内容，由于本APP中包含博弈内容所致，请放心使用',
                        img: hw3
                    }
                ]
            },
            {
                title: "VIVO",
                guideList: [
                    {
                        desc: '下载后会弹出风险框，请点击<span class="highlight">「继续安装」</span>',
                        img: v1
                    },
                    {
                        desc: '在<span class="highlight">「高风险提示」</span>弹框出现后点击安装，如没有安装，请重复第一步并点击<span class="highlight">「忽略风险并安装」</span>',
                        img: v2
                    }
                ]
            },
            {
                title: "OPPO",
                guideList: [
                    {
                        desc: '下载后会弹出<span class="highlight">「发现病毒」</span>，请不用担心，本APP没有任何病毒，请点击<span class="highlight">「无视风险安装」</span>',
                        img: oppo1
                    },
                    {
                        desc: 'OPPO自带的<span class="highlight">「安全卫士」</span>中会检测出敏感内容，由于本APP中包含博弈内容所致，请放心使用',
                        img: oppo2
                    }
                ]
            },
            {
                title: "小米",
                guideList: [
                    {
                        desc: '小米手机在正常安装情况下不会提示病毒，但下载后我们还是需在腾讯手机管家里把本App添加到信任区，<span id="toAntiRef" class="highlight" style="text-decoration: underline">查看杀毒设置</span>'
                    }
                ]
            },
            {
                title: "魅族",
                guideList: [
                    {
                        desc: '下载后会弹出<span class="highlight">「发现危险」</span>，请不用担心，本APP没有任何病毒，请点击<span class="highlight">「仍要安装」</span>',
                        img: mz1
                    }
                ]
            },
            {
                title: "其他",
                guideList: [
                    {
                        desc: '下载前请先至 <span class="highlight">「设置」</span><span class="highlight">「安全性」</span>',
                        img: andother1
                    },
                    {
                        desc: '开启<span class="highlight">「不明的来源」</span>，并执行<span class="highlight">「确定」</span>',
                        img: andother2
                    }
                ]
            }
        ]
    },
    {
        id: 3,
        name: "Android杀毒设置",
        childIndex: 0,
        childBarList: [
            {
                title: "华为",
                guideList: [
                    {
                        desc: '打开<span class="highlight">「腾讯手机管家」</span>后点击<span class="highlight">「安全检测」</span>',
                        img: andanti1
                    },
                    {
                        desc: '在安全检测后点击<span class="highlight">「处理」</span>',
                        img: andanti2
                    },
                    {
                        desc: '打开继续下一步，点击<span class="highlight">「移入信任区」</span>',
                        img: andanti3
                    },
                    {
                        desc: '点击<span class="highlight">「确认」</span>后，白名单添加成功，再次杀毒就不会提示了。',
                        img: andanti4
                    }
                ]
            },
            {
                title: "VIVO",
                guideList: [
                    {
                        desc: '打开<span class="highlight">「腾讯手机管家」</span>后点击<span class="highlight">「安全检测」</span>',
                        img: andanti1
                    },
                    {
                        desc: '在安全检测后点击<span class="highlight">「处理」</span>',
                        img: andanti2
                    },
                    {
                        desc: '打开继续下一步，点击<span class="highlight">「移入信任区」</span>',
                        img: andanti3
                    },
                    {
                        desc: '点击<span class="highlight">「确认」</span>后，白名单添加成功，再次杀毒就不会提示了。',
                        img: andanti4
                    }
                ]
            },
            {
                title: "OPPO",
                guideList: [
                    {
                        desc: '打开<span class="highlight">「腾讯手机管家」</span>后点击<span class="highlight">「安全检测」</span>',
                        img: andanti1
                    },
                    {
                        desc: '在安全检测后点击<span class="highlight">「处理」</span>',
                        img: andanti2
                    },
                    {
                        desc: '打开继续下一步，点击<span class="highlight">「移入信任区」</span>',
                        img: andanti3
                    },
                    {
                        desc: '点击<span class="highlight">「确认」</span>后，白名单添加成功，再次杀毒就不会提示了。',
                        img: andanti4
                    }
                ]
            },
            {
                title: "小米",
                guideList: [
                    {
                        desc: '打开<span class="highlight">「腾讯手机管家」</span>后点击<span class="highlight">「安全检测」</span>',
                        img: andanti1
                    },
                    {
                        desc: '在安全检测后点击<span class="highlight">「处理」</span>',
                        img: andanti2
                    },
                    {
                        desc: '打开继续下一步，点击<span class="highlight">「移入信任区」</span>',
                        img: andanti3
                    },
                    {
                        desc: '点击<span class="highlight">「确认」</span>后，白名单添加成功，再次杀毒就不会提示了。',
                        img: andanti4
                    }
                ]
            },
            {
                title: "魅族",
                guideList: [
                    {
                        desc: '魅族自带的<span class="highlight">「手机管家」</span>点击<span class="highlight">「病毒查杀」</span>',
                        img: andanti5
                    },
                    {
                        desc: '检查完成后请点击<span class="highlight">「隐患应用」</span>，不用点击<span class="highlight">「立即修复」</span>',
                        img: andanti6
                    },
                    {
                        desc: '进入后再点击<span class="highlight">「受信任的应用」</span>',
                        img: andanti7
                    },
                    {
                        desc: '找到xxAp然后勾选点击<span class="highlight">「确认」</span>即可',
                        img: andanti8
                    },
                    {
                        desc: '打开<span class="highlight">「腾讯手机管家」</span>后点击<span class="highlight">「安全检测」</span>',
                        img: andanti1
                    },
                    {
                        desc: '在安全检测后点击<span class="highlight">「处理」</span>',
                        img: andanti2
                    },
                    {
                        desc: '打开继续下一步，点击<span class="highlight">「移入信任区」</span>',
                        img: andanti3
                    },
                    {
                        desc: '点击<span class="highlight">「确认」</span>后，白名单添加成功，再次杀毒就不会提示了。',
                        img: andanti4
                    }
                ]
            },
            {
                title: "其他",
                guideList: [
                    {
                        desc: '打开<span class="highlight">「腾讯手机管家」</span>后点击<span class="highlight">「安全检测」</span>',
                        img: andanti1
                    },
                    {
                        desc: '在安全检测后点击<span class="highlight">「处理」</span>',
                        img: andanti2
                    },
                    {
                        desc: '打开继续下一步，点击<span class="highlight">「移入信任区」</span>',
                        img: andanti3
                    },
                    {
                        desc: '点击<span class="highlight">「确认」</span>后，白名单添加成功，再次杀毒就不会提示了。',
                        img: andanti4
                    }
                ]
            }
        ]
    }
]
</script>

<template>
    <div class="personal-page bg-light-green">
        <HeaderBar>
            <div class="header_title">APP安装指引</div>
        </HeaderBar>
        <div class="expand-page pb-20px appinstall">
            <van-tabs v-model:active="active" background="transparent" animated swipeable :ellipsis="false">
                <van-tab v-for="(tab, i) in pageNavList" :key="i" :title="tab.name">
                    <div class="pt-10px px-12px">
                        <div
                            text="#7d829c 14px"
                            class="type-wrapper text-center hstack mt-5px mx-auto mb-14px w-345px h-40px rounded-20px border border-#7f849e"
                        >
                            <div
                                class="type"
                                :class="{
                                    'type-active primary-btn text-17px text-#272932 font-bold': tab.childIndex === index
                                }"
                                @click="pageNavList[i].childIndex = index"
                                v-for="(item, index) in tab.childBarList"
                                :key="index"
                            >
                                {{ item.title }}
                            </div>
                        </div>
                    </div>
                    <div class="content px-14px" v-if="tab.childBarList[tab.childIndex].guideList">
                        <div
                            v-for="(guideItem, guideItemIndex) in tab.childBarList[tab.childIndex].guideList"
                            :key="guideItemIndex"
                        >
                            <div class="content_text">
                                {{ guideItemIndex + 1 }}.
                                <span v-html="guideItem.desc"></span>
                            </div>
                            <div class="content_img" v-if="guideItem.img">
                                <img :src="guideItem.img" alt="" />
                            </div>
                        </div>
                    </div>
                </van-tab>
            </van-tabs>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "guide.scss";
</style>
