<script setup lang="ts">
import { ref, nextTick } from "vue"
const notFoundRef = ref<HTMLDivElement>(null)

nextTick((): void => {
    let loading: HTMLDivElement = notFoundRef.value
    let letters: string[] = loading.textContent.split("")
    loading.textContent = ""
    letters.forEach((letter, i) => {
        let span: HTMLSpanElement = document.createElement("span")
        span.textContent = letter
        span.style.animationDelay = `${i / 10}s`
        span.style.fontFamily = "Roboto"
        loading.append(span)
    })
})
</script>

<template>
    <div text="center 14px white" class="nofound-page h-screen vstack flex-col items-center bg-#2980b9">
        <div ref="notFoundRef" class="loading text-5em">404</div>
        <div text="28px" class="my-4 good-text-shadow">抱歉！找不到网页</div>
        <button @click="$router.replace('/')" class="pushable">
            <span class="shadow"></span>
            <span class="edge"></span>
            <span class="front">返回首页</span>
        </button>
    </div>
</template>

<style lang="scss" scoped>
.good-text-shadow {
    text-shadow: 0 1px #bbb, 0 2px #bbb, 0 3px #bbb, 0 4px #bbb, 0 5px #bbb, 0 6px transparent, 0 7px transparent,
        0 8px transparent, 0 9px transparent, 0 10px 10px rgba(0, 0, 0);
}
.loading {
    background: #2980b9;
    display: flex;
    text-transform: uppercase;

    :deep(span) {
        text-shadow: 0 1px #bbb, 0 2px #bbb, 0 3px #bbb, 0 4px #bbb, 0 5px #bbb, 0 6px transparent, 0 7px transparent,
            0 8px transparent, 0 9px transparent, 0 10px 10px rgba(0, 0, 0, 0.4);
        transform: translateY(20px);
        animation: bounce 0.3s ease infinite alternate;
    }
}

@keyframes bounce {
    to {
        text-shadow: 0 1px #bbb, 0 2px #bbb, 0 3px #bbb, 0 4px #bbb, 0 5px #bbb, 0 6px #bbb, 0 7px #bbb, 0 8px #bbb, 0 9px #bbb,
            0 50px 25px rgba(0, 0, 0, 0.2);
        transform: translateY(-20px);
    }
}

.pushable {
    position: relative;
    border: none;
    background: transparent;
    padding: 0;
    cursor: pointer;
    outline-offset: 4px;
    transition: filter 250ms;
}

.shadow {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 12px;
    background: hsl(0deg 0% 0% / 0.25);
    will-change: transform;
    transform: translateY(2px);
    transition: transform 600ms cubic-bezier(0.3, 0.7, 0.4, 1);
}

.edge {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 12px;
    background: linear-gradient(
        to left,
        hsl(340deg 100% 16%) 0%,
        hsl(340deg 100% 32%) 8%,
        hsl(340deg 100% 32%) 92%,
        hsl(340deg 100% 16%) 100%
    );
}

.front {
    display: block;
    position: relative;
    padding: 12px 42px;
    border-radius: 12px;
    font-size: 18px;
    color: white;
    background: hsl(345deg 100% 47%);
    will-change: transform;
    transform: translateY(-4px);
    transition: transform 600ms cubic-bezier(0.3, 0.7, 0.4, 1);
}

.pushable:hover {
    filter: brightness(110%);
}

.pushable:hover .front {
    transform: translateY(-6px);
    transition: transform 250ms cubic-bezier(0.3, 0.7, 0.4, 1.5);
}

.pushable:active .front {
    transform: translateY(-2px);
    transition: transform 34ms;
}

.pushable:hover .shadow {
    transform: translateY(4px);
    transition: transform 250ms cubic-bezier(0.3, 0.7, 0.4, 1.5);
}

.pushable:active .shadow {
    transform: translateY(1px);
    transition: transform 34ms;
}

.pushable:focus:not(:focus-visible) {
    outline: none;
}
</style>
