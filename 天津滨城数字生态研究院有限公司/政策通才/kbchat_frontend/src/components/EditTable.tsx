import {Form, Input, Select, Table} from 'antd';
import React, {useContext, useEffect, useRef, useState} from 'react';

const EditableContext = React.createContext(null);
const EditableRow = ({index, ...props}) => {
	const [form] = Form.useForm();
	return (
		<Form form={form} component={false}>
			<EditableContext.Provider value={form}>
				<tr {...props} />
			</EditableContext.Provider>
		</Form>
	);
};
const EditableCell = ({
	                      title,
	                      editable,
	                      children,
	                      dataIndex,
	                      record,
	                      handleSave,
												type='input',//input,select
	                      options=null,
	                      placeholder,
	                      ...restProps
                      }) => {
	const inputRef = useRef(null);
	const form = useContext(EditableContext);
	const toggleEdit = () => {
		// form.setFieldsValue({
		// 	[dataIndex]: record[dataIndex],
		// });
	};
	const save = async () => {
		try {
			const values = await form.validateFields();
			toggleEdit();
			handleSave({
				...record,
				...values,
			});
		} catch (errInfo) {
			console.log('Save failed:', errInfo);
		}
	};
	let childNode = children;
	if (editable) {
		// form.setFieldValue(dataIndex, record[dataIndex])
		if(type === 'input') {
			childNode = (
				<Form.Item
					className={'edit-table'}
					style={{
						margin: 0,
						height: '32px'
					}}
					name={dataIndex}
					initialValue={record[dataIndex]}
				>
					<Input ref={inputRef}
					       style={{height: '32px'}}
					       onPressEnter={save}
					       onBlur={save}
					       placeholder={placeholder?placeholder:'请输入字段说明'}
					       autoComplete={"off"}/>
				</Form.Item>
			);
		} else if(type === 'select') {
			childNode = (
				<Form.Item
					className={'edit-table'}
					style={{
						margin: 0,
						height: '32px'
					}}
					name={dataIndex}
					initialValue={record[dataIndex]}
				>
					<Select
						ref={inputRef}
						onBlur={save}
						size={'middle'}
						placeholder={placeholder?placeholder:'请输入字段说明'}
						options={options}/>
				</Form.Item>
			);
		}

	}
	return <td {...restProps}>{childNode?childNode:' - '}</td>;
};


const EditTable = (props) => {
	// state
	const [dataSource, setDataSource] = useState([]);
	const [defaultColumns, setDefaultColumns] = useState([]);

	// mounted
	useEffect(() => {
		setDataSource(props.data)
		setDefaultColumns(props.columns)
	}, [])

	// methods
	const handleSave = (row) => {
		const newData = [...dataSource];
		const index = newData.findIndex((item) => row.key === item.key);
		const item = newData[index];
		newData.splice(index, 1, {
			...item,
			...row,
		});
		setDataSource(newData);
		props.change(newData)
	};
	const components = {
		body: {
			row: EditableRow,
			cell: EditableCell,
		},
	};
	const columns = defaultColumns.map((col) => {
		if (!col.editable) {
			return col;
		}
		return {
			...col,
			onCell: (record) => ({
				record,
				editable: col.editable,
				dataIndex: col.dataIndex,
				title: col.title,
				type: col.type,
				options: col.options,
				placeholder: col.placeholder,
				handleSave,
			}),
		};
	});

	// render
	return (
		<Table
			size='small'
			components={components}
			pagination={false}
			rowClassName={() => 'editable-row'}
			dataSource={dataSource}
			columns={columns}
			style={props?.tableStyle}
			scroll={props?.tableScroll}
		/>
	);
};

export default EditTable;
