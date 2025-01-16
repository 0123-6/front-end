import {useResetReactive, useResetRef} from "@/util/hooks/useResetState.ts";
import {useElForm} from "@/util/hooks/element-plus-component-hooks/useElForm.ts";
import {dateToYYYYMMDDHHMMSS} from "@/util/date.ts";
import dayjs from "dayjs";
import {computed} from "vue";

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

const formObject = useElForm({
	formRef: null,
	dataFn: () => ({
		systemList: [],
		alarmTypeList: [],
		statusList: [],
		beginTime: dateToYYYYMMDDHHMMSS(dayjs().subtract(6, 'day')),
		endTime: dateToYYYYMMDDHHMMSS(new Date()),
	}),
	rules: {
		systemList: [
			{required: true,},
		],
	},
})

const alarmDate = computed({
	get: () => ([formObject.data.beginTime, formObject.data.endTime,]),
	set: newValue => {
		formObject.data.beginTime = dateToYYYYMMDDHHMMSS(newValue[0])
		formObject.data.endTime = dateToYYYYMMDDHHMMSS(newValue[1])
	}
})