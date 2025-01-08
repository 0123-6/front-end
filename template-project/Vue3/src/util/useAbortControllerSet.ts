import {onBeforeUnmount, ref} from "vue";

// 将组件的请求放置在一个set中,在组件卸载时取消请求
export const useAbortControllerSet = () => {
    // 令牌控制器set
    const abortControllerSet = ref(new Set<AbortController>())
    onBeforeUnmount(() => {
        // 取消正在请求的请求
        for (const abortController of abortControllerSet.value) {
            abortController.abort()
        }
        abortControllerSet.value.clear()
    })

    return {
        abortControllerSet,
    }
}