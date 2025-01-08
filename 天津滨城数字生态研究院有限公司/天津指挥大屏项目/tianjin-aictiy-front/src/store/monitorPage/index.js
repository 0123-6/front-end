export default {
    namespaced:true,
    state:() => ({
        streets:[],//页面中的路口列表
        modelTypeList:[],//配置的模型
        oldStreetsLength:0,//路口列表长度
        earlyWarningInformation:null,//预警信息
        earlyWarningInformationNum:0,//预警信息数量
        streetIdList:[],//路口id列表
    }),
    getters:() =>({
    }),
    mutations: {
        setStreets(state,value){
            state.streets = value
        },
        setModelTypeList(state,value){
            state.modelTypeList = value
        },
        setOldStreetsLength(state,value){
            state.oldStreetsLength = value
        },
        setEarlyWarningInformation(state,value){
            state.earlyWarningInformation = value
        },
        setEarlyWarningInformationNum(state,value){
            state.earlyWarningInformationNum = value
        },
        setStreetIdList(state,value){
            state.streetIdList = value
        },
    },
    actions: {},
    modules: {}
}
