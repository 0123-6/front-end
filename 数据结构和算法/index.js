/**
 * @param {number[]} gas
 * @param {number[]} cost
 * @return {number}
 */
var canCompleteCircuit = function(gas, cost) {
	// 从第ans个开始
	let ans = 0
	// 暴力尝试
	while (ans < gas.length) {
		let ok = true
		let nowIndex = ans
		let nowGas = gas[nowIndex]
		// 往前走n段
		for (let i = 0; i < gas.length && ok; i++) {
			const canGo = nowGas >= cost[nowIndex]
			if (canGo) {
				nowGas = nowGas - cost[nowIndex] + gas[(nowIndex + 1) % gas.length]
				nowIndex = (nowIndex + 1) % gas.length
			} else {
				ok = false
			}
		}
		if (ok) {
			break
		}
		ans = ans + nowIndex + 1
	}
	// 答案
	return ans >= gas.length ? -1 : ans
}
