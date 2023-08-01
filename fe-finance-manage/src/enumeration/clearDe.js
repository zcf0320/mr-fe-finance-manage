let writeList = {
    //结算结果明细翻译枚举
    //通道
    channelType: [
        { code: 'ALI_PAY', value: '支付宝' },
        { code: 'KUAIQIAN_PAY', value: '快钱' },
        { code: 'JINGDONG_PAY', value: '京东支付' },
    ],
    //交易类型
    tradeType: [
        { code: 'CONSUME', value: '消费' },
        { code: 'REFUND', value: '退款' },
        { code: 'WITHDRAW', value: '提现' }
    ],
    //清算状态
    clearStatus: [
        { code: '1', value: '待结算' },
        { code: '2', value: '已结算' },
        { code: '3', value: '结算失败' },
    ],
}
const writeOffSearch = (code, k) => {
    let wirteOffData = '';
    Object.keys(writeList).forEach(key => {
        if (k === key) {
            writeList[key].map((i) => {
                if (i.code === code) {
                    wirteOffData = i.value;
                }
            })
        }
    });
    return wirteOffData;
}
export default writeOffSearch