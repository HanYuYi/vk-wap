import { showToast, type ToastPosition } from "vant"
import { useSysStore } from "@/stores/system"
import { Mask } from "maska"

const maskCn = new Mask({ mask: "### #### ####" })
const masKo = new Mask({ mask: "################" })

const maskDiscn = new Mask({ mask: "### #### !*!*!*!*" })
const maskOdis = new Mask({ mask: "############!*!*!*!*" })

/**
 * 验证手机号
 * @param value 手机号
 * @param phonePrefix 前缀
 */
export const checkPhone = function (value: string, phonePrefix: string) {
    if (!value.length) {
        return "手机号码不能为空哦"
    }

    const newValue: string = value.split(" ").join("")

    if (phonePrefix === "86" && !/^1+\d{10}$/.test(newValue)) {
        return "手机号码输入有误哦"
    }
    if (phonePrefix !== "86" && !/^\d{8,16}$/.test(newValue)) {
        return "手机号码输入有误哦"
    }
    return ""
}

/**
 * 格式化手机号，86的号码加空格
 * @param val
 */
export const formatterPhone = (val: string): string => {
    const systemParams = useSysStore()

    if (systemParams.countryCode.number === "86") {
        return maskCn.masked(val)
    }
    return masKo.masked(val)
}

/**
 * 格式化手机号带*号脱敏显示
 * @param val
 */
export const formatterSecPhone = (val: string): string => {
    const systemParams = useSysStore()

    if (systemParams.countryCode.number === "86") {
        return maskDiscn.masked(val)
    }
    return maskOdis.masked(val)
}

/**
 * 格式化银行卡
 * @param val
 */
export const formatterBankCard = (val: string): string => {
    if (!val.length) return ""
    return new Mask({ mask: "!*!*!*!* !*!*!*!* !*!*!*!* !* ###" }).masked(val)
}

/**
 * 校验银行卡号
 * @param val
 */
export const checkBankCard = (val: string) => {
    if (!val.length) {
        return "银行账户不能为空"
    }
    if (val.length < 6 || val.length > 20) {
        showToast({
            className: "vk-toast-fail",
            message: "银行卡号由16位数字或19位数字组成",
            icon: "warning",
            position: "top"
        })
        return "银行卡号由16位数字或19位数字组成"
    }
    return ""
}

/**
 * 去除空格
 * @param val
 */
export const formatterStr = (val: string): string => {
    return val.replace(/\s+/g, "")
}

/**
 * 用户名必须为中文
 * @param val
 * @param emptyMsg
 * @param cusMsg
 * @param position
 */
export const checkChineseName = (val: string, emptyMsg?: string, cusMsg?: string, position?: ToastPosition): string => {
    if (!val.length) {
        return emptyMsg ? emptyMsg : "用户名不能为空哦"
    }
    if (!/^[\u0391-\uFFE5]+$/.test(val)) {
        showToast({
            className: "vk-toast-fail",
            message: cusMsg ? cusMsg : "用户名必须为中文",
            icon: "warning",
            position: position ? position : "top"
        })
        return cusMsg ? cusMsg : "用户名必须为中文"
    }
    return ""
}

/**
 * 验证登录的用户名
 * @param val
 */
export const checkUsername = (val: string) => {
    if (!val.length) {
        return "用户名不能为空哦"
    }
    if (val.length < 6 || val.length > 12) {
        showToast({
            className: "vk-toast-fail",
            message: "账号长度 6 ~ 12",
            icon: "warning",
            position: "top"
        })
        return "账号长度 6 ~ 12"
    }
    return ""
}

/**
 * 验证注册的用户名
 * @param val
 */
export const checkUsernameForRegister = (val: string) => {
    if (!val.length) {
        return "用户名不能为空哦"
    }
    if (val.length < 6 || val.length > 12) {
        showToast({
            className: "vk-toast-fail",
            message: "用户名格式不正确（6~12位小写字母和数字哦）",
            icon: "warning",
            position: "top"
        })
        return "用户名格式不正确（6~12位小写字母和数字哦）"
    }
    return ""
}

/**
 * 验证登录密码
 * @param val
 */
export const checkPassword = (val: string) => {
    if (!val.length) {
        return "密码不能为空哦"
    }
    if (val.length < 6 || val.length > 20) {
        showToast({
            className: "vk-toast-fail",
            message: "密码长度 6 ~ 20",
            icon: "warning",
            position: "top"
        })
        return "密码长度 6 ~ 20"
    }
    return ""
}

/**
 * 验证注册的密码
 * @param val
 * @param emptyMsg
 * @param lenMsg
 */
export const checkPasswordForRegister = (val: string, emptyMsg?: string, lenMsg?: string) => {
    if (!val.length) {
        return emptyMsg ? emptyMsg : "密码不能为空哦"
    }
    if (val.length < 6 || val.length > 20) {
        showToast({
            className: "vk-toast-fail",
            message: lenMsg ? lenMsg : "密码格式不正确（6~20位字母和数字哦）",
            icon: "warning",
            position: "top"
        })
        return lenMsg ? lenMsg : "密码格式不正确（6~20位字母和数字哦）"
    }
    return ""
}

/**
 * 验证密码是否一样
 * @param val
 * @param newVal
 * @param message
 */
export const checkPasswordSame = (val: string, newVal: string, message: string): string => {
    if (val !== newVal) {
        showToast({
            className: "vk-toast-fail",
            message: message,
            icon: "warning",
            position: "top"
        })
        return message
    }
    return ""
}

/**
 * 验证短信验证码
 * @param val
 */
export const checkPhoneCode = (val: string): "请输入短信验证码" | "" => {
    if (!val.length) {
        showToast({
            className: "vk-toast-fail",
            message: "请输入短信验证码",
            icon: "warning"
        })
        return "请输入短信验证码"
    }
    return ""
}

/**
 * 验证url必须以https/http开头
 * @param val
 */
export const checkUrl = (val: string) => {
    if (!val.length) {
        return "请您输入链接"
    }
    if (!/(http|https):\/\/([\w.]+\/?)\S*/.test(val)) {
        showToast({
            className: "vk-toast-fail",
            message: "您输入的URL格式不正确，请以http或https开头",
            icon: "warning"
        })
        return "您输入的URL格式不正确，请以http或https开头"
    }
    return ""
}
