import SpecialSpike from "./SpecialSpike";
import PlusPurchaseSpecials from "./PlusPurchaseSpecials";
import Exemption from "./Exemption";
import Discount from "./Discount";
import GiftMerchandise from "./GiftMerchandise";
import { Form } from 'antd';

const components = {
  1: SpecialSpike,
  2: PlusPurchaseSpecials,
  5: GiftMerchandise,
  3: Exemption,
  4: Discount,
}

export default (props) => {
  const { activityType, form, behaviorTableGoodsList, onActionCheckSkuIds, actionTableGoodsList } = props
  const SpecificStory = components[activityType];

  return (
    <Form
      form={form}
      name="discount_condition"
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
      className="ant-advanced-search-form"
    >
      {
        activityType
        && <SpecificStory
          form={form}
          behaviorTableGoodsList={behaviorTableGoodsList}
          onActionCheckSkuIds={onActionCheckSkuIds}
          actionTableGoodsList={actionTableGoodsList}
          activityType={activityType}
        />
      }
    </Form>
  )
}