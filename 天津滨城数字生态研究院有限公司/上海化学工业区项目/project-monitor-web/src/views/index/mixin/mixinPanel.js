import projectAddSvg from '@/assets/icons/svg/project-add.svg';
import projectManageSvg from '@/assets/icons/svg/project-manage.svg';
import projectTrendSvg from '@/assets/icons/svg/project-trend.svg';
import projectKpiSvg from '@/assets/icons/svg/project-kpi.svg';
import projectPolicySvg from '@/assets/icons/svg/project-policy.svg';
import projectMessageSvg from '@/assets/icons/svg/project-message.svg';
import projectTemplateSvg from '@/assets/icons/svg/project-template.svg';
import projectRoleSvg from '@/assets/icons/svg/project-role.svg';
import projectUserSvg from '@/assets/icons/svg/project-user.svg';
import projectButtonReportSvg from '@/assets/icons/svg/project-button-report.svg';

export default {
	data() {
		return {
			// 功能面板列表,总共9个
			allPanel: [
				{name: '创建项目', code: 'create_project', icon: 'project-add', svg: projectAddSvg, path: '/project/form/0/0', },
				{name: '项目管理', code: 'project_manage', icon: 'project-manage', svg: projectManageSvg, path: '/project', },
				{name: '项目态势', code: 'project_situation', icon: 'project-trend', svg: projectTrendSvg, path: '/analysis', },
				{name: '绩效管理', code: 'performance_manage', icon: 'project-kpi', svg: projectKpiSvg, path: '/check', },
				{name: '知识库', code: 'knowledge_base', icon: 'project-policy', svg: projectPolicySvg, path: '/policy', },
				{name: '消息通知', code: 'msg_notify', icon: 'project-message', svg: projectMessageSvg, path: '/message', },
				{name: '模板管理', code: 'template_manage', icon: 'project-template', svg: projectTemplateSvg, path: '/flow', },
				{name: '角色权限', code: 'role_authority', icon: 'project-role', svg: projectRoleSvg, path: '/user/role', },
				{name: '成员列表', code: 'member_list', icon: 'project-user', svg: projectUserSvg, path: '/user/list', },
				{name: '一键报表', code: 'button_report', icon: 'project-button-report', svg: projectButtonReportSvg, path: null,},
			],
		};
	}
}
