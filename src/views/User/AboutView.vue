<template>
    <div class="personal-page bg-light-green">
        <HeaderBar>
            <div class="header_title">关于</div>
        </HeaderBar>

        <div class="expand-page">
            <div class="bg-#f5f5f5 py-40px text-center">
                <img class="h-80px" src="@/assets/img/template/july/app_logo.png" alt="" />
            </div>
            <div>
                <van-cell
                    class="bg-transparent"
                    title-class="text-16px text-oldText"
                    size="large"
                    title="服务条款"
                    is-link
                    to="/serviceterms"
                />
                <van-cell
                    class="bg-transparent"
                    size="large"
                    title-class="text-16px text-oldText"
                    title="隐私策略"
                    is-link
                    to="/privacy"
                />
            </div>
        </div>
    </div>
</template>
