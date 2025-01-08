import {CSSProperties, useEffect, useRef} from "react";
import LazyLoad from "vanilla-lazyload";

const lazyloadInstance = new LazyLoad()

interface IProps {
	src: string
	style?: CSSProperties
	className?: string
}

export default function LazyloadImg(props: IProps) {
	// state
	const {src, style = {}, className = ''} = props
	const imgRef = useRef(null)
	// effect
	useEffect(() => {
		if (imgRef.current) {
			lazyloadInstance.update()
		}
	}, []);
	// methods
	// render
	return (
		<img ref={imgRef}
		     data-src={src}
		     alt=""
		     style={style}
		     className={`lazy ${className}`}
		/>
	)
}
