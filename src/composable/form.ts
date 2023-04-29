import { formatterPhone, formatterStr } from "@/composable/validate"
import ApiSetting from "@/api/service"
import { ref, watch } from "vue"
import type { ComputedRef } from "vue"
import { useCountDown } from "@vant/use"
import type { CurrentTime } from "@vant/use"
import { useSysStore } from "@/stores/system"
import { HttpPlus } from "@/api/HttpPlus"

class IndexCheckMessage {
    seconds: number
    check: number
}

interface IndexCheckMessageParams {
    type: number
    phone?: string
    prefix?: string
}

const codeSended = ref(false) // 手机验证码是否已经发送了
const isCountDown = ref(false) //  是否正在倒计时
const phone = ref("")
const phonecode = ref("")
const codeCheck = ref(0)
const username = ref("")
const password = ref("")
const repassword = ref("")
const verifycode = ref("") // 图片验证码/极验验证码
const verifyBotion = ref<Record<string, string>>(null)
const isShowPassIcon = ref(true) // 默认展示密码icon
const isShowRePassIcon = ref(true) // 默认展示密码icon
const showVerifyCode = ref(false) // 用户名登录是否限制验证码
const codeloading = ref(false) // 验证码按钮loading状态

export function useForm() {
    const systemParams = useSysStore()

    // 切换国家区号，对号码重新格式化
    watch(
        () => systemParams.countryCode.number,
        () => {
            phone.value = formatterPhone(phone.value)
        }
    )

    const resetForm = (): void => {
        codeSended.value = false
        isCountDown.value = false
        phone.value = ""
        phonecode.value = ""
        codeCheck.value = 0
        username.value = ""
        password.value = ""
        repassword.value = ""
        verifycode.value = ""
        verifyBotion.value = null
        isShowPassIcon.value = true
        isShowRePassIcon.value = true
        showVerifyCode.value = false
        codeloading.value = false
    }

    // 切换密码显示状态
    const switchPassIcon = (): void => {
        isShowPassIcon.value = !isShowPassIcon.value
    }

    // 切换确认密码显示状态
    const switchRePassIcon = (): void => {
        isShowRePassIcon.value = !isShowRePassIcon.value
    }

    // vant倒计时钩子，
    const countDown = useCountDown({
        time: 60 * 1000,
        onFinish: () => {
            isCountDown.value = false
        }
    })

    const countdownTime: ComputedRef<CurrentTime> = countDown.current

    // 获取手机验证码
    const handleSendVerCode = async (type: number): Promise<void> => {
        codeloading.value = true
        try {
            const params: IndexCheckMessageParams = { type }

            if (type !== 5) {
                params.phone = formatterStr(phone.value)
                params.prefix = systemParams.countryCode.number
            }

            HttpPlus.setUrlOptions(ApiSetting.index.sendPhoneVerCode)
            const res = await HttpPlus.sendHttpRequest<IndexCheckMessage, IndexCheckMessageParams>(params)
            codeloading.value = false

            if (res.status === 1) {
                codeSended.value = true
                if (res.data.check) {
                    codeCheck.value = Number(res.data.check)
                }
                countDown.reset(res.data.seconds * 1000)
                countDown.start()
                isCountDown.value = true
            }
        } catch (error: unknown) {
            codeloading.value = false
            throw error
        }
    }

    return {
        codeSended,
        phone,
        phonecode,
        codeCheck,
        username,
        password,
        repassword,
        verifycode,
        verifyBotion,
        isShowPassIcon,
        isShowRePassIcon,
        showVerifyCode,
        codeloading,
        countDown,
        isCountDown,
        countdownTime,
        switchPassIcon,
        switchRePassIcon,
        handleSendVerCode,
        resetForm
    }
}
