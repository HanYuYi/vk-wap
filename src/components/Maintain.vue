<script setup lang="ts">
/**
 * Props
 */
interface Props {
    time: string
    content: string
}
const props = defineProps<Props>()
</script>

<template>
    <div class="maintain">
        <div class="page_img">
            <img src="@/assets/img/maintain/img.png" alt="" />
        </div>
        <div class="page_text">
            <p>{{ props.content }}</p>
            <p>
                维护时间：
                <span>{{ props.time }}</span>
            </p>
            <p>有疑问，您可以联系我们的客服人员。</p>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.maintain {
    padding: 1rem 0;
    color: #7c839f;
    font-size: 0.16rem;
    text-align: center;
}

.page_img {
    width: 60%;
    margin: 0 auto;
    text-align: center;
}

.page_img img {
    width: 100%;
}

.maintain .page_text {
    margin-top: 0.2rem;
    line-height: 0.22rem;
}
</style>
