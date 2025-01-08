import {createElement, useState} from './react.js'

export default function myElement() {
	// state
	const [number, setNumber] = useState(10)
	const [show, setShow] = useState(true)
	// methods
	function changeNumber() {
		setNumber(num => num+1)
		setShow(show => !show)
	}
	
	return createElement(
		'div',
		{style: 'width: 100vw;display: flex;flex-direction: column;'},
		createElement(
			'div',
			{style: 'width: 100%;display: flex;height: 100px;cursor:pointer;'},
			createElement('div', {style: 'width: 50%;background: red;'}),
			createElement(
				'div',
				{style: 'width: 50%;background: blue;'},
				createElement('span', null, number)
			),
		),
		createElement(
			'div',
			{style: 'width: 100%;display: flex;height: 100px;'},
			createElement(
				'div',
				{style: 'width: 33.333%;background: pink;display: flex;'},
				createElement(
					'span',
					{
						style: 'color: green;font-size: 20px;',
						onClick: changeNumber,
					},
					'确定'),
			),
			createElement('div', {style: 'width: 33.333%;background: orange;'}),
			show ? createElement(
				'div',
				{style: 'width: 33.333%;background: green;'},
				createElement('span', {style: 'color: red;font-size: 20px;'}, '取消'),
			) : null,
		),
	)
}
