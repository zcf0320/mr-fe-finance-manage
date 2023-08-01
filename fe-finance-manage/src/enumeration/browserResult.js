let writeList = {
    //对账差错明细浏览翻译枚举
    //差错类型
    errorType: [
        { code: 'MASTER_MONEY_MORE', value: '主对账方长款' },
        { code: 'MASTER_MONEY_LESS', value: '主对账方短款' },
        { code: 'MASTER_JNL_MORE', value: '主对账方多' },
        { code: 'SECONDARY_JNL_MORE', value: '次对账方多' }
    ],
    //交易类型
    tradeType: [
        { code: 'CONSUME', value: '消费' },
        { code: 'REFUND', value: '退款' },
        { code: 'WITHDRAW', value: '提现' },
    ],
    //差错处理状态
    dealResult: [
        { code: 'BAD_ACCOUNT', value: '记坏账' },
        { code: 'MANUAL_DEAL', value: '转人工' },
        { code: 'UNDO', value: '未处理' },
        { code: 'AUTO_MAtTCH', value: '自动勾兑' }
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