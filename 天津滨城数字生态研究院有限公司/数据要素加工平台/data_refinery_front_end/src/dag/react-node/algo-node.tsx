import React, {useState} from 'react'
import {
	CloseCircleOutlined,
	CheckCircleOutlined,
	ExclamationCircleOutlined,
	SyncOutlined,
} from '@ant-design/icons'

import {NsGraphStatusCommand} from '@antv/xflow'
import './algo-node.less'

import ModelSvg from "../../icon/model";
import PictureAdd from "../../icon/picture-add";
import Play2 from '../../icon/play-2'
import Car from '../../icon/car'
import Car2 from "../../icon/car-2";
import Filter from "../../icon/filter";
import Statistics from "../../icon/statistics";
import Power from '../../icon/power'
import Wenhao from "../../icon/wenhao";
import TextXflow from "./TextXflow";
import ModelXflow from "./ModelXflow";
import Sort from "./icon/Sort";
import Calc from "./icon/Calc";
import FaceLocationRecognitionSvg from "./icon/FaceLocationRecognitionSvg";
import FaceFeatureVectorExtractionSvg from "./icon/FaceFeatureVectorExtractionSvg";
import VideoClassificationPreProcessingSvg from "./icon/VideoClassificationPreProcessingSvg";
import CriminalVideoClassificationSvg from "./icon/CriminalVideoClassificationSvg";
import SpectrogramExtractionSvg from "./icon/SpectrogramExtractionSvg";
import UrbanAudioClassificationSvg from "./icon/UrbanAudioClassificationSvg";
import ClipFeatureExtractionSvg from "./icon/ClipFeatureExtractionSvg";
import StatusShow from "../../view/my-model/components/StatusShow";

interface IProps {
	status: NsGraphStatusCommand.StatusEnum
	isNodeTreePanel: boolean,
	show: boolean
}

export const AlgoIcon: React.FC<IProps> = props => {
	// console.log('algo icon: ',props)
	if (props.isNodeTreePanel && props.show) {
		return (
			<div className="text-blue-icon">
				<Wenhao/>
			</div>
		)
	}
	switch (props.status) {
		case NsGraphStatusCommand.StatusEnum.PROCESSING:
			return <SyncOutlined spin style={{color: '#4CAAB4', fontSize: '16px'}}/>
		case NsGraphStatusCommand.StatusEnum.ERROR:
			return <CloseCircleOutlined style={{color: '#F06B7C', fontSize: '16px'}}/>
		case NsGraphStatusCommand.StatusEnum.SUCCESS:
			return <CheckCircleOutlined style={{color: '#52C5A8', fontSize: '16px'}}/>
		case NsGraphStatusCommand.StatusEnum.WARNING:
			return <ExclamationCircleOutlined style={{color: '#EE7D0F', fontSize: '16px'}}/>
		default:
			return null
	}
}

//标签和图片的对应关系
const labelToIconMap = {
	'读取数据': ModelSvg(),
	'调整图片尺寸': PictureAdd(),
	'视频解码': Play2(),
	'车辆检测': Car(),
	'车流量统计': Car2(),
	'数据筛选': Filter(),
	'Min-Max标准化': Statistics(),
	'熵权法': Power(),
	'文本前处理': TextXflow(),
	'实体抽取模型推理': ModelXflow(),
	'数据按列值排序': Sort(),
	'月增长率计算': Calc(),
	'人脸位置识别': FaceLocationRecognitionSvg(),
	'人脸特征向量提取': FaceFeatureVectorExtractionSvg(),
	'视频分类前处理': VideoClassificationPreProcessingSvg(),
	'犯罪视频分类': CriminalVideoClassificationSvg(),
	'频谱图提取': SpectrogramExtractionSvg(),
	'城市音频分类': UrbanAudioClassificationSvg(),
	'Clip特征提取': ClipFeatureExtractionSvg(),
}

export const Icon = props => {
	let who = props.label
	if (labelToIconMap[who]) {
		return labelToIconMap[who]
	} else {
		return ModelSvg()
	}
}

export const AlgoNode = props => {
	// @ts-ignore
	const [isHover,setIsHover] = useState(false);
	return (
		<div className={"flex items-center relative"}>
			<div className={`xflow-algo-node text-white-icon hover:text-main
     ${props.isNodeTreePanel ? 'panel-node' : ''}
     ${props.data.status === NsGraphStatusCommand.StatusEnum.DEFAULT ? '' : ''}
     ${props.data.status === NsGraphStatusCommand.StatusEnum.PROCESSING ? '' : ''} 
     ${props.data.status === NsGraphStatusCommand.StatusEnum.SUCCESS ? '' : ''}
     ${props.data.status === NsGraphStatusCommand.StatusEnum.ERROR ? '' : ''}`}
			     style={{
				     outline: props.data.status === NsGraphStatusCommand.StatusEnum.ERROR ? '#F06B7C solid 1px' : '',
				     boxShadow: props.data.status === NsGraphStatusCommand.StatusEnum.ERROR ? '0px 2px 8px 0px rgba(166,9,9,0.17)' : '',
			     }}
			     onMouseOver={()=>setIsHover(true)}
			     onMouseOut={()=>setIsHover(false)}
			>
      <span className={`icon`}>
	      {/*<img src={(props.isNodeTreePanel&&!isHover)?((location.origin.indexOf('localhost')!==-1?'http://test.datarefinery.cn':location.origin) + props.data.icon):((location.origin.indexOf('localhost')!==-1?'http://test.datarefinery.cn':location.origin) + props.data.icon_hl)} style={{width:'16px',height:'16px'}} alt=""/>*/}
	      <img src={(props.isNodeTreePanel&&!isHover)?(props.data.icon):(props.data.icon_hl)} style={{width:'16px',height:'16px'}} alt=""/>
      </span>
				<span className="label text-hidden">{props.data.label}</span>
				<span className="status flex justify-center items-center mr-1">
        <AlgoIcon status={props.data && props.data.status} isNodeTreePanel={props.isNodeTreePanel} show={false}/>
      </span>
			</div>
			{
				props.isTest && props?.data?.status_desc!=='已发布' && props.isNodeTreePanel &&
				<StatusShow status={props?.data?.status_desc}/>
			}
		</div>
	)
}
