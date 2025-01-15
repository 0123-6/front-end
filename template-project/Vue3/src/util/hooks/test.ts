import {useResetReactive, useResetRef} from "@/util/hooks/useResetState.ts";

const {
	state: user,
	resetState: resetUser,
} = useResetReactive(() => ({
	address: '河南省',
	phone: '17796723651',
	fsws: 1234,
	qwqw: {
		sd: 123,
	},
}))


console.log(user.fsws)
resetUser({
	fsws: -100,
})
console.log(user.fsws)

const {
	state: isFetching,
	resetState: resetIsFetching,
} = useResetRef(() => false)

console.log(isFetching.value)
isFetching.value = true
console.log(isFetching.value)
resetIsFetching(false)
console.log(isFetching.value)

