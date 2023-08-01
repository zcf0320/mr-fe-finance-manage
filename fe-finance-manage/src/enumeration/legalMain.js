let writeList = {
    //账号与法体
    //账号类型
    accountType: [
        { code: 'cmbc', value: '招行' },
        { code: 'alipay', value: '支付宝' },
        { code: 'bill', value: '快钱' },
    ],

}
const legalMain = (code, k) => {
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
export default legalMain