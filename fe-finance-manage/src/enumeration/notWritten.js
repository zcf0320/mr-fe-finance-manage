let writeList = {
    //支付通道
    payWayCode: [
        { code: 'KUAIQIAN_PAY', value: '快钱提现' },
        { code: 'ALI_PAY', value: '支付宝提现' },
        { code: 'JINGDONG_PAY', value: '京东提现' }
    ]
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