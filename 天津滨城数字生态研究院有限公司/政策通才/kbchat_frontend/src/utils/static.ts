export const modelVersionList = [
	{ label: 'V1', value: 'V1' },
	{ label: 'V2', value: 'V2' },
	{ label: 'V3', value: 'V3' },
	{ label: 'V4', value: 'V4' },
	{ label: 'V5', value: 'V5' },
]

export const modelCpuConfigurationList = [
	{ label: '1 vCPU 1 GiB', value: JSON.stringify({cpu:1,memory:1}) },
	{ label: '1 vCPU 2 GiB', value: JSON.stringify({cpu:1,memory:2}) },
	{ label: '1 vCPU 4 GiB', value: JSON.stringify({cpu:1,memory:4}) },
	{ label: '2 vCPU 4 GiB', value: JSON.stringify({cpu:2,memory:4}) },
	{ label: '2 vCPU 8 GiB', value: JSON.stringify({cpu:2,memory:8}) },
	{ label: '4 vCPU 8 GiB', value: JSON.stringify({cpu:4,memory:8}) },
	{ label: '4 vCPU 16 GiB', value: JSON.stringify({cpu:4,memory:16}) },
	{ label: '8 vCPU 16 GiB', value: JSON.stringify({cpu:8,memory:16})},
]

export const modelGpuConfigurationList = [
	{ label: '0', value: 0 },
	{ label: '1', value: 1 },
	{ label: '2', value: 2 },
	{ label: '3', value: 3 },
	{ label: '4', value: 4 },
]
