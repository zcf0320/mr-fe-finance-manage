import React, { useContext, useEffect, useRef, useState } from 'react';
import { Table, Form, Input } from 'antd';
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
          // rules={[
          //   {
          //     required: true,
          //     message: `${title}是必填项`,
          //   },
          // ]}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
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

const TableEditableForm = props => {
  const { dataSource, onSave, columns } = props;

  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex(item => (row.outSkuId + row.wmsBatchNo) === (item.outSkuId + item.wmsBatchNo));
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
      scroll={{ x: 2000 }}
      style={{marginBottom: 50}}
    />
  )
}
export default TableEditableForm