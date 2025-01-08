import {createElement, useEffect, useRef, useState} from "./react.js"
import myElement from "./myElement.js";
import CompOne from "./CompOne.js";
import MyGame from './MyGame.js'

export default function MyComp(props) {
	const [number, setNumber] = useState(0)
	const [show, setShow] = useState(true)
	const asd = useRef(0)
	function click() {
		setNumber(c => c+1)
		setShow(s => !s)
		asd.current++
		console.log(asd.current)
	}
	
	useEffect(() => {
		console.log('number改变了', number)
	}, [number])
	
	// render
	return createElement(
		'div',
		{style: 'width: 100vw;display: flex;flex-direction: column;'},
		createElement(
			'div',
			{
				style: 'width: 100%;display: flex;height: 100px;cursor:pointer;',
				onClick: () => click(),
			},
			createElement('div', {style: 'width: 50%;background: red;'}),
			createElement('div', {style: 'width: 50%;background: blue;'}),
		),
		createElement(
			'div',
			{style: 'width: 100%;display: flex;height: 100px;'},
			createElement(
				'div',
				{
					style: 'width: 33.333%;background: pink;',
				},
			),
			createElement('div', {style: 'width: 33.333%;background: orange;'}, number),
			show ? createElement('div', {style: 'width: 33.333%;background: green;'}) : undefined,
		),
		createElement(
			CompOne,
			{
				changeFather: (num) => setNumber(n => num),
			}
		),
		createElement(
			myElement,
			{
				style: 'width: 100%;height: 300px;display: flex;',
			}
		),
		createElement(
			MyGame,
		),
		asd.current,
	)
}
