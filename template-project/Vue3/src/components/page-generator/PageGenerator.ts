// 参数接口
export interface IPageGeneratorProps {
    searchParams: ISearchItem[],
}

// 搜索项接口
interface ISearchItem {
    // 类型,支持输入框, 选择器, 日期选择器
    type: 'input' | 'select' | 'date',
    // 标签
    label: string,
    // 占位符文本
    placeholder: string | [string, string],
    // key的定义
    key: string,
    // select选择器专属,传入待选列表,或者获取待选列表的url
    selectList?: ISelectItem[] | string,
}

// select选择器接口
interface ISelectItem {
    // 标签
    label: string,
    // 值
    value: any,
}