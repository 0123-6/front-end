export default {
    namespaced:true,
    state:() => ({
        searchMode: 's0',//搜索模式，简单搜索s0，高级搜索s2
        searched: false,//是否点击搜索按钮
        searching:false,//搜索中
        searchResult:[],//搜索结果列表
        showMoastData:null,//点击搜索按钮弹出层数据
        moastShowMode:null,//点击搜索按钮弹出层下面3个选项
        drawingStatus:0,//用来标注小手是否处于绘制状态，非绘制状态为0，绘制中为1，绘制完成为2
        needInit:false,//是否需要刷新页面
    }),
    getters:() =>({
    }),
    mutations: {
        init(state) {
            console.log('store init change searchMode')
            state.searchMode = 's0'
            state.searched = false
            state.searching = false
            state.searchResult = []
            state.showMoastData = null
            state.moastShowMode = null
            state.drawingStatus = 0//未绘制
            state.needInit = false
        },
        setSearchMode(state,value){
            console.log('change searchmode:',value)
            state.searchMode = value
        },
        setSearched(state,value){
            state.searched = value
        },
        setSearching(state,value){
            state.searching = value
        },
        setSearchResult(state,value){
            state.searchResult = value
        },
        setShowMoastData(state,value){
            state.showMoastData = value
        },
        setMoastShowMode(state,value){
            state.moastShowMode = value
        },
        setDrawingStatus(state,value){
            state.drawingStatus = value
        },
        setNeedInit(state,value){
            state.needInit = value
        },
    },
    actions: {},
    modules: {}
}
