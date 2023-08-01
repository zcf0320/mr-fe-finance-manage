let writeList = {
    //成本部门维护
    enable: [
        { code: '0', value: '启用' },
        { code: '1', value: '禁用' },
    ],

    deleted: [
        { code: '0', value: '已删除' },
        { code: '1', value: '未删除' },
    ],
}
const costMain = (code, k) => {
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
export default costMain