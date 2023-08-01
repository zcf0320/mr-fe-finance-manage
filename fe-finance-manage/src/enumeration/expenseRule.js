let ruleList={
    //通道名称
    channelType:[
        {code:'ALI_PAY',value:'支付宝'},
        {code:'KUAIQIAN_PAY',value:'快钱'},
        {code:'JINGDONG_PAY',value:'京东支付'}
    ],//费用计算依据 
    feeCalculateMode:[
        {code:'1',value:'按笔'},
        {code:'2',value:'金额不分层'}
    ],//收费方式
    feeMode:[
        {code:'1',value:'单笔收取'},
        {code:'0',value:'不收取'},
    ],//计算方式
    feeCalculateBaseFlag:[
        {code:'1',value:'按固定金额收取'},
        {code:'2',value:'按金额固定百分比收取'},
    ],//四舍五入
    roundFlag:[
        {code:'1',value:'四舍五入'},
        {code:'2',value:'四舍五不入'},
    ],//容错方式
    faultTolerantFlag:[
        {code:'1',value:'小于等于'},
        {code:'2',value:'大于等于'},
        {code:'3',value:'正负'},
    ],

}
const expenseRule=(code,k)=>{
    let ruleData='';
    Object.keys(ruleList).forEach(key => {
            if(k===key){
                ruleList[key].map((i)=>{
                    if(i.code===code){
                        ruleData=i.value;
                    }
                })
            }
    });
    return ruleData;
}
export default expenseRule