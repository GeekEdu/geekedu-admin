import { useEffect, useState } from 'react'
import { Button, Input, Modal, Select, Space, Table, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import type { ColumnsType } from 'antd/es/table'
import { useDispatch, useSelector } from 'react-redux'
import { ExclamationCircleFilled } from '@ant-design/icons'
import { creditMall } from '../../api/index'
import { titleAction } from '../../store/user/loginUserSlice'
import { OptionBar, PerButton } from '../../components'
import { dateFormat } from '../../utils/index'

const { confirm } = Modal

interface DataType {
  id: React.Key
  created_at: string
}

function CreditMallPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(false)
  const [list, setList] = useState<any>([])
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [refresh, setRefresh] = useState(false)
  const [keywords, setKeywords] = useState<string>('')
  const [goodsTypes, setGoodsTypes] = useState<any>([])
  const [goods_type, setGoodsType] = useState([])

  useEffect(() => {
    document.title = '积分商城'
    dispatch(titleAction('积分商城'))
  }, [])

  useEffect(() => {
    getData()
  }, [page, size, refresh])

  const getData = () => {
    if (loading)
      return

    setLoading(true)
    creditMall
      .list({
        pageNum: page,
        pageSize: size,
        keywords,
        type: goods_type,
      })
      .then((res: any) => {
        setList(res.data.goods.data)
        setTotal(res.data.goods.total)
        const goodsTypes = res.data.goodsType
        const arr = []
        for (let i = 0; i < goodsTypes.length; i++) {
          arr.push({
            label: goodsTypes[i].name,
            value: goodsTypes[i].sign,
          })
        }
        setGoodsTypes(arr)
        setLoading(false)
      })
      .catch((e) => {
        setLoading(false)
      })
  }

  const resetList = () => {
    setPage(1)
    setSize(10)
    setList([])
    setGoodsType([])
    setKeywords('')
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
      title: '商品名称',
      width: 400,
      render: (_, record: any) => (
        <div className="d-flex">
          <div
            style={{
              backgroundImage: `url(${record.cover})`,
              width: 120,
              height: 120,
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'contain',
              backgroundPosition: 'center center',
            }}
          >
          </div>
          <div className="ml-10" style={{ width: 250 }}>
            {record.title}
          </div>
        </div>
      ),
    },
    {
      title: '价格',
      width: 400,
      render: (_, record: any) => (
        <div>
          {record.price}
          积分
        </div>
      ),
    },
    {
      title: '商品分类',
      width: 200,
      render: (_, record: any) => (
        <div>
          {record.goodsType}
        </div>
      ),
    },
    {
      title: '库存',
      width: 120,
      render: (_, record: any) => (
        <>
          <div>
            兑换：
            {record.sellCount}
          </div>
          <div>
            库存：
            {record.stockCount}
          </div>
        </>
      ),
    },
    {
      title: '是否显示',
      width: 120,
      render: (_, record: any) => (
        <>
          {record.isShow && <span className="c-green">· 显示</span>}
          {!record.isShow && <span className="c-red">· 隐藏</span>}
        </>
      ),
    },
    {
      title: '时间',
      width: 200,
      render: (_, record: any) => <div>{dateFormat(record.createdTime)}</div>,
    },
    {
      title: '操作',
      width: 130,
      render: (_, record: any) => (
        <Space>
          <PerButton
            type="link"
            text="编辑"
            class="c-primary"
            icon={null}
            p="addons.credit1Mall.goods.update"
            onClick={() => {
              navigate(`/creditMall/update?id=${record.id}`)
            }}
            disabled={null}
          />
          <PerButton
            type="link"
            text="删除"
            class="c-red"
            icon={null}
            p="addons.credit1Mall.goods.delete"
            onClick={() => {
              destory(record.id)
            }}
            disabled={null}
          />
        </Space>
      ),
    },
  ]

  const destory = (id: number) => {
    if (id === 0)
      return

    confirm({
      title: '操作确认',
      icon: <ExclamationCircleFilled />,
      content: '确认删除此商品？',
      centered: true,
      okText: '确认',
      cancelText: '取消',
      onOk() {
        if (loading)
          return

        setLoading(true)
        creditMall
          .destroy(id)
          .then(() => {
            setLoading(false)
            message.success('删除成功')
            resetData()
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

  const resetData = () => {
    setPage(1)
    setList([])
    setRefresh(!refresh)
  }

  return (
    <div className="geekedu-main-body">
      <div className="float-left j-b-flex mb-30">
        <div className="d-flex">
          <PerButton
            type="primary"
            text="新建积分商品"
            class=""
            icon={null}
            p="addons.credit1Mall.goods.store"
            onClick={() => navigate('/creditMall/create')}
            disabled={null}
          />
          <PerButton
            type="primary"
            text="积分订单"
            class="ml-10"
            icon={null}
            p="addons.credit1Mall.orders.list"
            onClick={() => navigate('/creditMall/orders/index')}
            disabled={null}
          />
          <OptionBar
            text="积分配置"
            value="/system/creditSignConfig"
          >
          </OptionBar>
        </div>
        <div className="d-flex">
          <Input
            value={keywords}
            onChange={(e) => {
              setKeywords(e.target.value)
            }}
            allowClear
            style={{ width: 150 }}
            placeholder="商品名称关键字"
          />
          <Select
            style={{ width: 150, marginLeft: 10 }}
            value={goods_type}
            onChange={(e) => {
              setGoodsType(e)
            }}
            allowClear
            placeholder="商品分类"
            options={goodsTypes}
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
            }}
          >
            筛选
          </Button>
        </div>
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
    </div>
  )
}

export default CreditMallPage
