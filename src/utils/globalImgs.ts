import lazyNewLogo from "@/assets/defaultimg/july/logo.png"
import lazyLogo from "@/assets/defaultimg/logo.png"
import lazyGoods from "@/assets/defaultimg/july/goods.png"
import lazyYHImg from "@/assets/defaultimg/july/youhui.png"
import homeBannerError from "@/assets/defaultimg/july/banner-error.jpg"
import GameCardError from "@/assets/defaultimg/july/game-card-error.png"
import GrayAvatar from "@/assets/defaultimg/default_headimg_bg.png"
import lazyPack140 from "@/assets/defaultimg/pack_140.png"
import NewAvatar from "@/assets/defaultimg/july/avatar.png"
import yhImg from "@/assets/img/template/july/home/bottom/yh.png"
import yhActiveImg from "@/assets/img/template/july/home/bottom/yh-active.png"
import NewsImg from "@/assets/img/template/july/home/bottom/news.png"
import NewsActiveImg from "@/assets/img/template/july/home/bottom/news-active.png"
import HomeImg from "@/assets/img/template/july/home/home.png"
import ZzImg from "@/assets/img/template/july/home/bottom/zz.png"
import ZzActiveImg from "@/assets/img/template/july/home/bottom/zz-active.png"
import MyImg from "@/assets/img/template/july/home/bottom/wd.png"
import MyActiveImg from "@/assets/img/template/july/home/bottom/wd-active.png"
import LiveGif from "@/assets/img/template/july/home/bottom/live_gif.gif"
import fireImg1 from "@/assets/img/active/common/firefly/fire1.png"
import fireImg2 from "@/assets/img/active/common/firefly/fire2.png"
import fireImg3 from "@/assets/img/active/common/firefly/fire3.png"
import fireImg4 from "@/assets/img/active/common/firefly/fire4.png"
import fireImg5 from "@/assets/img/active/common/firefly/fire5.png"
import fireImg6 from "@/assets/img/active/common/firefly/fire6.png"
import fireImg7 from "@/assets/img/active/common/firefly/fire7.png"

// 占位图
export function usePlaceImg() {
    return {
        lazyNewLogo,
        lazyLogo,
        lazyGoods,
        lazyYHImg,
        homeBannerError,
        GameCardError,
        GrayAvatar,
        NewAvatar,
        lazyPack140
    }
}

// 底部bottomtab的图片
export const useBottomImg = () => {
    return {
        yhImg,
        yhActiveImg,
        NewsImg,
        NewsActiveImg,
        HomeImg,
        ZzImg,
        ZzActiveImg,
        MyImg,
        MyActiveImg,
        LiveGif
    }
}

// 萤火虫飞舞的动效图片
export const useFireImg = (): Record<string, string> => {
    return {
        fireImg1,
        fireImg2,
        fireImg3,
        fireImg4,
        fireImg5,
        fireImg6,
        fireImg7
    }
}
