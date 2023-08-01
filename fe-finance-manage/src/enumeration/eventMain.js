let writeList = {
    //会计事件规则维护
    //借贷标识
    drcrFlag: [
        { code: 'dr', value: '借' },
        { code: 'cr', value: '贷' },

    ],
    //币种
    ccy: [
        { code: '156', value: '人民币' },
    ],
    //业务场景
    businessScenario: [
        { code: '1', value: 'OMS' },
        { code: '2', value: '供应链' },
    ],
    //金额类型
    amtType: [
        { code: '1', value: '应收账款-待清算' },
        { code: '2', value: '应收账款-待清算-平台' },
        { code: '3', value: '预收账款' },
        { code: '4', value: '主营业务收入-药品' },
        { code: '5', value: '主营业务收入-医疗器械' },
        { code: '6', value: '主营业务收入-非药非器械' },
        { code: '7', value: '增值税' },
        { code: '8', value: '库存商品' },
        { code: '9', value: '应收账款-已清算' },
        { code: '10', value: '销售费用-通道费' },
        { code: '11', value: '财务费用-手续费' },
        { code: '12', value: '银行存款-企业存款' },
        { code: '13', value: '其他货币-企业存款' },
        { code: '15', value: '商品销售数量' },
        { code: '16', value: '主营业务收入-佣金收入' },
        { code: '1', value: '库存商品-医疗器械' },
        { code: '2', value: '库存商品-非药非器械' },
        { code: '3', value: '应收账款-采购折扣款项' },
        { code: '4', value: '应付账款-暂估' },
        { code: '5', value: '应交税费-增值税(销项税)' },
        { code: '6', value: '应付账款-商品货款' },
        { code: '7', value: '库存商品-药品' },
        { code: '8', value: '主营业务成本-采购商品成本-药品' },
        { code: '9', value: '主营业务成本-采购商品成本-器械' },
        { code: '10', value: '主营业务成本-采购商品成本-非药非器械' },
    ],
}
const eventMain = (code, k) => {
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
export default eventMain