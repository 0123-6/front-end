import React, {useEffect, useState} from "react";
import {useHistory} from 'react-router-dom';
import {AutoComplete, Cascader, Form, Input, message, Popover, Select, Spin, Tooltip, Upload} from "antd";
import NavigationComponent from "../../../components/NavigationComponent";
import MyModel from "../../layout/icon/header/MyModel.svg";
import MyModelLight from "../../layout/icon/header/MyModelLight.svg";
import {handleKeyDownDisabled} from "../../../utils/util";
import ProgressBarComponent from "./components/ProgressBarComponent";
import {modelFormatList, modelFormatToFileTypeMap} from "../static";
import UploadSvg from "./icon/UploadSvg.svg";
import UploadDisabledSvg from "./icon/UploadDisabledSvg.svg";
import ButtonMain from "../../../components/ButtonMain";
import {PlusOutlined} from "@ant-design/icons";
import Wenhao from "../../../icon/wenhao";
import ButtonSecond from "../../../components/ButtonSecond";
import {MarkdownEditor} from "../../../dag/components/MarkdownEditor";
import ImageEditorModal from "./components/ImageEditorModal";
import {get, post} from "../../../axios";
import DeleteSvg from "../../../icon/table/DeleteSvg";
import { modelVersionList } from "../../../utils/static";
import AddLabelMapping from "../../../components/AddLabelMapping";

export const inputTypeList = [
	{"label":"文本","value":"text"},
	{"label":"表格","value":"csv"},
	{"label":"图片","value":"image"},
	{"label":"视频","value":"video"},
	{"label":"音频","value":"audio"},
	{"label":"json字符串","value":"json"}
]
export const outputTypeList = [
	{"label":"文本","value":"text"},
	{"label":"表格","value":"csv"},
	{"label":"图片","value":"image"},
	{"label":"视频","value":"video"},
	{"label":"音频","value":"audio"},
	{"label":"json字符串","value":"json"}
]

export const DescriptionComponent = (props) => {
	// state
	const {modelFormat} = props;
	// mounted
	// methods
	// render
	return (
		<div className={"w-[546px] pl-6 bg-white flex flex-col text-sm leading-[14px]"}
		     style={{height:'calc(100vh - 346px)'}}
		     onClick={e=>{e.stopPropagation()}}>
			{
				modelFormat === 'xgboost' &&
				<>
					<div className={"w-full h-[44px] border-b border-[#f0f1f3] flex items-center"}>XGBoost格式说明</div>
					<div className={"w-full pr-6 pb-8 overflow-auto scrollbar"}
							 style={{height:'calc(100% - 44px - 8px)'}}>
						<div className={"w-full flex flex-col"}>
							<div className={"mt-4 flex items-center text-black-dark"}>1.格式：</div>
							<div className={"mt-2 ml-3 flex items-center"}>.bst文件</div>
							<div className={"mt-6 flex items-center text-black-dark"}>2.文件生成示例：</div>
							<div className={"mt-2 w-full pl-[26px] pt-4 pb-4 flex flex-col leading-5 rounded"}
							     style={{background:'rgba(148,198,203,0.04)'}}>
								<span className={"flex items-center"}>import xgboost as xgb</span>
								<span className={"flex items-center"}>from sklearn.datasets import load_iris</span>
								<span className={"flex items-center"}>import os</span>
								<span className={"mt-4 flex items-center font-medium"}># 构建并训练模型</span>
								<span className={"flex items-center"}>model_dir = "."</span>
								<span className={"flex items-center"}>BST_FILE = "model.bst"</span>
								<span className={"mt-6 flex items-center"}>iris = load_iris()</span>
								<span className={"flex items-center"}>y = iris['target']</span>
								<span className={"flex items-center"}>X = iris['data']</span>
								<span className={"flex items-center"}>dtrain = xgb.DMatrix(X, label=y)</span>
								<span className={"flex items-center"}>{"param = {'max_depth': 6,"}</span>
								<span className={"ml-[56px] flex items-center"}>{"'eta': 0.1,"}</span>
								<span className={"ml-[56px] flex items-center"}>{"'silent': 1,"}</span>
								<span className={"ml-[56px] flex items-center"}>{"'nthread': 4,"}</span>
								<span className={"ml-[56px] flex items-center"}>{"'num_class': 10,"}</span>
								<span className={"ml-[56px] flex items-center"}>{"'objective': 'multi:softmax'"}</span>
								<span className={"ml-[56px] flex items-center"}>{"}"}</span>
								<span className={"flex items-center"}>{"xgb_model = xgb.train(params=param, dtrain=dtrain)"}</span>
								<span className={"mt-4 flex items-center font-medium"}>{"# 生成bst文件"}</span>
								<span className={"flex items-center"}>{"model_file = os.path.join((model_dir), BST_FILE)"}</span>
								<span className={"flex items-center"}>{"xgb_model.save_model(model_file)"}</span>
							</div>
							<div className={"mt-4 flex items-center text-black-dark"}>3.文件命名要求：</div>
							<div className={"mt-2 ml-3 flex items-center"}>请务必命名为model.bst</div>
						</div>
					</div>
				</>
			}
			{
				modelFormat === 'sklearn' &&
				<>
					<div className={"w-full h-[44px] border-b border-[#f0f1f3] flex items-center"}>Scikit-learn格式说明</div>
					<div className={"w-full pr-6 pb-8 overflow-auto scrollbar"}
					     style={{height:'calc(100% - 44px - 8px)'}}>
						<div className={"w-full flex flex-col"}>
							<div className={"mt-4 flex items-center text-black-dark"}>1.格式：</div>
							<div className={"mt-2 ml-3 flex items-center"}>.joblib文件</div>
							<div className={"mt-6 flex items-center text-black-dark"}>2.文件生成示例：</div>
							<div className={"mt-2 w-full pl-[26px] pt-4 pb-4 flex flex-col leading-5 rounded"}
							     style={{background:'rgba(148,198,203,0.04)'}}>
								<span className={"flex items-center"}>from sklearn import svm</span>
								<span className={"flex items-center"}>from sklearn import datasets</span>
								<span className={"mt-4 flex items-center font-medium"}># 加载joblib库</span>
								<span className={"flex items-center"}>from joblib import dump</span>
								<span className={"mt-4 flex items-center font-medium"}># 构建并训练模型</span>
								<span className={"flex items-center"}>{"iris = datasets.load_iris()"}</span>
								<span className={"flex items-center"}>{"X, y = iris.data, iris.target"}</span>
								<span className={"flex items-center"}>{"clf = svm.SVC(gamma='scale')"}</span>
								<span className={"flex items-center"}>{"clf.fit(X, y)"}</span>
								<span className={"mt-4 flex items-center font-medium"}>{"# 生成joblib文件"}</span>
								<span className={"flex items-center"}>{"dump(clf, 'model.joblib')"}</span>
							</div>
							<div className={"mt-4 flex items-center text-black-dark"}>3.文件命名要求：</div>
							<div className={"mt-2 ml-3 flex items-center"}>请务必命名为model.joblib</div>
						</div>
					</div>
				</>
			}
			{
				modelFormat === 'lightgbm' &&
				<>
					<div className={"w-full h-[44px] border-b border-[#f0f1f3] flex items-center"}>LightGBM格式说明</div>
					<div className={"w-full pr-6 pb-8 overflow-auto scrollbar"}
							 style={{height:'calc(100% - 44px - 8px)'}}>
						<div className={"w-full flex flex-col"}>
							<div className={"mt-4 flex items-center text-black-dark"}>1.格式：</div>
							<div className={"mt-2 ml-3 flex items-center"}>.bst文件</div>
							<div className={"mt-6 flex items-center text-black-dark"}>2.文件生成示例：</div>
							<div className={"mt-2 w-full pl-[26px] pt-4 pb-4 flex flex-col leading-5 rounded"}
							     style={{background:'rgba(148,198,203,0.04)'}}>
								<span className={"flex items-center"}>{"import lightgbm as lgb"}</span>
								<span className={"flex items-center"}>{"from sklearn.datasets import load_iris"}</span>
								<span className={"flex items-center"}>{"import os"}</span>
								<span className={"mt-4 flex items-center font-medium"}>{"# 构建并训练模型"}</span>
								<span className={"flex items-center"}>{"model_dir = \".\""}</span>
								<span className={"flex items-center"}>{"BST_FILE = \"model.bst\""}</span>
								<span className={"mt-6 flex items-center"}>iris = load_iris()</span>
								<span className={"flex items-center"}>y = iris['target']</span>
								<span className={"flex items-center"}>X = iris['data']</span>
								<span className={"flex items-center"}>dtrain = xgb.DMatrix(X, label=y)</span>
								<span className={"mt-6 flex items-center"}>{"param = {"}</span>
								<span className={"ml-[18px] flex items-center"}>{"'objective': 'multiclass',"}</span>
								<span className={"ml-[18px] flex items-center"}>{"'metric': 'softmax',"}</span>
								<span className={"ml-[18px] flex items-center"}>{"'num_class': 3,"}</span>
								<span className={"flex items-center"}>{"}"}</span>
								<span className={"flex items-center"}>{"lgb_model = lgb.train(params=params, train_set=dtrain)"}</span>
								<span className={"mt-4 flex items-center font-medium"}>{"# 生成bst文件"}</span>
								<span className={"flex items-center"}>{"model_file = os.path.join(model_dir, BST_FILE)"}</span>
								<span className={"flex items-center"}>{"lgb_model.save_model(model_file)"}</span>
							</div>
							<div className={"mt-4 flex items-center text-black-dark"}>3.文件命名要求：</div>
							<div className={"mt-2 ml-3 flex items-center"}>请务必命名为model.bst</div>
						</div>
					</div>
				</>
			}
			{
				modelFormat === 'tensorflow' &&
				<>
					<div className={"w-full h-[44px] border-b border-[#f0f1f3] flex items-center"}>TensorFlow格式说明</div>
					<div className={"w-full pr-6 pb-8 overflow-auto scrollbar"}
					     style={{height:'calc(100% - 44px - 8px)'}}>
						<div className={"w-full flex flex-col"}>
							<div className={"mt-4 flex items-center text-black-dark"}>1.格式：</div>
							<div className={"mt-2 ml-3 flex items-center"}>.zip格式（解压后为TensorFlow SavedModel文件）</div>
							<div className={"mt-6 flex items-center text-black-dark"}>2.文件生成示例：</div>
							<div className={"mt-2 w-full pl-[26px] pt-4 pb-4 flex flex-col leading-5 rounded"}
							     style={{background:'rgba(148,198,203,0.04)'}}>
								<span className={"flex items-center"}>{"from tensorflow.keras.datasets import mnist"}</span>
								<span className={"flex items-center"}>{"from tensorflow.keras import models"}</span>
								<span className={"flex items-center"}>{"from tensorflow.keras import layers"}</span>
								<span className={"flex items-center"}>{"import tensorflow as tf"}</span>
								<span className={"mt-4 flex items-center font-medium"}>{"# 读取数据"}</span>
								<span className={"flex items-center"}>{"(train_images, train_labels), (test_images, test_labels) ="}</span>
								<span className={"ml-1 flex items-center"}>{"mnist.load_data()"}</span>
								<span className={"mt-4 flex items-center font-medium"}>{"# 数据预处理"}</span>
								<span className={"flex items-center"}>{"train_images = train_images.reshape((60000, 28 * 28))"}</span>
								<span className={"flex items-center"}>{"train_images = train_images.astype('float32') / 255"}</span>
								<span className={"flex items-center"}>{"test_images = test_images.reshape((10000, 28 * 28))"}</span>
								<span className={"flex items-center"}>{"test_images = test_images.astype('float32') / 255"}</span>
								<span className={"mt-4 flex items-center font-medium"}>{"# 标签预处理"}</span>
								<span className={"flex items-center"}>{"from tensorflow.keras.utils import to_categorical"}</span>
								<span className={"flex items-center"}>{"train_labels = to_categorical(train_labels)"}</span>
								<span className={"flex items-center"}>{"test_labels = to_categorical(test_labels)"}</span>
								<span className={"mt-4 flex items-center font-medium"}>{"# 模型训练"}</span>
								<span className={"flex items-center"}>{"network.fit(train_images, train_labels, epochs = 5, batch_size = 128)"}</span>
								<span className={"mt-4 flex items-center font-medium"}>{"# 模型保存"}</span>
								<span className={"flex items-center"}>{"save_path = './0001'"}</span>
								<span className={"flex items-center"}>{"tf.saved_model.save(network, save_path)"}</span>
								<span className={"mt-4 flex items-center font-medium"}>{"# 打包成zip文件"}</span>
								<span className={"flex items-center"}>{"!zip -r model_fcn mnist.zip ./0001"}</span>
							</div>
							<div className={"mt-4 flex items-center text-black-dark"}>{"3.文件存储路径要求"}</div>
							<div className={"mt-2 ml-3 flex items-center font-medium"}>{"请保证.zip文件解压后文件目录结构与下列要求完全一致"}</div>
							<div className={"mt-2 w-full pl-[26px] pt-4 pb-4 flex flex-col leading-5 rounded"}
							     style={{background:'rgba(148,198,203,0.04)'}}>
								<span className={"flex items-center"}>{"│── 0001   # 模型版本"}</span>
								<span className={"flex items-center"}>{"│   ├── assets"}</span>
								<span className={"flex items-center"}>{"│   ├── variables"}</span>
								<span className={"flex items-center"}>{"│   ├── saved_model.pb"}</span>
							</div>
							<div className={"mt-4 flex items-center text-black-dark"}>4.文件命名要求：</div>
							<div className={"mt-2 ml-3 flex items-center"}>.zip文件文件名前缀必须包含“model_”，如 model_fcn_mnist.zip</div>
						</div>
					</div>
				</>
			}
			{
				modelFormat === 'pytorch' &&
				<>
					<div className={"w-full h-[44px] border-b border-[#f0f1f3] flex items-center"}>PyTorch格式说明</div>
					<div className={"w-full pr-6 pb-8 overflow-auto scrollbar"}
					     style={{height:'calc(100% - 44px - 8px)'}}>
						<div className={"w-full flex flex-col"}>
							<div className={"mt-4 flex items-center text-black-dark"}>1.格式：</div>
							<div className={"mt-2 ml-3 flex items-center"}>.zip格式（解压后为Torchserve Model文件）</div>
							<div className={"mt-6 flex items-center text-black-dark"}>2.文件生成示例：</div>
							<span className={"mt-2 ml-3 flex items-center leading-5 break-words break-all"}>{"TorchServe 的一个关键特性是能够将所有模型工件打包到单个模型存档文件中。它是一个单独的命令行界面 (CLI)，torch-model-archiver可以使用 state_dict 获取模型检查点或模型定义文件，并将它们打包成一个.mar文件。然后，任何使用 TorchServe 的人都可以重新分发和提供该文件。CLI 创建一个.mar文件，TorchServe 的服务器 CLI 使用该文件为模型提供服务。"}</span>
							<span className={"mt-4 ml-3 flex items-center"}>{"安装torch-model-archiver"}</span>
							<span className={"mt-2 ml-3 flex items-center font-medium"}>{"在终端输入命令行："}</span>
							<div className={"mt-2 w-full pl-[26px] pt-4 pb-4 flex flex-col leading-5 rounded"}
							     style={{background:'rgba(148,198,203,0.04)'}}>
								<span className={"flex items-center"}>{"pip install torch-model-archiver"}</span>
							</div>
							<span className={"mt-4 ml-3 flex items-center font-medium"}>{"或者从源安装："}</span>
							<div className={"mt-2 w-full pl-[26px] pt-4 pb-4 flex flex-col leading-5 rounded"}
									 style={{background:'rgba(148,198,203,0.04)'}}>
								<span className={"flex items-center"}>{"git clone https://github.com/pytorch/serve.git"}</span>
								<span className={"flex items-center"}>{"cd serve/model-archiver"}</span>
								<span className={"flex items-center"}>{"pip install ."}</span>
							</div>
							<span className={"mt-4 ml-3 flex items-center font-medium"}>{"运行如下命令："}</span>
							<div className={"mt-2 w-full pl-[26px] pt-4 pb-4 flex flex-col leading-5 rounded"}
									 style={{background:'rgba(148,198,203,0.04)'}}>
								<span className={"flex items-center"}>{"torch-model-archiver"}</span>
								<span className={"ml-2 flex items-center"}>{"--model-name  xxx     # 生成mar文件的名称"}</span>
								<span className={"ml-2 flex items-center"}>{"--version     1.0     # 模型版本"}</span>
								<span className={"ml-2 flex items-center"}>{"--model-file  xxx     # 模型构建脚本路径"}</span>
								<span className={"ml-2 flex items-center"}>{"--serialized-file xxx # 模型权重文件路径，.pt或.pth文件"}</span>
								<span className={"ml-2 flex items-center"}>{"--extra-files xxx     # 附加依赖项文件路径"}</span>
								<span className={"ml-2 flex items-center"}>{"--handler xxx         # TorchServe的默认处理程序名称"}</span>
								<span className={"ml-2 flex items-center"}>{"--export=path xxx     # .mar文件输出路径"}</span>
							</div>
							<span className={"mt-4 ml-3 flex items-center font-medium"}>{"命令示例："}</span>
							<div className={"mt-2 w-full pl-[26px] pt-4 pb-4 flex flex-col leading-5 rounded"}
							     style={{background:'rgba(148,198,203,0.04)'}}>
								<span className={"flex items-center"}>{"torch-model-archiver"}</span>
								<span className={"ml-2 flex items-center"}>{"--model-name densenet161"}</span>
								<span className={"ml-2 flex items-center"}>{"--version 1.0"}</span>
								<span className={"ml-2 flex items-center"}>{"--model-file examples/image_classifier/densenet_161/model.py"}</span>
								<span className={"ml-2 flex items-center"}>{"--serialized-file densenet161-8d451a50.pth"}</span>
								<span className={"ml-2 flex items-center"}>{"--extra-files examples/image_classifier/index_to_name.json"}</span>
								<span className={"ml-2 flex items-center"}>{"--handler image_classifier"}</span>
							</div>
							<span className={"mt-4 ml-3 flex items-center break-all leading-5"}>{"执行命令生成即可生成.mar文件。除此之外，还需要生成config.properties文件来启动KServe推理协议，config.properties文件示例如下："}</span>
							<div className={"mt-2 w-full pl-[26px] pt-4 pb-4 flex flex-col leading-5 rounded break-all"}
							     style={{background:'rgba(148,198,203,0.04)'}}>
								<span className={"flex items-center"}>{"inference_address=http://0.0.0.0:8085"}</span>
								<span className={"flex items-center"}>{"management_address=http://0.0.0.0:8081"}</span>
								<span className={"flex items-center"}>{"metrics_address=http://0.0.0.0:8082"}</span>
								<span className={"flex items-center"}>{"enable_metrics_api=true"}</span>
								<span className={"flex items-center"}>{"metrics_format=prometheus"}</span>
								<span className={"flex items-center"}>{"number_of_netty_threads=4"}</span>
								<span className={"flex items-center"}>{"job_queue_size=10"}</span>
								<span className={"flex items-center"}>{"service_envelope=kserve"}</span>
								<span className={"flex items-center"}>{"model_store=/mnt/models/model-store"}</span>
								<span className={"flex items-center"}>{"model_snapshot={\"name\":\"startup.cfg\",\"modelCount\":1,\"models\":{\"pytorch\":{\"1.0\":{\"defaultVersion\":true,\"marName\":\"pytorch.mar\",\"minWorkers\":1,\"maxWorkers\":5,\"batchSize\":1,\"maxBatchDelay\":5000,\"responseTimeout\":120}}}}"}</span>
								<span className={"flex items-center"}>{"max_response_size=104857600"}</span>
								<span className={"flex items-center"}>{"max_request_size=104857600"}</span>
							</div>
							<div className={"mt-4 flex items-center text-black-dark"}>{"3.文件存储路径要求"}</div>
							<div className={"mt-2 ml-3 flex items-center font-medium"}>{"请保证.zip文件解压后文件目录结构与下列要求完全一致"}</div>
							<div className={"mt-2 w-full pl-[26px] pt-4 pb-4 flex flex-col leading-5 rounded"}
							     style={{background:'rgba(148,198,203,0.04)'}}>
								<span className={"flex items-center"}>{"│── config"}</span>
								<span className={"flex items-center"}>{"│   ├── config.properties"}</span>
								<span className={"flex items-center"}>{"│── model-store"}</span>
								<span className={"flex items-center"}>{"│   ├── densenet161.mar"}</span>
							</div>
							<div className={"mt-4 flex items-center text-black-dark"}>4.文件命名无要求</div>
						</div>
					</div>
				</>
			}

		</div>
	)
}

export default function MyModelCreate() {
	// state
	const history = useHistory();
	const [form] = Form.useForm();
	// 模型格式
	const [modelFormat, setModelFormat] = useState('');
	const [number, setNumber] = useState(1);
	const [modelFileUrl, setModelFileUrl] = useState('');
	// 镜像文件
	const [mirrorImage, setMirrorImage] = useState(null);
	const [modelCoverUrl, setModelCoverUrl] = useState('');
	const [modelCoverLoading, setModelCoverLoading] = useState(false);
	const [modelDescription,setModelDescription] = useState('');
	const [labelMapping,setLabelMapping] = useState([]);
	// 模型类型列表
	const [modelTypeList, setModelTypeList] = useState([]);
	// 模型分类列表
	const [modelClassList, setModelClassList] = useState([]);
	// 模型图标列表
	const [modelIconList, setModelIconList] = useState([]);
	const [modelIcon, setModelIcon] = useState(null);
	// 展示弹框
	const [showImageEditorModal, setShowImageEditorModal] = useState(false)

	// mounted
	useEffect(() => {
		form.resetFields()
		getModelTypeList()
		getModelClassList()
	}, [])
	// methods
	const getModelClassList = async () => {
		const {data} = await get('/drapi/comp/menu/2')
		let list = []
		for(let i=0;i<data.length;i++){
			let item = {
				label: data[i].name,
				value: data[i].id,
				children: []
			}
			for(let j=0;j<data[i].children.length;j++){
				item.children.push({
					label: data[i].children[j].name,
					value: data[i].children[j].id,
				})
			}
			list.push(item)
		}
		console.log('ModelClassList: ', list)
		setModelClassList(list)
	}
	const getModelIconList = async (id) => {
		const {data} = await get(`/drapi/comp/menu/icons/${id}`)
		let list = []
		for(let i=0;i<data.icons.length;i++){
			list.push({
				// label: <img src={`${(location.origin.indexOf('localhost')!==-1?'http://test.datarefinery.cn':location.origin)+data.icons[i].icon}`} alt={''}/>,
				label: <img src={`${data.icons[i].icon}`} alt={''}/>,
				value: data.icons[i].id,
			})
		}
		setModelIconList(list)
		setModelIcon(null)
		form.setFieldValue('modelIcon', null)
	}
	const getModelTypeList = async () => {
		const {data} = await get('/drapi/comp/model/types')
		let list = []
		for(let i=0;i<data.model_types.length;i++){
			list.push({
				label: data.model_types[i].name,
				value: data.model_types[i].id,
			})
		}
		setModelTypeList(list)
	}
	const goBack = (e = undefined) => {
		if (e) {
			e.preventDefault()
		}
		history.goBack()
	}
	// 创建模型
	const createModel = async () => {
		const formData = form.getFieldsValue(true);
		let label_mapping_object = {}
		for (let i = 0; i < labelMapping.length; i++) {
			label_mapping_object[labelMapping[i].key] = labelMapping[i].value
		}
		const params = {
			model_framework: formData.modelFormat,
			model_addr: formData?.modelFileUrl ? formData?.modelFileUrl : null,
			mirror_image: formData?.mirrorImage ? formData?.mirrorImage : null,
			name: formData.modelName,
			cover: formData.modelCoverUrl,
			model_type_id: formData.modelType,
			comp_menu_id: formData.modelClass[formData.modelClass.length - 1],
			icon_id: formData.modelIcon[0],
			label_mapping: label_mapping_object,
			input_type: formData.inputType,
			output_type: formData.outputType,
			version: formData.modelVersion,
			abstract: formData.modelSimpleDescription,
			description: formData.modelDescription,
		}
		await post('/drapi/comp/mycomps', params)
		message.success('创建成功')
		goBack()
	}
	const onFinishFailed = (errorInfo) => {
		console.log('Failed:', errorInfo);
	}
	const modelFileBeforeUpload = (_file) => {
		console.log('before into 上传')
		if (modelFileUrl) {
			console.log('ssssss')
			return false
		}
	}
	const modelFileHandleChange = (_data) => {
		console.log('into handleChange')
		console.log('_data: ', _data)
		if (_data.file.status === 'done') {
			form.setFieldValue('modelFileUrl', _data.file.response.data.urls[0])
			form.validateFields(['modelFileUrl'])
			setModelFileUrl(_data.file.response.data.urls[0])
		}
	}
	// 点击下一步
	const clickNextStep = async (e) => {
		e.preventDefault()
		e.stopPropagation()
		try {
			if(modelFormat !== 'other') {
				await form.validateFields(['modelFormat','modelFileUrl'])
			} else {
				await form.validateFields(['modelFormat'])
				// 模型文件和镜像文件必须而且只能存在一个
				const mirrorImage = form.getFieldValue('mirrorImage')
				if (modelFileUrl && mirrorImage) {
					message.warn('模型文件和镜像文件不能同时存在')
					return
				}
				if(!modelFileUrl && !mirrorImage){
					message.warn('模型文件和镜像文件必须存在一个')
					return
				}
			}
			setNumber(2)
			document.getElementById('layoutRef')?.scrollTo(0, 0)
		} catch (error) {
			console.log('error: ', error)
		}
	}
	// 点击上一步
	const clickBeforeStep = (e) => {
		e.preventDefault()
		e.stopPropagation()
		setNumber(1)
		document.getElementById('layoutRef')?.scrollTo(0, 0)
	}
	// 删除文件
	const modelFileHandleRemove = (_file = null) => {
		form.setFieldValue('modelFileUrl', null)
		form.validateFields(['modelFileUrl'])
		setModelFileUrl('')
	}
	// 停止上传
	const modelFileStopUpload = () => {
		if (modelFileUrl) {
			message.warn('请先删除已上传的模型文件')
		}
		if(mirrorImage) {
			message.warn('请先删除镜像文件')
		}
	}
	// 添加markdown文件
	const clickAddMarkdownFile = (e) => {
		e.preventDefault()
		e.stopPropagation()
		const input = document.createElement('input');
		input.type = 'file';
		// 上传markdown格式文件
		input.accept = ".md,.markdown,.mdown,.mkd,.mkdn";
		input.onchange = (event) => {
			// @ts-ignore
			const file = event.target.files[0];
			// 解析markdown文件

			const reader = new FileReader();
			reader.onload = () => {
				console.log('reader.result: ', reader.result)
				setModelDescription(reader.result.toString())
			};
			reader.readAsText(file);
		};
		input.click();
	}
	// markdown文件change
	const changeModelDescription = (value) => {
		form.setFieldValue('modelDescription', value)
		form.validateFields(['modelDescription'])
		setModelDescription(value)
	}

	const [modelCoverFile, setModelCoverFile] = useState(null)

	const clickUploadModelCover = () => {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = 'image/*';
		input.onchange = (event) => {
			// @ts-ignore
			const file = event.target.files[0];
			const reader = new FileReader();
			reader.onload = () => {
				setModelCoverFile(file);
				setShowImageEditorModal(true)
			};
			reader.readAsDataURL(file);
		};
		input.click();
	}
	// 编辑图片弹框事件
	const imageEditorModalOnOk = async (_data) => {
		const {imageFile} = _data
		setShowImageEditorModal(false)
		setModelCoverUrl(URL.createObjectURL(imageFile))
		form.setFieldValue('modelCoverUrl', null)
		setModelCoverLoading(true)
		const params = {
			business_type: 'model-cover',
			avatar: imageFile,
		}
		const res = await post('/drapi/file/upload', params, {headers: {'Content-Type': 'multipart/form-data'}})
		const url = res.data.urls[0]
		setModelCoverUrl(url)
		form.setFieldValue('modelCoverUrl', url)
		form.validateFields(['modelCoverUrl'])
		setModelCoverLoading(false)
	}
	const imageEditorModalOnCancel = () => {
		setShowImageEditorModal(false)
	}
	// 添加标签映射
	const addLabelMapping = (e) => {
		e.preventDefault()
		e.stopPropagation()
		const newLabelMapping = [...labelMapping]
		newLabelMapping.push({key: '', value: ''})
		setLabelMapping(newLabelMapping)
		form.setFieldValue('labelMapping', newLabelMapping)
	}
	// @ts-ignore
	const modelFileUrlOnDrop = (e) => {
		const {name} = e.dataTransfer.files[0]
		const fileName = name
		if (modelFormat && fileName) {
			const fileType = fileName.split('.').pop()
			const modelFormatFileType = modelFormatToFileTypeMap[modelFormat]
			if (modelFormatFileType.indexOf(fileType) === -1) {
				message.warn('模型文件格式不正确')
			}
		}
	}
	const changeLabelMapping = (e, index, key) => {
		e.preventDefault()
		e.stopPropagation()
		const newLabelMapping = [...labelMapping]
		newLabelMapping[index][key] = e.target.value
		setLabelMapping(newLabelMapping)
		form.setFieldValue('labelMapping', newLabelMapping)
	}
	const deleteLabelMapping = (index) => {
		const newLabelMapping = [...labelMapping]
		newLabelMapping.splice(index, 1)
		setLabelMapping(newLabelMapping)
		form.setFieldValue('labelMapping', newLabelMapping)
	}
	const changeModelClass = (value) => {
		form.setFieldValue('modelClass', value)
		form.validateFields(['modelClass'])
		console.log('value: ', value)
		const id = value[value.length-1]
		getModelIconList(id)
	}
	const changeModelIcon = (value) => {
		setModelIcon(value)
		form.setFieldValue('modelIcon', value)
		form.validateFields(['modelIcon'])
	}
	const changeModelFormat = (value) => {
		setModelFormat(value)
		// 重置镜像文件
		setMirrorImage(null)
		form.setFieldValue('mirrorImage', null)
	}
	// render
	return (
		// 最外层
		<div className="w-full flex flex-col items-center bg text-sm leading-[14px]">
			<NavigationComponent data={[
				{label: '我的模型', router: '/my-model', icon: MyModel, iconActive: MyModelLight},
				{label: '创建', disabled: true},
			]}/>
			{/*主体内容*/}
			<div className={`mb-16 flex flex-col bg-white pt-10 shadow-card rounded ${number === 1 ? 'label-width-170' : 'label-width-126'} `}
				style={{width: '960px'}}>
				<Form form={form}
				      onFinish={createModel}
				      onFinishFailed={onFinishFailed}
				      onKeyDown={handleKeyDownDisabled}>
					<div className={"w-full flex flex-col"}>
						{/*进度条组件*/}
						<ProgressBarComponent number={number}/>
						{/*模型格式*/}
						<Form.Item
							style={{marginTop: '54px'}}
							className={`label-height-38 ${number === 1 ? '' : 'hidden'}`}
							label="模型格式"
							name="modelFormat"
							rules={[{required: true, message: '请选择模型格式'}]}
						>
							<Select
								size={'large'}
								style={{width: 451}}
								options={modelFormatList}
								placeholder={'请选择模型格式'}
								onChange={changeModelFormat}
							/>
						</Form.Item>
						{/*镜像文件*/}
						{
							modelFormat === 'other' &&
							<Form.Item
								// style={{marginTop: '44px'}}
								className={`label-height-38 ${number === 1 ? '' : 'hidden'}`}
								label="镜像文件"
								name="mirrorImage"
								rules={[
									// {required: true, message: '请输入镜像文件地址'},
								]}
							>
								<Input style={{width: 451}}
											 placeholder={'请输入镜像文件地址'}
											 autoComplete={"off"}
											 disabled={!!modelFileUrl}
											 onChange={(e) => setMirrorImage(e.target.value)}
								/>
							</Form.Item>
						}
						{/*模型文件*/}
						<Form.Item
							label="模型文件"
							className={`${number === 1 ? '' : 'hidden'}`}
							name="modelFileUrl"
							dependencies={['modelFormat']}
							// 模型文件格式需要和模型格式指定的模型文件格式一致
							rules={[
								{required: modelFormat !== 'other', message: '请上传模型文件'},
								() => ({
									validator(_, fileName) {
										// modelFormat为空时，还没有选择模型格式，不需要检验
										// fileName为空时，还说明没有上传文件，不需要校验
										if (modelFormat && fileName) {
											const fileType = fileName.split('.').pop()
											const modelFormatFileType = modelFormatToFileTypeMap[modelFormat]
											if (modelFormatFileType.indexOf(fileType) === -1) {
												return Promise.reject(new Error('模型文件格式不正确'))
											}
										}
										return Promise.resolve()
									}
								})
							]}
						>
							<div className={"relative"} style={{width: '451px', height: '165px'}}>
								<Upload.Dragger
									showUploadList={{
										showRemoveIcon: true,
										showPreviewIcon: false,
									}}
									name="modelFileUrl"
									multiple={false}
									accept={modelFormatToFileTypeMap[modelFormat]}
									action={`http://${location.host}/drapi/file/upload`}
									data={{
										business_type: 'model-file',
										user_id: JSON.parse(localStorage.getItem("userInfo")).id
									}}
									headers={{
										Authorization: `token ${localStorage.getItem("token")}`
									}}
									beforeUpload={modelFileBeforeUpload}
									onChange={_data => modelFileHandleChange(_data)}
									onDrop={modelFileUrlOnDrop}
									onRemove={modelFileHandleRemove}
								>
									<div className={"w-full flex flex-col items-center text-sm leading-[14px]"}
									     style={{color: '#B7B7B7'}}>
										<img src={(!modelFileUrl && !mirrorImage) ? UploadSvg : UploadDisabledSvg} alt=""/>
										<span className={"mt-4 flex items-center"}>拖拽到区域或点击上传模型文件</span>
										{
											modelFormat &&
											<div className={"mt-2 flex items-center"}>
												<span className={"flex items-center mr-1"}>仅支持上传{modelFormatToFileTypeMap[modelFormat]}格式文件</span>
												<Popover title={null}
																 placement="rightTop"
																 overlayClassName={'create-model-popover'}
																 trigger="hover"
																 content={ modelFormat!=='other' ? DescriptionComponent({modelFormat}) : null}
												>
													<div className={"flex items-center text-black-light"}>
														<Wenhao/>
													</div>
												</Popover>
											</div>
										}
									</div>
								</Upload.Dragger>
								{
									(modelFileUrl || mirrorImage) &&
									<div className={"absolute w-full h-full bg-main cursor-not-allowed z-30 top-0 left-0"}
											 style={{backgroundColor: 'rgba(0,0,0,0)'}}
											 onClick={modelFileStopUpload}/>
								}
							</div>
						</Form.Item>
						<div style={{height:'30vh'}}
						     className={`w-full ${number === 1 ? '' : 'hidden'}`}>
						</div>
						{/*模型名称*/}
						<Form.Item
							style={{marginTop: '32px'}}
							className={`label-height-38 ${number === 2 ? '' : 'hidden'}`}
							label="模型名称"
							name="modelName"
							rules={[
								{required: true, message: '请输入模型名称'},
								() => ({
									validator(_, value) {
										if (value && value.length > 20) {
											return Promise.reject(new Error('模型名称不能超过20个字符'))
										}
										return Promise.resolve()
									}
								})
							]}
						>
							<Input style={{width: 373}} placeholder={'请输入模型名称'} autoComplete={"off"}/>
						</Form.Item>
						{/*模型封面*/}
						<Form.Item
							className={`${number === 2 ? '' : 'hidden'}`}
							label="模型封面"
							name="modelCoverUrl"
							rules={[
								{required: true, message: '请上传模型封面'},
							]}
						>
							<div className={"relative"}>
								{
									!modelCoverUrl &&
									<div className={"w-[196px] h-[112px]"}>
										<Spin spinning={modelCoverLoading} size="small" tip="上传中...">
											<div
												className="group w-full h-full flex justify-center items-center cursor-pointer relative rounded-lg bg-white border-2 border-dashed border-[#e7eaee] hover:border-main-hover-border transition-all duration-300"
												style={{width: '192px', height: '108px'}}
												onClick={clickUploadModelCover}
											>
												<PlusOutlined
													className="text-[#E1E1E1] group-hover:text-main-hover-border text-[15px] transition-all duration-300"/>
											</div>
										</Spin>
									</div>
								}
								{
									modelCoverUrl &&
									<div className={"w-[196px] h-[112px]"}>
										<Spin spinning={modelCoverLoading} size="small" tip="上传中...">
											<img src={modelCoverUrl} alt=""
													 onClick={clickUploadModelCover}
													 className={"cursor-pointer relative rounded-lg border-2 border-dashed border-[#e7eaee] hover:border-main-hover-border transition-all duration-300"}
													 style={{width: '192px', height: '108px',}}/>
										</Spin>
									</div>
								}
								<span
									className={"mt-2 flex text-xs leading-[12px] text-white-disable-text"}>图片文件类型支持png、jpg、jpeg、bmp等，图片大小不超过2M</span>
							</div>
						</Form.Item>
						{/*模型类型*/}
						<Form.Item
							className={`label-height-38 ${number === 2 ? '' : 'hidden'}`}
							label="模型类型"
							name="modelType"
							rules={[{required: true, message: '请选择模型类型'}]}
						>
							<Select
								size={'large'}
								style={{width: 373}}
								options={modelTypeList}
								placeholder={'请选择模型类型'}
							/>
						</Form.Item>
						{/*分类*/}
						<Form.Item
							className={`label-height-38 ${number === 2 ? '' : 'hidden'}`}
							label="分类"
							name="modelClass"
							rules={[{required: true, message: '请选择分类'}]}
						>
							<div className={"flex items-center my-model-select-type"}>
								<Cascader size={'large'}
								          expandTrigger="hover"
								          dropdownClassName={'my-model-select-type-dropdown'}
								          style={{width: 373}}
								          options={modelClassList}
								          placeholder="请选择分类"
								          onChange={changeModelClass}
								/>
								<Tooltip title={'分类说明目录说明目录说明目录说明目录说明目\u2028录说明目录说明目录说明目录说明目录说明目录\n' +
									'说明目录说明'}
								         overlayClassName={'my-model-table'}>
									<div className={"ml-2 flex items-center text-black-light"}>
										<Wenhao/>
									</div>
								</Tooltip>
							</div>
						</Form.Item>
						{/*icon*/}
						<Form.Item
							className={`label-height-38 ${number === 2 ? '' : 'hidden'}`}
							label="图标"
							name="modelIcon"
							rules={[{required: true, message: '请选择图标'}]}
						>
							<div className={"flex items-center my-model-select-type"}>
								<Cascader size={'large'}
								          value={modelIcon}
								          expandTrigger="hover"
								          dropdownClassName={'my-model-select-type-dropdown-icon'}
								          style={{width: 373}}
								          options={modelIconList}
								          placeholder="请选择图标"
								          onChange={changeModelIcon}
								/>
							</div>
						</Form.Item>
						{/*标签映射*/}
						<Form.Item
							className={`label-height-38 ${number === 2 ? '' : 'hidden'}`}
							label="标签映射"
							name="labelMapping"
						>
							<div className={"flex flex-col"}>
								{
									labelMapping.map((item, index) => {
										return (
											<div key={index} className={"mb-4 w-full flex items-center"}>
												<span className={"flex items-center"}>键：</span>
												<Input autoComplete={"off"} value={item.key}
												       onChange={(e)=>changeLabelMapping(e,index,'key')}
												       style={{width:'150px'}}
												       placeholder={'请输入键'}/>
												<span className={"ml-4 flex items-center"}>值：</span>
												<Input autoComplete={"off"} value={item.value}
												       onChange={(e)=>changeLabelMapping(e,index,'value')}
												       style={{width:'150px'}}
												       placeholder={'请输入值'}/>
												<div className={"ml-4 flex items-center text-black-light cursor-pointer hover:text-red-hover"}
												     onClick={()=>deleteLabelMapping(index)}>
													<DeleteSvg/>
												</div>
											</div>
										)
									})
								}
								<AddLabelMapping click={addLabelMapping}/>
							</div>
						</Form.Item>
						{/*输入格式*/}
						<Form.Item
							className={`label-height-38 ${number === 2 ? '' : 'hidden'}`}
							label="输入格式"
							name="inputType"
							rules={[{required: true, message: '请选择输入格式'}]}
						>
							<Select
								size={'large'}
								style={{width: 373}}
								options={inputTypeList}
								placeholder={'请选择输入格式'}
							/>
						</Form.Item>
						{/*输出格式*/}
						<Form.Item
							className={`label-height-38 ${number === 2 ? '' : 'hidden'}`}
							label="输出格式"
							name="outputType"
							rules={[{required: true, message: '请选择输出格式'}]}
						>
							<Select
								size={'large'}
								style={{width: 373}}
								options={outputTypeList}
								placeholder={'请选择输出格式'}
							/>
						</Form.Item>
						{/*版本信息*/}
						<Form.Item
							className={`label-height-38 ${number === 2 ? '' : 'hidden'}`}
							label="版本信息"
							name="modelVersion"
							rules={[{required: true, message: '请选择版本信息'}]}
						>
							<AutoComplete
								size={'large'}
								options={modelVersionList}
								style={{ width: 373 }}
								placeholder="请选择版本信息"
							/>
						</Form.Item>
						{/*模型简介*/}
						<Form.Item
							className={`label-height-38 ${number === 2 ? '' : 'hidden'}`}
							label="模型简介"
							name="modelSimpleDescription"
							rules={[{required: true, message: '请输入模型简介'}]}
						>
							<Input.TextArea style={{width: '656px', height: '129px'}} showCount maxLength={500}
							                onKeyDown={e => e.stopPropagation()}
							                placeholder={"请输入模型简介"}/>
						</Form.Item>
						{/*模型描述*/}
						<Form.Item
							className={`label-height-100 ${number === 2 ? '' : 'hidden'}`}
							label="模型描述"
							name="modelDescription"
							rules={[{required: true, message: '请输入模型描述'}]}
						>
							<div className={"w-[656px] flex flex-col"}>
								<div className={"w-full flex justify-end items-center"}>
									<ButtonSecond text={'+Markdown'} click={clickAddMarkdownFile}
									              style={{width: '79px', height: '24px', fontSize: '12px', lineHeight: '12px'}}/>
								</div>
								<div style={{width: '656px', height: '335px'}}
								     className={"mt-1"}
								     onKeyDown={e => e.stopPropagation()}>
									<MarkdownEditor value={modelDescription}
									                height={'335px'}
									                change={changeModelDescription}/>
								</div>
							</div>
						</Form.Item>
						{/*下一步*/}
						<div className={`mb-6 w-full flex justify-center items-center ${number === 1 ? '' : 'hidden'}`}>
							<ButtonMain text={'下一步'} click={clickNextStep} style={{width: '87px', height: '32px'}}/>
						</div>
						{/*按钮*/}
						<div className={`mb-7 w-full flex justify-center items-center ${number === 2 ? '' : 'hidden'}`}
						     style={{marginTop: '6.66vh'}}>
							<ButtonSecond style={{width: '86px', height: '32px', lineHeight: '14px'}}
							              text={'上一步'}
							              click={clickBeforeStep}/>
							<ButtonMain className="ml-6"
							            style={{width: '86px', height: '32px', lineHeight: '14px'}}
							            text={'确定'}
							            click={null}/>
						</div>
					</div>
				</Form>
			</div>
			{/*弹框*/}
			<ImageEditorModal title='编辑图片'
			                  show={showImageEditorModal}
			                  data={{imageFile: modelCoverFile}}
			                  onOk={imageEditorModalOnOk}
			                  onCancel={imageEditorModalOnCancel}/>
		</div>
	)
}
