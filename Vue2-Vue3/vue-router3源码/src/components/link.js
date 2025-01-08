export default {
	// 名称, RouterLink
	name: 'RouterLink',
	template: `
		<a :href="href" @click="handler"><slot name="default"/></a>
	`,
	// 接收的属性
	props: {
		// 必填属性to，string类型或者Location对象类型
		to: {
			type: [String, Object],
			required: true
		},
		// 是否是replaceState，默认pushState
		replace: Boolean,
	},
	data() {
		return {
			href: '',
			location: null,
		}
	},
	created() {
		const result = this.$router.resolve(this.to)
		this.href = result.href
		this.location = result.location
	},
	methods: {
		handler(e) {
			const noop = () => {}
			// 如果通过触发校验
			if (guardEvent(e)) {
				const result = this.$router.resolve(this.to)
				this.href = result.href
				this.location = result.location
				// 如果设置了replace属性，则使用replaceState；否则使用pushState
				if (this.replace) {
					this.$router.replace(this.location, noop)
				} else {
					this.$router.push(this.location, noop)
				}
			}
		},
	},
}

export function guardEvent (e) {
	// don't redirect with control keys
	// 如果事件包含控制键，不触发导航
	if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) return
	// don't redirect when preventDefault called
	if (e.defaultPrevented) return
	// don't redirect on right click
	if (e.button !== undefined && e.button !== 0) return
	// don't redirect if `target="_blank"`
	if (e.currentTarget && e.currentTarget.getAttribute) {
		const target = e.currentTarget.getAttribute('target')
		if (/\b_blank\b/i.test(target)) return
	}
	// this may be a Weex event which doesn't have this method
	if (e.preventDefault) {
		e.preventDefault()
	}
	// 如果没有触发防止导航的条件，则返回 true
	return true
}