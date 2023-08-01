let writeList={
    //银行名称
    thBankType:[
        {code:'CMBChina',value:'招商银行'},
        {code:'ICBC',value:'工商银行'}
    ],//出金/入金 
    inOutFlag:[
        {code:'IN',value:'入金'},
        {code:'OUT',value:'出金'}
    ],//核销转态
    verificationStatus:[
        {code:'1',value:'待核销'},
        {code:'2',value:'已核销'},
        {code:'3',value:'核销失败'}
    ],//支付通道
    paymentType:[
        {code:'支付宝',value:'ALI_PAY'},
        {code:'微信',value:'weixin'},
    ]
}
const writeOffSearch=(code,k)=>{
    let wirteOffData='';
    Object.keys(writeList).forEach(key => {
            if(k===key){
                writeList[key].map((i)=>{
                    if(i.code===code){
                        wirteOffData=i.value;
                    }
                })
            }
    });
    return wirteOffData;
}
export default writeOffSearch