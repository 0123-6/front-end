import {createElement, useState} from "./react.js";

export default function Board() {
	// state
	const [squares, setSquares] = useState(Array(9).fill(null))
	const [xIsNext, setXIsNext] = useState(true)
	const winner = calculateWinner(squares)
	let status
	if (winner) {
		status = '获胜者： ' + winner
	} else {
		status = '下一个落子者：' + (xIsNext ? 'X' : 'O')
	}
	// methods
	function handleClick(i) {
		if (squares[i] || calculateWinner(squares)) {
			return
		}
		const nextSquares = squares.slice()
		nextSquares[i] = xIsNext ? 'X' : 'O'
		setSquares(nextSquares)
		setXIsNext(!xIsNext)
	}
	// render
	return createElement(
		'div',
		null,
		createElement(
			'div',
			{
				className: 'status',
			},
			status,
		),
		createElement(
			'div',
			{
				className: 'board-row',
			},
			createElement(
				Square,
				{
					value: squares[0],
					onSquareClick: () => handleClick(0),
				}
			),
			createElement(
				Square,
				{
					value: squares[1],
					onSquareClick: () => handleClick(1),
				}
			),
			createElement(
				Square,
				{
					value: squares[2],
					onSquareClick: () => handleClick(2),
				}
			),
		),
		createElement(
			'div',
			{
				className: 'board-row',
			},
			createElement(
				Square,
				{
					value: squares[3],
					onSquareClick: () => handleClick(3),
				}
			),
			createElement(
				Square,
				{
					value: squares[4],
					onSquareClick: () => handleClick(4),
				}
			),
			createElement(
				Square,
				{
					value: squares[5],
					onSquareClick: () => handleClick(5),
				}
			),
		),
		createElement(
			'div',
			{
				className: 'board-row',
			},
			createElement(
				Square,
				{
					value: squares[6],
					onSquareClick: () => handleClick(6),
				}
			),
			createElement(
				Square,
				{
					value: squares[7],
					onSquareClick: () => handleClick(7),
				}
			),
			createElement(
				Square,
				{
					value: squares[8],
					onSquareClick: () => handleClick(8),
				}
			),
		),
	)
}

function Square(props) {
	// state
	const {value, onSquareClick} = props
	// methods
	// render
	return createElement(
		'button',
		{
			className: 'square',
			onClick: onSquareClick,
		},
		value,
	)
}

// 计算获胜者
function calculateWinner(squares) {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	]
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i]
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return squares[a]
		}
	}
	return null
}


