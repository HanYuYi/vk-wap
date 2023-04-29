declare global {
    interface Window {
        domainName: {
            _WAP_TO_PC: string
        }
        initBotion: (userConfig: any, back: any) => void
    }
}

/**
 * DPlayer类型声明
 */
interface DPlayerParams {
    container: HTMLElement
    live?: boolean
    theme?: string
    autoplay?: boolean
    video: {
        url: string
        pic?: string
        duration: number
        type?: "customFlv" | "customHls"
        customType?: {
            customFlv(video: HTMLMediaElement): void
            customHls(video: HTMLMediaElement): void
        }
    }
}
export declare class DPlayer {
    constructor(config?: Partial<DPlayerParams>)
    play(): void
    pause(): void
    on(event: string, fn: () => void): void
    destroy(): void
    switchVideo(options: { url: string; pic: string }): void
}

// 目前仅支持的请求方式
export type AxiosSendMethod = "get" | "post"

/**
 * 提取数组类型
 */
export type InferArray<T> = T extends (infer S)[] ? S : never

export type Simplify<T> = {
    [P in keyof T]: T[P]
}

/**
 * 将部分字段变为可选
 */
export type SomePartial<T, K extends keyof T> = Simplify<Partial<Pick<T, K>> & Pick<T, Exclude<keyof T, K>>>
