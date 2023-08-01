let dailyReportList={
    //账号（选公司）
    accountId:[
        {code:'fxjk',value:'快钱-徐州万邦云药房连锁有限公司-yyf2@wbpharma.com-10219834775'},
        {code:'fxyjk',value:'快钱-复星健康科技(江苏)有限公司-yjk2@wbpharma.com-10219928668'},
        {code:'platform',value:'快钱-海南星创互联网医药有限公司-jkdj005@fosun.com-10219733103'},
        {code:'JINGDONG_PAY',value:'京东钱包-徐州万邦云药房连锁有限公司-xingshaoning123'},
        {code:'ALI_PAY',value:'支付宝-徐州万邦云药房连锁有限公司-shiluyi@fosunhealth.com'},
    ],
    //清算状态
    clearStatus:[
        {code:'1',value:'待清算'},
        {code:'2',value:'已清算'},
        {code:'3',value:'清算失败'},
    ],
    //三方平台编号
    thirdPlatformId:[
        {code:0,value:'无'},
        {code:1,value:'复星商城'},
        {code:2,value:'京东'},
        {code:3,value:'宝宝树'},
        {code:4,value:'天猫'},
        {code:5,value:'快手'},
        {code:6,value:'抖音'},
        {code:7,value:'网易严选'},
        {code:8,value:'口碑'},
        {code:9,value:'星选'},
        {code:10,value:'线下B2B'},
        {code:11,value:'外部互联网医院'},
    ],
    //交易/费用类型
    tradeType:[
        {code:'PRICEPROTECTBACK',value:'价保返佣'},
        {code:'PRICEPROTECT',value:'价保扣款'},
        {code:'AFTERSALECOMPENSATE',value:'售后卖家赔付费'},
        {code:'EXPAND_NEW',value:'拓新'},
        {code:'PLATFORM_COMMISSION_SETTLE',value:'平台佣金结算'},
        {code:'FREIGHT_INSURANCE',value:'卖家版运费保险 '},
        {code:'ALI_REFUND_FEE',value:'支付宝退费'},
        {code:'JD_SUM_TRANSFER',value:'京东转账'},
        {code:'JINGDOU',value:'随单送的京豆'},
        {code:'PDD_DEDUCT',value:'拼多多扣款'},
        {code:'CONSUME',value:'消费'},
        {code:'REFUND',value:'退款'},
        {code:'WITHDRAW',value:'提现'},
        {code:'COMMISSION',value:'佣金'},
    ],
    //差错类型
    errorType:[
        {code:'MASTER_MONEY_MORE',value:'主对账方长款'},
        {code:'MASTER_MONEY_LESS',value:'主对账方短款'},
        {code:'MASTER_JNL_MORE',value:'主对账方多'},
        {code:'SECONDARY_JNL_MORE',value:'次对账方多'},

    ]
}
const dailyReport=(code,k)=>{
    let dailyReportData='';
    Object.keys(dailyReportList).forEach(key => {
            if(k===key){
                dailyReportList[key].map((i)=>{
                    if(i.code===code){
                        dailyReportData=i.value;
                    }
                })
            }
    });
    return dailyReportData;
}
export default dailyReport