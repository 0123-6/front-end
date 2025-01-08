import NotRun from "../../../../icon/table/status/未运行.svg";
import Stop from "../../../../icon/table/status/已停止.svg";
import RunError from "../../../../icon/table/status/运行失败.svg";
import RunSuccess from "../../../../icon/table/status/运行成功.svg";
import React from "react";

interface Iprops {
	status: string,
}

export default function StatusShow(props: Iprops) {
	const {status} = props
	return (
		<span style={{width: '85px', height: '23px'}}
		      className={`inline-flex  items-center rounded-xl pl-2
                ${status === '未申请' ? 'text-status-notrun bg-status-notrun-bg' : ''}
                ${status === '待审核' ? 'text-status-stop bg-status-stop-bg' : ''}
                ${status === '已上线' ? 'text-status-success bg-status-success-bg' : ''}
                ${status === '已驳回' ? 'text-status-error bg-status-error-bg' : ''}
                ${status === '已下线' ? 'text-status-notrun bg-status-notrun-bg' : ''}
              `}>
          {
	          status === '未申请' &&
						<img src={NotRun} alt="" style={{width: '14px', height: '14px'}}/>
          }
			{
				status === '待审核' &&
				<img src={Stop} alt="" style={{width: '14px', height: '14px'}}/>
			}
			{
				status === '已驳回' &&
				<img src={RunError} alt="" style={{width: '14px', height: '14px'}}/>
			}
			{
				status === '已上线' &&
				<img src={RunSuccess} alt="" style={{width: '14px', height: '14px'}}/>
			}
			{
				status === '已下线' &&
				<img src={NotRun} alt="" style={{width: '14px', height: '14px'}}/>
			}
			<span className={"ml-1 inline-flex items-center text-xs font-semibold"}>{status}</span>
        </span>
	)
}
