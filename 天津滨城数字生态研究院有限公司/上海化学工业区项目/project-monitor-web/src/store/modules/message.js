const useMessageStore = defineStore(
  'message',
  {
    state: () => ({
      unreadNum: 0
    }),
    actions: {
      getUnreadNum() {
        this.unreadNum = 1
      },
      setUnreadNum(val) {
        this.unreadNum = val
      },
    }
  })

export default useMessageStore
