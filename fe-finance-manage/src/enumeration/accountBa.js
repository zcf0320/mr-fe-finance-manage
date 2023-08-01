let writeList = {
    //科目余额枚举翻译
    //核算机构
    settleBranch: [
        { code: '01', value: '云药房' },
        { code: '02', value: '云健康' },
        { code: '03', value: '海南星创' },
        { code: '04', value: '复胜健康' },
        { code: '05', value: '复星医药销售' },
    ],
    //货币
    ccy: [
        { code: '156', value: '人民币' },
    ],

}
const accountBa = (code, k) => {
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
export default accountBa