import { ref } from "vue"
import type { UnwrapRef } from "vue"
import type { ApiInterface } from "@/api/HttpPlus"
import { useSysStore } from "@/stores/system"
import type { SomePartial } from "@/types"
import { HttpPlus } from "@/api/HttpPlus"

export function useFetch<T, P extends {} = {}>(
    apiSetting: SomePartial<ApiInterface, "timeout" | "method">,
    params: P,
    pageLoading: boolean = false
) {
    const loading = ref<boolean>(false)
    const data = ref<T>(null)
    const message = ref<string>("")

    async function doFetch() {
        const systemParams = useSysStore()

        loading.value = true
        if (pageLoading) {
            systemParams.PageLoading = true
        }

        HttpPlus.setUrlOptions(apiSetting)
        const res = await HttpPlus.sendHttpRequest<UnwrapRef<T>, P>(params)
        if (pageLoading) {
            systemParams.PageLoading = false
        }
        message.value = res?.message
        if (res.status === 1) {
            data.value = res.data
        }
        loading.value = false
    }

    doFetch()

    return { loading, data, message }
}
