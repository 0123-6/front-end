export default {
	name: 'LayoutPage',
	template: `<div style="width: 100vw;height: 100vh;background-color: orange;display: flex;flex-direction: column;">
	<!--导航部分-->
	<div style="width: 100%;height: 60px;background-color: green;display: flex;align-items: center;">
		<RouterLink to="/">Go to Home</RouterLink>
    <RouterLink to="/login">Go to Login</RouterLink>
	</div>
	<!--内容部分-->
	<RouterView/>
</div>`,
}
