import React, {useEffect, useRef, useState} from "react";
import {Viewer} from "@toast-ui/react-editor";

interface IProps {
	content: string;
	justShow?: boolean;
	onOk?: () => void;
	stopGenerate?: boolean;
}

export default function ViewerTimeout(props:IProps) {
	// state
	const {content,justShow=true,onOk,stopGenerate=false} = props;
	const [displayedText, setDisplayedText] = useState('');
	const currentIndex = useRef(0)
	const timer = useRef(null)
	// mounted
	useEffect(() => {
		if (justShow) {
			setDisplayedText(content);
		} else {
			timer.current = setInterval(() => {
				if (stopGenerate || currentIndex.current >= content.length) {
					clearInterval(timer.current)
					timer.current = null
					console.log('显示完毕，content： ', content);
					onOk && onOk();
				} else if (currentIndex.current < content.length) {
					setDisplayedText(prevText => prevText + content[currentIndex.current]);
					currentIndex.current += 1;
					// 自动将屏幕滚动到底部
					const div = document.getElementById('layoutRef')
					div?.scrollTo(0, div.scrollHeight);
				}
			}, 50);
		}
		return () => {
			clearInterval(timer.current)
		}
	}, []);
	useEffect(() => {
		if (stopGenerate) {
			clearInterval(timer.current)
			timer.current = null
		}
	}, [stopGenerate]);
	// methods
	// render
	return (
		<div key={displayedText}>
			<Viewer initialValue={displayedText}/>
		</div>
	)
}
