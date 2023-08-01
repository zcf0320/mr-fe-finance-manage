import React, { useState, useEffect, useMemo } from 'react';
import { Form, Button, Table, message, Row, Col } from 'antd';
import classNames from 'classnames';
import styles from "./index.module.scss";

const RESET = Symbol("reset"),
  defaultSearchLib = {
    pageNum: 1,
    pageSize: 10
  },
  colSpanProps = {
    xxl: 8,
    xl: 8,
    lg: 8,
    md: 12,
    sm: 24,
    xs: 24
  };
const MiniTable = (props) => {
  const {
    children,
    tableConfig,
    otherBtns,
    requestPromise,
    refrash,
    setForm,
    searchClass,
    onFormChange,
    regetListFields
  } = props;
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState({
    list: [],
    total: 0,
    searchLib: defaultSearchLib,
  });

  const { list, total, searchLib } = dataSource;

  const _getData = (params = {}, type) => {
    if (requestPromise) {
      let req = Object.assign({}, searchLib, params);
      (type == RESET) && (req = defaultSearchLib);
      const promiseResult = requestPromise(req);
      if (promiseResult) {
        promiseResult.then(res => {
          let data = [], count = 0;
          if (res.status == 200 || res.code == 200) {
            const { list, total, records } = res.data || {};
            data = list || records;
            count = total;
          } else {
            message.error("列表获取失败");
          }
          setDataSource({
            list: data,
            total: count,
            searchLib: req,
          })
          setLoading(false)
        }).catch(() => {
          setDataSource({
            list: [],
            total: 0,
            searchLib: req,
          })
          setLoading(false)
          message.error("列表获取失败");
        })
      }
    } else {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (refrash) return;
    _getData()
  }, [])

  useEffect(() => {
    if (refrash) {
      setLoading(true)
      _getData()
    }
  }, [refrash])

  useEffect(() => {
    setForm && setForm(form)
  }, [form])

  const _handleFind = () => {
    const searchParams = form.getFieldsValue(true);
    setLoading(true)
    _getData(Object.assign({ pageNum: 1 }, searchParams));
  }

  const _handleReset = () => {
    form.resetFields()
    if (onFormChange) {
      onFormChange({}, {});
    }
    setLoading(true)
    _getData({}, RESET)
  }

  const _handlePage = (pageNum, pageSize) => {
    if (onFormChange) {
      onFormChange({}, defaultSearchLib);
    }
    setLoading(true)
    _getData({ pageNum, pageSize })
  }

  const _handleValChange = (v, allV) => {
    const fieldSet = new Set(regetListFields)
    if (Object.keys(v).some(d => fieldSet.has(d))) {
      _handleFind()
    }
    if (onFormChange) {
      onFormChange(v, allV);
    }
  }

  const _searchClass = classNames(styles.searchBar, searchClass)
  
  const optionsSpan = useMemo(()=> {
    const count = React.Children.count(children);
    const span = {};
    Object.keys(colSpanProps)
      .forEach(d=> {
        const surplus = (colSpanProps[d] * count % 24);
        span[d] = surplus ? (24 - surplus) : 24;
      })
    return span;
  }, [])

  return (
    <div>
      <Form
        form={form}
        name="searchBar"
        onValuesChange={_handleValChange}
        className={_searchClass}
      >
        <Row gutter={12}>
          {
            React.Children.map(
              children,
              d => (
                <Col {...colSpanProps}>
                  {d}
                </Col>
              )
            )
          }
          <Col {...optionsSpan}>
            <div className={styles.optionsWrap}>
              <Button type="primary" onClick={_handleFind}>搜索</Button>
              <Button onClick={_handleReset}>重置</Button>
            </div>
          </Col>
        </Row>
      </Form>
      <div className={styles.tableWrap}>
        <div className={styles.btnWrap}>
          {otherBtns}
        </div>
        <Table
          rowKey="id"
          size="small"
          dataSource={list}
          loading={loading}
          pagination={{
            total,
            size: "small",
            showQuickJumper: true,
            showSizeChanger: true,
            onChange: _handlePage,
            current: searchLib.pageNum,
            pageSize: searchLib.pageSize,
          }}
          {...tableConfig}
        />
      </div>
    </div>
  )
}

export default MiniTable