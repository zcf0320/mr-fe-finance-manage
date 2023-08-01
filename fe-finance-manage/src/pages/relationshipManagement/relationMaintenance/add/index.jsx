import React, { useEffect, useState, useRef, } from 'react';
import { Button, Modal, message, Input, Table, Select, Space, Form, Row, Col, Tag, notification } from 'antd';
import { connect } from 'react-redux';
import { cacheUserInfo } from '@state/action/index';
import _ from 'lodash'
import {
    costRelationList, costRelationLook, costRelationModify, costRelationAdd,
    costRelationDepartmentList, costRelationUnitList, costRelationDepartment, costRelationFirstDepartment
} from '@api/costRelation'

// import { number } from 'echarts';


const add = (props) => {
    const { TextArea } = Input;
    const { history } = props;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { cacheUser, userInfo } = props;
    const [tellerNo, setTellerNo] = useState(userInfo.username)
    const [checkStrictly, setCheckStrictly] = React.useState(false);

    const [operation, setOperation] = useState();
    const [a, setA] = useState("0")
    const [propsdata, setPropsData] = useState(props.location.query)
    const [legaid, setLegaid] = useState(propsdata&&propsdata.record ? propsdata.record.id : '')
    const [CostRelationName, setCostRelationName] = useState(propsdata&&propsdata.record ? propsdata.record.costRelationName : '')
    const [Remark, setREmark] = useState(propsdata&&propsdata.record ? propsdata.record.remark : '')
    const [tableData, setTableData] = useState([])
    const [thirdTabData, setThirdTabData] = useState()
    const [loadingData,setLoadingData]=useState(false)
    //存放编辑的信息
    const [editData,setEditData]=useState({});
    //存放删除的相关信息
    const [deleteData,setDeleteData]=useState({});

    // const [changeCostName, setChangeCostName] = useState()
    // const [changeRemark, setChangeRemark] = useState()
    // const [changeStateValue, setChangeStateValue] = useState()
    // const [legalId, setlegalId] = useState()
    //添加
    const [addCostName, setAddCostName] = useState(propsdata&&propsdata.record ? propsdata.record.costRelationName : '')
    const [addSostName, setAddSostName] = useState(propsdata&&propsdata.record ? propsdata.record.remark : '')
    //下拉
    const [firstMentList, setFirstmentList] = useState()
    const [depertMentList, setDepartmentList] = useState()
    const [departmentlist, setdepartmentlist] = useState()
    const [relationlist, setRelation] = useState()
    const [firstselId, setfirstSelId] = useState()
    const [departmentId, setDepartmentId] = useState()
    const [costId, setCostId] = useState()
    const [deId, setDeId] = useState()
    const [firstselName, setfirstSelName] = useState()
    const [departmentName, setDepartmentName] = useState()
    const [costName, setCostName] = useState()
    const [deName, setDeName] = useState()
    //修改
    const [form] = Form.useForm();
    const [record, setRecord] = useState()

    const [changefirstSelId, setChangefirstSelId] = useState()
    const [changefirstSelName, setChangefirstSelName] = useState()
    const [changeDepartmentId, setChangeDepartmentId] = useState()
    const [changeDepartmentName, setChangeDepartmentName] = useState()
    const [changeCostId, setChangeCostId] = useState()
    const [changeCostName, setChangeCostName] = useState()
    const [changeDeId, setChangeDeId] = useState()
    const [changeDeName, setChangeDeName] = useState()
    //删除
    const [tabId, setTabId] = useState()

    // 4个 设置
    const [hiddenSelectArray,setHiddenSelectArray]= useState([0,1,1,1])
    
    //存放 业务部门名称
    const [disableDepertMentList,setDisableDepertMentList]= useState([])
    const [disableEditDepertMentList,setDisableEditDepertMentList]= useState([])

    //存放成本部门
    const [disableCostDepartment,setDisableCostDepartment]= useState([])
    const [disableEditCostDepartment,setDisableEditCostDepartment]= useState([])
    //存放 业务单元不可选择
    const [disableBusinessUnit,setDisableBusinessUnit]= useState([])
    const [disableEditBusinessUnit,setDisableEditBusinessUnit]= useState([])


   //存当前Table下可以选择的业务部门名称
    const [optDepertMentList,setOptDepertMentList]= useState(new Map())
    const [optEditDepertMentList,setOptEditDepertMentList]= useState(new Map())


    //存当前Table下可以选择的成本部门
    const [optCostDepartment,setOptCostDepartment]= useState(new Map())
    const [optEditCostDepartment,setOptEditCostDepartment]= useState(new Map())

    //存放table 下标的位置 方便后面查找
    const [firstSelectIndex, setFirstSelectIndex]=useState();


    // let obj = {
    //     firstselId: firstselId,
    //     firstselName: firstselName,
    //     departmentId: departmentId,
    //     departmentName: departmentName,
    //     costId: costId,
    //     costName: costName,
    //     deId: deId,
    //     deName: deName
    // }
    const handleDataMearge =  (oldData,currentData) =>{
        let res=[]
        let level;
        res=JSON.parse(JSON.stringify(oldData));
        if(res.length<1){
            res.push(currentData)
        }else{
            let i=0
             while (i<res.length){
                let one_items=res[i];
                if(Number(one_items.id)===Number(currentData.id)){
                    one_items.children.forEach((two_item)=> {
                        if (Number(two_item.id) === Number(currentData.children[0].id)) {
                            //二级相等
                            two_item.children.forEach((three_item)=>{
                                if(Number(three_item.id)===Number(currentData.children[0].children[0].id)){
                                    //三级相等 4级是绝对不会相等的
                                    if(!level){
                                        level=1;
                                        three_item.children=three_item.children.concat(currentData.children[0].children[0].children)
                                        return res
                                    }
                                }
                            })
                            //三级不相等情况
                            if(!level){
                                level=2;
                                two_item.children= two_item.children.concat(currentData.children[0].children)
                                return res
                            }
                        }
                    })
                    //二级不相等的情况
                    if(!level){
                        level=3;
                        one_items.children= one_items.children.concat(currentData.children)
                    }
                }
                 i++;
             }
            if(!level){
                // 当其他地方修改过后 不能被修改
                level=4;
            }
          if(level===4){
              // 避免多次添加
              res.push(currentData);
          }
        }
        return res;
    }


    const handleEditDataMearge =  (oldData,currentData) =>{
        let res=[];
        res=JSON.parse(JSON.stringify(oldData));
        //编辑前的数据
        const {_changefirstSelId,_changeDepartmentId,_changeCostId,_changeDeId,level} =editData;
        if(level===1) {
            //一级修改 情况 是把 2 3 4 直接挂载到新的上，然后删除旧的1， 1的旧id 是_changefirstSelId
            for (let i = 0; i < res.length; i++) {
                // 当前数组中存在 与 当前修改的一级Id 一样
                if (Number(res[i].id) === Number( currentData.id)) {
                    // 将编辑前所有二级子数据放到修改后的一级ID下
                    for (let j = 0; j < res.length; j++) {
                        if (Number(res[j].id) === Number(_changefirstSelId)) {
                            res[i].children=  res[i].children.concat(res[j].children)
                            _.remove(res,(item)=>Number(item.id)===Number(_changefirstSelId))
                            return res;
                        }
                    }
                }
            }
            // 当前数组中不存在 与 当前修改的一级Id 一样
            for (let j = 0; j < res.length; j++) {
                if (Number(res[j].id) === Number(_changefirstSelId)) {
                    _.remove(currentData.children, (item)=> true);
                    currentData.children = currentData.children.concat(res[j].children)
                    res = res.concat(currentData);
                    _.remove(res,(item)=>Number(item.id)===Number(_changefirstSelId))
                    return res;
                }
            }

        }
        else if(level===2){
            //二级修改 情况 是把 3 4 直接挂载到新的上，然后删除旧的1 2，  2的id_changeDepartmentId
            for(let i=0; i<res.length;i++){
                if(Number(res[i].id)!== Number(currentData.id)){
                    continue;
                }

                // 当前数组中存在 与 当前修改的一级Id 一样
                let one_children=res[i].children;
                for(let ii=0; ii<one_children.length; ii++){
                    if(Number(one_children[ii].id)!== Number(currentData.children[0].id)){
                        continue;
                    }

                    //二级也相等情况  当1 2 级相等的情况下 直接把 3 4 的放到 对应子节点下并删除当前修改的节点
                    // 将编辑前所有二级子数据放到修改后的一级ID下
                    for (let j = 0; j < res.length; j++) {
                        if (Number(res[j].id) !== Number(_changefirstSelId)) {
                            continue;
                        }
                        let one_children_j=res[j].children;
                        for (let jj = 0; jj < one_children_j.length; jj++) {
                            if (Number(one_children_j[jj].id) !== Number(_changeDepartmentId)) {
                                continue;
                            }
                            one_children[ii].children = one_children[ii].children
                                .concat(one_children_j[jj].children)
                            _.remove(res[j].children,(item)=>Number(item.id)===Number(_changeDepartmentId))
                            if (res[j].children.length === 0) {
                                // 当前一级部门下无二级部门，删除当前一级部门
                                _.remove(res,(item)=>Number(item.id)===Number(_changefirstSelId))
                            }
                            return res;
                        }
                    }
                }

                // 当前数组中不存在 与 当前修改的二级Id一样子节点，新增一个子节点
                for (let j = 0; j < res.length; j++) {
                    if (Number(res[j].id) === Number(_changefirstSelId)) {
                        let one_children_j=res[j].children;
                        for (let jj = 0; jj < one_children_j.length; jj++) {
                            if (Number(one_children_j[jj].id) === Number(_changeDepartmentId)) {
                                _.remove(currentData.children[0].children, (item)=> true);
                                currentData.children[0].children =
                                    currentData.children[0].children.concat(one_children_j[jj].children);
                                res[i].children = res[i].children.concat(currentData.children[0]);
                                _.remove(res[j].children,(item)=>Number(item.id)===Number(_changeDepartmentId))
                                if (one_children_j.length === 0) {
                                    // 当前一级部门下无二级部门，删除当前一级部门
                                    _.remove(res,(item)=>Number(item.id)===Number(_changefirstSelId))
                                }
                                return res;
                            }
                        }
                    }
                }

            }

            // 当前数组中不存在 与 当前修改的一级Id一样子节点，新增一个子节点
            for (let j = 0; j < res.length; j++) {
                if (Number(res[j].id) !== Number(_changefirstSelId)) {
                    continue;
                }
                let one_children_j=res[j].children;
                for (let jj = 0; jj < one_children_j.length; jj++) {
                    if (Number(one_children_j[jj].id) !== Number(_changeDepartmentId)) {
                        continue;
                    }

                    _.remove(currentData.children[0].children, ()=> true);
                    currentData.children[0].children =
                        currentData.children[0].children.concat(one_children_j[jj].children);

                    res = res.concat(currentData);
                    _.remove(res[j].children,(item)=>Number(item.id)===Number(_changeDepartmentId))
                    if (one_children_j.length === 0) {
                        // 当前一级部门下无二级部门，删除当前一级部门
                        _.remove(res,(item)=>Number(item.id)===Number(_changefirstSelId))
                    }
                    return res;
                }
            }

        }
        else if (level===3) {
            // 三级修改 情况 是把 4 直接挂载到新的上，然后删除旧的123
            for(let i=0; i<res.length;i++){
                if(Number(res[i].id)!== Number(currentData.id)){
                    continue;
                }

                // 当前数组中存在 与 当前修改的一级Id 一样
                let one_children=res[i].children;
                for(let ii=0; ii<one_children.length; ii++){
                    if(Number(one_children[ii].id)!== Number(currentData.children[0].id)){
                        continue;
                    }

                    // 当前数组中存在 与 当前修改的二级Id 一样
                    let two_children=one_children[ii].children;
                    for(let iii=0; iii<two_children.length; iii++) {
                        if (Number(two_children[iii].id) !== Number(currentData.children[0].children[0].id)) {
                            continue;
                        }
                        // 当前数组中存在 与 当前修改的三级Id 一样

                        // 将编辑前所有四级子数据放到修改后的三级ID下
                        for (let j = 0; j < res.length; j++) {
                            if (Number(res[j].id) !== Number(_changefirstSelId)) {
                                continue;
                            }
                            let one_children_j=res[j].children;
                            for (let jj = 0; jj < one_children_j.length; jj++) {
                                if (Number(one_children_j[jj].id) !== Number(_changeDepartmentId)) {
                                    continue;
                                }
                                let two_children_j=one_children_j[jj].children;
                                for (let jjj = 0; jjj < two_children_j.length; jjj++) {
                                    if (Number(two_children_j[jjj].id) !== Number(_changeCostId)) {
                                        continue;
                                    }

                                    two_children[iii].children = two_children[iii].children
                                        .concat(two_children_j[jjj].children)
                                    _.remove(res[j].children[jj].children,(item)=>Number(item.id)===Number(_changeCostId))
                                    if (res[j].children[jj].children.length === 0) {
                                        // 当前二级部门下无三级部门，删除当前二级部门
                                        _.remove(res[j].children,(item)=>Number(item.id)===Number(_changeDepartmentId))
                                        if (res[j].children.length === 0) {
                                            // 当前一级部门下无二级部门，删除当前一级部门
                                            _.remove(res,(item)=>Number(item.id)===Number(_changefirstSelId))
                                        }
                                    }
                                    return res;
                                }
                            }
                        }
                    }

                    // 当前数组中不存在 与 当前修改的三级Id 一样,新增一个3级节点
                    for (let j = 0; j < res.length; j++) {
                        if (Number(res[j].id) !== Number(_changefirstSelId)) {
                            continue;
                        }
                        let one_children_j=res[j].children;
                        for (let jj = 0; jj < one_children_j.length; jj++) {
                            if (Number(one_children_j[jj].id) !== Number(_changeDepartmentId)) {
                                continue;
                            }
                            let two_children_j=one_children_j[jj].children;
                            for (let jjj = 0; jjj < two_children_j.length; jjj++) {
                                if (Number(two_children_j[jjj].id) !== Number(_changeCostId)) {
                                    continue;
                                }
                                _.remove(currentData.children[0].children[0].children, (item)=> true);
                                currentData.children[0].children[0].children =
                                    currentData.children[0].children[0].children.concat(two_children_j[jjj].children);

                                res[i].children[ii].children =
                                    res[i].children[ii].children.concat(currentData.children[0].children[0]);

                                _.remove(res[j].children[jj].children,(item)=>Number(item.id)===Number(_changeCostId))
                                if (res[j].children[jj].children.length === 0) {
                                    // 当前二级部门下无三级部门，删除当前二级部门
                                    _.remove(res[j].children,(item)=>Number(item.id)===Number(_changeDepartmentId))
                                    if (res[j].children.length === 0) {
                                        // 当前一级部门下无二级部门，删除当前一级部门
                                        _.remove(res,(item)=>Number(item.id)===Number(_changefirstSelId))
                                    }
                                }
                                return res;
                            }
                        }
                    }
                }

                // 当前数组中不存在 与 当前修改的二级Id一样子节点，新增一个2级节点
                for (let j = 0; j < res.length; j++) {
                    if (Number(res[j].id) !== Number(_changefirstSelId)) {
                        continue;
                    }
                    let one_children_j=res[j].children;
                    for (let jj = 0; jj < one_children_j.length; jj++) {
                        if (Number(one_children_j[jj].id) !== Number(_changeDepartmentId)) {
                            continue;
                        }
                        let two_children_j=one_children_j[jj].children;
                        for (let jjj = 0; jjj < two_children_j.length; jjj++) {
                            if (Number(two_children_j[jjj].id) !== Number(_changeCostId)) {
                                continue;
                            }
                            _.remove(currentData.children[0].children[0].children, (item)=> true);
                            currentData.children[0].children[0].children =
                                currentData.children[0].children[0].children.concat(two_children_j[jjj].children);

                            res[i].children =
                                res[i].children.concat(currentData.children[0]);
                            _.remove(res[j].children[jj].children,(item)=>Number(item.id)===Number(_changeCostId))
                            if (res[j].children[jj].children.length === 0) {
                                // 当前二级部门下无三级部门，删除当前二级部门
                                _.remove(res[j].children,(item)=>Number(item.id)===Number(_changeDepartmentId))
                                if (res[j].children.length === 0) {
                                    // 当前一级部门下无二级部门，删除当前一级部门
                                    _.remove(res,(item)=>Number(item.id)===Number(_changefirstSelId))
                                }
                            }
                            return res;
                        }
                    }
                }

            }

            // 当前数组中不存在 与 当前修改的一级Id一样子节点，新增一个一级节点
            for (let j = 0; j < res.length; j++) {
                if (Number(res[j].id) !== Number(_changefirstSelId)) {
                    continue;
                }
                let one_children_j=res[j].children;
                for (let jj = 0; jj < one_children_j.length; jj++) {
                    if (Number(one_children_j[jj].id) !== Number(_changeDepartmentId)) {
                        continue;
                    }
                    let two_children_j=one_children_j[jj].children;
                    for (let jjj = 0; jjj < two_children_j.length; jjj++) {
                        if (Number(two_children_j[jjj].id) !== Number(_changeCostId)) {
                            continue;
                        }
                        _.remove(currentData.children[0].children[0].children, (item)=> true);
                        currentData.children[0].children[0].children =
                            currentData.children[0].children[0].children.concat(two_children_j[jjj].children);

                        res = res.concat(currentData);
                        _.remove(res[j].children[jj].children,(item)=>Number(item.id)===Number(_changeCostId))
                        if (res[j].children[jj].children.length === 0) {
                            // 当前二级部门下无三级部门，删除当前二级部门
                            _.remove(res[j].children,(item)=>Number(item.id)===Number(_changeDepartmentId))
                            if (res[j].children.length === 0) {
                                // 当前一级部门下无二级部门，删除当前一级部门
                                _.remove(res,(item)=>Number(item.id)===Number(_changefirstSelId))
                            }
                        }
                        return res;
                    }
                }
            }

        }
        else if(level===4){
            // 三级修改 情况 是把 4 直接挂载到新的上，然后删除旧的123
            for(let i=0; i<res.length;i++){
                if(Number(res[i].id)!== Number(currentData.id)){
                    continue;
                }

                // 当前数组中存在 与 当前修改的一级Id 一样
                let one_children=res[i].children;
                for(let ii=0; ii<one_children.length; ii++){
                    if(Number(one_children[ii].id)!== Number(currentData.children[0].id)){
                        continue;
                    }

                    // 当前数组中存在 与 当前修改的二级Id 一样
                    let two_children=one_children[ii].children;
                    for(let iii=0; iii<two_children.length; iii++) {
                        if (Number(two_children[iii].id) !== Number(currentData.children[0].children[0].id)) {
                            continue;
                        }
                        // 当前数组中存在 与 当前修改的三级Id 一样
                        two_children[iii].children = two_children[iii].children
                            .concat(currentData.children[0].children[0].children)

                        for (let j = 0; j < res.length; j++) {
                            if (Number(res[j].id) !== Number(_changefirstSelId)) {
                                continue;
                            }
                            let one_children_j=res[j].children;
                            for (let jj = 0; jj < one_children_j.length; jj++) {
                                if (Number(one_children_j[jj].id) !== Number(_changeDepartmentId)) {
                                    continue;
                                }
                                let two_children_j=one_children_j[jj].children;
                                for (let jjj = 0; jjj < two_children_j.length; jjj++) {
                                    if (Number(two_children_j[jjj].id) !== Number(_changeCostId)) {
                                        continue;
                                    }
                                    let three_children_j=two_children_j[jjj].children;
                                    for (let jjjj = 0; jjjj < three_children_j.length; jjjj++) {
                                        if (Number(three_children_j[jjjj].id) !== Number(_changeDeId)) {
                                            continue;
                                        }
                                        _.remove(res[j].children[jj].children[jjj].children,
                                            (item) => Number(item.id) === Number(_changeDeId));
                                        if (res[j].children[jj].children[jjj].children.length === 0) {
                                            // 当前3级部门下无4级部门，删除当前3级部门
                                            _.remove(res[j].children[jj].children, (item) => Number(item.id) === Number(_changeCostId))
                                            if (res[j].children[jj].children.length === 0) {
                                                // 当前二级部门下无三级部门，删除当前二级部门
                                                _.remove(res[j].children, (item) => Number(item.id) === Number(_changeDepartmentId))
                                                if (res[j].children.length === 0) {
                                                    // 当前一级部门下无二级部门，删除当前一级部门
                                                    _.remove(res, (item) => Number(item.id) === Number(_changefirstSelId))
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        return res;
                    }
                    // 当前数组中不存在 与 当前修改的三级Id 一样,新增一个3级节点
                    one_children[ii].children = one_children[ii].children
                        .concat(currentData.children[0].children)

                    for (let j = 0; j < res.length; j++) {
                        if (Number(res[j].id) !== Number(_changefirstSelId)) {
                            continue;
                        }
                        let one_children_j=res[j].children;
                        for (let jj = 0; jj < one_children_j.length; jj++) {
                            if (Number(one_children_j[jj].id) !== Number(_changeDepartmentId)) {
                                continue;
                            }
                            let two_children_j=one_children_j[jj].children;
                            for (let jjj = 0; jjj < two_children_j.length; jjj++) {
                                if (Number(two_children_j[jjj].id) !== Number(_changeCostId)) {
                                    continue;
                                }
                                let three_children_j=two_children_j[jjj].children;
                                for (let jjjj = 0; jjjj < three_children_j.length; jjjj++) {
                                    if (Number(three_children_j[jjjj].id) !== Number(_changeDeId)) {
                                        continue;
                                    }
                                    _.remove(res[j].children[jj].children[jjj].children,
                                        (item) => Number(item.id) === Number(_changeDeId));
                                    if (res[j].children[jj].children[jjj].children.length === 0) {
                                        // 当前3级部门下无4级部门，删除当前3级部门
                                        _.remove(res[j].children[jj].children, (item) => Number(item.id) === Number(_changeCostId))
                                        if (res[j].children[jj].children.length === 0) {
                                            // 当前二级部门下无三级部门，删除当前二级部门
                                            _.remove(res[j].children, (item) => Number(item.id) === Number(_changeDepartmentId))
                                            if (res[j].children.length === 0) {
                                                // 当前一级部门下无二级部门，删除当前一级部门
                                                _.remove(res, (item) => Number(item.id) === Number(_changefirstSelId))
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    return res;
                }

                res[i].children = res[i].children
                    .concat(currentData.children)

                for (let j = 0; j < res.length; j++) {
                    if (Number(res[j].id) !== Number(_changefirstSelId)) {
                        continue;
                    }
                    let one_children_j=res[j].children;
                    for (let jj = 0; jj < one_children_j.length; jj++) {
                        if (Number(one_children_j[jj].id) !== Number(_changeDepartmentId)) {
                            continue;
                        }
                        let two_children_j=one_children_j[jj].children;
                        for (let jjj = 0; jjj < two_children_j.length; jjj++) {
                            if (Number(two_children_j[jjj].id) !== Number(_changeCostId)) {
                                continue;
                            }
                            let three_children_j=two_children_j[jjj].children;
                            for (let jjjj = 0; jjjj < three_children_j.length; jjjj++) {
                                if (Number(three_children_j[jjjj].id) !== Number(_changeDeId)) {
                                    continue;
                                }
                                _.remove(res[j].children[jj].children[jjj].children,
                                    (item) => Number(item.id) === Number(_changeDeId));
                                if (res[j].children[jj].children[jjj].children.length === 0) {
                                    // 当前3级部门下无4级部门，删除当前3级部门
                                    _.remove(res[j].children[jj].children, (item) => Number(item.id) === Number(_changeCostId))
                                    if (res[j].children[jj].children.length === 0) {
                                        // 当前二级部门下无三级部门，删除当前二级部门
                                        _.remove(res[j].children, (item) => Number(item.id) === Number(_changeDepartmentId))
                                        if (res[j].children.length === 0) {
                                            // 当前一级部门下无二级部门，删除当前一级部门
                                            _.remove(res, (item) => Number(item.id) === Number(_changefirstSelId))
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                return res;

            }

            // 当前数组中不存在 与 当前修改的一级Id一样子节点，新增一个一级节点
            res=res.concat(currentData)
            for (let j = 0; j < res.length; j++) {
                if (Number(res[j].id) !== Number(_changefirstSelId)) {
                    continue;
                }
                let one_children_j=res[j].children;
                for (let jj = 0; jj < one_children_j.length; jj++) {
                    if (Number(one_children_j[jj].id) !== Number(_changeDepartmentId)) {
                        continue;
                    }
                    let two_children_j=one_children_j[jj].children;
                    for (let jjj = 0; jjj < two_children_j.length; jjj++) {
                        if (Number(two_children_j[jjj].id) !== Number(_changeCostId)) {
                            continue;
                        }
                        let three_children_j=two_children_j[jjj].children;
                        for (let jjjj = 0; jjjj < three_children_j.length; jjjj++) {
                            if (Number(three_children_j[jjjj].id) !== Number(_changeDeId)) {
                                continue;
                            }
                            _.remove(res[j].children[jj].children[jjj].children,
                                (item) => Number(item.id) === Number(_changeDeId));
                            if (res[j].children[jj].children[jjj].children.length === 0) {
                                // 当前3级部门下无4级部门，删除当前3级部门
                                _.remove(res[j].children[jj].children, (item) => Number(item.id) === Number(_changeCostId))
                                if (res[j].children[jj].children.length === 0) {
                                    // 当前二级部门下无三级部门，删除当前二级部门
                                    _.remove(res[j].children, (item) => Number(item.id) === Number(_changeDepartmentId))
                                    if (res[j].children.length === 0) {
                                        // 当前一级部门下无二级部门，删除当前一级部门
                                        _.remove(res, (item) => Number(item.id) === Number(_changefirstSelId))
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return res;
    }


    //错误弹框
    const openNotification = (type,errorMsg) => {
        notification[type]({
            duration: 3,
            description: errorMsg
        });
    }

    const handleDelData=(oldData)=>{
       const {level,delRecord} =deleteData;
       let delId=Number(delRecord.id)
        let res=[];
        res=JSON.parse(JSON.stringify(oldData));
        if(level===1){
            //删除1级的情况
            _.remove(res,(item)=>Number(item.id)===delId)
        }
        else if(level===2){
            // 2级的情况
             for(let i =0; i<res.length;i++){
                 let twoItem=res[i].children
                 for(let ii=0; ii<twoItem.length;ii++){
                      if(Number(twoItem[ii].id)===delId){
                          if(twoItem.length===1 ){
                              //   删除2级情况 并且2级节点只有1个的情况
                              _.remove(res,(item)=>Number(item.id)===Number(res[i].id))
                          }else{
                              //   删除2级情况 并且2级节点有多个的情况
                              _.remove(twoItem,(item)=>Number(item.id)===delId)
                          }
                      }
                 }
             }
        }
        else if(level===3){
            // 3级的情况
            for(let i =0; i<res.length;i++){
                let twoItem=res[i].children
                for(let ii=0; ii<twoItem.length;ii++){
                    let threeItem=twoItem[ii].children
                    for(let iii=0; iii<threeItem.length;iii++){
                        if(Number(threeItem[iii].id)===delId){
                           if(threeItem.length===1){
                               if(twoItem.length===1){
                                   //   删除3级情况 并且3级节点只有1个的情况 2级节点只有1个
                                   _.remove(res,(item)=>Number(item.id)===Number(res[i].id))
                               }else{
                                   //   删除3级情况 并且3级节点只有1个的情况 2级节点有多个
                                   _.remove(twoItem,(item)=>Number(item.id)===Number(twoItem[ii].id))
                               }
                           }else {
                               //   删除3级情况 并且3级节点有多个的情况
                               _.remove(threeItem,(item)=>Number(item.id)===delId)
                           }
                        }
                    }
                }
            }
        }
        else if(level===4){
            // 4级的情况  待测
            for(let i =0; i<res.length;i++){
                let twoItem=res[i].children
                for(let ii=0; ii<twoItem.length;ii++){
                    let threeItem=twoItem[ii].children
                    for(let iii=0; iii<threeItem.length;iii++){
                        let fourItem=threeItem[iii].children
                        for(let iiii=0; iiii<fourItem.length;iiii++){
                            if(Number(fourItem[iiii].id)===delId){
                                if(fourItem.length===1){
                                    if(threeItem.length===1){
                                        if(twoItem.length===1){
                                            // 删除4级节点 1234 都只有1个的情况
                                            _.remove(res,(item)=>Number(item.id)===Number(res[i].id))
                                        }else{
                                            // 删除4级节点 并且3级节点和4级只有1个 2级节点有多个情况
                                            _.remove(twoItem,(item)=>Number(item.id)===Number(twoItem[ii].id))
                                        }
                                    }else{
                                        // 删除4级节点 并且3级节点有多个的情况
                                         if(twoItem.length===1){
                                             // 删除4级节点 并且3级节点有多个的情况 2级节点只有1个情况
                                             _.remove(twoItem,(item)=>Number(item.id)===Number(twoItem[ii].id))

                                         }else{
                                             // 删除4级节点 4级节点1个 并且3级节点有多个的情况 2级节点多个情况
                                             _.remove(threeItem,(item)=>Number(item.id)===Number(threeItem[iii].id))
                                         }
                                    }
                                }else{
                                    // 删除4级节点 并且4级节点有多个的情况
                                    _.remove(fourItem,(item)=>Number(item.id)===delId)
                                }

                            }

                        }
                    }
                }
            }
        }


        return res
    }


    const handleIdList =() =>{
        let idList=[]
        let relationId = "";
        if (propsdata.type === 'edit'){
            relationId = legaid
        }

        for (let i=0; i<tableData.length;i++){
            for (let ii=0; ii<tableData[i].children.length;ii++){
                for (let iii=0; iii<tableData[i].children[ii].children.length;iii++){
                    for (let iiii=0; iiii<tableData[i].children[ii].children[iii].children.length;iiii++){
                        let obj={
                            costRelationId: relationId,
                            costFirstDepartmentId:'',
                            costBusinessDepartmentId:'',
                            costDepartmentId:'',
                            costBusinessUnitId:'',
                        }
                        obj.costFirstDepartmentId=tableData[i].id
                        obj.costBusinessDepartmentId=tableData[i].children[ii].id;
                        obj.costDepartmentId=tableData[i].children[ii].children[iii].id;
                        obj.costBusinessUnitId=tableData[i].children[ii].children[iii].children[iiii].id;
                        idList.push(obj)
                    }
                }
            }
        }
        return idList;
    }
    const handleOk = async () => {
        if (a === '1') {
            //新增
            let currentData={
                "id": firstselId,
                "key":firstselId,
                "name": firstselName,
                "children": [
                    {
                        "id": departmentId,
                        "key":firstselId+departmentId,
                        "name": departmentName,
                        "children": [
                            {
                                "id": costId,
                                "key":firstselId+departmentId+costId,
                                "name": costName,
                                "children": [
                                    {
                                        "id": deId,
                                        "name": deName,
                                        "key":firstselId+departmentId+costId+deId,
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
            try {
                let obj=  handleDataMearge(tableData,currentData)
                setTableData(obj)
            }catch(e){
            }
        }
        else if (a === '2') {
            //编辑
            let currentData={
                "id": changefirstSelId,
                "key":changefirstSelId,
                "name": changefirstSelName,
                "children": [
                    {
                        "id": changeDepartmentId,
                        "key":changefirstSelId+changeDepartmentId,
                        "name": changeDepartmentName,
                        "children": [
                            {
                                "id": changeCostId,
                                "key":changefirstSelId+changeDepartmentId+changeCostId,
                                "name": changeCostName,
                                "children": [
                                    {
                                        "id": changeDeId,
                                        "name": changeDeName,
                                        "key":changefirstSelId+changeDepartmentId+changeCostId+changeDeId,
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }

            let obj=  handleEditDataMearge(tableData,currentData)
            setTableData(obj)

            // changeId(tableData, name, newName);
        }
        else if (a === '3') {
            //删除处理
            let obj = handleDelData(tableData)
            setTableData(obj)
        } else if (a === '4') {
            if (propsdata.type === 'add') {
                let idList =handleIdList();
                let params = {
                    costRelationName: addCostName,
                    remark: addSostName,
                    tellerNo: tellerNo,
                    idList: idList
                }
                let res = await costRelationAdd(params)
                if (res.success) {
                    openNotification('success','添加成功')
                } else {
                    openNotification('error',res.errorMsg ? res.errorMsg : '添加失败')
                }

            }else if (propsdata.type === 'copy'){
                let idList =handleIdList();
                //dzy 复制操作 调用新增接口
                let params = {
                    costRelationName: addCostName,
                    remark: addSostName,
                    tellerNo: tellerNo,
                    idList:  idList
                }
               let res = await costRelationAdd(params)
                if (res.success) {
                    openNotification('success','复制成功')
                } else {
                    openNotification('error',res.errorMsg ? res.errorMsg : '复制失败')
                }
            } else if (propsdata.type === 'edit'){
                let idList =handleIdList();
                //编辑操作 调用更新接口
                let params = {
                    id: legaid,
                    costRelationName: addCostName,
                    remark: addSostName,
                    tellerNo: tellerNo,
                    idList:  idList
                }
                let res = await costRelationModify(params)
                if (res.success) {
                    openNotification('success','编辑成功')
                } else {
                    openNotification('error',res.errorMsg ? res.errorMsg : '编辑失败')
                }
            }
        }
        setIsModalVisible(false);
    };
    //编辑表格数据
    const changeId=(objAry, key, newkey)=>{
        if (objAry != null) {
          objAry.forEach((item) => {
            Object.assign(item, {
              [newkey]: item[key],
            });
            delete item[key];
            changeId(item.children, key, newkey);
          });
        }
      }
    //删除表格数据
    const findId = (data, id) => {
        data ? data.forEach((item, index, data) => {
            if (item.id == id) {
                data.splice(index, 1)
            } else {
                findId(item.children, id)
            }
        }) : ''
        return data;
    }
    const handleCancel = () => {

        setIsModalVisible(false);

    };
    //表单提交成功
    const onFinish = async () => {

    };
    //表单提交失败
    const onFinishFailed = (e) => {
        setIsModalVisible(true);
    };
    //弹框判断
    const look = (a) => {
        if (a === "1") {
            setOperation("添加业务成本");
            setA(a)
        } else if (a === "2") {
            setOperation("编辑业务成本");
            setA(a)
        } else if (a === "3") {
            setOperation("删除业务成本");
            setA(a)
        }
        setIsModalVisible(true);
    };

    useEffect(() => {
        firstmentList()
        departmentList()
        costRelationunitList()
        costDepartmentList()
        if (propsdata&&propsdata.type) {
            if (propsdata.type !== 'add') {
                setLoadingData(true)
                queryPageDetail()
            }
        }
    }, [])

    const costDepartmentList = async () => {
        const res = await costRelationDepartmentList();
        setDepartmentList(res.result)
    }
    const costRelationunitList = async () => {
        const res = await costRelationUnitList();
        setRelation(res.result)
    }
    const departmentList = async () => {
        const res = await costRelationDepartment();
        setdepartmentlist(res.result)
    }
    const firstmentList = async () => {
        const res = await costRelationFirstDepartment();
        setFirstmentList(res.result)
    }
    //查看
    const queryPageDetail = async () => {
        let params = {
            costRelationId: legaid,
            costRelationName: CostRelationName,
            remark: Remark,
            tellerNo: tellerNo,
        }
        const res = await costRelationLook(params)
        let and = res.result ? res.result.costFirstDepartmentList : []
        const data = and.map((item1, index1) => {
            return {
                key: `${index1 + 1}`,
                id: item1.costFirstDepartmentId,
                name: item1.firstDepartmentName,
                children: item1.costBusinessDepartmentList.map((item2, index2) => {
                    return {
                        key: `${index1 + 1}${index2 + 1}`,
                        id: item2.costBusinessDepartmentId,
                        name: item2.businessDepartmentName,
                        children: item2.costDepartmentList.map((item3, index3) => {
                            return {
                                key: `${index1 + 1}${index2 + 1}${index3 + 1}`,
                                id: item3.costDepartmentId,
                                name: item3.departmentName,
                                children: item3.costBusinessUnitList.map((item4, index4) => {
                                    return {
                                        key: `${index1 + 1}${index2 + 1}${index3 + 1}${index4 + 1}`,
                                        id: item4.costBusinessUnitId,
                                        name: item4.businessUnitName,
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })


        setTableData(data)
        setLoadingData(false)
    }
    //添加
    const firstchangeSelect = (v, o) => {
        setfirstSelId(o.key)
        setfirstSelName(v)
        setHiddenSelectArray([0,0,1,1])
        handFirstchangeSelect(o)
        setFirstSelectIndex(o._index)
    }
    const handFirstchangeSelect= (o) => {
        //选择一级部门时候重置2级部门 并记录当前选择的部门的子部门ID 提供给2级菜单选择
        resetTwoSelect();
        resetThreeSelect();
        resetFourSelect();
    }
    const firstDisable=(id)=>{
        return commonDisable(id,optDepertMentList,disableDepertMentList,firstselId)
    }
    const firstEditDisable=(id)=>{
        return commonDisable(id,optEditDepertMentList,disableEditDepertMentList,changefirstSelId)
    }

    //业务部门名称选择事件
    const departmentSelect = (v, o) => {
        setDepartmentId(o.key)
        setDepartmentName(v)
        setHiddenSelectArray([0,0,0,1])
        resetThreeSelect();
        resetFourSelect();
    }

    const secondDisable=(id)=>{
        return commonDisable(id,optCostDepartment,disableCostDepartment,departmentId)
    }
    const secondEditDisable=(id)=>{
        return commonDisable(id,optEditDepertMentList,disableEditCostDepartment,changeDepartmentId)
    }

     // 通用设置不可选择 id是 选择项的id canSelectSet 是记录的当前fatherId 对应的所有已选择的子节点数组 disableSelect 是当前表格已经选择了的
    //  优先级是 canSelectSet 保证包含选项的所有都能选择 判断完成后才到 disableSelect
    const commonDisable=(id,canSelectSet,disableSelect,fatherId)=> {
        let newCanSelectArr= canSelectSet.get(Number(fatherId)) || new Set()
        if(newCanSelectArr.size>0 &&(newCanSelectArr.has(Number(id)) )){
            return false
        }
        return  !!disableSelect.includes(Number(id)) ;

    }

    const costchangeSelect = (v, o) => {
        setCostId(o.key)
        setCostName(v)
        setHiddenSelectArray([0,0,0,0])
        resetFourSelect();
    }

    const costdeSelect = (v, o) => {
        setDeId(o.key)
        setDeName(v)
    }
    /*

  重置部门
 */
    const resetTwoSelect = () =>{
        setDepartmentId()
        setDepartmentName()
        //编辑的重置
        setChangeDepartmentId()
        setChangeDepartmentName()
    }
    const resetThreeSelect = () =>{
        setCostId()
        setCostName()

        setChangeCostId()
        setChangeCostName()
    }
    const resetFourSelect = () =>{
        setDeId()
        setDeName()
        setChangeDeId()
        setChangeDeName()
    }

    //编辑
    const changefirstMentList = (v, o) => {
        const {level}=editData;
         if(level>3){
             resetFourSelect();
             handleResetFourOption();
         }
        if(level>2){
            resetThreeSelect();
            handleResetThreeOption();
        }
        if(level>1){
            //拿到之前的ID
            handleResetTwoOption();
        }
        resetTwoSelect();
        setChangefirstSelId(o.key)
        setChangefirstSelName(v)
    }
    const handleResetTwoOption =()=>{
        // 当选择2 级 3 级 4 级编辑的时候 1级菜单修改情况下 把2级菜单可选的放开
        let _optEditDepertMentList= optEditDepertMentList.get(changefirstSelId)
        if(_optEditDepertMentList){
            _optEditDepertMentList.forEach(i=>{
                _.remove(disableEditDepertMentList,item=> Number(item) === i )
            })
            optEditDepertMentList.set(changefirstSelId,new Set())
        }
    }

    const handleResetThreeOption =()=>{
        // 当选择3 级4级编辑的时候 把3级菜单可选的放开
        let _optEditCostDepartment= optEditCostDepartment.get(changeDepartmentId)
        if(_optEditCostDepartment){
            _optEditCostDepartment.forEach(i=>{
                _.remove(disableEditCostDepartment,item=> Number(item) === i )
            })
            optEditDepertMentList.set(changeDepartmentId,new Set())
        }
    }

    const handleResetFourOption =()=>{
        // 4级编辑的时候
          _.remove(disableEditCostDepartment,item=> Number(item) === Number(changeDeId) )
    }


    const changedeperMentList = (v, o) => {
        const {level}=editData;
        setChangeDepartmentId(o.key)
        setChangeDepartmentName(v)
        if(level>3){
            resetFourSelect();
            handleResetFourOption();
        }
        if(level>2){
            resetThreeSelect();
            handleResetThreeOption();
        }

    }
    const changeCostSelect = (v, o) => {
        const {level}=editData;
        setChangeCostId(o.key)
        setChangeCostName(v)
        if(level>3){
            resetFourSelect();
            handleResetFourOption();
        }
    }
    const changeCostdeSelect = (v, o) => {
        setChangeDeId(o.key)
        setChangeDeName(v)
    }
    //添加
    const openModal = () => {
        //dzy 还原4个选择框的可选择状态
        setHiddenSelectArray([0,1,1,1])
        //还原 设置在选择框上的值
        resetTwoSelect()
        resetThreeSelect()
        resetFourSelect()
    }

  //设置 禁止输入
    const handleDisableSelect= async() => {
        if(!tableData)return
        // 找出现有关系中被选择的 2 3 4 级菜单
        const newDisableDepertMentList=[];
        const newDisableCostchangeSelect=[];
        const newDisableCostdeSelect=[];
        tableData.map(async(item) => {
            if(!optDepertMentList.has(Number(item.id)) ){
                optDepertMentList.set(Number(item.id),new Set())
            }
            item.children.forEach((item_children)=>{
                optDepertMentList.set(Number(item.id),optDepertMentList.get(Number(item.id)).add(Number(item_children.id)))
            })
            //一级部门
            item.children&&item.children.length>0&&item.children.map((one_child) => {
                if(!optCostDepartment.has(Number(one_child.id)) ){
                    optCostDepartment.set(Number(one_child.id),new Set())
                }
                    one_child.children.forEach((one_child_children)=>{
                        optCostDepartment.set(Number(one_child.id),optCostDepartment.get(Number(one_child.id)).add(Number(one_child_children.id)))
                    })
                //业务部门
                newDisableDepertMentList.push(Number(one_child.id))
                one_child.children&&one_child.children.length>0&&one_child.children.map((two_child) => {
                    //成本部门
                    newDisableCostchangeSelect.push(Number(two_child.id))
                    two_child.children&&two_child.children.length>0&&two_child.children.map((three_child) => {
                        //业务单元
                        newDisableCostdeSelect.push(Number(three_child.id))
                    })
                })
            })
        })
        setDisableDepertMentList(newDisableDepertMentList)
        setDisableCostDepartment(newDisableCostchangeSelect)
        setDisableBusinessUnit(newDisableCostdeSelect)

        // 编辑的时候先保存下原来能选择的
        setOptEditCostDepartment(optCostDepartment)
        setOptEditDepertMentList(optDepertMentList)

        setDisableEditDepertMentList(newDisableDepertMentList)
        setDisableEditCostDepartment(newDisableCostchangeSelect)
        setDisableEditBusinessUnit(newDisableCostdeSelect)


    }
    const  handleEditSelect= (_level)=>{
       let a=[1,1,1,1]
        setHiddenSelectArray(a.fill(0,0,_level) )
    }
    //编辑回显
    const openModify = (record) => {
       let _level= handleLevel(JSON.parse(JSON.stringify(record)),4)
        handleEditSelect(_level)
          if(_level ===1){
              for(let i=0; i<tableData.length;i++){
                  let oneItem=tableData[i]
                  if(Number(oneItem.id)===Number(record.id)){
                      setFormVal(oneItem,oneItem.children[0],oneItem.children[0].children[0],oneItem.children[0].children[0].children[0],_level)
                      break;
                  }
              }
          }else if(_level===2){
              // 点的是2级的菜单
              for(let i=0; i<tableData.length;i++){
                  let oneItem=tableData[i]
                  for(let ii =0; ii<oneItem.children.length;ii++){
                      let twoItem=oneItem.children[ii]
                      if(Number(twoItem.id)===Number(record.id)){
                          setFormVal(oneItem,twoItem,twoItem.children[0],twoItem.children[0].children[0],_level)
                          break;
                      }
                  }
              }

          }else if(_level===3){
              for(let i=0; i<tableData.length;i++){
                  let oneItem=tableData[i]
                  for(let ii =0; ii<oneItem.children.length;ii++){
                      let twoItem=oneItem.children[ii]
                      for(let iii =0; iii<twoItem.children.length;iii++){
                          let threeItem=twoItem.children[iii]
                          if(Number(threeItem.id)===Number(record.id)){
                              setFormVal(oneItem,twoItem,threeItem,threeItem.children[0],_level)
                              break;
                          }
                      }
                  }
              }
          }else if(_level===4){
              for(let i=0; i<tableData.length;i++){
                  let oneItem=tableData[i]
                   for(let ii =0; ii<oneItem.children.length;ii++){
                       let twoItem=oneItem.children[ii]
                       for(let iii =0; iii<twoItem.children.length;iii++){
                           let threeItem=twoItem.children[iii]
                           for(let iiii =0; iiii<threeItem.children.length;iiii++){
                               let fourItem=threeItem.children[iiii]
                               if(Number(fourItem.id)===Number(record.id)){
                                   setFormVal(oneItem,twoItem,threeItem,fourItem,_level)
                                   break;
                               }

                           }
                       }
                   }
              }
          }
    }

   const setFormVal= (oneItem,twoItem,threeItem,fourItem,level)=>{
       // setRecord(record)
       setChangefirstSelName(oneItem.name)
       setChangeDepartmentName(twoItem.name)
       setChangeCostName(threeItem.name)
       setChangeDeName(fourItem.name)

       setChangefirstSelId(oneItem.id)
       setChangeDepartmentId(twoItem.id)
       setChangeCostId(threeItem.id)
       setChangeDeId(fourItem.id)

       setEditData({
           _changefirstSelId:oneItem.id,
           _changeDepartmentId:twoItem.id,
           _changeCostId:threeItem.id,
           _changeDeId:fourItem.id,
           level,
       })

       form.setFieldsValue({
           changefirstSelName: oneItem.name,
           changeDepartmentName: twoItem.name,
           changeCostName: threeItem.name,
           changeDeName: fourItem.name,
       })
    }

      //处理级别
      const handleLevel =(record,level)=>{
            if (record.children&&record.children.length>0){
                level=level-1;
                return handleLevel(record.children[0],level)
            }else {
                return level;
            }

      }


    //删除
    const openDel = (record) => {
       // setTabId(record.id)
        setA('3')
        let _level= handleLevel(JSON.parse(JSON.stringify(record)),4)
        setDeleteData({
            level:_level,
            delRecord:record
        })
    }
    //阻止事件冒泡
    const stopEvents = (e) => {
        e.stopPropagation();
        e.preventDefault()
    }
const labelTips = (val) =>{
        return (
          <p style={{ color: 'rgba(0,0,0,.45)', fontSize: '15px', marginTop: '10px', marginLeft: '35px' }}>单选,当前关联列表中已有的{val}不可选择</p>
            )
        }

    //保存
    const lookModal = async () => {
        setA('4')
    }
    const rendermodal = (a) => {
        if (a === '1') {
            //新增
            return <Form onFinishFailed={onFinishFailed} onFinish={onFinish}>
                <Row gutter={32}>
                    <Col>
                        <Form.Item name="costDepartmentName" label="一级部门名称" style={{ width: '100%', marginLeft: '100px' }} >
                            <Select onSelect={firstchangeSelect}
                                    disabled={hiddenSelectArray[0]}
                                style={{ width: '70%', marginLeft: '28px' }}  >
                                {firstMentList ? firstMentList.map((item, idx) => {
                                    return <Select.Option _index={idx}
                                                          key={item.id}
                                                          value={item.firstDepartmentName}

                                    >{item.firstDepartmentName}</Select.Option>
                                }) : ''}
                            </Select>
                            {labelTips("业务单元")}
                        </Form.Item>
                    </Col>
                    <Col><Form.Item name="costDepartmentName" label="业务部门名称" style={{ width: '100%', marginLeft: '100px' }} >
                        <div>
                            <Select
                                onSelect={departmentSelect}
                                value={departmentName}
                                disabled={hiddenSelectArray[1]}
                                style={{ width: '70%',marginLeft: '28px' }}>
                                {depertMentList ? depertMentList.map((item, idx) => {
                                    return <Select.Option  key={item.id}
                                                           _index={idx}
                                                           value={item.businessDepartmentName}
                                                           disabled={firstDisable(item.id.toString())}
                                    >{item.businessDepartmentName}</Select.Option>
                                }) : ''}
                            </Select>
                            {labelTips("业务部门")}
                        </div>
                    </Form.Item>
                    </Col>
                    <Col>
                        <Form.Item name="costDepartmentName" label="成本部门名称"
                            style={{ width: '100%', marginLeft: '100px' }} >
                            <Select
                              disabled={hiddenSelectArray[2]}
                                onSelect={costchangeSelect}
                               value={costName}
                                style={{ width: '70%', marginLeft: '28px' }} >
                                {departmentlist ? departmentlist.map((item, idx) => {
                                    return <Select.Option _index={idx}
                                                          disabled={secondDisable(item.id.toString())}
                                                          key={item.id}
                                                          value={item.costDepartmentName}
                                    >{item.costDepartmentName}</Select.Option>
                                }) : ''}
                            </Select>
                            {labelTips("成本部门")}
                        </Form.Item>
                    </Col>
                    <Col>
                        <Form.Item name="costDepartmentName" label="业务单元名称"
                            style={{ width: '100%', marginLeft: '100px' }} >
                            <Select onSelect={costdeSelect}
                                    value={deName}
                                    disabled={hiddenSelectArray[3]}
                                style={{ width: '70%', marginLeft: '28px' }} >
                                {relationlist ? relationlist.map((item, idx) => {
                                    return <Select.Option
                                     disabled={disableBusinessUnit.includes(item.id.toString()) || disableBusinessUnit.includes(Number(item.id))  }
                                      key={item.id}
                                      value={item.businessUnitName}>{item.businessUnitName}</Select.Option>
                                }) : ''}
                            </Select>
                            {labelTips("业务单元")}
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item
                    wrapperCol={{
                        offset: 16,
                        span: 16,
                    }}
                    style={{ marginTop: '20px' }}
                >
                    <Button type="primary" onClick={handleCancel} width="650px" style={{ marginRight: '20px' }}>取消</Button>
                    <Button type="primary" onClick={handleOk} htmlType="submit" width="650px">
                        确定
                        </Button>
                </Form.Item>
            </Form>

        } else if (a === '2') {
            let initialValues = {
                changefirstSelName: changefirstSelName,
                changeDepartmentName: changeDepartmentName,
                changeCostName: changeCostName,
                changeDeName: changeDeName
            }
            return <Form form={form} initialValues={initialValues}>
                <Row gutter={32}>
                    <Col>
                        <Form.Item name="changefirstSelName" label="一级部门名称" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%', marginLeft: '100px' }} >
                            <Select disabled={hiddenSelectArray[0]} style={{ width: '70%',marginLeft: '28px'  }} placeholder="请选择" onSelect={changefirstMentList} defaultValue={changefirstSelName}>
                                {firstMentList ? firstMentList.map((item,idx) => {
                                    return <Select.Option   key={item.id} _index={idx}
                                                            value={item.firstDepartmentName}
                                    >{item.firstDepartmentName}</Select.Option>
                                }) : ''}
                            </Select>
                            {labelTips("部门名称")}
                        </Form.Item>
                    </Col>
                    <Col>
                        <Form.Item name="changeDepartmentName" label="业务部门名称" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%', marginLeft: '100px' }} >
                            <Select disabled={hiddenSelectArray[1]} style={{ width: '70%', marginLeft: '28px' }} placeholder="请选择" onSelect={changedeperMentList} value={changeDepartmentName} defaultValue={changeDepartmentName}>
                                {depertMentList ? depertMentList.map((item, idx) => {
                                    return <Select.Option
                                      key={item.id}
                                      disabled={firstEditDisable(Number(item.id))}
                                      value={item.businessDepartmentName}
                                    >{item.businessDepartmentName}</Select.Option>
                                }) : ''}
                            </Select>
                            {labelTips("业务单元")}
                        </Form.Item>
                    </Col>
                    <Col>
                        <Form.Item name="changeCostName" label="成本部门名称" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%', marginLeft: '100px' }} >
                            <Select disabled={hiddenSelectArray[2]}  style={{ width: '70%', marginLeft: '28px' }} placeholder="请选择" onSelect={changeCostSelect} value={changeCostName} defaultValue={changeCostName}>
                                {departmentlist ? departmentlist.map((item, idx) => {
                                    return <Select.Option
                                       disabled={secondEditDisable(Number(item.id))}
                                                          key={item.id}
                                                          _index={idx}
                                                          value={item.costDepartmentName}>{item.costDepartmentName}</Select.Option>
                                }) : ''}
                            </Select>
                            {labelTips("成本部门")}
                        </Form.Item>
                    </Col>

                    <Col>
                        <Form.Item name="changeDeName" label="业务单元名称" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%', marginLeft: '100px' }} >
                            <Select disabled={hiddenSelectArray[3]}  style={{ width: '70%', marginLeft: '28px' }} placeholder="请选择" onSelect={changeCostdeSelect} value={changeDeName} defaultValue={changeDeName}>
                                {relationlist ? relationlist.map((item, idx) => {
                                    return <Select.Option
                                      disabled={ disableEditCostDepartment.includes(Number(item.id))  }
                                      key={item.id} value={item.businessUnitName}>{item.businessUnitName}</Select.Option>
                                }) : ''}
                            </Select>
                            {labelTips("业务单元")}
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item
                    wrapperCol={{
                        offset: 16,
                        span: 16,
                    }}
                    style={{ marginTop: '20px' }}
                >
                    <Button type="primary" onClick={handleCancel} width="650px" style={{ marginRight: '20px' }}>取消</Button>
                    <Button type="primary" onClick={handleOk} htmlType="submit" width="650px">
                        确定
                        </Button>
                </Form.Item>
            </Form>

        } else if (a === '3') {
            return <div>
                <Form>
                    <p style={{ fontSize: '17px' }}>确定删除关联信息吗?</p>
                    <Form.Item
                        wrapperCol={{
                            offset: 16,
                            span: 16,
                        }}
                        style={{ marginTop: '20px' }}
                    >
                        <Button type="primary" onClick={handleCancel} width="650px" style={{ marginRight: '20px' }}>取消</Button>
                        <Button type="primary" onClick={handleOk} htmlType="submit" width="650px">
                            确定
                    </Button>
                    </Form.Item>
                </Form>
            </div>
        } else if (a === '4') {
            return <div>
                <Form>
                    <p style={{ fontSize: '17px' }}>确定创建关联信息吗?</p>
                    <Form.Item
                        wrapperCol={{
                            offset: 16,
                            span: 16,
                        }}
                        style={{ marginTop: '20px' }}
                    >
                        <Button type="primary" onClick={handleCancel} width="650px" style={{ marginRight: '20px' }}>取消</Button>
                        <Button type="primary" onClick={handleOk} htmlType="submit" width="650px">
                            确定
                    </Button>
                    </Form.Item>
                </Form>
            </div>
        }
    }
    //查看
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
        },
    ];
    const tabColumns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '操作',
            key: 'action',
            render: (text, record,fff) => (
                <Space size="middle">
                    <Button type="primary" danger onClick={(e) => { stopEvents(e), look('3'), openDel(record) }}>删除</Button>
                    <Button type='primary' onClick={(e) => { stopEvents(e), look('2'),handleDisableSelect(), openModify(record) }}>编辑</Button>
                </Space>
            ),
        },
    ];
    const addcostName = (e) => {
        setAddCostName(e.target.value)
    }

    const addsostName = (e) => {
        setAddSostName(e.target.value)
    }

    const lookAction = () => {
        props.history.push({
            pathname: '/relationShip/relationMaintenance',
        })
    }
    return (
        <div style={{ width: '100%', color: '#222222', background: '#fff', padding: '20px 50px 20px 20px' }}>
            {
                propsdata ? propsdata.type === 'add' ?
                    <Form>
                        <p style={{ fontSize: '15px' }}>基本关系</p>
                        <Row gutter={32}>
                            <Col span={12} style={{ width: '100%' }}>
                                <Form.Item name="CostRelationName" initialValue={CostRelationName} label="成本关系名称" rules={[{ required: true, message: '请输入成本关系名称' }]} style={{ width: '100%' }} >
                                    <Input type="text" style={{ width: '100%' }} placeholder="限制20字以内" maxLength={20}
                                        onChange={(e) => addcostName(e)}
                                    />
                                </Form.Item>
                            </Col>
                            <Form.Item name="remark" initialValue={Remark} label="备注" style={{ width: '100%', textIndent: '10px' }} >
                                <TextArea rows={4} placeholder="100个字以内" maxLength={100} style={{ width: '60%', marginLeft: '20px' }}
                                    onChange={(e) => addsostName(e)}
                                />
                            </Form.Item>
                            <Form.Item name="remark" label="关联关系" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%', textIndent: '10px' }} >
                                <div>
                                    关联列表<Button type='primary' onClick={() => { openModal(),handleDisableSelect(), look('1') }} style={{ marginLeft: '10px' }} >添加业务成本-业务单元</Button>
                                    <Table columns={columns} style={{ width: '900px', marginTop: '8px', height: '100%' }}
                                        dataSource={tableData}
                                        expandRowByClick={true}
                                           onExpand={(expanded, record)=>{
                                           }}
                                        pagination={false} />
                                    <p style={{ color: '#ccc', fontSize: '15px' }}>成本关系可关联多个成本-业务单元,一个时间段内仅可有一个成本关系处于启用状态</p>
                                </div>
                                <Space size={20}>
                                    <Button onClick={() => lookAction(null, 'add')}>取消</Button>
                                    <Button type="primary" onClick={() => { look('3'), lookModal() }}>保存</Button>
                                </Space>
                            </Form.Item>
                        </Row>
                    </Form>
                    : propsdata.type === 'look' ?
                        <Form>
                            <p style={{ fontSize: '15px' }}>基本关系</p>
                            <Row gutter={32}>
                                <Col span={12} style={{ width: '100%' }}>
                                    <Form.Item name="CostRelationName" initialValue={CostRelationName} label="成本关系名称" rules={[{ required: true, message: '请输入成本关系名称' }]} style={{ width: '100%' }} >
                                        <Input type="text" style={{ width: '100%' }} placeholder="限制20字以内" maxLength={20}
                                            onChange={(e) => addcostName(e)}
                                        />
                                    </Form.Item>
                                </Col>
                                <Form.Item name="remark" initialValue={Remark} label="备注" style={{ width: '100%', textIndent: '10px' }} >
                                    <TextArea rows={4} placeholder="100个字以内" maxLength={100} style={{ width: '60%', marginLeft: '20px' }}
                                        onChange={(e) => addsostName(e)}
                                    />
                                </Form.Item>
                                <Form.Item name="remark" label="关联关系" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%', textIndent: '10px' }} >
                                    <div>
                                        <Table columns={columns} style={{ width: '900px', marginTop: '8px', height: '100%' }}
                                            dataSource={tableData}
                                            expandRowByClick={true}
                                            pagination={false} />
                                    </div>
                                    <Space size={20}>
                                        <Button onClick={() => lookAction(null, 'add')}>取消</Button>
                                    </Space>
                                </Form.Item>
                            </Row>
                        </Form>
                        : propsdata.type === 'copy' ?
                            <Form>
                                <p style={{ fontSize: '15px' }}>基本关系</p>
                                <Row gutter={32}>
                                    <Col span={12} style={{ width: '100%' }}>
                                        <Form.Item name="CostRelationName" initialValue={CostRelationName} label="成本关系名称" rules={[{ required: true, message: '请输入成本关系名称' }]} style={{ width: '100%' }} >
                                            <Input type="text" style={{ width: '100%' }} placeholder="限制20字以内" maxLength={20}
                                                onChange={(e) => addcostName(e)}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Form.Item name="remark" initialValue={Remark} label="备注" style={{ width: '100%', textIndent: '10px' }} >
                                        <TextArea rows={4} placeholder="100个字以内" maxLength={100} style={{ width: '60%', marginLeft: '20px' }}
                                            onChange={(e) => addsostName(e)}
                                        />
                                    </Form.Item>
                                    <Form.Item name="remark" label="关联关系" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%', textIndent: '10px' }} >
                                        <div>
                                            关联列表<Button type='primary' onClick={() => { openModal(), handleDisableSelect(),look('1') }} style={{ marginLeft: '10px' }} >添加业务成本-业务单元</Button>
                                            <Table columns={tabColumns} style={{ width: '900px', marginTop: '8px', height: '100%' }}
                                                dataSource={tableData}
                                                   loading={loadingData}
                                                expandRowByClick={false}
                                                pagination={false} />
                                            <p style={{ color: '#ccc', fontSize: '15px' }}>成本关系可关联多个成本-业务单元,一个时间段内仅可有一个成本关系处于启用状态</p>
                                        </div>
                                        <Space size={20}>
                                            <Button onClick={() => lookAction(null, 'add')}>取消</Button>
                                            <Button type="primary" onClick={() => { look('3'), lookModal() }}>保存</Button>
                                        </Space>
                                    </Form.Item>
                                </Row>
                            </Form>
                            : propsdata.type === 'edit' ?
                                <Form>
                                    <p style={{ fontSize: '15px' }}>基本关系</p>
                                    <Row gutter={32}>
                                        <Col span={12} style={{ width: '100%' }}>
                                            <Form.Item name="CostRelationName" initialValue={CostRelationName} label="成本关系名称" rules={[{ required: true, message: '请输入成本关系名称' }]} style={{ width: '100%' }} >
                                                <Input type="text" style={{ width: '100%' }} placeholder="限制20字以内" maxLength={20}
                                                       onChange={(e) => addcostName(e)}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Form.Item name="remark" initialValue={Remark} label="备注" style={{ width: '100%', textIndent: '10px' }} >
                                            <TextArea rows={4} placeholder="100个字以内" maxLength={100} style={{ width: '60%', marginLeft: '20px' }}
                                                      onChange={(e) => addsostName(e)}
                                            />
                                        </Form.Item>
                                        <Form.Item name="remark" label="关联关系" rules={[{ required: true, message: '此项为必填项' }]} style={{ width: '100%', textIndent: '10px' }} >
                                            <div>
                                                关联列表<Button type='primary' onClick={() => { openModal(), handleDisableSelect(),look('1') }} style={{ marginLeft: '10px' }} >添加业务成本-业务单元</Button>
                                                <Table columns={tabColumns} style={{ width: '900px', marginTop: '8px', height: '100%' }}
                                                       dataSource={tableData}
                                                       loading={loadingData}
                                                       expandRowByClick={false}
                                                       pagination={false} />
                                                <p style={{ color: '#ccc', fontSize: '15px' }}>成本关系可关联多个成本-业务单元,一个时间段内仅可有一个成本关系处于启用状态</p>
                                            </div>
                                            <Space size={20}>
                                                <Button onClick={() => lookAction(null, 'add')}>取消</Button>
                                                <Button type="primary" onClick={() => { look('3'), lookModal() }}>保存</Button>
                                            </Space>
                                        </Form.Item>
                                    </Row>
                                </Form>: '' : ''
            }

            <Modal title={operation} visible={isModalVisible} width="50%" keyboard={true} footer={null} onCancel={handleCancel} getContainer={false} maskClosable={false}>
                {rendermodal(a)}
            </Modal>
        </div>
    )
}
const mapStateToProps = (state) => ({
    userInfo: state.userInfo,
});

const mapDispatchToProps = (dispatch) => ({
    cacheUser(user) {
        dispatch(cacheUserInfo(user));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(add);