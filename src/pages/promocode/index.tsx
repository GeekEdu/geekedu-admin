/*
 * @Author: Poison02 2069820192@qq.com
 * @Date: 2024-01-19 22:53:24
 * @LastEditors: Poison02 2069820192@qq.com
 * @LastEditTime: 2024-03-19 14:39:08
 * @FilePath: /geekedu-admin/src/pages/promocode/index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useEffect, useState } from 'react'
import {
  Button,
  DatePicker,
  Drawer,
  Input,
  Modal,
  Space,
  Table,
  Tag,
  message,
} from 'antd'
import { useNavigate } from 'react-router-dom'
import type { ColumnsType } from 'antd/es/table'
import { useDispatch, useSelector } from 'react-redux'
import { ExclamationCircleFilled } from '@ant-design/icons'
import { promocode } from '../../api/index'
import { titleAction } from '../../store/user/loginUserSlice'
import { OptionBar, PerButton } from '../../components'
import { dateFormat } from '../../utils/index'
import filterIcon from '../../assets/img/icon-filter.png'
import filterHIcon from '../../assets/img/icon-filter-h.png'

const { confirm } = Modal
const { RangePicker } = DatePicker

interface DataType {
  couponId: React.Key
  couponTotal: number
  expiredTime: string
  createdTime: string
}

function PromoCodePage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(false)
  const [list, setList] = useState<any>([])
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [refresh, setRefresh] = useState(false)
  const [key, setKey] = useState<string>('')
  const [user_id, setUserId] = useState('')
  const [created_at, setCreatedAt] = useState<any>([])
  const [expired_at, setExpiredAt] = useState<any>([])
  const [createdAts, setCreatedAts] = useState<any>([])
  const [expiredAts, setExpiredAts] = useState<any>([])
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([])
  const [drawer, setDrawer] = useState(false)
  const [showStatus, setShowStatus] = useState(false)

  useEffect(() => {
    document.title = '优惠码'
    dispatch(titleAction('优惠码'))
  }, [])

  useEffect(() => {
    getData()
  }, [page, size, refresh])

  useEffect(() => {
    if (
      (created_at && created_at.length > 0)
      || (expired_at && expired_at.length > 0)
      || user_id
      || key
    )
      setShowStatus(true)
    else
      setShowStatus(false)
  }, [created_at, expired_at, user_id, key])

  const getData = () => {
    if (loading)
      return

    setLoading(true)
    promocode
      .list({
        pageNum: page,
        pageSize: size,
        keywords: key,
      })
      .then((res: any) => {
        setList(res.data.data)
        setTotal(res.data.total)
        setLoading(false)
      })
      .catch((e) => {
        setLoading(false)
      })
  }

  const destorymulti = () => {
    if (selectedRowKeys.length === 0) {
      message.error('请选择需要操作的数据')
      return
    }
    confirm({
      title: '操作确认',
      icon: <ExclamationCircleFilled />,
      content: '确认删除选中的优惠码？',
      centered: true,
      okText: '确认',
      cancelText: '取消',
      onOk() {
        if (loading)
          return

        setLoading(true)
        promocode
          .destroyMulti({
            ids: selectedRowKeys,
          })
          .then(() => {
            message.success('成功')
            resetList()
            setLoading(false)
          })
          .catch((e) => {
            setLoading(false)
          })
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }

  const resetList = () => {
    setPage(1)
    setSize(10)
    setList([])
    setSelectedRowKeys([])
    setKey('')
    setUserId('')
    setCreatedAts([])
    setExpiredAt([])
    setExpiredAts([])
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
      render: (_, record: any) => <span>{record.couponId}</span>,
    },
    {
      title: '优惠码',
      render: (_, record: any) => (
        <>
          <div className="mb-10">{record.couponCode}</div>
          <div>
            面值：
            {record.couponPrice}
            元
          </div>
          <div>
            最低消费：
            {record.couponLimit}
            元
          </div>
        </>
      ),
    },
    {
      title: '可使用次数',
      width: 300,
      render: (_, record: any) => (
        <>
          {record.useLimit === 0 && <Tag color="error">不限制</Tag>}
          {record.useLimit !== 0 && (
            <Tag>
              {record.useLimit || 0}
              次
            </Tag>
          )}
        </>
      ),
    },
    {
      title: '库存',
      width: 150,
      dataIndex: 'couponTotal',
      render: (couponTotal: number) => (
        <span>
          {couponTotal || 0}
          次
        </span>
      ),
    },
    {
      title: '过期时间',
      width: 200,
      dataIndex: 'expiredTime',
      render: (expiredTime: string) => <span>{dateFormat(expiredTime)}</span>,
    },
    {
      title: '添加时间',
      width: 200,
      dataIndex: 'createdTime',
      render: (createdTime: string) => <span>{dateFormat(createdTime)}</span>,
    },
  ]

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      setSelectedRowKeys(selectedRowKeys)
    },
  }

  return (
    <div className="geekedu-main-body">
      <div className="float-left j-b-flex mb-30">
        <div className="d-flex">
          <PerButton
            type="primary"
            text="新建优惠码"
            class=""
            icon={null}
            p="promoCode.store"
            onClick={() => navigate('/createcode')}
            disabled={null}
          />
          <PerButton
            type="primary"
            text="批量生成"
            class="ml-10"
            icon={null}
            p="promoCode.generator"
            onClick={() => navigate('/createmulticode')}
            disabled={null}
          />
          <PerButton
            type="primary"
            text="批量导入"
            class="ml-10"
            icon={null}
            p="promoCode.store"
            onClick={() => navigate('/order/code-import')}
            disabled={null}
          />
          <PerButton
            type="danger"
            text="批量删除"
            class="ml-10"
            icon={null}
            p="promoCode.destroy.multi"
            onClick={() => destorymulti()}
            disabled={null}
          />
        </div>
        <div className="d-flex">
          <Input
            value={key}
            onChange={(e) => {
              setKey(e.target.value)
            }}
            allowClear
            style={{ width: 150 }}
            placeholder="优惠码关键字"
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
          {/* <div
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
          </div> */}
        </div>
      </div>
      <div className="float-left">
        <Table
          rowSelection={{
            type: 'checkbox',
            ...rowSelection,
          }}
          loading={loading}
          columns={columns}
          dataSource={list}
          rowKey={record => record.couponId}
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
                value={key}
                onChange={(e) => {
                  setKey(e.target.value)
                }}
                allowClear
                placeholder="优惠码"
              />
              <Input
                value={user_id}
                onChange={(e) => {
                  setUserId(e.target.value)
                }}
                allowClear
                style={{ marginTop: 20 }}
                placeholder="学员ID"
              />
              <RangePicker
                format="YYYY-MM-DD"
                value={expiredAts}
                style={{ marginTop: 20 }}
                onChange={(date, dateString) => {
                  setExpiredAt(dateString)
                  setExpiredAts(date)
                }}
                placeholder={['过期时间-开始', '过期时间-结束']}
              />
              <RangePicker
                format="YYYY-MM-DD"
                value={createdAts}
                style={{ marginTop: 20 }}
                onChange={(date, dateString) => {
                  setCreatedAt(dateString)
                  setCreatedAts(date)
                }}
                placeholder={['添加时间-开始', '添加时间-结束']}
              />
            </div>
          </Drawer>
          )
        : null}
    </div>
  )
}
export default PromoCodePage
