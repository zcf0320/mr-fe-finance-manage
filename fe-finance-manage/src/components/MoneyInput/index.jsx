import React, { forwardRef } from 'react';
import { InputNumber } from 'antd'
const Money = (props, ref) => {
  const { onChange, ...restProps } = props
  const onInputChange = (value) => {
    onChange && onChange(value.toFixed(2))
  }
  return (
    <InputNumber ref={ref} {...restProps} onChange={onInputChange} style={{ width: "100%" }} />
  )
}
export default forwardRef(Money)