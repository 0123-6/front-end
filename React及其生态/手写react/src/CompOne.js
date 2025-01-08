import {createElement, useState} from "./react.js"

export default function CompOne(props) {
	// state
	const {changeFather} = props
	const [number, setNumber] = useState(0)
	// methods
	function change() {
		setNumber(num => num + 1)
		console.log('number: ', number)
	}
	function click(e) {
		e.stopPropagation()
		e.preventDefault()
		changeFather(number)
	}
	// render
	return createElement(
		'div',
		{
			style: 'width: 300px;height: 300px;display:flex;flex-direction: column;background: yellow;',
			onClick: () => change(),
		},
		number,
		createElement(
			'div',
			{
				style: 'width: 100%;height: 100px;background: green;cursor: pointer;',
				onClick: (e) => click(e),
			},
			'将值传递并修改父元素的值',
		)
	)
}
