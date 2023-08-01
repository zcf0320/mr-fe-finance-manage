let accountMainList = {
    //红字标识
    negativeFlag:[
        {code:'y',value:'需红字记账（是否允许为负）'},
        {code:'n',value:'正常记账'},
    ],
    //余额方向
    drcrFlag:[
        {code:'dr',value:'借'},
        {code:'cr',value:'贷'},
    ],
    //自动开户标志
    autoOpenaccountFlag:[
        {code:'y',value:'自动开户'},
        {code:'n',value:'手动开户'},
    ],
    //类型
    type:[
        {code:'0',value:'资产'},
        {code:'1',value:'负债'},
        {code:'5',value:'损益'},
        {code:'9',value:'表外'},
    ],
    //科目细分
    subjectBreakdown:[
        {code:'cost',value:'收入'},
        {code:'income',value:'成本'},
        {code:'exes',value:'费用'},
        {code:'contacts',value:'往来'},
    ],
    //参数类型
    paramType:[
        {code:'1',value:'客户编码'},
        {code:'2',value:'供应商编码'},
        {code:'3',value:'科目'},
        {code:'4',value:'成本部门'},
        {code:'5',value:'成本中心'},
    ]
}
const accountMain = (code, k) => {
    let accountMainData = '';
    Object.keys(accountMainList).forEach(key => {
        if (k === key) {
            accountMainList[key].map((i) => {
                if (i.code === code) {
                    accountMainData = i.value;
                }
            })
        }
    });
    return accountMainData;
}
export default accountMain