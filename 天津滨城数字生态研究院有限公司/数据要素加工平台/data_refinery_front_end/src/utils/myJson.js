const stringify = (obj) => {
	try {
		return JSON.stringify(obj, (k, v) => {
			if(typeof v === 'function') {
				return `FUNCTION_FLAG ${v}`
			} else {
				return v
			}
		})
	} catch (error) {
		console.log(error)
		return '出错了'
	}
}

const parse = (jsonStr) => {
	try {
		return JSON.parse(jsonStr, (key, value) => {
			if(value && typeof value === 'string') {
				return value.indexOf('FUNCTION_FLAG') > -1 ? new Function(`return ${value.replace('FUNCTION_FLAG', '')}`)() : value
			}
			return value
		})
	} catch (error) {
		console.log(error)
		return '出错了'
	}
}

export {stringify,parse}
