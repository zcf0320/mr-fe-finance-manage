import React, { useContext, useEffect, useRef, useState } from 'react';
import { Table, Form, Input } from 'antd';
import MoneyInput from '@components/MoneyInput'
import './index.scss';
// 全局上下文
const EditableContext = React.createContext(null);

// 编辑行
const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  )
}

// 编辑单元格
const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] })
  }

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log("保存出错：", errInfo)
    }
  }
  let childNode = children;
  if (editable) {
    childNode = editing ?
      (
        <Form.Item
          style={{ margin: 0 }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title}是必填项`,
            },
          ]}
        >
          {
            dataIndex === "shareAmount" ?
              <MoneyInput ref={inputRef} onPressEnter={save} onBlur={save} /> :
              <Input ref={inputRef} onPressEnter={save} onBlur={save} maxLength={30} />
          }
        </Form.Item>
      ) :
      (
        <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }} onClick={toggleEdit}>
          {children}
        </div>
      )
  }
  return <td {...restProps}>{childNode}</td>;
}

const columns = [
  {
    title: 'SKUID',
    dataIndex: 'skuId',
  },
  {
    title: '开票名称',
    dataIndex: 'skuName',
    width: 200,
    editable: true
  },
  {
    title: '购买数量',
    dataIndex: 'skuNum',
  },
  {
    title: '开票金额',
    dataIndex: 'shareAmount',
    width: 200,
    editable: true
  },
  {
    title: '税点',
    dataIndex: 'taxRate',
  },
];

const TableEditableForm = props => {
  const { dataSource, onSave } = props;

  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex(item => row.skuId === item.skuId);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    onSave && onSave(newData)
  }

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const newColumns = columns.map(col => {
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
        handleSave,
      }),
    };
  });

  return (
    <Table
      components={components}
      columns={newColumns}
      dataSource={dataSource}
      rowKey="skuId"
      pagination={false}
      rowClassName={() => 'editable-row'}
      bordered
      size="small"
    />
  )
}
export default TableEditableForm