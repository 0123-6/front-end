import React from "react";
import DraggableModal, {IDraggableModalProps} from "../../../../components/draggable-modal";
import icon1 from '../icon/icon1.png'
import icon2 from '../icon/icon2.png'
import icon3 from '../icon/icon3.png'

export default function CreateModal(props: IDraggableModalProps) {
	// state
	const {title, show, onOk, onCancel} = props;
	const menuList = [
		{
			name: '新建模型',
			icon: icon1,
			style: {
				backgroundImage: 'linear-gradient(144deg, #FBFFFF 0%, #F8FCFF 100%)',
			},
		},
		{
			name: '基于ModelOS创建',
			icon: icon2,
			style: {
				backgroundImage: 'linear-gradient(144deg, #FFFDFB 0%, #F8FBFF 100%)',
			}
		},
		{
			name: '新建非部署模型',
			icon: icon3,
			style: {
				backgroundImage: 'linear-gradient(144deg, #FEFFFB 0%, #F8FFFF 100%)',
			}
		},
	]
	// methods
	const innerOnOk = (index) => {
		const params = {
			type: index,
		}
		onOk(params)
	}
	// render
	return (
		<DraggableModal title={title}
		                wrapClassName='modal-width-822 modal-height-260'
		                show={show}
		                onCancel={onCancel}>
			<div className={"w-full h-[219px] pl-[42px] pr-[42px] pt-[38px] flex"}>
				{
					menuList.map((item, index) => (
						<div key={index}
						     style={{
									 ...item.style,
							     border: '1px solid rgba(247,247,247,1)',
							     boxShadow: '0px 2px 30px 0px rgba(248,251,253,1)',
							     marginRight:index!==menuList.length-1?'25px':'0px'
								 }}
						     className={"rounded-lg w-[230px] h-[123px] flex flex-col justify-center items-center cursor-pointer"}
						     onClick={_e => innerOnOk(index)}
						>
							<img src={item.icon} alt=""/>
							<span className="mt-2.5 flex items-center text-base leading-4">{item.name}</span>
						</div>
					))
				}
			</div>
		</DraggableModal>
	)
}
