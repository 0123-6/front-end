import React, {useEffect, useState} from "react";
import RobotSvg from "../../icon/RobotSvg.svg";
// import SuccessSvg from "../../icon/SuccessSvg.svg";
import ViewerTimeout from "../components/ViewerTimeout";
import LikeOrUnlikeOrCopy from "../components/LikeOrUnlikeOrCopy";

interface IProps {
	item: any;
	index: number;
	clickRelationZc: (id: number) => void;
	clickLikeOrUnlikeOrCopy: (item: any, name: string, index: number) => void;
	onOk?: () => void;
}

export default function Answer(props:IProps) {
	// state
	const {item,index,clickRelationZc,clickLikeOrUnlikeOrCopy,onOk} = props;
	// 是否答案显示完毕
	const [showFinished, setShowFinished] = useState(false);
	// ...显示数量,最少1个，最多3个
	// const [showNum, setShowNum] = useState(1);
	const [text, setText] = useState('.')
	// mounted
	useEffect(() => {
		if (item.answer===null) {
			const timer = setInterval(() => {
				setText(text => {
					if (text.length===3) {
						return '.'
					} else {
						return text + '.'
					}
				})
			}, 500);
			return () => {
				clearInterval(timer)
			}
		}
	}, [item]);
	// methods
	const showOnOk = () => {
		setShowFinished(true);
		if (onOk) {
			onOk()
		}
	}
	// render
	return (
		<div className={"w-full flex flex-col"}>
			{
				(!item?.stopGenerate || item.answer!==null) &&
				<div className={"mt-5 w-full flex items-start"}>
					<div className={"h-[64px] min-h-[64px] flex flex-col mr-[9px]"}>
						<img src={RobotSvg} alt=""/>
					</div>
					{
						item.answer===null &&
						<div className={"h-[48px] flex items-center"}>
							{/*<img src={SuccessSvg} alt=""/>*/}
							{/*ml-3*/}
							<span className={"text-black text-base"}>正在为您生成答案{text}</span>
						</div>
					}
					{/*回答*/}
					{
						!(item.answer===null) &&
						<div className={"bg-white rounded-2xl flex flex-col pt-[20px] pr-[24px] pb-[20px] pl-[24px] my-viewer relative group"}
								 style={{
							     maxWidth:'70.25%',
							     boxShadow: '0px 2px 8px 0px rgba(217,222,238,1)',
						     }}
						>
							<ViewerTimeout content={item.answer}
														 justShow={item?.justShow}
														 onOk={showOnOk}
														 stopGenerate={item?.stopGenerate}
							/>
							{
								(item?.justShow===undefined || showFinished) && item?.relation_zc?.length>0 &&
								<div className={"mt-1 w-full border-t border-white-divide flex flex-wrap"}>
									<span className={"mt-2 mr-2 h-[28px] flex items-center text-base text-black-dark font-bold"}>参考信息:</span>
									{
										item?.relation_zc?.map((item,index)=>(
											<div key={index}
											     onClick={_e => clickRelationZc(item.id)}
											     className={"mt-2 mr-2 max-w-[187px] pl-1 pr-1 h-[28px] flex items-center bg-[#d8e0ff] rounded-lg cursor-pointer"}>
												<span className={"flex items-center text-sm text-main text-hidden"}>{item?.title}</span>
											</div>
										))
									}
								</div>
							}
							{
								item?.id &&
								<LikeOrUnlikeOrCopy click={name => clickLikeOrUnlikeOrCopy(item, name, index)}
																		like={item.like}
																		className={"hidden group-hover:flex absolute right-0 top-[-50px]"}/>
							}
						</div>
					}
				</div>
			}
		</div>

	)
}
