import {useEffect, useRef} from "react";
import {Editor} from "@toast-ui/editor";
if (import.meta.env.DEV) {
	import('@toast-ui/editor/dist/toastui-editor.css')
}
import '@/style/markdown.css'

interface IProps {
	value: string
}

export default function MarkdownViewer(props: IProps) {
	// state
	const {value} = props
	const markdownRef = useRef(null)
	const viewer = useRef(null)
	// effect
	useEffect(() => {
		viewer.current = Editor.factory({
			el: markdownRef.current,
			viewer: true,
			height: '600px',
			minHeight: '600px',
			initialValue: value,
		})

		return () => {
			viewer.current!.destroy()
		}
	}, []);
	// methods
	// render
	return (
		// 最外层
		<div className={'w-full'}>
			<div ref={markdownRef} className={'w-full'}></div>
		</div>
	)
}
