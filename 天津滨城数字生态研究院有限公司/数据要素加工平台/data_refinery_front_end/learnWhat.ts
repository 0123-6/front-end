import {HookConfig} from "@antv/xflow-core/es/hooks/config";
import {XFlowHookConfig} from "@antv/xflow-core/es/hooks/module";

const list = ['js','vue','react']
const randomNum = Math.round(Math.random()*list.length)

console.log('这次学习：', list[randomNum])

function identity<T>(addOptions:()=>void): T {
	return arg;
}

// @ts-ignore
let myIdentity: <T>(arg: T) => T = identity;

const myF:<T>(arg:T)=>T = identity;
myF(2)

export declare const createHookConfig: <T extends unknown = any>(addOptions: (config: HookConfig, container: IValueProxy<T>) => void) => (value?: T) => XFlowHookConfig;
