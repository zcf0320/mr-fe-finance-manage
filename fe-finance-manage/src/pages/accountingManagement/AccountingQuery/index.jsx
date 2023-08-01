
import React, { useEffect, useRef, useState } from 'react';
import styles from './index.module.scss'
import { Button, Table, Tag, Space, DatePicker, AutoComplete, Select, Modal, Input, Form, Row, Col, Pagination, Spin, notification } from 'antd'
import moment from 'moment';
import {
    AccountingEntry, AccountingSee, AccountingSubjectName, AccountingSubjectNo, AccountingaddAccEntry,
    AccountingSubjectNoBySno, AccountingCostDepartmentName, AccountingSubjectNameByNo
} from '@api/liquiManage'
import accountEa from '../../../enumeration/accountEa'
import { connect } from 'react-redux';
import { cacheUserInfo } from '@state/action/index';


const accountQuery = (props) => {
    const { cacheUser, userInfo } = props;
    //日期选择器事件
    const date = new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
    const Y = date.getFullYear()
    const appendZero = (obj) => {
        if (obj < 10) {
            return '0' + obj
        } else {
            return obj
        }
    }
    const [form] = Form.useForm()
    const frominnter = useRef()
    const M = appendZero(date.getMonth() + 1)
    const D = appendZero(date.getDate())
    // 开始会计日
    const initDate = Y + "-" + M + "-" + D
    // 截止会计日
    const enedDate = Y + "-" + M + "-" + D
    // 新增表单内部会计日
    const modelinitDate = Y + "-" + M + "-" + D
    const [tellerNo, setTellerNo] = useState(userInfo.username)
    const [tableData, setTableData] = useState()
    const [pageNum, setPageNum] = useState(1)
    const [pageSize, setPageSize] = useState(20)
    // 开始会计日
    const [accDate, setAccountDate] = useState(moment(initDate))
    // 截止会计日
    const [eccDate, setEccountDate] = useState(moment(enedDate))
    const [total, setTotal] = useState(1)
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [tabDetail, setTabDetail] = useState({
        // 会计日期
        AccDate: '',
        // 核算机构
        Accountingagency: '',
        // 币种
        Currency: '',
        // 客商名称
        Merchantname: '',
        // 产品
        Product: '',
        // 产品名称
        Productname: '',
        // 成本部门
        Department: '',
        // 成本中心
        Costcenter: '',
        // 成本中心名称
        Costcentername: '',
        // 会计事件
        Accountevent: '',
    })
    //业务凭证号
    const [voucherValue, setVoucherValue] = useState()
    //业务凭证细项
    const [voucherDetails, setVoucherDetails] = useState()
    //会计流水号
    const [accountingNumber, setAccountingNumber] = useState()
    //数据懒加载
    const [loading, setLoading] = useState(false)
    // 科目号
    const [accountnumber, setAccountnumber] = useState()
    // 会计事件
    const [accountevent, setAccountevent] = useState()
    // 转化会计事件
    const [conversionevent, setconversionevent] = useState()
    // 借贷标志
    const [accountBorrowingmarks, setAccountBorrowingmarks] = useState()
    // 上头表单借贷标志
    const [accountmodelBorrowingmarks, setAccountmodelBorrowingmarks] = useState()
    // 上头转化借贷标志
    const [conversionmodelBorrowingmarks, setconversionmodelBorrowingmarks] = useState()
    // 转化借贷标志
    const [conversionBorrowingmarks, setconversionBorrowingmarks] = useState()
    // 核算机构
    const [accountingagency, setAccountingagency] = useState()
    // 转化核算机构
    const [conversioningagency, setconversioningagency] = useState()
    const [a, setA] = useState("0")
    const [operation, setOperation] = useState();
    // 表单内部表格
    const [ModelTabledata, setModelTabledata] = useState()
    // 新增表单内部公共信息录入
    // 会计日
    const [accModelDate, setAccountModelDate] = useState(moment(modelinitDate))
    // 币种
    const [currencyModel, setCurrencyModel] = useState()
    // 转化币种
    const [convercurrencyModel, setconverCurrencyModel] = useState()
    // 客商名称
    const [merchantnameModel, setMerchantnameModel] = useState()
    // 核算结构
    const [accountingstructureModel, setAccountingstructureModel] = useState()
    // 产品
    const [productModel, setProductModel] = useState()
    // 产品名称
    const [productModelname, setProductModelname] = useState()
    // 成本中心
    const [costcenterModel, setCostcenterModel] = useState()
    // 成本中心名称
    const [costcenternameModel, setCostcenternameModel] = useState()
    // 成本部门
    const [departmentofcostModel, setDepartmentofcostModel] = useState()
    // 储存新增成本部门搜索值
    const [storedepartmentofcostModel, setstoreDepartmentofcostModel] = useState()
    // 是否垂直居中
    const [modelcontuter, setmodelcontuter] = useState()
    // 科目信息录入序号
    const [addserialNumber, setaddserialNumber] = useState()
    // 科目信息录入科目名称
    const [addcoursetitle, setaddcoursetitle] = useState()
    // 科目信息录入记账金额
    const [addaccountmoney, setaddaccountmoney] = useState()
    // 科目信息录入摘要
    const [addabstract, setaddabstract] = useState()
    // 科目信息清空录入摘要
    const [remabstract, setremabstract] = useState(null)
    const [rel, setrel] = useState()
    // 默认三级科目号
    const [defaultthree, setdefaultthree] = useState()
    //渲染三级科目号内容
    const [acc, setAcc] = useState([])
    // 储存三级科目号
    const [accThree, setAccaccThree] = useState()
    // 渲染科目名称
    const [accsubname, setAccsubname] = useState()
    const formRow = [
        {
            name: '序号',
            type: 'input',
            key: 'serialNumber',
            value: '',
        }, {
            name: '科目名称',
            type: 'input',
            key: 'subjectName',
            value: '',
        }, {
            name: '三级科目号',
            type: 'select',
            key: 'subjectNo',
            value: '',
        }, {
            name: '记账金额',
            type: 'input',
            key: 'amount',
            value: '',
        }, {
            name: '借贷标志',
            type: 'select',
            key: 'drcrFlag',
            value: '借',
        }, {
            name: '摘要',
            type: 'text',
            key: 'rmk',
            value: '',
        }, {
            type: 'button'
        }
    ]
    const [fromlist, setfromlist] = useState([[...formRow]])

    //数据
    useEffect(() => {
        setLoading(true)
        accountingPageList(pageNum, pageSize)
    }, [])
    useEffect(() => {
        accountNumberList(addcoursetitle)
    }, [fromlist])
    useEffect(() => {
        // 三级科目号搜索
        seachaccountAccountTh(accThree)
        // 新增成本部门搜索
        seachDepartmentofcostModel()
    }, [defaultthree])
    useEffect(() => {
        seachaccountBorrowing()
    }, [accountBorrowingmarks])
    useEffect(() => {
    }, [accsubname])
    //数据列表
    const accountingPageList = async (pageNum, pageSize) => {
        let params = {
            // 开始会计日
            startAccDate: accDate.format('YYYY-MM-DD'),
            // 结束会计日
            endAccDate: eccDate.format('YYYY-MM-DD'),
            pageNum: pageNum,
            pageSize: pageSize,
            receiptNo: voucherValue,
            receiptDetail: voucherDetails,
            accSequenceNo: accountingNumber,
            // 会计事件
            accountNo: conversionevent,
            // 借贷标识
            drcrFlag: conversionmodelBorrowingmarks,
            // 核算机构
            settleBranch: conversioningagency,
            //  会计科目
            subjectNo: accountnumber,
            tellerNo: tellerNo
        }
        setTimeout(() => {
            setLoading(false)
        }, 1000)
        const res = await AccountingEntry(params)
        setTotal(res.pageInfo.total);
        setTableData(res.result);
    }
    //监听分页变化
    const queryPage = async (pageNum, pageSize) => {
        setPageNum(pageNum);
        setPageSize(pageSize)
        await accountingPageList(pageNum, pageSize)
    }
    //开始日期选择框onchange事件
    const changeDate = (moment, string) => {
        setAccountDate(moment)
    }
    //截止日期选择框onchange事件
    const changeendDate = (moment, string) => {
        setEccountDate(moment)
    }
    //业务凭证号搜索
    const voucherRck = (e) => {
        setVoucherValue(e.target.value)
    }
    //业务凭证细项搜索
    const voucherList = (e) => {
        setVoucherDetails(e.target.value)
    }
    //会计流水号
    const accountingList = (e) => {
        setAccountingNumber(e.target.value)
    }
    // 科目号
    const seachaccountnumber = (e) => {
        setAccountnumber(e.target.value)
    }
    // 会计事件
    const seachaccountevent = (v, o) => {
        setAccountevent(o.children)
        if (o.children === '确收') {
            setconversionevent('SELL_GOODS_CONFIRM')
        } else if (o.children === '清算客户') {
            setconversionevent('SELL_GOODS_CLEAR_PAYED')
        } else if (o.children === '清算平台') {
            setconversionevent('SELL_GOODS_CLEAR_PLAT')
        } else if (o.children === '开立发票') {
            setconversionevent('SELL_GOODS_INVOICE')
        } else if (o.children === '结算') {
            setconversionevent('SELL_GOODS_SETTLE')
        } else if (o.children === '核销') {
            setconversionevent('CASH_ADVANCE')
        }
    }
    // 借贷标志
    const seachaccountBorrowing = (e, b,ind) => {
        setAccountBorrowingmarks(e)
        if (e) {
            if (e === '借') {
              fromlist[ind][4].value =e
              b.value = e
                setconversionBorrowingmarks('dr')
            } else if (e === '贷') {
               fromlist[ind][4].value =e
               b.value = e
                setconversionBorrowingmarks('cr')
            }
        }
        
    }
    // 上头表单借贷标志
    const seachaccountmodelBorrowing = (v, o) => {
        setAccountmodelBorrowingmarks(o.children)
        if (o.children === '借') {
            setconversionmodelBorrowingmarks('dr')
        } else if (o.children === '贷') {
            setconversionmodelBorrowingmarks('cr')
        }
    }
    // 核算机构
    const seachaccountingagency = (v, o) => {
        setAccountingagency(o.children)
        if (o.children === '云药房') {
            setconversioningagency('01')
        } else if (o.children === '云健康') {
            setconversioningagency('02')
        } else if (o.children === '海南星创') {
            setconversioningagency('03')
        } else if (o.children === '复胜健康') {
            setconversioningagency('04')
        } else if (o.children === '复星医药销售') {
            setconversioningagency('05')
        }
    }
    // 表单内部公共信息录入
    // 新增会计日
    const changeModelDate = (moment, string) => {
        setAccountModelDate(moment)
    }
    // 新增币种
    const seachCurrencyModel = (v, o) => {
        setCurrencyModel(o.children)
        if (o.children === '人民币') {
            setconverCurrencyModel('156')
        }
    }
    // 新增客商名称
    const seachMerchantnameModel = (e) => {
        setMerchantnameModel(e.target.value)
    }
    // 新增核算结构
    const seachAccountingstructureModel = (v, o) => {
        setAccountingstructureModel(o.children)
        if (o.children === '云药房') {
            setconversioningagency('01')
        } else if (o.children === '云健康') {
            setconversioningagency('02')
        } else if (o.children === '海南星创') {
            setconversioningagency('03')
        } else if (o.children === '复胜健康') {
            setconversioningagency('04')
        } else if (o.children === '复星医药销售') {
            setconversioningagency('05')
        }
    }
    // 新增产品
    const seachProductModel = (e) => {
        setProductModel(e.target.value)
    }
    // 新增产品名称
    const seachProductModelname = (e) => {
        setProductModelname(e.target.value)
    }
    // 新增成本中心
    const seachCostcenterModel = (e) => {
        setCostcenterModel(e.target.value)
    }
    // 新增成本中心名称
    const seachCostcenternameModel = (e) => {
        setCostcenternameModel(e.target.value)
    }
    // 新增成本部门搜索
    const seachDepartmentofcostModel = async (e) => {
        let params = {
            costDepartmentName: e,
            tellerNo: tellerNo
        }
        let res = await AccountingCostDepartmentName(params)
        setstoreDepartmentofcostModel(res.result)
    }

    //弹框确认
    const handleOk = async () => {
        // 新增
        if (a === '1') {
            setAccountModelDate(moment(modelinitDate))
            setCurrencyModel()
            setconverCurrencyModel()
            setconversioningagency()
            setMerchantnameModel()
            setAccountingstructureModel()
            setProductModel()
            setProductModelname()
            setCostcenterModel()
            setCostcenternameModel()
            setDepartmentofcostModel('')
            form.resetFields()
            fromlist.forEach((v, i) => {
                v.forEach((v, i) => {
                    v.value = ''
                })
            })
            setfromlist([[...formRow]])
        } else if (a === '2') {
            //  查看
        }
        setIsModalVisible(false);
    };
    //弹框取消
    const handleCancel = () => {
        setIsModalVisible(false);
        setAccountModelDate(moment(modelinitDate))
        setCurrencyModel()
        setconverCurrencyModel()
        setconversioningagency()
        setMerchantnameModel()
        setAccountingstructureModel()
        setProductModel()
        setProductModelname()
        setCostcenterModel()
        setCostcenternameModel()
        setDepartmentofcostModel('')
        form.resetFields()
        fromlist.forEach((v, i) => {
            v.forEach((v, i) => {
                v.value = ''
            })
        })
        setfromlist([[...formRow]])
    };
    //重置
    const Xia = () => {
        setAccountDate(moment(initDate))
        setEccountDate(moment(enedDate))
        setVoucherValue()
        setVoucherDetails()
        setAccountingNumber()
        setAccountnumber()
        setAccountevent()
        setAccountingagency()
        setAccountBorrowingmarks()
        setconversionBorrowingmarks()
        setconversionmodelBorrowingmarks()
        setconversionevent()
        setconversioningagency()
        setAccountmodelBorrowingmarks()
    }
    //查找
    const Abb = () => {
        if (accDate) {
            setLoading(true)
            accountingPageList(pageNum, pageSize)
        } else {
            notification.open({
                duration: 3,
                description: "会计日为必输"
            });
        }
    }
    //查看
    const accountLook = async (record) => {
        let params = {
            accSequenceNo: record.accSequenceNo,
            tellerNo: tellerNo
        }
        const res = await AccountingSee(params)
        setIsModalVisible(true);
        setTabDetail({
            // 会计日期
            AccDate: record.accDate,
            // 核算机构
            Accountingagency: record.settleBranch,
            // 币种
            Currency: record.ccy,
            // 客商名称
            Merchantname: record.traveName,
            // 产品
            Product: record.bizTyp,
            // 产品名称
            Productname: record.bizName,
            // 成本部门
            Department: '',
            // 成本中心
            Costcenter: record.costCenter,
            // 成本中心名称
            Costcentername: record.costCenterName,
            // 会计事件
            Accountevent: record.accountNo,
        })
        setModelTabledata(res.result)
    }
    const look = (a) => {
        // 新建
        if (a === '1') {
            setOperation(<b>新增会计凭证</b>);
            setA(a)
            setIsModalVisible(true);
            setmodelcontuter({ padding: '0px', overflowY: 'auto', })
            setaddabstract('')
        } else if (a === '2') {
            // 查看
            setOperation(<b>会计凭证查看</b>);
            setA(a)
            setmodelcontuter()
        }
    }
    // 表单内部添加
    const handleaddOk = (ind) => {
        let arr = fromlist
        let row = JSON.parse(JSON.stringify(formRow))
        row[5].value = fromlist[0][5].value
        row[4].value = fromlist[0][4].value
        arr.push(row)
        setfromlist([...arr])
    }
    // 表单内部删除
    const handledeltCancel = (index) => {
        if (fromlist.length !== 1) {
            let arrmodel = fromlist.filter((v, i) => {
                if (i !== index) {
                    return v
                }
            })
            setfromlist([...arrmodel])
        }
    }
    // 科目信息录入input事件
    // 科目名称搜索
    const seachserialModel = (e, b, i) => {
        if (e) {
            b.value = e
        }
        accountNumberList(e)
        setaddcoursetitle(e)
        accountThree(e, b, i)

    }
    // 三级科目号搜索
    const seachaccountAccountTh = async (e, b, ind) => {
        setAccaccThree(e)
        seachaccountThree(e,b,ind)
        if (e) {
            b.value = e
        }
    }
    // 三级科目号
    const seachaccountThree = async (v, b,ind) => {
        let params = {
            subjectNo: v,
            tellerNo: tellerNo,
        }
        let res = await AccountingSubjectNoBySno(params)
        let resto = await AccountingSubjectNameByNo(params)
        setAcc(res.result)
        if (resto.result) {
           fromlist[ind][1].value = resto.result
            setfromlist(JSON.parse(JSON.stringify(fromlist)))
        }
    }
    //科目名称
    const accountNumberList = async (AccountNumber) => {
        let a = AccountNumber + ''
        let [subjectName1, subjectName2] = a.includes(",") ? a.split(",") : a.split("，");
        let params = {
            subjectName1,
            subjectName2,
            tellerNo: tellerNo
        }
        const res = await AccountingSubjectName(params)
        setrel(res.result)

    }
    // 三级科目号
    const accountThree = async (AccountNumber, b, ind) => {
        setaddcoursetitle(AccountNumber)
        let params = {
            subjectName: AccountNumber,
            tellerNo: tellerNo
        }
        // 渲染三级科目号的
        const res = await AccountingSubjectNo(params)
        let bs = res.result[0]
        if (bs) {
            fromlist[ind][2].value = bs.value
        }
        setAcc(res.result)
        setAccaccThree(res.result)
    }

    // 记账金额
    const seachchargemoneyModel = (b, e) => {
        if (b.name === '记账金额') {
            setaddaccountmoney(e.target.value)
        }
    }
    // 摘要
    const addseachabstract = (e) => {
        setaddabstract(e.target.value)
    }
    // 表单内部表格
    const tablecolumns = [
        {
            title: '序号',
            dataIndex: 'idx',
            key: 'id',
            width: 80,
            render: (t, r, i) => {
                return i = i * 1 + 1
            }
        },
        {
            title: '会计科目',
            key: 'subjectNo',
            dataIndex: 'subjectNo',
            width: 200,
        },
        {
            title: '科目名称',
            key: 'subjectName',
            dataIndex: 'subjectName',
            width: 290,
        },
        {
            title: '借贷标志',
            key: 'drcrFlag',
            dataIndex: 'drcrFlag',
            width: 100,
            render: (t, r, i) => {
                return accountEa(t, 'drcrFlag')
            }
        },
        {
            title: '金额',
            key: 'amount',
            dataIndex: 'amount',
            width: 80,
            render: (t, r, i) => {
                return <span>{(r.amount).toFixed(2)}</span>
            }
        },
    ]
    // 提交
    const auucountsubmit = async () => {
        let params = {
            accDate: accModelDate.format('YYYY-MM-DD'),
            ccy: convercurrencyModel ? convercurrencyModel : '156',
            traveName: merchantnameModel,
            settleBranch: conversioningagency,
            bizTyp: productModel,
            bizName: productModelname,
            costCenter: costcenterModel,
            costCenterName: costcenternameModel,
            costDepartment: departmentofcostModel,
            createdBy: tellerNo,
            accSubjectSubParamDTOList: [
                {
                    subjectNo: '',
                    serialNumber: '',
                    subjectName: '',
                    amount: '',
                    drcrFlag: '',
                    rmk: '',
                }
            ]
        }
        let num = 0;
        let mun = 0;
        fromlist.map((v, i) => {
            if (fromlist[0][4].value == '借') {
                fromlist[0][4].value = '借'
            }
            if (v[4].value === '') return;
            if (v[4].value === '借') {
                num += v[3].value * 1
            } else if (v[4].value === '贷') {
                mun += v[3].value * 1
            }
        })
        if (num === mun) {
            let result = fromlist.reduce((p, item, i) => {
                let obj = item.reduce((obj, v) => {
                    if (v.key) {
                        if (v.key === 'serialNumber') {
                            obj[v.key] = i + 1;
                        } else if (v.key === 'drcrFlag') {
                            obj[v.key] = v.value === '借' ? 'dr' : 'cr';
                        } else if (v.key === 'amount') {
                            obj[v.key] = (v.value * 1).toFixed(2)
                        } else {
                            obj[v.key] = v.value;
                        }
                    }
                    return obj
                }, {})
                p.push(obj);
                return p
            }, [])
            params.accSubjectSubParamDTOList = result
            let res = await AccountingaddAccEntry(params)
            if (res.success) {
                notification['success']({
                    duration: 3,
                    description: "添加成功"
                });
                setIsModalVisible(false);
                setAccountModelDate(moment(modelinitDate))
                setCurrencyModel()
                setMerchantnameModel()
                setAccountingstructureModel()
                setProductModel()
                setProductModelname()
                setCostcenterModel()
                setCostcenternameModel()
                setDepartmentofcostModel()
                setDepartmentofcostModel('')
                form.resetFields()
                fromlist.forEach((v, i) => {
                    v.forEach((v, i) => {
                        v.value = ''
                    })
                })
                setaddabstract()
                setfromlist([[...formRow]])
                Abb()
                accountingPageList()
            } else {
                notification['error']({
                    duration: 3,
                    description: "添加失败"
                });
            }
        } else {
            notification['warning']({
                duration: 3,
                description: "借贷不平衡,不允许提交"
            });
        }
    }
    // 借贷平衡计算
    const principle = () => {
        let flagArr = fromlist.map((v) => {
                return v[4].value;
        })
        if (!flagArr.includes('借')) {
            return notification['warning']({
                duration: 3,
                description: "借贷不平衡"
            });
        } else if (!flagArr.includes('贷')) {
            return notification['warning']({
                duration: 3,
                description: "借贷不平衡"
            });
        }
        let arr = fromlist
        let row = [...formRow];
        // 借
        let num = 0;
        // 贷
        let mun = 0;
        let two = 0;
        fromlist.map((v, i) => {
            if (v[4].value === '') return;
            if (v[4].value === '借') {
                num += v[3].value * 1
            } else if (v[4].value === '贷') {
                mun += v[3].value * 1
            }
        })
        // 差额
        let znumber = num - mun
        if (fromlist.length == 1) {
            notification['warning']({
                duration: 3,
                description: "借贷不平衡,不允许提交"
            });
        } else {
            // 借小于贷
            if (znumber < 0) {
                let three = row[3].value = row[3].value + znumber
                row[3].value = znumber
                row[4].value = '贷'
                two = fromlist[fromlist.length - 1][3].value
                row[3].value = row[3].value - Math.abs(znumber)
                row[3].value = two * 1 - three
                if (fromlist[fromlist.length - 1][4].value == '借') {
                    fromlist[fromlist.length - 1][3].value = (fromlist[fromlist.length - 1][3].value * 1) - (znumber * 1)
                } else if (fromlist[fromlist.length - 1][4].value == '贷') {
                    fromlist[fromlist.length - 1][3].value = (fromlist[fromlist.length - 1][3].value * 1) + (znumber * 1)
                }

                // 借大于贷
            } else if (znumber > 0) {
                row[3].value = znumber
                row[4].value = '借'
                two = fromlist[fromlist.length - 1][3].value
                let numto = row[3].value += two * 1
                row[3].value = numto
                if (fromlist[fromlist.length - 1][4].value == '借') {
                    fromlist[fromlist.length - 1][3].value = (fromlist[fromlist.length - 1][3].value * 1) - (znumber * 1)
                } else if (fromlist[fromlist.length - 1][4].value == '贷') {
                    fromlist[fromlist.length - 1][3].value = (fromlist[fromlist.length - 1][3].value * 1) + (znumber * 1)
                }

            } else if (znumber == 0) {
                return
            }
            row[5].value = fromlist[0][5].value
            setfromlist([...arr])
        }

    }
    // 取消操作
    const cancel = () => {
        setIsModalVisible(false);
        setAccountModelDate(moment(modelinitDate))
        // setCurrencyModel()
        // setMerchantnameModel()
        // setAccountingstructureModel()
        // setProductModel()
        // setProductModelname()
        // setCostcenterModel()
        // setCostcenternameModel()
        // setDepartmentofcostModel()
        // setAccaccThree()
        // from.resetFields()
        // fromlist.forEach((v,i)=>{
        //     v.forEach((v,i)=>{
        //       v.value = ''
        //     })
        // })
        // setfromlist([[...formRow]])
    }
    const rendermodal = (a) => {
        if (a === '1') {
            return <div style={{ width: '100%', height: 'auto', }}>
                <div style={{ width: '100%', }}>
                    <p style={{ fontSize: '12px', margin: '30px 0px 10px 10px', }}>公共信息录入</p>
                    <div style={{ display: 'flex', width: '100%', flexWrap: 'wrap', }}>
                        <div style={{ display: 'flex', width: '30%', alignItems: 'center' }}>
                            <span style={{ marginLeft: '19px', marginTop: '25px', fontSize: '12px' }}>会计日:</span>
                            <Space direction="vertical" style={{ marginTop: '25px', }}>
                                <DatePicker defaultValue={moment().subtract(1, 'days').endOf('day')} style={{ maxWidth: '200px', minWidth: '110px', height: '35px', borderRadius: '5px', marginLeft: '15px' }} size={"small"}
                                    onChange={(e) => { changeModelDate(e) }}
                                    value={accModelDate}
                                />
                            </Space>
                        </div>
                        <div style={{ display: 'flex', width: '30%', marginTop: '25px', alignItems: 'center' }}>
                            <span style={{ marginLeft: '19px', fontSize: '12px' }}>币种:</span>
                            <Select placeholder='请选择' size='middle'
                                onChange={(e) => { setCurrencyModel(e) }}
                                onSelect={seachCurrencyModel}
                                defaultValue={accountEa('156', 'ccy')}
                                value={currencyModel}
                                style={{ maxWidth: '200px', minWidth: '150px', height: '35px', paddingRight: '4px', borderRadius: '5px', marginLeft: '5px' }} showArrow={true}>
                                <Select.Option key={1} value={'人民币'} style={{ height: '30px', }}>人民币</Select.Option>
                            </Select>
                        </div>
                        <div style={{ display: 'flex', width: '30%', marginTop: '25px', alignItems: 'center' }}>
                            <span style={{ marginLeft: '19px', width: '100px', fontSize: '12px' }}>客商名称:</span>
                            <Input placeholder='请输入:' value={merchantnameModel} onChange={(e) => { seachMerchantnameModel(e) }} style={{ maxWidth: '200px', minWidth: '110px', marginLeft: '5px', height: '35px', borderRadius: '5px' }}>
                            </Input>
                        </div>
                        <div style={{ display: 'flex', width: '30%', marginTop: '25px', alignItems: 'center' }}>
                            <span style={{ fontSize: '12px', marginLeft: '19px', }}>核算结构:</span>
                            <Select placeholder='请选择' size='middle' onSelect={seachAccountingstructureModel} value={accountingstructureModel} style={{ maxWidth: '200px', minWidth: '150px', height: '35px', paddingRight: '4px', borderRadius: '5px', marginLeft: '5px' }} showArrow={true}>
                                <Select.Option key={1} style={{ height: '30px', }}>云药房</Select.Option>
                                <Select.Option key={2} style={{ height: '30px' }}>云健康</Select.Option>
                                <Select.Option key={3} style={{ height: '30px', }}>海南星创</Select.Option>
                                <Select.Option key={4} style={{ height: '30px' }}>复胜健康</Select.Option>
                                <Select.Option key={5} style={{ height: '30px', }}>复星医药销售</Select.Option>
                            </Select>
                        </div>
                        <div style={{ display: 'flex', width: '30%', marginTop: '25px', alignItems: 'center' }}>
                            <span style={{ marginLeft: '19px', width: '40px', fontSize: '12px' }}>产品:</span>
                            <Input placeholder='请输入:' value={productModel} onChange={(e) => { seachProductModel(e) }} style={{ maxWidth: '200px', minWidth: '110px', marginLeft: '5px', height: '35px', borderRadius: '5px' }}>
                            </Input>
                        </div>
                        <div style={{ display: 'flex', width: '30%', marginTop: '25px', alignItems: 'center' }}>
                            <span style={{ marginLeft: '19px', width: '100px', fontSize: '12px' }}>产品名称:</span>
                            <Input placeholder='请输入:' value={productModelname} onChange={(e) => { seachProductModelname(e) }} style={{ maxWidth: '200px', minWidth: '110px', marginLeft: '5px', height: '35px', borderRadius: '5px' }}>
                            </Input>
                        </div>
                        <div style={{ display: 'flex', width: '30%', marginTop: '25px', alignItems: 'center' }}>
                            <span style={{ marginLeft: '19px', width: '100px', fontSize: '12px' }}>成本中心:</span>
                            <Input placeholder='请输入:' value={costcenterModel} onChange={(e) => { seachCostcenterModel(e) }} style={{ maxWidth: '200px', minWidth: '110px', marginLeft: '5px', height: '35px', borderRadius: '5px' }}>
                            </Input>
                        </div>
                        <div style={{ display: 'flex', width: '30%', marginTop: '25px', alignItems: 'center' }}>
                            <span style={{ marginLeft: '19px', width: '150px', fontSize: '12px' }}>成本中心名称:</span>
                            <Input placeholder='请输入:' value={costcenternameModel} onChange={(e) => { seachCostcenternameModel(e) }} style={{ maxWidth: '200px', minWidth: '110px', marginLeft: '5px', height: '35px', borderRadius: '5px' }}>
                            </Input>
                        </div>
                        <div style={{ display: 'flex', width: '30%', marginTop: '25px', alignItems: 'center' }}>
                            <span style={{ marginLeft: '19px', width: '100px', fontSize: '12px' }}>成本部门:</span>
                            <Input.Group placeholder='请输入:' style={{ maxWidth: '200px', minWidth: '110px', marginLeft: '5px', marginTop: '-10px', height: '35px', borderRadius: '5px' }}>
                                <AutoComplete
                                    onChange={(e) => { seachDepartmentofcostModel(e), setDepartmentofcostModel(e) }}
                                    value={departmentofcostModel}
                                    style={{ width: '100%', marginTop: '10px' }}
                                    placeholder="请输入"
                                    options={storedepartmentofcostModel}
                                />
                            </Input.Group>
                        </div>
                    </div>
                    <div style={{ width: '100%', height: '0 auto', overflow: 'hidden', borderTop: '1px solid #ccc', marginTop: '30px' }}>
                        <p style={{ fontSize: '12px', margin: '30px 0px 10px 10px', }}>科目信息录入</p>
                        <div className='modelinputinner' style={{ marginLeft: '19px', display: 'flex', width: '100%', fontSize: '12px', flexWrap: 'wrap' }}>
                            <Form
                                // ref={frominnter}
                                form={form}
                               
                            >
                                {
                                    fromlist.map((v, i) => {
                                        return (
                                            <Row key={i}>
                                                {
                                                    v.map((b, ind) => {
                                                        if (b.type === 'input') {
                                                            return <Form.Item name={b.key ? 'serialNumber' : ''} style={{ width: 'auto', marginTop: '15px' }} key={ind}>
                                                                <div style={{ display: 'flex', alignItems: 'center', width: 'auto', }}>
                                                                    {
                                                                        b.name === '序号' ?
                                                                            <span style={{ width: '40px', fontSize: '12px' }}>{b.name}:</span>
                                                                            : b.name === '记账金额' ? <span style={{ width: '80px', fontSize: '12px' }}>{b.name}:</span>
                                                                                : <span style={{ width: '100px', marginLeft: '19px', fontSize: '12px' }}>{b.name}:</span>
                                                                    }

                                                                    {
                                                                        b.name === '序号' ?
                                                                            <Input placeholder='请输入:' disabled={true} value={i + 1}
                                                                                onChange={(e) => {
                                                                                    b.value = i + 1
                                                                                }}
                                                                                style={{ maxWidth: '50px', minWidth: '30px', marginLeft: '5px', height: '35px', borderRadius: '5px' }}>

                                                                            </Input>
                                                                            : b.name === '科目名称' ?
                                                                                    <Input.Group placeholder='请输入:' style={{ maxWidth: '260px', minWidth: '200px', marginLeft: '5px', marginTop: '-10px', height: '35px', borderRadius: '5px' }}>
                                                                                        <AutoComplete
                                                                                            onChange={(e) => {
                                                                                                seachserialModel(e, b, i)
                                                                                                b.value = e
                                                                                            }}
                                                                                            value={b.value}
                                                                                            style={{ width: '100%', marginTop: '10px' }}
                                                                                            placeholder="请输入"
                                                                                            options={rel}
                                                                                        />
                                                                                    </Input.Group>
                                                                                 :
                                                                                <Input placeholder='请输入:' value={b.value}
                                                                                    onChange={(e) => {
                                                                                        seachchargemoneyModel(b, e)
                                                                                        b.value = e.target.value
                                                                                    }}
                                                                                    style={{ maxWidth: '200px', minWidth: '110px', marginLeft: '5px', height: '35px', borderRadius: '5px' }}>
                                                                                </Input>
                                                                    }
                                                                </div>
                                                            </Form.Item>
                                                        } else if (b.type === 'text') {
                                                            return <Form.Item name="textable" style={{ width: '50%', marginTop: '15px' }} key={ind}>
                                                                <div style={{ display: 'flex', alignItems: 'center', width: '100%', }}>
                                                                    <span style={{ width: '60px', fontSize: '12px' }}>{b.name}:</span>
                                                                    <Input.TextArea
                                                                        onChange={(e) => {
                                                                            addseachabstract(e)
                                                                            b.value = e.target.value
                                                                        }}
                                                                        rows={2} placeholder='多行输入' value={b.value} style={{ width: '600px', height: 'auto' }} />
                                                                </div>
                                                            </Form.Item>
                                                        } else if (b.type === 'select') {
                                                            return <Form.Item name="Three" style={{ width: 'auto', marginTop: '15px' }} key={ind}>
                                                                <div style={{ display: 'flex', alignItems: 'center', width: 'auto', }}>
                                                                    <span style={{ marginLeft: '19px', width: '100px', fontSize: '12px', }}>{b.name}:</span>
                                                                    {
                                                                        b.name === '借贷标志' ?
                                                                            <Select placeholder='请选择' size='middle'
                                                                                defaultValue={accountEa('dr', 'drcrFlag')}
                                                                                onChange={(e) => { b.value =  e }}
                                                                                onSelect={(e) => seachaccountBorrowing(e, b,i)}
                                                                                style={{ maxWidth: '200px', minWidth: '150px', height: '35px', paddingRight: '4px', borderRadius: '5px', marginLeft: '5px' }} showArrow={true}>
                                                                                <Select.Option value={accountEa('dr', 'drcrFlag')} style={{ height: '30px', }}>借</Select.Option>
                                                                                <Select.Option value={accountEa('cr', 'drcrFlag')} style={{ height: '30px' }}>贷</Select.Option>
                                                                            </Select>
                                                                            :
                                                                            <Input.Group placeholder='请输入:' style={{ maxWidth: '280px', minWidth: '180px', marginLeft: '5px', marginTop: '-10px', height: '35px', borderRadius: '5px' }}>
                                                                                <AutoComplete
                                                                                    onChange={(e) => {
                                                                                        seachaccountAccountTh(e, b, i)
                                                                                        b.value = e
                                                                                    }}
                                                                                    value={b.value}
                                                                                    style={{ width: '100%', marginTop: '10px' }}
                                                                                    placeholder="请输入"
                                                                                    options={acc}
                                                                                />
                                                                            </Input.Group>
                                                                    }
                                                                </div>
                                                            </Form.Item>
                                                        } else {
                                                            return <Form.Item
                                                                wrapperCol={{
                                                                    offset: 16,
                                                                    span: 16,
                                                                }}
                                                                style={{ marginTop: '20px', }}
                                                                key={ind}
                                                            >
                                                                <div style={{ display: 'flex', }}>
                                                                    <Button onClick={
                                                                        () => handleaddOk(ind)

                                                                    } style={{ marginRight: '20px', background: '#3137b7', color: '#fff', borderRadius: '5px' }} htmlType="submit" width="650px">
                                                                        添加
                                                                    </Button>
                                                                    <Button onClick={() => handledeltCancel(i)} style={{ marginRight: '0px', background: '#3137b7', color: '#fff', borderRadius: '5px' }} width="650px" >
                                                                        删除</Button>
                                                                </div>
                                                            </Form.Item>
                                                        }
                                                    })
                                                }
                                            </Row>
                                        )
                                    })
                                }
                            </Form>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '75px 0', width: '100%', }}>
                        <span></span>
                        <span>
                            <Button
                                onClick={principle}
                                style={{ marginRight: '20px', background: '#3137b7', color: '#fff', borderRadius: '5px' }} htmlType="submit" width="650px">
                                借贷平衡计算
                            </Button>
                            <Button onClick={auucountsubmit} style={{ marginRight: '20px', background: '#3137b7', color: '#fff', borderRadius: '5px' }} width="650px" >
                                提交</Button>
                            <Button
                                onClick={cancel}
                                style={{ marginRight: '20px', background: '#3137b7', color: '#fff', borderRadius: '5px' }} width="650px" >取消</Button>
                        </span>
                        <span></span>
                    </div>
                </div>
            </div>
        } else if (a === '2') {
            return <div>
                <Form>
                    <Row gutter={[16, 16]}>
                        <Col span={8} style={{ paddingLeft: '5px' }}>
                            <span>会计日期:</span>
                            <span>{tabDetail ? tabDetail.AccDate : ''}</span>
                        </Col>
                        <Col span={4}>
                            <span>核算机构:</span>
                            <span>{tabDetail ? accountEa(tabDetail.Accountingagency, 'settleBranch') : ''}</span>
                        </Col>
                        <Col span={4}>
                            <span>币种:</span>
                            <span>{tabDetail ? accountEa(tabDetail.Currency, 'ccy') : ''}</span>

                        </Col>
                        <Col span={8}>
                            <span>客商名称:</span>
                            <span>{tabDetail ? tabDetail.Merchantname : ''}</span>
                        </Col>
                        <Col span={8}>
                            <span>产品:</span>
                            <span>{tabDetail ? tabDetail.Product : ''}</span>
                        </Col>
                        <Col span={8}>
                            <span>产品名称:</span>
                            <span>{tabDetail ? tabDetail.Productname : ''}</span>
                        </Col>
                        <Col span={8}>
                            <span>成本部门:</span>
                            <span>{tabDetail ? tabDetail.Department : ''}</span>
                        </Col>

                        <Col span={8}>
                            <span>成本中心:</span>
                            <span>{tabDetail ? tabDetail.Costcenter : ''}</span>
                        </Col>
                        <Col span={8}>
                            <span>成本中心名称:</span>
                            <span>{tabDetail ? tabDetail.Costcentername : ''}</span>
                        </Col>
                        <Col span={8}>
                            <span>会计事件:</span>
                            <span>{tabDetail ? tabDetail.Accountevent : ''}</span>
                        </Col>
                        <Table
                            style={{ margin: '0 auto' }}
                            columns={tablecolumns}
                            dataSource={ModelTabledata}
                            rowKey="id"
                            pagination={false}
                        ></Table>
                    </Row>
                </Form>
            </div>
        }
    }
    const columns = [
        {
            title: '序号',
            dataIndex: 'idx',
            key: 'id',
            width: 150,
            render: (t, r, i) => {
                return i = i * 1 + 1
            }
        },
        {
            title: '会计日',
            dataIndex: 'accDate',
            key: 'accDate',
            width: 150,
        },
        {
            title: '核算机构',
            key: 'settleBranch',
            dataIndex: 'settleBranch',
            width: 150,
            render: (t, r, i) => {
                return accountEa(t, 'settleBranch')
            }
        },
        {
            title: '会计科目',
            key: 'subjectNo',
            dataIndex: 'subjectNo',
            width: 160,
        },
        {
            title: '科目名称',
            key: 'subjectName',
            dataIndex: 'subjectName',
            width: 160,
        },
        {
            title: '借贷标志',
            key: 'drcrFlag',
            dataIndex: 'drcrFlag',
            width: 150,
            render: (t, r, i) => {
                return accountEa(t, 'drcrFlag')
            }
        },
        {
            title: '交易金额',
            key: 'amount',
            dataIndex: 'amount',
            width: 150,
            render: (t, r, i) => {
                return <span>{(r.amount).toFixed(2)}</span>
            }
        },
        {
            title: '请求系统',
            dataIndex: 'requestSystem',
            key: 'requestSystem',
            width: 150,
            render: (t, r, i) => {
                return accountEa(t, 'requestSystem')
            }
        },
        {
            title: '业务凭证号',
            key: 'receiptNo',
            dataIndex: 'receiptNo',
            width: 150,
        },
        {
            title: '凭证细分',
            key: 'receiptDetail',
            dataIndex: 'receiptDetail',
            width: 150,
        },
        {
            title: '会计流水号',
            key: 'accSequenceNo',
            dataIndex: 'accSequenceNo',
            width: 160,
        },
        {
            title: '交易号',
            key: 'accountNo',
            dataIndex: 'accountNo',
            width: 160,
            render: (t, r, i) => {
                return accountEa(t, 'accountNo')
            }
        },
        {
            title: '币种',
            key: 'ccy',
            dataIndex: 'ccy',
            width: 150,
            render: (t, r, i) => {
                return accountEa(t, 'ccy')
            }
        },
        {
            title: '红字标识',
            key: 'negativeFlag',
            dataIndex: 'negativeFlag',
            width: 150,
            render: (t, r, i) => {
                return accountEa(t, 'negativeFlag')
            }
        }, {
            title: '备注',
            key: 'rmk',
            dataIndex: 'rmk',
            width: 150,
        }, {
            title: '产品',
            key: 'bizTyp',
            dataIndex: 'bizTyp',
            width: 150,
        },
        {
            title: '产品名称',
            key: 'bizName',
            dataIndex: 'bizName',
            width: 150,
        },

        {
            title: '成本中心名称',
            key: 'costCenterName',
            dataIndex: 'costCenterName',
            width: 150,
        },
        {
            title: '成本中心',
            key: 'costCenter',
            dataIndex: 'costCenter',
            width: 150,
        }, {
            title: '客商名称',
            key: 'traveName',
            dataIndex: 'traveName',
            width: 150,
        },
        {
            title: '操作',
            key: 'action',
            width: 150,
            fixed: 'right',
            render: (text, record) => (
                <Space size="middle">
                    <a onClick={() => { look('2'), accountLook(record) }}>查看</a>
                </Space>
            ),
        }
    ];
    return (
        <div className={styles.box}>
            <div className={styles.proTableSearch}>
                <div className={styles.proTableHead}>
                    <div style={{ display: 'flex', width: '30%', alignItems: 'center' }}>
                        <span style={{ fontSize: '18px' }}>业务凭证号:</span>
                        <Input placeholder='请输入:' value={voucherValue} onChange={(e) => { voucherRck(e) }} style={{ maxWidth: '200px', minWidth: '110px', marginLeft: '5px', height: '45px', borderRadius: '5px' }}>
                        </Input>
                    </div>
                    <div style={{ display: 'flex', width: '30%', alignItems: 'center' }}>
                        <span style={{ marginLeft: '19px', fontSize: '18px' }}>业务凭证细项:</span>
                        <Input placeholder='请输入:' value={voucherDetails} onChange={(e) => { voucherList(e) }} style={{ maxWidth: '200px', minWidth: '110px', marginLeft: '5px', height: '45px', borderRadius: '5px' }}>
                        </Input>
                    </div>
                    <div style={{ display: 'flex', width: '30%', alignItems: 'center' }}>
                        <span style={{ marginLeft: '19px', fontSize: '18px' }}>会计流水号:</span>
                        <Input placeholder='请输入:' value={accountingNumber} onChange={(e) => { accountingList(e) }} style={{ maxWidth: '200px', minWidth: '110px', marginLeft: '5px', height: '45px', borderRadius: '5px' }}>
                        </Input>
                    </div>
                    <div style={{ display: 'flex', width: '30%', marginTop: '20px', alignItems: 'center' }}>
                        <span style={{ fontSize: '18px', }}>科目号:</span>
                        <Input placeholder='请输入:' value={accountnumber} onChange={(e) => { seachaccountnumber(e) }} style={{ maxWidth: '200px', minWidth: '110px', marginLeft: '5px', height: '45px', borderRadius: '5px' }}>
                        </Input>
                    </div>
                    <div style={{ display: 'flex', width: '30%', marginTop: '20px', alignItems: 'center' }}>
                        <span style={{ marginLeft: '19px', fontSize: '18px' }}>开始会计日:</span>
                        <Space direction="vertical">
                            <DatePicker defaultValue={moment().subtract(1, 'days').endOf('day')} style={{ maxWidth: '200px', minWidth: '110px', height: '45px', borderRadius: '5px', marginLeft: '15px' }} size={"small"}
                                onChange={(e) => { changeDate(e) }}
                                value={accDate}
                            />
                        </Space>
                    </div>
                    <div style={{ display: 'flex', width: '30%', marginTop: '20px', alignItems: 'center' }}>
                        <span style={{ marginLeft: '19px', fontSize: '18px' }}>截止会计日:</span>
                        <Space direction="vertical">
                            <DatePicker defaultValue={moment().subtract(1, 'days').endOf('day')} style={{ maxWidth: '200px', minWidth: '110px', height: '45px', borderRadius: '5px', marginLeft: '15px' }} size={"small"}
                                onChange={(e) => { changeendDate(e) }}
                                value={eccDate}
                            />
                        </Space>
                    </div>
                    <div style={{ display: 'flex', width: '30%', marginTop: '20px', alignItems: 'center' }}>
                        <span style={{ fontSize: '18px', }}>会计事件:</span>
                        <Select placeholder='请选择' size='middle' onSelect={seachaccountevent} value={accountevent} style={{ maxWidth: '200px', minWidth: '150px', height: '35px', paddingRight: '4px', borderRadius: '5px', marginLeft: '5px' }} showArrow={true}>
                            <Select.Option key={1} style={{ height: '30px', }}>确收</Select.Option>
                            <Select.Option key={2} style={{ height: '30px' }}>清算客户</Select.Option>
                            <Select.Option key={3} style={{ height: '30px', }}>清算平台</Select.Option>
                            <Select.Option key={4} style={{ height: '30px' }}>开立发票</Select.Option>
                            <Select.Option key={5} style={{ height: '30px', }}>结算</Select.Option>
                            <Select.Option key={6} style={{ height: '30px' }}>核销</Select.Option>
                        </Select>
                    </div>
                    <div style={{ display: 'flex', width: '30%', marginTop: '20px', alignItems: 'center' }}>
                        <span style={{ marginLeft: '19px', fontSize: '18px' }}>借贷标志:</span>
                        <Select placeholder='请选择' size='middle' onSelect={seachaccountmodelBorrowing} value={accountmodelBorrowingmarks} style={{ maxWidth: '200px', minWidth: '150px', height: '35px', paddingRight: '4px', borderRadius: '5px', marginLeft: '5px' }} showArrow={true}>
                            <Select.Option value={'借'} key={1} style={{ height: '30px', }}>借</Select.Option>
                            <Select.Option value={'贷'} key={2} style={{ height: '30px' }}>贷</Select.Option>
                        </Select>
                    </div>
                    <div style={{ display: 'flex', width: '30%', marginTop: '20px', alignItems: 'center' }}>
                        <span style={{ marginLeft: '19px', fontSize: '18px' }}>核算机构:</span>
                        <Select placeholder='请选择' size='middle' onSelect={seachaccountingagency} value={accountingagency} style={{ maxWidth: '200px', minWidth: '150px', height: '35px', paddingRight: '4px', borderRadius: '5px', marginLeft: '5px' }} showArrow={true}>
                            <Select.Option key={1} style={{ height: '30px', }}>云药房</Select.Option>
                            <Select.Option key={2} style={{ height: '30px' }}>云健康</Select.Option>
                            <Select.Option key={3} style={{ height: '30px', }}>海南星创</Select.Option>
                            <Select.Option key={4} style={{ height: '30px' }}>复胜健康</Select.Option>
                            <Select.Option key={5} style={{ height: '30px', }}>复星医药销售</Select.Option>
                        </Select>
                    </div>
                </div>
                <div className={styles.proTables}>
                    <Button className={styles.reset} onClick={() => Xia()}>重置</Button>
                    <Button className={styles.searchBtn} onClick={() => Abb()}>查询</Button>
                </div>
            </div>


            <div className={styles.card}>
                <div className={styles.mixing}>
                    <b>会计分录列表</b>
                    <Button type="primary" style={{ maxWidth: '100px', maxHeight: '50px' }} onClick={() => look('1')}>新建</Button>
                </div>
                <div className={styles.table}>
                    <Spin spinning={loading}>
                        <Table columns={columns} dataSource={tableData} scroll={{ x: 2700 }} pagination={false} />
                    </Spin>
                    <div className={styles.pagination}>
                        <Pagination
                            total={total}
                            current={pageNum}
                            rowKey="id"
                            showTotal={(total, range) => `第${(range[0]) < 0 ? '1' : (range[0])}—${range[1]}条/总共 ${total} 条`}
                            defaultPageSize={pageSize}
                            defaultCurrent={pageNum}
                            showSizeChanger={true}
                            pageSizeOptions={[10, 20, 30, 40, 50]}
                            onChange={(pageNum, pageSize) => queryPage(pageNum, pageSize)}
                        />
                    </div>
                </div>
            </div>
            <Modal title={operation} centered bodyStyle={modelcontuter} visible={isModalVisible} keyboard={true} onOk={handleOk} onCancel={handleCancel} width={800}>
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

export default connect(mapStateToProps, mapDispatchToProps)(accountQuery);