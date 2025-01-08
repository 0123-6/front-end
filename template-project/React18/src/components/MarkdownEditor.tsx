import {useEffect, useRef} from "react";
import {Editor} from "@toast-ui/editor";
if (import.meta.env.DEV) {
	import('@toast-ui/editor/dist/toastui-editor.css')
}
import '@/style/markdown.css'
import {ableSelectFileByClick, exportFile, ISelectFileProps} from "@/util/file.ts";

Editor.setLanguage('zh-CN', {
	Markdown: 'Markdown',
	WYSIWYG: '所见即所得',
	Write: '编辑',
	Preview: '预览',
	Headings: '标题',
	Paragraph: '文本',
	Bold: '加粗',
	Italic: '斜体字',
	Strike: '删除线',
	Code: '内嵌代码',
	Line: '水平线',
	Blockquote: '引用块',
	'Unordered list': '无序列表',
	'Ordered list': '有序列表',
	Task: '任务',
	Indent: '缩进',
	Outdent: '减少缩进',
	'Insert link': '插入链接',
	'Insert CodeBlock': '插入代码块',
	'Insert table': '插入表格',
	'Insert image': '插入图片',
	Heading: '标题',
	'Image URL': '图片网址',
	'Select image file': '选择图片文件',
	'Choose a file': '选择一个文件',
	'No file': '没有文件',
	Description: '说明',
	OK: '确认',
	More: '更多',
	Cancel: '取消',
	File: '文件',
	URL: 'URL',
	'Link text': '链接文本',
	'Add row to up': '向上添加行',
	'Add row to down': '在下方添加行',
	'Add column to left': '在左侧添加列',
	'Add column to right': '在右侧添加列',
	'Remove row': '删除行',
	'Remove column': '删除列',
	'Align column to left': '左对齐',
	'Align column to center': '居中对齐',
	'Align column to right': '右对齐',
	'Remove table': '删除表格',
	'Would you like to paste as table?': '需要粘贴为表格吗?',
	'Text color': '文字颜色',
	'Auto scroll enabled': '自动滚动已启用',
	'Auto scroll disabled': '自动滚动已禁用',
	'Choose language': '选择语言',
})

interface IProps {
	showImportAndExport: Boolean
}

export default function MarkdownEditor(props: IProps) {
	// state
	const {showImportAndExport = false} = props
	const markdownRef = useRef(null)
	const editor = useRef(null)
	const importMarkdownFileButtonRef = useRef(null)
	// effect
	useEffect(() => {
		editor.current = new Editor({
			el: markdownRef.current,
			height: '600px',
			minHeight: '600px',
			initialEditType: 'markdown',
			previewStyle: 'vertical',
			language: 'zh-CN',
			autofocus: false,
			hooks: {
				async addImageBlobHook(file, callback) {
					callback('https://xxx.xxx.xxx')
				}
			},
		})
		editor.current!.getMarkdown()

		return () => {
			editor.current!.destroy()
		}
	}, []);
	useEffect(() => {
		let cancelFn = null
		if (showImportAndExport) {
			const importProps: ISelectFileProps = {
				element: importMarkdownFileButtonRef.current!,
				accept: '.md,.markdown',
				callback: async file => {
					const text = await file.text()
					editor.current!.setMarkdown(text, false)
				},
				callbackError: text => {
					alert(text)
				},
			}
			cancelFn = ableSelectFileByClick(importProps)
		}

		return () => {
			cancelFn && cancelFn()
		}
	}, []);
	// methods
	function exportMarkdownFile() {
		const text = editor.current!.getMarkdown()
		const newFile = new File([text], '新建markdown.md', {
			type: 'text/markdown',
		})
		exportFile({
			file: newFile,
			callback: () => {
				alert('导出成功')
			},
			callbackError: text => {
				alert(text)
			},
		})
	}
	// render
	return (
		// 最外层
		<div className={'w-full flex flex-col'}>
			{/*上*/}
			<div className={'w-full'}>
				<div ref={markdownRef} className={'w-full'}></div>
			</div>
			{/*下*/}
			{
				showImportAndExport &&
				<div className={'mt-2 w-full flex items-center'}>
					<button ref={importMarkdownFileButtonRef}>导入</button>
					<button className={'ml-4'}
					        onClick={exportMarkdownFile}>导出</button>
				</div>
			}
		</div>
	)
}
