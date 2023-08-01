let writeList = {
    //对账资金结果浏览翻译枚举
    //对账类型
    checkType: [
        { code: 'SALES', value: '销售' },
        { code: 'PURCHASE', value: '采购' },
        { code: 'WITHDRAW', value: '提现' },
    ],
    //执行阶段
    executePhase: [
        { code: 'INIT', value: '初始化' },
        { code: 'GET_FILE', value: '获取对账文件' },
        { code: 'IMPORT_FILE', value: '对账文件入库' },
        { code: 'CHECK_JNL', value: '核对流水' },
        { code: 'MARK_ERROR', value: '对账差错标记' },
        { code: 'ERROR_MATCH', value: '差错勾兑' },
    ],
    //阶段状态
    phaseStatus: [
        { code: 'DOING', value: '执行中' },
        { code: 'SUCCESS', value: '成功' },
        { code: 'FAILED', value: '失败' },
        { code: 'UNDO', value: '未开始' }
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