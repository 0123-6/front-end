const useProjectStore = defineStore(
  'project',
  {
    state: () => ({
      refresh: false,
      refreshRemark: false
    }),
    actions: {
      setRefresh() {
        this.refresh = !this.refresh
      },
      setRefreshRemark() {
        this.refreshRemark = !this.refreshRemark
      },
    }
  })

export default useProjectStore
