import {create} from "./myState.js";

const useStore = create(set => ({
	count: 1,
	inc: () => set(state => ({
		count: state.count+1,
	})),
}))

function MyComp() {
	// state
	// const [count, setCount] = React.useState(0)
	const {count, inc} = useStore()
	
	// methods
	
	// render
	return React.createElement(
		'div',
		{
			style: {
				width: '100vw',
				height: '100vh',
				background: 'red',
				display: 'flex',
				flexDirection: 'column',
			},
		},
		React.createElement(
			'span',
			{
				style: {
				
				},
				onClick: inc,
			},
			count,
		),
		React.createElement(CompTwo),
	)
}

function CompTwo() {
	// state
	const {count} = useStore()
	// render
	return React.createElement(
		'span',
		{
			style: {
			
			},
		},
		count,
	)
}

// 先绑定DOM
const dom = ReactDOM.createRoot(document.getElementById('app'))
dom.render(React.createElement(MyComp))
