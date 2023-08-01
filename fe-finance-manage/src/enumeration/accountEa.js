let writeList = {
    //会计分录枚举翻译
    //请求系统
    requestSystem: [
        { code: 'finance-product', value: '业财产品' },
        { code: 'finance-check', value: '对账中心' },
        { code: 'finance-settle', value: '结算中心' },
        { code: 'finance-account', value: '业财总账' }
    ],
    //核算机构
    settleBranch: [
        { code: '01', value: '云药房' },
        { code: '02', value: '云健康' },
        { code: '03', value: '海南星创' },
        { code: '04', value: '复胜健康' },
        { code: '05', value: '复星医药销售' },
    ],
    //交易号
    accountNo: [
        { code: 'SELL_GOODS_CONFIRM', value: '确收' },
        { code: 'SELL_GOODS_CLEAR_PAYED', value: '清算客户' },
        { code: 'SELL_GOODS_CLEAR_PLAT', value: '清算平台' },
        { code: 'SELL_GOODS_INVOICE', value: '开立发票' },
        { code: 'SELL_GOODS_SETTLE', value: '结算' },
        { code: 'CASH_ADVANCE', value: '核销' }
    ],
    //币种
    ccy: [
        { code: '156', value: '人民币' }
    ],
    //借贷标志
    drcrFlag: [
        { code: 'cr', value: '贷' },
        { code: 'dr', value: '借' }
    ],
    //红字标识
    negativeFlag: [
        { code: 'y', value: '需要红字记账' },
        { code: 'n', value: '正常记账' }
    ],

}
const accountEa = (code, k) => {
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
export default accountEa