import React, {useEffect, useRef} from "react";
import {Editor} from "@toast-ui/editor";
import '@toast-ui/editor/dist/toastui-editor.css';
import './zh-cn.js';
import {EditorOptions} from "@toast-ui/editor/types/editor";
import {post} from "../../../axios";

interface IProps {
  value: string,
  change: (value: string) => void,
  height?: string;
}

export function MarkdownEditor(props:IProps) {
  // state
  const {value, change,height='217px'} = props
  const editor = useRef(null)
  const divRef = useRef(null)
  // effect
  useEffect(()=>{
    const editorOptions:EditorOptions = {
      el: divRef.current,
      initialEditType: 'markdown',
      height,
      language: 'zh-CN',
      autofocus: false,
      initialValue: value,
      hooks: {
        async addImageBlobHook(file, callback) {
          const params = {
            business_type: 'avatar',
            avatar: file,
          }
          const res = await post('/drapi/file/upload', params, {headers: {'Content-Type': 'multipart/form-data'}})
          const url = res.data.urls[0]
          callback(url)
        }

      }
    }
    editor.current = new Editor(editorOptions)
    editor.current.on('change', () => {
      // @ts-ignore
      change(editor.current.getMarkdown())
    });
  },[])
  useEffect(()=>{
    if(editor.current) {
      if(value && (editor.current.getMarkdown() !== value)) {
        editor.current.setMarkdown(value,false)
      }
    }
  },[value])
  // methods
  // render
  return (
    <div ref={divRef}/>
  )
}

