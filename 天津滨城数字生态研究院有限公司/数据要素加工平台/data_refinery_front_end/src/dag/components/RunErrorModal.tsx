import React, {useRef, useState} from "react";
import {Modal} from "antd";
import Draggable, {DraggableData, DraggableEvent} from "react-draggable";

export default function RunErrorModal(props) {
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

  const {data} = props
  const errorInfo = data?.errorInfo
  // methods
  // render
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
          {props?.data?.label}
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
             wrapClassName="experiment-xflow-result-error"
             footer={null}
             open={props.show}
             onOk={props.onOk}
             onCancel={props.onCancel}>
        <div className="pt-6 pl-6 pr-6 w-full h-full overflow-auto flex flex-col">
          {/*状态*/}
          <div className="w-full flex items-center text-sm pl-6 border border-white-divide"
               style={{height:'40px',minHeight:'40px',borderRadius:'4px 4px 0px 0px',background:'#F9FAFA'}}>
            <div className="text-black flex items-center">状态：</div>
            <div className="text-red flex items-center">运行失败</div>
          </div>
          {/*错误信息*/}
          <div className="bg-white flex-shrink-0 border-r border-b border-l border-white-divide pt-4 pl-6 pr-6 pb-4 mb-6 w-full text-sm text-black"
               style={{borderRadius:'0 0 4px 4px',minHeight:'162px'}}>
            失败原因：{errorInfo}
          </div>
        </div>
      </Modal>
    </Draggable>

  )
}
