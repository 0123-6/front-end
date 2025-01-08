import React from "react";

interface IProps {
	width?: string;
	height?: string;
}

export default function DataManagementSvg(props:IProps) {
	// state
	const { width='16px', height='16px' } = props;
	return (
		<svg width={width} height={height} viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
			<g id="数据管理" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
				<g id="数据要素_数据管理_用户数据管理" transform="translate(-21.000000, -215.000000)">
					<g id="编组-5" transform="translate(21.000000, 215.000000)">
						<rect id="矩形" fill="#D8D8D8" opacity="0" x="0" y="0" width="16" height="16"/>
						<path d="M15,5.78947368 L15,8 C15,9.83127368 12.0898778,11.3157895 8.5,11.3157895 C4.91015111,11.3157895 2,9.83127368 2,8 L2,5.78947368 C2,7.62074737 4.91015111,9.10526316 8.5,9.10526316 C12.0898778,9.10526316 15,7.62074737 15,5.78947368 Z M2,9.47368421 C2,11.3049579 4.91015111,12.7894737 8.5,12.7894737 C12.0898778,12.7894737 15,11.3049579 15,9.47368421 L15,11.6842105 C15,13.5154842 12.0898778,15 8.5,15 C4.91015111,15 2,13.5154842 2,11.6842105 L2,9.47368421 Z M8.5,7.63157895 C4.91015111,7.63157895 2,6.14704842 2,4.31578947 C2,2.48453053 4.91015111,1 8.5,1 C12.0898778,1 15,2.48453053 15,4.31578947 C15,6.14704842 12.0898778,7.63157895 8.5,7.63157895 Z" id="形状" fill="currentColor" fillRule="nonzero"/>
					</g>
				</g>
			</g>
		</svg>
	)
}
