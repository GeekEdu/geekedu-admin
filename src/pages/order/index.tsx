import { useEffect, useState } from 'react'
import {
  Button,
  DatePicker,
  Drawer,
  Dropdown,
  Input,
  Select,
  Space,
  Table,
  Tabs,
  message,
} from 'antd'
import { useNavigate } from 'react-router-dom'
import type { ColumnsType } from 'antd/es/table'
import type { MenuProps } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { DownOutlined } from '@ant-design/icons'
import moment from 'moment'
import * as XLSX from 'xlsx'
import { order } from '../../api/index'
import { titleAction } from '../../store/user/loginUserSlice'
import { PerButton } from '../../components'
import { dateFormat } from '../../utils/index'
import filterIcon from '../../assets/img/icon-filter.png'
import filterHIcon from '../../assets/img/icon-filter-h.png'
import aliIcon from '../../assets/img/ali-pay.png'
import wepayIcon from '../../assets/img/wepay.png'
import cardIcon from '../../assets/img/card.png'
import { RefundDialog } from './components/refund-dailog'

const { RangePicker } = DatePicker

interface DataType {
  id: React.Key
  amount: number
  createdTime: string
}

function OrderPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(false)
  const [list, setList] = useState<any>([])
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [refresh, setRefresh] = useState(false)
  const [goods_name, setGoodsName] = useState<string>('')
  const [order_id, setOrderId] = useState('')
  const [is_refund, setIsRefund] = useState(-1)
  const [status, setStatus] = useState('')
  const [payment, setPayment] = useState([])
  const [created_at, setCreatedAt] = useState<any>([])
  const [createdAts, setCreatedAts] = useState<any>([])
  const [drawer, setDrawer] = useState(false)
  const [showStatus, setShowStatus] = useState(false)
  const [countMap, setCountMap] = useState<any>({ 3: 0, 4: 0, 1: 0, 2: 0 })
  const [users, setUsers] = useState<any>({})
  const [orderTotal, setOrderTotal] = useState(0)
  const [visiable, setVisiable] = useState<boolean>(false)
  const [oid, setOid] = useState(0)
  const [types, setTypes] = useState<any>([
    {
      label: '全部',
      key: '',
    },
    {
      label: '已下单已支付',
      key: '3',
    },
    {
      label: '已下单已退款',
      key: '4',
    },
    {
      label: '已下单未支付',
      key: '1',
    },
    {
      label: '已下单已取消',
      key: '2',
    },
  ])
  const payments = [
    {
      value: 'ALIPAY',
      label: '支付宝支付',
    },
    {
      value: 'WX_PAY',
      label: '微信支付',
    },

    {
      value: 'OTHER',
      label: '线下打款',
    },
  ]
  const refunds = [
    {
      label: '是否有退款',
      value: -1,
    },
    {
      label: '有退款',
      value: 1,
    },
    {
      label: '无退款',
      value: 0,
    },
  ]

  useEffect(() => {
    document.title = '全部订单'
    dispatch(titleAction('全部订单'))
  }, [])

  useEffect(() => {
    if (countMap === null) {
      setOrderTotal(0)
    }
    else {
      let total = 0
      for (let i = 1; i < types.length; i++)
        total += Number(countMap[types[i].key])

      setOrderTotal(total)
    }
  }, [countMap, types])

  useEffect(() => {
    const statusRows = [
      {
        label: `全部(${orderTotal})`,
        key: '',
      },
      {
        label: `已下单已支付(${Number(countMap[3])})`,
        key: '3',
      },
      {
        label: `已下单已退款(${Number(countMap[4])})`,
        key: '4',
      },
      {
        label: `已下单未支付(${Number(countMap[1])})`,
        key: '1',
      },
      {
        label: `已下单已取消(${Number(countMap[2])})`,
        key: '2',
      },
    ]
    setTypes(statusRows)
  }, [orderTotal, countMap])

  useEffect(() => {
    getData()
  }, [page, size, refresh])

  const getData = () => {
    if (loading)
      return

    setLoading(true)
    order
      .list({
        pageNum: page,
        pageSize: size,
        sort: 'id',
        order: 'desc',
        orderId: order_id,
        goodsName: goods_name,
        isRefund: is_refund,
        status,
        createdTime: created_at.join(','),
        payment,
      })
      .then((res: any) => {
        setList(res.data.data.data)
        setTotal(res.data.data.total)
        setCountMap(res.data.countMap)
        setUsers(res.data.users)
        setLoading(false)
      })
      .catch((e) => {
        setLoading(false)
      })
  }

  useEffect(() => {
    if (
      (created_at && created_at.length > 0)
      || is_refund !== -1
      || status
      || order_id
      || (payment && payment.length > 0)
      || goods_name
    )
      setShowStatus(true)
    else
      setShowStatus(false)
  }, [created_at, is_refund, order_id, goods_name, status, payment])

  const resetList = () => {
    setPage(1)
    setSize(10)
    setList([])
    setGoodsName('')
    setOrderId('')
    setIsRefund(-1)
    setCreatedAts([])
    setStatus('')
    setPayment([])
    setCreatedAt([])
    setRefresh(!refresh)
  }

  const paginationProps = {
    current: page, // 当前页码
    pageSize: size,
    total, // 总条数
    onChange: (page: number, pageSize: number) =>
      handlePageChange(page, pageSize), // 改变页码的函数
    showSizeChanger: true,
  }

  const handlePageChange = (page: number, pageSize: number) => {
    setPage(page)
    setSize(pageSize)
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'ID',
      width: 120,
      render: (_, record: any) => <span>{record.orderId}</span>,
    },
    {
      title: '学员',
      width: 210,
      render: (_, record: any) => (
        <>
          {users[record.userId] && (
            <div className="user-item d-flex">
              <div className="avatar">
                <img
                  src={users[record.userId].avatar}
                  width="40"
                  height="40"
                />
              </div>
              <div className="ml-10">{users[record.userId].name}</div>
            </div>
          )}
          {!users[record.userId] && <span className="c-red">学员不存在</span>}
        </>
      ),
    },
    {
      title: '商品名称',
      width: 300,
      render: (_, record: any) => (
        <>
          <span key={record.goods.goodsId}>{record.goods.goodsName}</span>
        </>
      ),
    },
    {
      title: '支付金额',
      width: 150,
      dataIndex: 'amount',
      render: (amount: number) => (
        <span>
          ¥
          {amount}
        </span>
      ),
    },
    {
      title: '支付渠道',
      width: 150,
      render: (_, record: any) => (
        <>
          {record.payment === 'ALIPAY' && (
            <img src={aliIcon} width="30" height="30" />
          )}
          {record.payment === 'WX_PAY' && (
            <img src={wepayIcon} width="30" height="30" />
          )}
          {record.payment === 'wechat_h5' && (
            <img src={wepayIcon} width="30" height="30" />
          )}
          {record.payment === 'wechat-jsapi' && (
            <img src={wepayIcon} width="30" height="30" />
          )}
          {record.payment === 'wechatApp' && (
            <img src={wepayIcon} width="30" height="30" />
          )}
          {record.payment === 'OTHER' && (
            <img src={cardIcon} width="30" height="30" />
          )}
          {record.payment === '' && <span>-</span>}
        </>
      ),
    },
    {
      title: '支付状态',
      width: 150,
      render: (_, record: any) => (
        <>
          {record.orderStatusText === '已下单已支付' && (
            <span className="c-green">
              ·
              {record.orderStatusText}
            </span>
          )}
          {record.orderStatusText === '已下单未支付' && (
            <span className="c-red">
              ·
              {record.orderStatusText}
            </span>
          )}
          {record.orderStatusText === '已下单已退款' && (
            <span className="c-yellow">
              ·
              {record.orderStatusText}
            </span>
          )}
          {record.orderStatusText === '已下单已取消' && (
            <span className="c-gray">
              ·
              {record.orderStatusText}
            </span>
          )}
        </>
      ),
    },
    {
      title: '退款',
      render: (_, record: any) => (
        <>
          {!record.isRefund
            ? (
              <span>-</span>
              )
            : record.refund
              ? (
                <span>{showRefund(record.refund)}</span>
                )
              : (
                  ''
                )}
        </>
      ),
    },
    {
      title: '订单创建时间',
      width: 200,
      dataIndex: 'createdTime',
      render: (createdTime: string) => <span>{dateFormat(createdTime)}</span>,
    },
    {
      title: '操作',
      width: 120,
      render: (_, record: any) => {
        const items: MenuProps['items'] = [
          {
            key: '1',
            label: (
              <PerButton
                type="link"
                text="退款"
                class="c-primary"
                icon={null}
                p="order.refund"
                onClick={() => {
                  refund(record)
                }}
                disabled={record.status !== 9}
              />
            ),
          },
        ]
        return (
          <Space>
            <PerButton
              type="link"
              text="查看"
              class="c-primary"
              icon={null}
              p="order.detail"
              onClick={() => {
                navigate(`/order/detail?id=${record.orderId}`)
              }}
              disabled={null}
            />
            <Dropdown menu={{ items }}>
              <Button
                type="link"
                className="c-primary"
                onClick={e => e.preventDefault()}
              >
                <Space size="small" align="center">
                  更多
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
          </Space>
        )
      },
    },
  ]

  const showRefund = (item: any) => {
    let amount = 0
    for (let i = 0; i < item.length; i++) {
      if (item[i].status === 1 || item[i].status === 5)
        amount += item[i].amount / 100
    }
    return `¥${amount.toFixed(2)}`
  }

  const refund = (item: any) => {
    setOid(item.id)
    setVisiable(true)
  }

  const importexcel = () => {
    if (loading)
      return

    setLoading(true)
    const params = {
      pageNum: 1,
      pageSize: total,
      orderId: order_id,
      goodsName: goods_name,
      isRefund: is_refund,
      status,
      createdTime: created_at.join(','),
      payment,
    }
    order.list(params).then((res: any) => {
      if (res.data.data.total === 0) {
        message.error('数据为空')
        setLoading(false)
        return
      }
      let status
      if (Number(status) === 3)
        status = '已下单已支付'
      else if (Number(status) === 4)
        status = '已下单已退款'
      else if (Number(status) === 1)
        status = '已下单未支付'
      else if (Number(status) === 2)
        status = '已下单已取消'
      else
        status = '全部'

      const filename = `全部订单（${status}）.xlsx`
      const sheetName = 'sheet1'
      const users = res.data.users
      const data = [
        [
          'ID',
          '学员ID',
          '学员',
          '商品名称',
          '支付金额',
          '支付渠道',
          '支付状态',
          '退款',
          '订单创建时间',
        ],
      ]
      res.data.data.data.forEach((item: any) => {
        data.push([
          item.orderId,
          item.userId,
          users[item.userId] ? users[item.userId].name : '用户已删除',
          item.goods ? item.goods.goodsName : '商品已删除',
          `${item.amount}元`,
          item.payTypeText,
          item.orderStatusText,
          item.isRefund === false ? '-' : showRefund(item.refund),
          item.createdTime
            ? moment(item.createdTime).format('YYYY-MM-DD HH:mm:ss')
            : '',
        ])
      })

      const jsonWorkSheet = XLSX.utils.json_to_sheet(data)
      const workBook: XLSX.WorkBook = {
        SheetNames: [sheetName],
        Sheets: {
          [sheetName]: jsonWorkSheet,
        },
      }
      XLSX.writeFile(workBook, filename)
      setLoading(false)
    })
  }

  const onChange = (key: string) => {
    setPage(1)
    setStatus(key)
    setRefresh(!refresh)
  }

  const disabledDate = (current: any) => {
    return current && current >= moment().add(0, 'days') // 选择时间要大于等于当前天。若今天不能被选择，去掉等号即可。
  }

  return (
    <div className="geekedu-main-body">
      <RefundDialog
        open={visiable}
        id={oid}
        onCancel={() => setVisiable(false)}
        onSuccess={() => {
          setVisiable(false)
          setRefresh(!refresh)
        }}
      >
      </RefundDialog>
      <div className="float-left j-b-flex mb-30">
        <div className="d-flex">
          <PerButton
            type="primary"
            text="退款订单"
            class=""
            icon={null}
            p="order.refund.list"
            onClick={() => navigate('/order/refund')}
            disabled={null}
          />
          <Button
            className="ml-10"
            type="primary"
            onClick={() => importexcel()}
          >
            导出表格
          </Button>
        </div>
        <div className="d-flex">
          <Input
            value={order_id}
            onChange={(e) => {
              setOrderId(e.target.value)
            }}
            allowClear
            style={{ width: 150 }}
            placeholder="订单编号"
          />
          <Input
            value={goods_name}
            onChange={(e) => {
              setGoodsName(e.target.value)
            }}
            allowClear
            style={{ width: 150, marginLeft: 10 }}
            placeholder="商品全称"
          />
          <Select
            style={{ width: 150, marginLeft: 10 }}
            value={payment}
            onChange={(e) => {
              setPayment(e)
            }}
            allowClear
            placeholder="支付渠道"
            options={payments}
          />
          <Button className="ml-10" onClick={resetList}>
            清空
          </Button>
          <Button
            className="ml-10"
            type="primary"
            onClick={() => {
              setPage(1)
              setRefresh(!refresh)
              setDrawer(false)
            }}
          >
            筛选
          </Button>
          <div
            className="drawerMore d-flex ml-10"
            onClick={() => setDrawer(true)}
          >
            {showStatus && (
              <>
                <img src={filterHIcon} />
                <span className="act">已选</span>
              </>
            )}
            {!showStatus && (
              <>
                <img src={filterIcon} />
                <span>更多</span>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="float-left">
        <Tabs defaultActiveKey={status} items={types} onChange={onChange} />
      </div>
      <div className="float-left">
        <Table
          loading={loading}
          columns={columns}
          dataSource={list}
          rowKey={record => record.id}
          pagination={paginationProps}
        />
      </div>
      {drawer
        ? (
          <Drawer
            title="更多筛选"
            onClose={() => setDrawer(false)}
            maskClosable={false}
            open={true}
            footer={(
              <Space className="j-b-flex">
                <Button
                  onClick={() => {
                    resetList()
                    setDrawer(false)
                  }}
                >
                  清空
                </Button>
                <Button
                  onClick={() => {
                    setPage(1)
                    setRefresh(!refresh)
                    setDrawer(false)
                  }}
                  type="primary"
                >
                  筛选
                </Button>
              </Space>
            )}
            width={360}
          >
            <div className="float-left">
              <Input
                value={order_id}
                onChange={(e) => {
                  setOrderId(e.target.value)
                }}
                allowClear
                placeholder="订单编号"
              />
              <Input
                value={goods_name}
                onChange={(e) => {
                  setGoodsName(e.target.value)
                }}
                allowClear
                style={{ marginTop: 20 }}
                placeholder="商品全称"
              />
              <Select
                style={{ width: '100%', marginTop: 20 }}
                value={payment}
                onChange={(e) => {
                  setPayment(e)
                }}
                allowClear
                placeholder="支付渠道"
                options={payments}
              />
              <Select
                style={{ width: '100%', marginTop: 20 }}
                value={is_refund}
                onChange={(e) => {
                  setIsRefund(e)
                }}
                allowClear
                placeholder="退款方式"
                options={refunds}
              />
              <RangePicker
                disabledDate={disabledDate}
                format="YYYY-MM-DD HH:mm:ss"
                value={createdAts}
                style={{ marginTop: 20 }}
                onChange={(date, dateString) => {
                  setCreatedAt(dateString)
                  setCreatedAts(date)
                }}
                placeholder={['订单添加-开始时间', '订单添加-结束时间']}
              />
            </div>
          </Drawer>
          )
        : null}
    </div>
  )
}

export default OrderPage
