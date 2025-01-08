import {Modal} from "antd";
import React, {useRef, useState} from "react";
import Draggable, {DraggableData, DraggableEvent} from "react-draggable";
import ButtonSecond from "../../../../components/ButtonSecond";
import ButtonMain from "../../../../components/ButtonMain";

export default function ApplyReleaseModal(props) {
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
          提示
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
             wrapClassName="experiment-delete"
             footer={null}
             open={props.show}
             onOk={props.onOk}
             onCancel={props.onCancel}>
        <div className="mt-11 w-full flex justify-center">
          <span className="text-sm text-black">确定要申请发布<span className="text-main pl-1 pr-1">{props?.data?.name}</span>吗?</span>
        </div>
        <div className="mt-12 pb-6 w-full flex justify-center items-center">
          <ButtonSecond text={'取消'} click={props.onCancel} style={{width:'61px',height:'32px'}}/>
          <ButtonMain text={'确定'} className={"ml-4"} click={props.onOk} style={{width:'61px',height:'32px'}}/>
        </div>
      </Modal>
    </Draggable>
  )
}
