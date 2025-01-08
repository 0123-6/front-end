import { dataItem_queryAll } from '@/api/pm/dataItem'
const useDictStore = defineStore(
  'dict',
  {
    state: () => ({
      dict: []
    }),
    actions: {
      getDict(key) {
        return this.dict.find(n => n.itemTypeCode === key).itemCodeList
      },
      getDicts(keys) {
        let obj = {}
        keys.forEach(key => {
          obj[key] = this.getDict(key)
        })
        return obj
      },
      async initDict() {
        const res = await dataItem_queryAll()
        this.dict = res.result
        console.log('initDict', res.result)
        window.cip_dict = res.result
      }
    }
  })

export default useDictStore
