# vk-view-wap2.0

## 注意事项：

* 项目架构vue3/vue-router4/vant4/pinia/unocss/ts/js/vite

* node 版本需要16.18.0以上，建议使用 pnpm/yarn, 当然npm也支持(建议使用nvm工具切换node版本)

* 组件库是vant4.0, 使用了vite自动引入，在vue模板的<template></template>中可直接使用van-xxx组件，无需引入；components目录中的一级文件也支持自动引入，但是如果是子目录里面的组件则需要手动引入。

* 项目自动热更新，依赖预构建的缓存在node_modules/.vite目录中，如果本地更改不生效，直接执行yarn dev --force/npm run dev --force,将重新搜寻依赖关系构建项目(自动)；如果还无效，可以删掉node_modules/.vite，重新执行yarn dev/npm run dev(手动)；

* 项目使用了postcss-pxtorem，可自动转换px为rem; 同时用amfe-flexible设置 rem 基准值为100px和老项目一样，即老项目的css代码可以直接拷贝过来使用。

* 项目既支持less,也支持scss,同时内置了unocss原子引擎，支持windcss/taliwindcss书写方式

* 项目支持vue2的option API, 但建议后续开发多使用composition API

* 项目状态管理使用pinia, 可视为vuex5以上，简单好用。

* 项目使用TS，是JS的超集，前期不熟悉TS，可直接在TS中写js代码，触发了IDE类型校验eslint提示爆红，可暂时忽略，后面ts水平提高了再消除这些警告。打包用pnpm run build / yarn build / npm run build, 后续TS技能上来了，打包命令可用yarn build-type-check

* 项目根目录的stats.html是打包可视化工具rollup-plugin-visualizer(功能类似webpack-bundle-analyzer)生成的文件，可在浏览器直接打开，用于后续打包优化分析。

* pnpm run preview / yarn preview / npm run preview 用于预览打包后dist文件夹里面的应用，也就是打包后前端也具备了本地启动服务器预览生产版本的能力。

* vbase模板快捷指令，建议使用ts setup scss
![vbase](/vscode.png)

## 项目目录介绍

* views相当于老项目的page

* types里面是ts的类型定义

* composable里面是可复用的逻辑


## 关于懒加载

   封装了 PullRresh 和 ListLazy 两个component, 可独立使用，也可一起使用。为了简化逻辑和便于维护，所有页面懒加载用到了这两个组件的，逻辑这块都是可重用的，统一在全局状态stores/fresh.ts中处理，因为共用了一个list，为了防止页面跳转后，数据混乱，造成显示异常，在用到这两个组件的页面，script setup里面要执行一下 freshStore.resetList()，页面卸载或路由退出前，也执行以下freshStore.resetList()，可以避免懒加载页面99%的bug。

### 引入图片

  ## 静态图片：

    1. import 语法

    2. 绝对路径，路径别名@代表根目录，这样随意变更vue文件的位置，图片路径不需要重新修改，项目会自动构建相关路径，包括vue文件在route等位置，如果用相对路径../../assets, 每次移动了vue文件，路径需要人工去修改一遍。

    ```
    <img src="@/assets/img/maintain/img.png" alt="" />

    ```


  ## 动态图片：

      
  1.  模板中使用 /src开头的绝对路径,不需要require了

    ```   

      <img
        class="lv_img"
        :src="`/src/assets/img/vipsystemnew/medal/${index}.png`"
        alt=""
      />

    ```
  

  2. new URL语法，见vite官网


    ```
    
    row.icon = new URL(
      `../assets/img/template/july/youhui/nav/${row.status}.png`,
      import.meta.url
    ).href

    ```

# 关于跑马灯

  Vue3Marquee已经封装好了，使用非常简单；setup 里面放个函数就可以自定义滚动速度

  ```

    // 计算跑马灯过渡时间，速度默认是90
    const { marqueeDuration } = useMarquee(130)

  ```

  用van-notice-bar也可以实现该效果。
  
  唯一要注意的是外层div不要用v-if，用v-show，或者干脆不要做判断。否则V-IF条件下，页面初始化渲染，读取不到内容宽度，跑马灯会静止不动。

### 读取响应式数据ref

    * ref中定义的数据，在template/watch中自动解耦，在js里面需要使用.value
  
    * 读取ref的值，可以使用.value,也可以使用unref(需要import {unref} from vue),也可以使用get(ref)
    
    * get从vueuse引入，三种方式解耦

### toast

  * 成功

    ```

    showToast({
      className: 'vk-toast-success',
      message: 'xxxxx',
      icon: 'checked'
    })

    ```

  * 失败

    ```

    showToast({
      className: 'vk-toast-fail',
      message: '请您先登录',
      icon: 'warning',
    })

    ```


### 时间转换

  不需要装moment.js或自己写逻辑，使用vueuse的useDateFormat函数，内部使用了day.js，非常简单易用

  需要输出带汉字的时间 2023年-01月-01号，将字符放在方括号中，即可原样返回而不被格式化替换。

  timestamp必须是毫秒的数字

  如果不用.value，输出的是 "2023年-01月-01号"

  ```{{ useDateFormat(Number(timestamp), 'YYYY[年]MM[月]DD[日]').value }}```

  输出 01-20 04:00

  ```{{ useDateFormat(Number(timestamp), 'MM-DD HH:mm').value }}```

  倒计时使用useCountDown，vant/use引入，内部实现了生命钩子，页面销毁会自动清空销毁定时器，不需要在手动处理，倒计时时分秒的显示使用formatCountDown函数，全局通用。显示逻辑是：

  当剩余时间大于1天(24h)，显示汉字 x天X小时（用在首页悬浮窗）

  剩余时间小于一天且大于1个小时，显示 HH:MM:SS; 小于1个小时，显示 MM : SS, 自动补零。

  `formatCountDown(item.countdowntime)  // countdowntime是毫秒单位`

  显示效果为 01:12:05 / 01:05


  有些优惠活动强制要求显示小时， HH:MM:SS，那就传个参数：

  `formatCountDown(item.countdowntime， true)`
    
  显示效果为 01:12:05 / 00:01:05


     

### swiper8.x

    swiper8.x原生支持vue3，不需要同时装swiper4/5和vue-awesome-swiper了，用法见代码(/vkstyle)或[官网文档](https://swiperjs.com/vue)

### 动画

  在很多情况下，不需要自己实现动画，项目内置的windcss/taliwindcss默认支持animation.css，底部tabbar,资讯，优惠tab点击都用到了该动画，只需要在需要动画的class加个类名即可，如果想先添加class，动画执行完毕再删除class，使用我封装好的animateCSS(dom, animateclassname)

  更复杂的动画，使用gsap3.0，全面淘汰老项目的Velocity，TweenMax。见生日礼包金币掉落动画，带重力加速度和回弹效果。

# css穿透语法
 
 老项目 less：/deep/.classname 已经废弃了，vite编译会警告
![deep](/deep.png)

  scss: :deep(.classname)

  项目中两种都支持，我目前写scss居多，之所以要支持scss，是现在需求对动画要求越来越高，之前和UI配合的时候，我们发现codepen上面很多现成的纯css动画效果，以后做活动的时候都可以参考着用一下，而codepen上面的范例全部是scss做的,支持scss后直接拷贝过来用即可。

