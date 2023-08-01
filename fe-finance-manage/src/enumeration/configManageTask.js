let configList={
    //对账类型
    checkType:[
        {code:'SALES',value:'销售'},
        {code:'PURCHASE',value:'采购'},
        {code:'WITHDRAW',value:'提现'}
    ],//对账开关
    jobStatus:[
        {code:'ENABLE',value:'启用'},
        {code:'DISABLED',value:'停用'}
    ],//节假日是否参与对账标志
    holidayCheckFlag:[
        {code:'YES',value:'是'},
        {code:'NO',value:'否'},
    ]
}
const configManage=(code,k)=>{
    let configData='';
    Object.keys(configList).forEach(key => {
            if(k===key){
                configList[key].map((i)=>{
                    if(i.code===code){
                        configData=i.value;
                    }
                })
            }
    });
    return configData;
}
export default configManage