import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Space, message } from 'antd';
import moment from 'moment';
import BehavioralBuying from './behaviorComponents/entry';
import BasicConfiguration from './basicConfigComponent/BasicConfiguration';
import RenderActionCompoent from './actionComponents/entry';
import {activityTypeList} from './ListColumns';
import { getStoreInformation, getActivityGoodsList, addActivity } from '../../api/activity';

const CreateActivity = ({history}) => {
  const [activityType, setActivityType] = useState();
  const [currentActivityType, setcurrentActivityType] = useState({});
  const [isTextAreaDisabled, setIsTextAreaDisabled] = useState(true);
  const [storeInformationList, setStoreInformationList] = useState([]);
  const [platformId, setPlatformId] = useState(1);
  const [supplierId, setSupplierId] = useState();
  const [behaviorTableGoodsList, setBehaviorTableGoodsList] = useState([]);
  const [actionTableGoodsList, setActionTableGoodsList] = useState([]);
  const [isShowNumAndAmount, setIsShowNumAndAmout] = useState(false);

  const [form] = Form.useForm();
  const [conditionForm] = Form.useForm();
  const [actionForm] = Form.useForm();

  useEffect(() => {
    getShopInformation();
  }, [platformId])

  useEffect(() => {
    const behaviorValues = conditionForm.getFieldValue('skuIds');
    const actionValues = actionForm.getFieldValue('skuIds');
    if (behaviorValues && behaviorValues.trim() !== '') {
      getGoodsList(behaviorValues, 'behavior');
    }
    if (actionValues && actionValues.trim() !== '') {
      getGoodsList(actionValues, 'action');
    }
  }, [platformId, supplierId])

  const getShopInformation = async () => {
    try {
      const res = await getStoreInformation({id: platformId});
      if (res.data) {
        setStoreInformationList(res.data);
      } else {
        message.error("获取店铺信息错误");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleChange = (changedValues, allValues) => {
    if (changedValues.activityType) {
      setActivityType(changedValues.activityType);
      setcurrentActivityType(activityTypeList.filter((item) => item.key === changedValues.activityType)[0]);
      if ([1, 2, 7].includes(changedValues.activityType)) {
        conditionForm.setFieldsValue({'acitivityGoodsType': '2'})
      }
      const isShow = [1, 2].includes(changedValues.activityType);
      isShow ? setIsShowNumAndAmout(true) : setIsShowNumAndAmout(false);
      setIsTextAreaDisabled(false);
      setActionTableGoodsList([]);
    }
    if (changedValues.platformId) {
      setPlatformId(changedValues.platformId);
    }
    if (changedValues.supplierId) {
      setSupplierId(changedValues.supplierId);
    }
  }

  const conditionHandleChange = (changedValues, allValues) => {
    if (changedValues.acitivityGoodsType) {
      changedValues.acitivityGoodsType !== '1' ? setIsTextAreaDisabled(false) : setIsTextAreaDisabled(true);
    }
  }

  //点击确认，提交所有表单数据
  const onFinsh = () => { 
    const conditionFormData = conditionForm.validateFields();
    const basicFormData = form.validateFields();
    const actionFormData = actionForm.validateFields();

    Promise.all([basicFormData, conditionFormData, actionFormData]).then( async (values) => {
      const [basicFormValue, conditionFormValue, actionFormValue] = values;
      //处理基础表单中的数据 basicFormValue
      const beginTime = moment(basicFormValue.startDate).format("YYYY-MM-DD") + ' '+ moment(basicFormValue.startTime).format('hh:mm:ss');
      const endTime = moment(basicFormValue.endDate).format("YYYY-MM-DD") + ' '+ moment(basicFormValue.endTime).format('hh:mm:ss');
      const basicData = {
        beginTime,
        endTime,
        platformId: basicFormValue.platformId,
        activityType: basicFormValue.activityType,
        activityName: basicFormValue.activityName,
        supplierId: basicFormValue.supplierId,
        mutexType: basicFormValue.mutexType
      }
      //处理行为表单中的数据 conditionFormValue
      let activityConditionRuleVo;
      if (currentActivityType.type === 1) {
        activityConditionRuleVo = {
          ruleType: Number(conditionFormValue.ruleType[0]),
          conditionRuleType: Number(conditionFormValue.ruleType[1]),
          acitivityGoodsType: Number(conditionFormValue.acitivityGoodsType),
          activityGoodsVoList: behaviorTableGoodsList,
        }
      } else {
        activityConditionRuleVo = {
          ruleType: Number(conditionFormValue.ruleType[0]),
          conditionRuleType: Number(conditionFormValue.ruleType[1]),
          buyMinNum: Number(conditionFormValue.buyMinNum),
          buyMaxNum: Number(conditionFormValue.buyMaxNum),
          buyMinAmount: Number(conditionFormValue.buyMinAmount),
          buyMaxAmount: Number(conditionFormValue.buyMaxAmount),
          acitivityGoodsType: Number(conditionFormValue.acitivityGoodsType),
          activityGoodsVoList: behaviorTableGoodsList,
        }
      }
      //处理动作表单中的数据 actionFormValue
      const activityActionRuleVo = {
        actionRuleType: currentActivityType.type,
        discountPrecent: actionFormValue.discountPrecent,
        promotionAmount: actionFormValue.promotionAmount,
        specialSkillGoodsVoList: actionFormValue.specialSkillGoodsVoList,
        externalGoodsVoList: actionFormValue.externalGoodsVoList,
        giftGoodsVoList: actionFormValue.giftGoodsVoList,
      }

      //组合所有的请求条件
      const params = {
        ...basicData,
        activityConditionRuleVo,
        activityActionRuleVo,
      }
      
      console.log(params)
      // 请求添加活动
      try {
        const res = await addActivity(params);
        if (res.status === 200) {
          message.success("添加活动成功");
          history.push("/activityEngine/activityManage");
        } else {
          message.error(res.message);
        }
      } catch {
        message.error("添加活动失败");
      }
    }).catch(() => {
      message.error("参数错误");
    })
  }
  //13201517,13200022,13200060
  //校验行为/购买中的skuIds 校验成功那么在行为组件table中展示商品数据，如果是特价秒杀活动，在特价秒杀活动中展示商品数据
  const onCheckSkuIds = () => {
    //获取到skuIds数据->
    if (platformId && supplierId) {
      const values = conditionForm.getFieldValue('skuIds');
      if (values && values.trim() !== '') {
        getGoodsList(values, 'behavior');
      } else {
        message.error("skuId不存在或为空！");
      }
    } else {
      message.warn("请选择活动店铺和活动平台！");
    }
  }

  const onActionCheckSkuIds = () => {
    if (platformId && supplierId) {
      const values = actionForm.getFieldValue('skuIds');
      if (values && values.trim() !== '') {
        getGoodsList(values, 'action');
      } else {
        message.error("skuId不存在或为空！");
      }
    } else {
      message.warn("请选择活动店铺和活动平台！");
    }
  }

  const getGoodsList = async (values, type) => {
    try {
      const regular = /[0-9]+/g;
      const skuIds = [...new Set(regular[Symbol.match](values).map(Number))];
      const params = {
        skuIdList: skuIds,
        platformId: platformId,
        supplierId: supplierId,
      };
      try {
        const res = await getActivityGoodsList(params);
        if (res.status === 200) {
          if (type === 'behavior') {
            setBehaviorTableGoodsList(res.data);
          } else if (type === 'action') {
            setActionTableGoodsList(res.data);
          }
          message.success("校验成功");
        } else {
          message.error(res.message);
          if (type === 'behavior') {
            setBehaviorTableGoodsList([]);
          } else if (type === 'action') {
            setActionTableGoodsList([]);
          }
        }
      } catch (err) {
        message.error("获取商品信息错误");
      }
    } catch {
      message.error("输入格式错误，请重新输入");
    }
  }

  return (
    <div>
      <Card 
        title="基础信息"
        bordered={false}
        extra={
          <Space>
            <Button onClick={() => history.push("/activityEngine/activityManage")}>取消</Button>
            <Button type="primary" onClick={() => onFinsh() }>确认</Button>
          </Space>
        }
      >
        <BasicConfiguration
          form={form}
          handleChange={handleChange}
          storeInformationList={storeInformationList}
        />
      </Card>
      <Card title="条件" bordered={false}>
        <BehavioralBuying
          form={conditionForm}
          activityType={activityType}
          conditionHandleChange={conditionHandleChange}
          isTextAreaDisabled={isTextAreaDisabled}
          onCheckSkuIds={onCheckSkuIds}
          behaviorTableGoodsList={behaviorTableGoodsList}
          isShowNumAndAmount={isShowNumAndAmount}
        />
      </Card>
      <Card title="动作" bordered={false}>
        <RenderActionCompoent
          form={actionForm}
          activityType={currentActivityType.type}
          onActionCheckSkuIds={onActionCheckSkuIds}
          actionTableGoodsList={actionTableGoodsList}
          behaviorTableGoodsList={behaviorTableGoodsList}
        />
      </Card>
    </div>
  )
}

export default CreateActivity;