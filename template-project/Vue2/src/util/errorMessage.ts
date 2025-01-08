import {Message} from 'element-ui'

export default function (message: string) {
	Message({
		type: 'error',
		message,
		showClose: true,
	})
}
