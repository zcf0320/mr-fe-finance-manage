export const routerLib = {
  "/activityEngine/activityManage": () => import("../pages/activityManage"),
  "/activityEngine/createActivity": () => import("../pages/activityManage/createActivity"),

  "/oms-order/manage": () => import("../pages/orderManage"),
  "/oms-order/manage/detail": () => import("../pages/orderDetail"),

  "/oms-after-sale/manage": () => import("../pages/afterSale"),

  "/oms-after-sale/manage/detail": () => import("../pages/afterSaleDeatil"),
  "/order/import/batch": () => import("../pages/orderManage/ImportBatch"),
  "/order/import/cancelBatch": () => import("../pages/orderManage/ImportCancelBatch"),

  "/oms-orderB2B/manage": () => import("../pages/orderB2B"),
  "/oms-orderB2B/manage/detail": () => import("../pages/orderB2B/detail"),
  "/oms-orderB2B/manage/add": () => import("../pages/orderB2B/add"),

  //统一对账任务配置管理
  "/oms-configManage": () => import("../pages/configManage"),
  //统一对账任务配置
  "/oms-configManage/task": () => import("../pages/configManage/configTask"),
  //统一对账结果管理
  "/oms-resultManage/manage": () => import("../pages/resultManage"),
  //统一对账结果浏览
  "/oms-resultManage/browsering": () => import("../pages/resultManage/resultBrowsering"),
  //统一对账资金结果浏览
  "/oms-resultManage/funt": () => import("../pages/resultManage/resultFunt"),
  //统一对账差错明细
  "/oms-resultManage/error": () => import("../pages/resultManage/resultError"),
  //清算管理 
  "/clearManage/manage": () => import("../pages/ClearManagement"),
  //费用规则维护
  "/clearManage/costMaintenance": () => import("../pages/ClearManagement/CostMaintenance"),
  //清算明细
  "/clearManage/clearDetails": () => import("../pages/ClearManagement/ClearDetails"),
  //结算明细
  "/clearManage/settleDetails": () => import("../pages/ClearManagement/CloseDetail"),
  //核销查询
  "/clearManage/writeQuery": () => import("../pages/ClearManagement/WriteQuery"),
  //未对平提现记录
  "/clearManage/notWritten": () => import("../pages/ClearManagement/NotWritten"),
  //核销明细流水
  "/clearManage/writtenDetails": () => import("../pages/ClearManagement/WrittenDetail"),
  //其他记账结果查询
  "/clearManage/otherKeeping": () => import("../pages/ClearManagement/OtherKeeping"),
  //每日金额汇总报表		
  "/clearManage/dailyReport": () => import("../pages/ClearManagement/DailyReport"),
  //会计总账管理
  "/accountManage/manage": () => import("../pages/accountingManagement"),
  //会计分录查询
  "/accountManage/accountingEntryQuery": () => import("../pages/accountingManagement/AccountingQuery"),
  //业财-SAP基础参数映射
  "/accountManage/accountParameterMap": () => import("../pages/accountingManagement/AccountingParameterMap"),
  //科目余额查询
  "/accountManage/accountBalanceQuery": () => import("../pages/accountingManagement/AccountingBalance"),
  //总账配置管理
  "/leaderConfig/Manage": () => import("../pages/configGuration"),
  //场景规则维护
  "/leaderConfig/scenarioMaintenance": () => import("../pages/configGuration/scenarioMaintenance"),
  //科目规则维护
  "/leaderConfig/accountMaintenance": () => import("../pages/configGuration/accountMaintenance"),
  //会计事件规则维护
  "/leaderConfig/eventMaintenance": () => import("../pages/configGuration/eventMaintenance"),
  //账号与法体关系维护
  "/leaderConfig/legalMaintenance": () => import("../pages/configGuration/legalMaintenance"),
  //成本关系管理
  "/relationShip/Manage": () => import("../pages/relationshipManagement"),
  //一级部门维护
  "/relationShip/primaryMaintenance": () => import("../pages/relationshipManagement/primaryMaintenance"),
  //业务部门维护
  "/relationShip/departmentMaintenance": () => import("../pages/relationshipManagement/departmentMaintenance"),
  //成本部门维护
  "/relationShip/costMaintenance": () => import("../pages/relationshipManagement/costMaintenance"),
  //业务单元维护
  "/relationShip/businessMaintenance": () => import("../pages/relationshipManagement/businessMaintenance"),
  //成本关系维护
  "/relationShip/relationMaintenance": () => import("../pages/relationshipManagement/relationMaintenance"),
  //添加成本关系维护
  "/relationShip/addMaintenance/add": () => import("../pages/relationshipManagement/relationMaintenance/add"),
  //财务管理
  "/financial/financialApproval": () => import("../pages/financialApproval"),
  //财务审批
  "/financial/financialMaintenance": () => import("../pages/financialApproval/finanMaintenance"),
  //财务审批明细
  "/financial/financialMaintenanceDetail": () => import("../pages/financialApproval/finanMaintenanceDetail"),
  //财务审批批次查询
  "/financial/financialQuery": () => import("../pages/financialApproval/finanQuery"),
  //财务审批批次查询查看明细
  "/financial/financialQueryDetail": () => import("../pages/financialApproval/finanQueryDetail"),
  //财务收款信息维护
  "/financial/collectionMaintenance": () => import("../pages/financialApproval/collectionMaintenance"),
}