import {Form, Input, Modal, Select} from "antd";
import React, {useEffect, useRef, useState} from "react";
import Draggable, {DraggableData, DraggableEvent} from "react-draggable";
import {applicationFieldList} from "../../common";
import {handleKeyDownDisabled} from "../../../../utils/util";
import ButtonSecond from "../../../../components/ButtonSecond";
import ButtonMain from "../../../../components/ButtonMain";

export default function EditModal(props) {
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
  const [form] = Form.useForm();
  // mounted
  useEffect(()=>{
    if (props.show) {
      console.log('props: ',props)
      const params = {
        name: props.data.name,
        application_field: props.data.application_field,
        description: props.data.description
      }
      form.setFieldsValue(params)
    }
  },[props.show])

  const modalEditOk = () => {
    const params = form.getFieldsValue(true)
    props.onOk(params)
  }
  const modalEditCancel = (e) => {
    e.preventDefault()
    props.onCancel()
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
          编辑
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
             destroyOnClose
             maskStyle={{}}
             bodyStyle={{}}
             wrapClassName="offline-packet-edit"
             footer={null}
             open={props.show}
             onCancel={modalEditCancel}>
        <Form
          form={form}
          onFinish={modalEditOk}
          onKeyDown={handleKeyDownDisabled}
        >
          <Form.Item
            label="名称"
            className='label-height-38'
            name="name"
            rules={[{ required: true, message: '请输入实验名称' }]}
          >
            <Input placeholder="请输入实验名称" autoComplete={"off"}/>
          </Form.Item>
          <Form.Item
            label="应用领域"
            className='label-height-38'
            style={{
              position: "relative",
              right: "29px"
            }}
            name="application_field"
            rules={[{ required: true, message: '请选择应用领域' }]}
          >
            <Select
              style={{width:'calc(100% + 29px)'}}
              size={'large'}
              placeholder={'请选择应用领域'}
              options={applicationFieldList}
              mode="multiple" maxTagCount="responsive"
            />
          </Form.Item>
          <Form.Item
            label="简介"
            name="description"
            rules={[{ required: true, message: '请输入实验简介' }]}
          >
            <Input.TextArea maxLength={500} rows={10} showCount
                            onKeyDown={e => e.stopPropagation()}
                            placeholder="请输入实验简介"/>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 0, span: 24 }}>
            <div className="pb-6 w-full flex justify-center items-center">
              <ButtonSecond text={'取消'} click={(e)=>modalEditCancel(e)} style={{width:'61px',height:'32px'}}/>
              <ButtonMain text={'确定'} className={"ml-4"} click={null} style={{width:'61px',height:'32px'}}/>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </Draggable>
  )
}
