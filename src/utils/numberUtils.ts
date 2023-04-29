/**
 * 得到一个两数之间的随机整数,不含最大值，含最小值
 * @param min
 * @param max
 */
export function getRandomInt(min: number, max: number) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min
}

/**
 * 得到一个两数之间的随机整数,含最大值，含最小值
 * @param min
 * @param max
 */
export function getRandomIntInclusive(min: number, max: number) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * 格式化数字（每三位加逗号）,小数点默认保留两位
 * @param value 被格式化的值
 * @param floatLength 小数点保留位数
 */
export function formatNumberSplit(value: number | string = 0, floatLength: number = 2): string {
    let result: string = ""
    const numArr: string[] = value.toString().split(".")

    if (numArr[0]) {
        let num: string = numArr[0]
        if (num.includes(",")) {
            result = num
        } else {
            while (num.length > 3) {
                result = "," + num.slice(-3) + result
                num = num.slice(0, num.length - 3)
            }
            if (num) {
                result = num + result
            }
        }
    }

    if (numArr[1]) {
        result = floatLength ? result + "." + numArr[1].slice(0, floatLength) : result
    } else {
        const end: string = "0".repeat(floatLength)
        if (end.length) {
            result = result + "." + end
        }
    }
    return result
}
