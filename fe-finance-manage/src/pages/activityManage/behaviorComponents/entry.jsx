import BehavioralBuying from "./BehavioralBuying";

const components = {
  "BehavioralBuying": BehavioralBuying,
}

export default (props) => {
  const { activityType, conditionHandleChange, isTextAreaDisabled, form, onCheckSkuIds, behaviorTableGoodsList, isShowNumAndAmount } = props
  
  const SpecificStory = components['BehavioralBuying'];

  return (
    <SpecificStory
      form={form}
      activityType={activityType}
      conditionHandleChange={conditionHandleChange}
      isTextAreaDisabled={isTextAreaDisabled}
      onCheckSkuIds={onCheckSkuIds}
      behaviorTableGoodsList={behaviorTableGoodsList}
      isShowNumAndAmount={isShowNumAndAmount}
    />
  )
}