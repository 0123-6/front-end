import React, {useEffect, useRef, useState} from "react";
import {Input, message, Spin, Tooltip} from "antd";
import copy from "copy-to-clipboard";
import DraggableModalPrompt from "../../components/draggable-modal/draggable-modal-prompt";
import RobotSvg from "../../icon/RobotSvg.svg";
import SuccessSvg from "../../icon/SuccessSvg.svg";
import ButtonMain from "../components/ButtonMain";
import newChatSvg from "../../icon/newChatSvg.svg";
import ChatSecondSvg from "../../icon/ChatSecondSvg";
import SendSvg from "../../icon/SendSvg";
import SoundInputSvg from "../../icon/SoundInputSvg";
import EditSvg from "../../icon/EditSvg";
import DeleteSvg from "../../icon/DeleteSvg";
import CloseSvg from "../../icon/CloseSvg";
import {del, get, post} from "../../axios";
import bg2 from "../../icon/bg2.svg";
import {useHistory} from "react-router-dom";
import Answer from "./Answer";
import ViewerTimeout from "../components/ViewerTimeout";
import DefaultAvatarSvg from "../../icon/DefaultAvatarSvg.svg";
import {SyncOutlined} from "@ant-design/icons";
import RecordArea from "../layout/RecordArea";
import LikeOrUnlikeOrCopy from "../components/LikeOrUnlikeOrCopy";

export default function Chat() {
	// state
	// @ts-ignore
	const history = useHistory();
	// 对话问题和回答列表
	const [chatList, setChatList] = useState([]);
	// 政策库加载中
	const [policyLoading, setPolicyLoading] = useState(false);
	// 是否正在对话思考中
	const [isThinking, setIsThinking] = useState(false);
	// 是否input focus
	const [isInputFocus, setIsInputFocus] = useState(false);
	const inputRef = useRef(null)
	// chat页面input value
	const [inputValue, setInputValue] = useState('')
	// 历史记录
	const [historyList,setHistoryList] = useState([])
	// 历史记录加载中
	const [historyLoading,setHistoryLoading] = useState(false)
	// 当前会话id
	const converseId = useRef(null)
	// 是否是新建会话
	const isNewConverse = useRef(true)
	// 历史记录编辑id
	const [historyEditIndex, setHistoryEditIndex] = useState(null)
	// 历史记录删除id
	const historyDeleteIndexRef = useRef(null)
	// 弹框
	const [showDeleteModal, setShowDeleteModal] = useState(false)
	// input history ref
	const historyEditInputRef = useRef(null)
	// 是否登录
	const [isLogin,setIsLogin] = useState(false)
	// 用户信息
	// @ts-ignore
	const [userInfo,setUserInfo] = useState(null)
	// 政策库信息
	const [policyInfo,setPolicyInfo] = useState(null)
	// 语音输入中
	const [recording, setRecording] = useState(false);
	// 语音识别中
	const [recognizing, setRecognizing] = useState(false);
	const mediaRecorder = useRef(null);
	const audioChunks = useRef([]);
	// mounted
	useEffect(() => {
		setChatList([])
		converseId.current = null
		isNewConverse.current = true
	}, []);
	useEffect(()=>{
		const oldUser = JSON.parse(localStorage.getItem('user') || 'null')
		if(oldUser){
			setUserInfo(oldUser?.user_info)
			setIsLogin(true)
		} else {
			history.replace('/login')
		}
		return () => {
			setUserInfo(null)
			setIsLogin(false)
		}
	},[])
	useEffect(() => {
		if (isLogin) {
			getHistory()
		}
	}, [isLogin]);
	useEffect(() => {
		isNewConverse.current = chatList.length === 0;
		if (chatList.length > 0 && !isThinking) {
			const last = chatList[chatList.length - 1];
			if (last.answer === null && last?.stopGenerate!==true) {
				setIsThinking(true)
				getAnswer(last.question)
			}
			const div = document.getElementById('layoutRef')
			div.scrollTo(0, div.scrollHeight);
		}
	}, [chatList]);
	useEffect(()=>{
		getPolicyInfo()
	},[])
	// methods
	// get政策库信息
	const getPolicyInfo = async () => {
		setPolicyLoading(true)
		const {data} = await get('/chat/city/config')
		setPolicyInfo(data)
		setPolicyLoading(false)
	}
	// 获取历史记录
	const getHistory = async (showLoading=true) => {
		// 判断是否登录
		if(!isLogin) {
			// message.error('请先登录')
			return
		}
		const params = {
			page_num: 1,
			page_size: 10000,
		}
		if(showLoading) {
			setHistoryLoading(true)
		}
		const {data} = await get('/chat/converse', params)
		setHistoryList(data.list)
		setHistoryLoading(false)
	}
	// 获取答案接口
	const getAnswer = async (question) => {
		const params = {
			prompt: question,
			converse_id: converseId.current,
		}
		let data = null
		try {
			// 如果chatList的长度>10,则不再请求接口，前端自己生成
			if (chatList.length > 10) {
				data = {
					response: '对不起，单次会话只支持10个提问，请点击“新建会话”再向我提问~',
				}
			} else {
				const res = await post('/chat/chat', params)
				data = res.data
			}
		} catch (errorRes) {
			console.log('chat errorRes: ',errorRes)
			data = {
				response: '后端异常，请稍后再试',
			}
		}
		// chatList可能不是最新的，所以要重新获取
		const newChatList = [...chatList]
		// 如果这个问题已经停止生成，就不要再更新了
		if (newChatList[newChatList.length - 1]?.stopGenerate) {
			return
		}
		// 如果isNewConverse.current，说明是新建会话，忽略回答
		if (isNewConverse.current) {
			console.log('新建会话，忽略回答')
			return
		}
		// 如果converseId存在，而且converseId不等于data.converse_id，说明点击了历史记录，忽略回答
		if (converseId.current && converseId.current !== data.converse_id) {
			console.log('点击了历史记录，忽略回答')
			return
		}
		newChatList[newChatList.length - 1].answer = data.response
		newChatList[newChatList.length - 1].id = data.question_id
		newChatList[newChatList.length - 1].relation_zc = data.relation_zc
		newChatList[newChatList.length - 1].justShow = false
		// 如果是第一次对话，记录会话id，更新历史记录
		if(converseId.current === null) {
			converseId.current = data.converse_id
			getHistory(false)
		}
		setChatList(newChatList)
	}
	const onKeyDown = (e) => {
		if (e.keyCode === 13) {
			e.stopPropagation()
			e.preventDefault()
			let value = e.target.value;
			// 没有登录
			if(!isLogin) {
				message.error('请先登录')
			} else if (value && !isThinking) {
				addQuestion(value)
				e.target.value = '';
				handleInput()
				setInputValue('')
			}
		}
	}
	// 添加问题
	const addQuestion = (question) => {
		// 没有登录
		if(!isLogin) {
			message.error('请先登录')
		} else if(!isThinking && question!==undefined && question!==null && question!=='') {
			setChatList([...chatList,{
				id: null,
				question,
				answer: null,
				like: 0,
			}])
		}
	}
	const clickStopThinking = () => {
		setIsThinking(false);
		// 更新chatList,将最后一个问题的stopGenerate设置为true
		const newChatList = [...chatList]
		newChatList[newChatList.length - 1].stopGenerate = true
		setChatList(newChatList)
	}
	// 重新提问
	const clickReAddQuestion = () => {
		// 将chatList的最后一个问题作为新问题重新问
		const last = chatList[chatList.length - 1];
		const question = last.question;
		setChatList([...chatList, {
			id: null,
			question,
			answer: null,
			like: 0,
		}])
	}
	const clickAddQuestion = (e) => {
		if(e) {
			e.stopPropagation()
			e.preventDefault()
		}
		let value = inputRef.current.value;
		// 没有登录
		if(!isLogin) {
			message.error('请先登录')
		} else if (value && !isThinking) {
			addQuestion(value)
			inputRef.current.value = '';
			handleInput()
			setInputValue('')
		}
	}
	const clickTip = (tip) => {
		addQuestion(tip)
	}
	const setInputFocus = () => {
		inputRef.current.focus()
		setIsInputFocus(true)
	}

	const handleStartRecording = async (e) => {
		e.stopPropagation()
		e.preventDefault()
		if(!isLogin) {
			message.error('请先登录')
			return
		}
		if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
			console.log('浏览器不支持录音功能');
			message.error('浏览器不支持录音功能')
			return;
		}
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			mediaRecorder.current = new MediaRecorder(stream);
			mediaRecorder.current.ondataavailable = e => {
				console.log('ondataavailable:', e.data)
				if (e.data.size > 0) {
					audioChunks.current.push(e.data);
				}
			};
			mediaRecorder.current.onstop = async () => {
				const file = new File(
					audioChunks.current,
					`my-file.${mediaRecorder.current.mimeType.match(/\/([\w\d]+);?/)[1]}`,
					{ type: mediaRecorder.current.mimeType }
				);
				const params = {
					file: file
				}
				setRecording(false);
				setRecognizing(true)
				const {data} = await post('/chat/speech/recognition', params, {headers: {'Content-Type': 'multipart/form-data'}})
				setRecognizing(false)
				// 最长只能输入150个字符
				inputRef.current.value = (inputRef.current.value + data?.text).slice(0, 150)
				setInputValue(inputRef.current.value)
				handleInput()
				inputRef.current.focus()
				setIsInputFocus(true)
				audioChunks.current = [];
			};
			mediaRecorder.current.start();
			setRecording(true);
		} catch (error) {
			console.error('获取麦克风权限失败:', error);
			message.error('获取麦克风权限失败')
		}
	};

	const handleStopRecording = (_e=null) => {
		if (mediaRecorder) {
			mediaRecorder.current.stop();
		}
	};

	// 处理输入框高度
	const handleInput = () => {
		const textarea = inputRef.current
		textarea.style.height = 'auto'; // 先重置高度
		textarea.style.height = (textarea.scrollHeight<=300?textarea.scrollHeight:300) + 'px'; // 设置高度为内容的实际高度
	};
	const clickNewChat = () => {
		setIsThinking(false)
		setChatList([])
		converseId.current = null
		inputRef.current.value = ''
		setInputValue('')
		// 输入框获取焦点
		// setInputFocus()
		setHistoryEditIndex(null)
	}
	// 点击了历史记录
	const clickHistory = async (index) => {
		setIsThinking(false)
		// 获取历史记录详情
		const {data} = await get(`/chat/converse/${historyList[index].id}`)
		// 先清空对话列表
		setChatList([])
		setChatList(JSON.parse(JSON.stringify(data.question_list)))
		converseId.current = historyList[index].id
	}
	// 问题点击
	const clickLikeOrUnlikeOrCopyQuestion = async (item, name, _index) => {
		if (name === '复制') {
			copy(item.question)
			message.success('复制成功')
		}
	}
	// 点击了点赞或者踩或者复制,其中name为点赞，踩，复制，或null代表取消点赞或者踩
	const clickLikeOrUnlikeOrCopyAnswer = async (item, name, index) => {
		if (name === '复制') {
			copy(item.answer)
			message.success('复制成功')
		} else {
			const params = {
				question_id: item.id,
				like: name === '点赞' ? 1 : (name === '踩' ? -1 : 0),
			}
			await post('/chat/question/like', params)
			// 更新chatList
			const newChatList = [...chatList]
			newChatList[index].like = name === '点赞' ? 1 : (name === '踩' ? -1 : 0)
			setChatList(newChatList)
		}
	}
	// 点击了历史记录的编辑
	const clickHistoryEdit = (e,index) => {
		e.stopPropagation()
		e.preventDefault()
		setHistoryEditIndex(index)
	}
	// 历史记录编辑保存
	const historyEditOnKeyDown = (e) => {
		if (e.keyCode === 13) {
			historyEditOnOk(e)
		}
	}
	const historyEditOnOk = async (e) => {
		e.stopPropagation()
		e.preventDefault()
		// console.log('historyEditInputRef.current: ',historyEditInputRef.current)
		const params = {
			id: historyList[historyEditIndex].id,
			title: historyEditInputRef.current.input.value,
		}
		await post('/chat/converse', params)
		// message.success('修改成功')
		// 直接更新历史记录
		const newHistoryList = [...historyList]
		newHistoryList[historyEditIndex].title = historyEditInputRef.current.input.value
		setHistoryList(newHistoryList)
		setHistoryEditIndex(-1)
	}
	const historyEditOnCancel = (e) => {
		e.stopPropagation()
		e.preventDefault()
		setHistoryEditIndex(-1)
	}
	// 点击了历史记录删除
	const clickHistoryDelete = (e,index) => {
		e.stopPropagation()
		e.preventDefault()
		historyDeleteIndexRef.current = index
		setShowDeleteModal(true)
	}
	const deleteModalOnOk = async () => {
		// 当前对话不可删除
		if (historyList[historyDeleteIndexRef.current].id === converseId.current) {
			message.error('不可删除正在进行的当前对话')
			setShowDeleteModal(false)
			historyDeleteIndexRef.current = -1
			return
		}
		const params = {
			id: historyList[historyDeleteIndexRef.current].id,
		}
		await del(`/chat/converse/${params.id}`,null)
		message.success('删除成功')
		getHistory()
		setShowDeleteModal(false)
		historyDeleteIndexRef.current = -1
	}
	const deleteModalOnCancel = () => {
		setShowDeleteModal(false)
		historyDeleteIndexRef.current = -1
	}
	// 点击了关联知识点
	const clickRelationZc = (id) => {
		// 跳转到search detail页面
		window.open(location.origin + `/search/detail/${id}?source=chat`)
	}
	const answerOnOk = () => {
		setIsThinking(false)
	}
	// render
	return (
		<div>
			<>
				{/*内容区域*/}
				<div className={"flex flex-col relative"}
				     style={{
					     width: '71.15vw',
					     minWidth: '630px',
					     paddingLeft:'8.8vw',
					     marginTop:'17vh',
					     marginBottom:'30vh',
				     }}>
					{/*对话区域*/}
					<span className={"w-full flex justify-center font-bold text-black-dark text-[24px]"}
					      style={{}}>您可以这样问我</span>
					{/*提示语区域*/}
					{/*正在加载*/}
					{
						policyLoading &&
						<Spin spinning={policyLoading} size="default" tip="加载中...">
							<div className={"w-full"} style={{height: 'calc(27.76vh + 70px)'}}/>
						</Spin>
					}
					{/*加载完成*/}
					{
						!policyLoading && policyInfo &&
						<div className={"w-full grid grid-cols-3 gap-[24px]"}
								 style={{marginTop:'5.83vh'}}>
							{
								policyInfo?.question_list?.map((item, index) => (
									<div key={index}
										// pt-[22px] pb-[22px]
										   className={`w-full bg-white rounded-2xl p-[20px] text-base leading-6 text-black-dark flex items-center hover:shadow-[0px_2px_8px_0px_rgba(217,222,238,1)] ${!isThinking?'cursor-pointer':'cursor-not-allowed'}`}
										   style={{
											   height: '13.88vh',
											   minHeight: '128px',
										   }}
										   onClick={_e=>clickTip(item)}
									>
										<span className={"text-hidden-5"}>{item}</span>
									</div>
								))
							}
						</div>
					}
					{/*对话区域内容*/}
					<div className={"w-full flex flex-col"}>
						{
							chatList.map((item, index) => (
								<div key={index}
								     className={"w-full flex flex-col"}>
									{/*问题*/}
									<div className={"mt-[43px] w-full flex justify-end items-start"}>
										{/*问题*/}
										<div className={"rounded-2xl flex justify-center items-center pt-[10px] pb-[10px] pl-[34px] pr-[34px] relative group"}
										     style={{
											     backgroundImage: 'linear-gradient(-47deg, #2554FF 2%, #53A9FF 100%)',
											     boxShadow: '0px 2px 8px 0px rgba(217,222,238,0.5)',
											     maxWidth:'70.25%',
										     }}>
											<span className={"text-base leading-6 text-white break-all"}>{item.question}</span>
											<LikeOrUnlikeOrCopy click={name => clickLikeOrUnlikeOrCopyQuestion(item, name, index)}
											                    onlyShowCopy={true}
											                    className={"hidden group-hover:flex absolute right-0 top-[-50px]"}/>
										</div>
										{/*头像*/}
										<div className="ml-2 rounded-full overflow-hidden outline-2 outline outline-white-divide"
										     style={{width:'48px',minWidth:'48px',height:'50px',minHeight:'50px'}}>
											<img className="avatar" src={userInfo?.avatar ? userInfo?.avatar : DefaultAvatarSvg} alt="" style={{width:'100%',height:'100%'}}/>
										</div>
									</div>
									{/*回答*/}
									{/*停止生成针对的是某一个具体问题，不可以影响其它问题，不宜作为全局变量，应该作为某一个问题的私有属性*/}
									<Answer item={item}
									        index={index}
									        clickRelationZc={clickRelationZc}
									        clickLikeOrUnlikeOrCopy={clickLikeOrUnlikeOrCopyAnswer}
									        onOk={answerOnOk}
									/>
									{/*点赞，踩*/}
									{
										item.like!==0 &&
										<div className={"mt-5 w-full flex items-start"}>
											<div className={"h-[64px] min-h-[64px] flex flex-col mr-[9px]"}>
												<img src={RobotSvg} alt=""/>
											</div>
											<div className={"bg-white rounded-2xl flex items-center pt-[20px] pr-[24px] pb-[20px] pl-[24px] my-viewer"}
													 style={{
												     maxWidth:'70.25%',
												     boxShadow: '0px 2px 8px 0px rgba(217,222,238,1)',
											     }}
											>
												{item.like===1 && <ViewerTimeout content={'很高兴您喜欢这个答案'} justShow={item?.justShow}/>}
												{item.like===-1 && <ViewerTimeout content={'感谢您的提醒'} justShow={item?.justShow}/>}
											</div>
										</div>
									}
								</div>
							))
						}
					</div>
				</div>
				{/*顶部模糊图片区域*/}
				{/*<div className={"fixed top-0 left-0 right-0 z-40"}>*/}
				{/*  <PatternGlueTopSvg/>*/}
				{/*</div>*/}
				{/*底部模糊图片区域*/}
				{/*<div className={"fixed bottom-[5px] left-0 right-0"}>*/}
				{/*  <PatternGlueBottomSvg/>*/}
				{/*</div>*/}
				{/*底部固定区域*/}
				<div className={"fixed bottom-[5px] left-0 right-0 flex flex-col"}
				     style={{
					     width: '71.15vw',
					     minWidth: '630px',
				     }}>
					<div className={"w-full flex flex-col"}
					     style={{
						     paddingLeft:'8.8vw',
					     }}>
						{/*停止生产等按钮*/}
						{
							isThinking &&
							<div className={"w-full flex justify-center items-center"}>
								<ButtonMain text={
									<div className={"flex items-center"}>
										<div className={"w-[16px] h-[16px] bg-main rounded-sm"}/>
										<span className={"ml-1.5 flex items-center"}>停止生成</span>
									</div>
								} click={clickStopThinking} className={"w-[139px] h-[44px]"}/>
							</div>
						}
						{/*重新回答按钮*/}
						{
							!isThinking && chatList.length>0 &&
							<div className={"w-full flex justify-center items-center"}>
								<ButtonMain click={clickReAddQuestion}
														disabled={chatList.length >= 10}
								            className={"w-[139px] h-[44px]"}
								            text={
																	<div className={"flex items-center"}>
																		<SyncOutlined style={{fontSize: '16px'}}/>
																		<span className={"ml-1.5 flex items-center"}>重新回答</span>
																	</div>
														}/>
							</div>
						}
						{/*输入框*/}
						<div className="mt-[29px] w-full min-h-[60px] flex items-end z-20 relative bg-cover"
						     style={{
							     backgroundImage: `url(${bg2})`,
						     }}>
							{/*新建对话按钮*/}
							<div className={`${!isInputFocus?'w-[153px]':'w-[75px]'} h-[60px] flex justify-center items-center rounded-2xl cursor-pointer bg-white`}
							     style={{
								     boxShadow: '0px 2px 8px 0px rgba(217,222,238,1)',
								     transition: 'all 0.3s',
							     }}
							     onClick={clickNewChat}
							>
								<img src={newChatSvg} alt=""/>
								{
									<span className={`${!isInputFocus?'w-[78px] pl-[14px]':'w-0'} text-base font-medium overflow-hidden flex`}
												style={{
										      backgroundImage: 'linear-gradient(-47deg, #2554FF 50%, #53A9FF 100%)',
										      backgroundClip: 'text',
										      WebkitBackgroundClip: 'text',
										      color: 'transparent',
													transition: 'all 0.3s',
													whiteSpace: 'nowrap',
									      }}>新建会话</span>
								}
							</div>
							{/*输入框*/}
							<div className={`ml-[21px] flex-1 min-h-[60px] flex justify-between items-start bg-white rounded-2xl pl-6 pr-5 pt-4 pb-4 ${!(recording || recognizing) ? 'cursor-pointer' : 'cursor-not-allowed'}`}
							     style={{
										 boxShadow: '0px 2px 8px 0px rgba(217,222,238,1)',
							     }}
							     onClick={setInputFocus}
							>
							<span className={"w-[20px] h-[28px] text-black-light flex items-center"}>
								{
									!(recording || recognizing) &&
									<ChatSecondSvg/>
								}
							</span>
								<div className={"flex-1 flex flex-col"}>
									<div className={"w-full min-h-[28px] flex items-center"}>
                    <textarea ref={inputRef}
                              disabled={(recording || recognizing)}
                              maxLength={150}
                              rows={1} // 设置初始行数为1
                              autoComplete="off"
                              className={`ml-3 flex-1 ${!(recording || recognizing) ? '' : 'hidden'}`}
                              placeholder={"有问题尽管问我…"}
                              onKeyDown={onKeyDown}
                              onBlur={()=>setIsInputFocus(false)}
                              onChange={e => setInputValue(e.target.value)}
                              onInput={handleInput} // 添加onInput事件处理函数
                              style={{ resize: "none",overflowY: "auto",overflowX:'hidden',height:'22px',lineHeight:'22px' }} // 隐藏右下角的斜线
                    />
										<span className={`text-base text-black-dark mb-4 ${!(recording || recognizing) ? 'hidden' : 'w-full flex justify-center items-center'}`}>{recognizing?'正在识别…':'正在听您说…'}</span>
									</div>
									{
										(recording || recognizing) &&
										<div className={"w-full flex justify-center items-center relative h-[34px]"}>
											{
												recording &&
												<div className={"w-full flex justify-center items-center relative"}>
													<div className={"relative flex justify-center items-center w-[34px] h-[34px] text-white text-[24px] mic-icon bg-white border border-main cursor-pointer"}
															 style={{
														     borderRadius: '50%',
														     transition: 'all 0.3s ease-in-out',
													     }}
															 onClick={handleStopRecording}
													>
														<div className={"flex justify-center items-center text-main w-[20px] h-[20px]"}>
															<SoundInputSvg/>
														</div>
													</div>
												</div>
											}
											{
												recognizing &&
												<div className={"w-full flex justify-center items-center relative h-[34px]"}>
													<div className={"dot"}/>
													<div className={"dot"}/>
													<div className={"dot"}/>
													<div className={"dot"}/>
													<div className={"dot"}/>
												</div>
											}
										</div>
									}
								</div>
								<div className={`w-[26px] h-[28px] flex items-center ${(inputValue && !isThinking)?'cursor-pointer text-main':'cursor-not-allowed text-[#E5E5E5]'} ${!(recording || recognizing)?'':'cursor-not-allowed'}`}
								     onClick={!(recording || recognizing) ? clickAddQuestion : null}>
									{
										!(recording || recognizing) &&
										<SendSvg/>
									}
								</div>
								<div className={`ml-4 w-[26px] h-[28px] flex items-center text-[#E5E5E5] ${!isThinking?'cursor-pointer hover:text-main':'cursor-not-allowed text-[#E5E5E5]'} ${!(recording || recognizing)?'':'cursor-not-allowed'}`}
								     onClick={!(recording || recognizing) ? handleStartRecording : null}>
									{
										!(recording || recognizing) &&
										<SoundInputSvg/>
									}
								</div>
							</div>
						</div>
					</div>
					{/*底部备案区域*/}
					<div className="flex justify-center items-center bg-[#edf3fe]"
					     style={{height:'40px',minHeight:'40px',width:'calc(100vw - 5px)'}}>
						<RecordArea/>
					</div>
				</div>
				{/*悬浮右边区域，宽度过小不展示*/}
				<div className={"hidden normal:flex fixed right-6 flex-col"}
				     style={{
					     width: '19vw',
					     minWidth: '220px',
					     top: '17vh',
				     }}>
					<span className={"text-base text-black-dark font-medium"}>最近会话</span>
					{/*最近会话加载中*/}
					{
						historyLoading &&
						<Spin spinning={historyLoading} size="default" tip="加载中...">
							<div className={"w-full"} style={{height: '400px'}}/>
						</Spin>
					}
					{/*最近会话加载完成*/}
					{
						!historyLoading &&
						<div className={"mt-[14px] w-full flex flex-col bg-[#F7FAFF] rounded-lg pl-1 pr-1 overflow-y-auto"}
						     style={{
							     boxShadow: '0px 2px 4px 0px rgba(198,198,198,0.5)',
							     maxHeight: '69.72vh',
						     }}>
							{
								historyList.map((item,index)=>(
									<div className={`w-full h-[45px] flex-shrink-0 flex items-center text-sm text-black-dark cursor-pointer ${index>0?'border-t border-[#F5F5F5]':''} group`}
									     key={index}
									     onClick={()=>clickHistory(index)}
									>
										<div className={`w-full h-[38px] flex items-center rounded-lg
                                    group-hover:bg-white group-hover:shadow-[0px_0px_2px_0px_rgba(198,198,198,0.5)]
                                    ${index===historyEditIndex?'bg-white shadow-[0px_0px_2px_0px_rgba(198,198,198,0.5)]':''}
                                 `}>
											<div className={`mr-[5px] w-[5px] h-full group-hover:bg-main
                          ${index===historyEditIndex?'bg-main':''}`}
											     style={{borderRadius:'8px 0 0 8px'}}/>
											{
												index !== historyEditIndex &&
												<>
													<span className={"flex-1 text-hidden"}>{item?.title}</span>
													<span className={"flex items-center group-hover:hidden text-black-light"}>{item?.created_at}</span>
													<Tooltip title={'编辑'}
																	 overlayClassName={"like-or-unlike-or-copy"}>
														<div className={`w-[28px] h-[28px] rounded hidden group-hover:flex justify-center items-center text-black hover:bg-[#F7F7F7] hover:text-main`}
																 onClick={(e)=>clickHistoryEdit(e,index)}>
															<EditSvg/>
														</div>
													</Tooltip>
													<Tooltip title={'删除'}
																	 overlayClassName={"like-or-unlike-or-copy"}>
														<div className={`ml-1 mr-1 w-[28px] h-[28px] rounded hidden group-hover:flex justify-center items-center text-black hover:bg-[#F7F7F7] hover:text-red`}
																 onClick={(e)=>clickHistoryDelete(e,index)}>
															<DeleteSvg/>
														</div>
													</Tooltip>
												</>
											}
											{
												index === historyEditIndex &&
												<>
													<Input autoComplete="off"
																 autoFocus
																 defaultValue={item?.title}
																 className={"flex-1"}
																 style={{
														       fontSize:'14px',
														       lineHeight: '14px',
														       height:'26px',
														       border:'1px solid rgba(37,84,255,1)',
														       borderRadius:'8px',
														       color: '#262626',
													       }}
																 onClick={(e)=>e.stopPropagation()}
																 onKeyDown={(e)=>historyEditOnKeyDown(e)}
																 ref={historyEditInputRef}
													/>
													<Tooltip title={'保存'}
																	 overlayClassName={"like-or-unlike-or-copy"}>
														<div className="ml-1 w-[28px] h-[28px] rounded flex justify-center items-center text-black hover:bg-[#F7F7F7] hover:text-main"
																 onClick={(e)=>historyEditOnOk(e)}>
															<img src={SuccessSvg} alt=""/>
														</div>
													</Tooltip>
													<Tooltip title={'取消'}
																	 overlayClassName={"like-or-unlike-or-copy"}>
														<div className="mr-1 w-[28px] h-[28px] rounded flex justify-center items-center text-black hover:bg-[#F7F7F7] hover:text-main"
																 onClick={(e)=>historyEditOnCancel(e)}>
															<CloseSvg/>
														</div>
													</Tooltip>
												</>
											}
										</div>
									</div>
								))
							}
						</div>
					}
				</div>
			</>
			{/*删除弹框*/}
			<DraggableModalPrompt
				show={showDeleteModal}
				onOk={deleteModalOnOk}
				onCancel={deleteModalOnCancel}>
				<span className="text-base text-black-dark flex items-center">确定删除<span className="max-w-[180px] text-main pl-1 pr-1 text-hidden">{historyList[historyDeleteIndexRef.current]?.title}</span>会话吗？</span>
			</DraggableModalPrompt>
		</div>
	)
}
