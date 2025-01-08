import {PlusCircleOutlined} from "@ant-design/icons";
import ButtonSecond from "./ButtonSecond";
import React from "react";

interface IProps {
	click: (any) => void
}

export default function AddLabelMapping(props:IProps) {
	const {click} = props
	return (
		<ButtonSecond style={{width: '159px', height: '38px', lineHeight: '14px',borderRadius:'2px'}}
		              className={"text-white-disable-text"}
		              text={
			              <div className={"flex justify-center items-center"}>
				              <PlusCircleOutlined className={""}
				                                  style={{fontSize: '18px'}}/>
				              <span className={"ml-2"}>添加标签映射</span>
			              </div>
		              }
		              click={click}/>
	)
}
