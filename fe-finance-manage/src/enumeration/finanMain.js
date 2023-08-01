let writeList = {
    //状态
    paymentStatus: [
        { code: 'o', value: '未付款' },
        { code: '1', value: '已申请' },
        { code: '2', value: '已审批' },
        { code: '3', value: '付款中' },
        { code: '4', value: '付款成功' },
        { code: '5', value: '付款失败' },
        { code: '6', value: '付款取消' },
        { code: '7', value: '审批驳回' },
        { code: '8', value: '付款异常' },
    ],

}
const finanMain = (code, k) => {
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
export default finanMain