//防抖
export const debounce = (() => {
    let timer = null
    return (callback, wait) => {
        clearTimeout(timer)
        timer = setTimeout(callback, wait)
    }
})()