import {InputNumber, Modal} from "antd";
import React, {useEffect, useRef, useState} from "react";
import Draggable, {DraggableData, DraggableEvent} from "react-draggable";

export default function ApplyModal(props) {
  // draggable
  const [disabled, setDisabled] = useState(true);
  const [bounds, setBounds] = useState({ left: 0, top: 0, bottom: 0, right: 0 });
  const draggleRef = useRef<HTMLDivElement>(null);
  const onStart = (_event: DraggableEvent, uiData: DraggableData) => {
    const { clientWidth, clientHeight } = window.document.documentElement;
    const targetRect = draggleRef.current?.getBoundingClientRect();
    if (!targetRect) {
      return;
    }
    setBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y),
    });
  };

  // state
  const [cpu,setCpu] = useState(1)
  const [gpu,setGpu] = useState(0)
  const [memory,setMemory] = useState(1)
  // mounted
  useEffect(() => {
    if (props.show) {
      setCpu(1)
      setGpu(0)
      setMemory(1)
    }
  },[props.show])

  // methods
  const onOk = () => {
    props.onOk({cpu,gpu,memory})
  }

  return (
    <Draggable>
      <Modal title={
        <div
          style={{
            width: '100%',
            cursor: 'move',
            padding: '12px 24px',
          }}
          onMouseOver={() => {
            if (disabled) {
              setDisabled(false);
            }
          }}
          onMouseOut={() => {
            setDisabled(true);
          }}
          // fix eslintjsx-a11y/mouse-events-have-key-events
          // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/mouse-events-have-key-events.md
          onFocus={() => {}}
          onBlur={() => {}}
          // end
        >
          申请
        </div>
      }
             modalRender={(modal) => (
               <Draggable
                 disabled={disabled}
                 bounds={bounds}
                 onStart={(event, uiData) => onStart(event, uiData)}
               >
                 <div ref={draggleRef}>{modal}</div>
               </Draggable>
             )}
             centered
             maskStyle={{}}
             bodyStyle={{}}
             destroyOnClose
             wrapClassName="api-serve-apply-modal"
             footer={null}
             open={props.show}
             onOk={onOk}
             onCancel={props.onCancel}>
        <div className="mt-6 w-full flex flex-col">
          <div className={"w-full flex items-center"}>
            <span className={'flex justify-end'} style={{width:'55px'}}>名称: </span>
            <span className={"ml-4 text-main"}>{props?.data?.name}</span>
          </div>
          {/*实例配置*/}
          <div className={"mt-4 "}>实例配置</div>
          {/*cpu*/}
          <div className={"mt-4 w-full flex items-center"}>
            <span className={"w-1/6 pr-4 flex justify-end"}>CPU</span>
            <InputNumber className={"w-5/6"} min={0} max={10} value={cpu} onChange={value => setCpu(Number(value))} />
          </div>
          {/*gpu*/}
          <div className={"mt-4 w-full flex items-center"}>
            <span className={"w-1/6 pr-4 flex justify-end"}>GPU</span>
            <InputNumber className={"w-5/6"} min={0} max={10} value={gpu} onChange={value => setGpu(Number(value))} />
          </div>
          {/*Memory*/}
          <div className={"mt-4 w-full flex items-center"}>
            <span className={"w-1/6 pr-1 flex justify-end"}>Memory</span>
            <InputNumber className={"w-5/6"} min={0} max={10} value={memory} onChange={value => setMemory(Number(value))} />
          </div>
        </div>
        <div className="mt-8 pb-6 w-full flex justify-center items-center">
          <div className="flex justify-center items-center hover:cursor-pointer rounded text-main hover:text-main-hover active:text-main-focus"
               style={{width:'61px',height:'32px',lineHeight:'14px',border:'1px solid rgba(191,208,224,1)'}}
               onClick={props.onCancel}>取消</div>
          <div className="ml-4 flex justify-center items-center hover:cursor-pointer rounded bg-main hover:bg-main-hover active:bg-main-focus text-sm text-white"
               style={{width:'83px',height:'32px',lineHeight:'14px'}} onClick={onOk}>提交申请</div>
        </div>
      </Modal>
    </Draggable>

  )
}
