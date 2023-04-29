/**
 * 向头部追加字符
 * @param value
 * @param len
 */
export const pad = (value: number | string, len: number = 2): string => {
    const str = String(value)
    return str.padStart(len, "0")
}

/**
 * 手动px转rem
 * @param px
 */
export const pxToRem = (px: number): number => {
    return px / 100
}

/**
 * 手动rem转px
 * @param rem
 * @constructor
 */
export const RemToPx = (rem: number): number => {
    return (document.documentElement.clientWidth / 750) * 200 * rem
}

/**
 * HEX十六进制颜色值转换为RGB(A)颜色值
 * @param val
 */
export const hexToRgb = (val: string): string => {
    let a: string, b: string, c: string
    if (/^#/g.test(val)) {
        a = val.slice(1, 3)
        b = val.slice(3, 5)
        c = val.slice(5, 7)
        return "rgba(" + parseInt(a, 16) + "," + parseInt(b, 16) + "," + parseInt(c, 16) + ",0.5)"
    }
    return "rgba(0, 0, 0, 0.4)"
}
