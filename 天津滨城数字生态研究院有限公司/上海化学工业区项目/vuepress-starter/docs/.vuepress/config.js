module.exports = {
	title: '帮助中心',
	description: '帮助中心',
	themeConfig: {
		nextLinks: true,
		prevLinks: true,
		smoothScroll: true,
		logo: '/logo.svg',
		sidebar: [
			{
				title: '首页',// home-page
				children: [
					'/',
					'/home-page/global-search/',
					'/home-page/panel-view/',
				],
			},
			{
				title: '项目管理',// project-manage
				children: [
					// 项目查看
					'/project-manage/project-view/',
					// 项目编辑
					'/project-manage/project-edit/',
					// 项目进度更新
					'/project-manage/project-progress-update/',
					// 项目删除
					'/project-manage/project-delete/',
					// 项目终止
					'/project-manage/project-termination/',
					// 项目导出
					'/project-manage/project-export/',
					// 添加备注
					'/project-manage/project-add-remarks/',
				],
			},
			{
				title: '项目态势',// project-situation
				children: [
					// 项目态势查看
					'/project-situation/project-situation-view/',
					// 项目态势导出
					'/project-situation/project-situation-export/',
				],
			},
			{
				title: '绩效管理',// performance-management
				children: [
					// 绩效管理
					'/performance-management/performance-management/',
				],
			},
			{
				title: '知识库',// knowledge-base
				children: [
					// 知识文件上传
					'/knowledge-base/knowledge-file-upload/',
					// 知识库查询
					'/knowledge-base/knowledge-base-query/',
					// 知识库失效状态变更
					'/knowledge-base/knowledge-base-invalid-status-change/',
					// 知识文件下载
					'/knowledge-base/knowledge-file-download/',
					// 知识文件删除
					'/knowledge-base/knowledge-file-delete/',
				],
			},
			{
				title: '消息通知',// message-notification
				children: [
					// 消息查看
					'/message-notification/message-view/',
					// 消息状态变更
					'/message-notification/message-status-change/',
					// 消息删除
					'/message-notification/message-delete/',
				],
			},
			{
				title: '模板中心',// template-center
				children: [
					// 模板查看
					'/template-center/template-view/',
				],
			},
			{
				title: '成员管理',// user-management
				children: [
					// 新增成员
					'/user-management/user-add/',
					// 成员查询
					'/user-management/user-query/',
					// 成员信息修改
					'/user-management/user-info-change/',
					// 成员状态更改
					'/user-management/user-status-change/',
					// 成员删除
					'/user-management/user-delete/',
					// 新增角色
					'/user-management/role-add/',
					// 角色查询
					'/user-management/role-query/',
					// 角色权限修改
					'/user-management/role-permission-change/',
					// 角色删除
					'/user-management/role-delete/',
				],
			},
			{
				title: '个人中心',// personal-center
				children: [
					// 个人信息查看
					'/personal-center/personal-info-view/',
					// 更换头像
					'/personal-center/change-avatar/',
					// 修改密码
					'/personal-center/change-password/',
					// 退出登录
					'/personal-center/logout/',
				],
			},
		],
	},
	plugins: [
		'@vuepress/plugin-back-to-top',
		[
			'medium-zoom',
			{
				selector: '.theme-default-content img',
				delay: 1000,
				options: {
					margin: 24,
					background: '#fff',
					scrollOffset: 0,
				},
			},
		],
	],
}