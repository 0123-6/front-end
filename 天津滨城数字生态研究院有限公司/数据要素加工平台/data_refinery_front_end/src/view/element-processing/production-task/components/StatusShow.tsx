import NotRun from "../../../../icon/table/status/未运行.svg";
import Stop from "../../../../icon/table/status/已停止.svg";
import Running from "../../../../icon/table/status/运行中.svg";
import RunError from "../../../../icon/table/status/运行失败.svg";
import RunSuccess from "../../../../icon/table/status/运行成功.svg";
import React from "react";

interface IProps {
	status: string,
}

export default function StatusShow(props: IProps) {
	const {status} = props
	return (
		<span style={{width: '85px', height: '23px'}}
		      className={`inline-flex  items-center rounded-xl pl-2
                ${status === '未运行' ? 'text-status-notrun bg-status-notrun-bg' : ''}
                ${status === '已停止' ? 'text-status-stop bg-status-stop-bg' : ''}
                ${status === '运行中' ? 'text-status-running bg-status-running-bg' : ''}
                ${status === '运行失败' ? 'text-status-error bg-status-error-bg' : ''}
                ${status === '运行成功' ? 'text-status-success bg-status-success-bg' : ''}`}>
          {
	          status === '未运行' &&
						<img src={NotRun} alt="" style={{width: '14px', height: '14px'}}/>
          }
			{
				status === '已停止' &&
				<img src={Stop} alt="" style={{width: '14px', height: '14px'}}/>
			}
			{
				status === '运行中' &&
				<img src={Running} alt="" style={{width: '14px', height: '14px'}} className={"rotate"}/>
			}
			{
				status === '运行失败' &&
				<img src={RunError} alt="" style={{width: '14px', height: '14px'}}/>
			}
			{
				status === '运行成功' &&
				<img src={RunSuccess} alt="" style={{width: '14px', height: '14px'}}/>
			}
			<span className={"ml-1 inline-flex items-center text-xs font-semibold"}>{status}</span>
		</span>
	)
}
