/*
 * @Author: Poison02 2069820192@qq.com
 * @Date: 2024-01-19 22:53:24
 * @LastEditors: Poison02 2069820192@qq.com
 * @LastEditTime: 2024-03-26 11:13:42
 * @FilePath: /geekedu-admin/src/pages/miaosha/index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useEffect, useState } from 'react'
import { Button, Input, Modal, Space, Table, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import type { ColumnsType } from 'antd/es/table'
import { useDispatch, useSelector } from 'react-redux'
import { ExclamationCircleFilled } from '@ant-design/icons'
import { miaosha } from '../../api/index'
import { titleAction } from '../../store/user/loginUserSlice'
import { PerButton, ThumbBar } from '../../components'
import { dateFormat } from '../../utils/index'

const { confirm } = Modal

interface DataType {
  id: React.Key
  goods_title: string
  goods_id: number
  goods_type_text: string
  created_at: string
}

function MiaoshaPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(false)
  const [list, setList] = useState<any>([])
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [refresh, setRefresh] = useState(false)
  const [keywords, setKeywords] = useState<string>('')

  useEffect(() => {
    document.title = '秒杀活动'
    dispatch(titleAction('秒杀活动'))
  }, [])

  useEffect(() => {
    getData()
  }, [page, size, refresh])

  const getData = () => {
    if (loading)
      return

    setLoading(true)
    miaosha
      .list({
        pageNum: page,
        pageSize: size,
        keywords,
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

  const resetList = () => {
    setPage(1)
    setSize(10)
    setList([])
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
      title: '类型',
      dataIndex: 'goodsTypeText',
      render: (goodsTypeText: string) => <span>{goodsTypeText}</span>,
    },
    {
      title: '商品名称',
      width: 400,
      render: (_, record: any) => (
        <>
          {record.goodsType === 'book' && (
            <ThumbBar
              value={record.goodsCover}
              width={90}
              height={120}
              title={record.goodsTitle}
              border={4}
            >
            </ThumbBar>
          )}
          {record.goodsType !== 'book' && (
            <ThumbBar
              value={record.goodsCover}
              width={120}
              height={90}
              title={record.goodsTitle}
              border={4}
            >
            </ThumbBar>
          )}
        </>
      ),
    },
    {
      title: '价格',
      width: 150,
      render: (_, record: any) => (
        <>
          <div>
            秒杀价：
            {record.price}
            元
          </div>
          <div className="ori-charge">
            原价：
            {record.originPrice}
            元
          </div>
        </>
      ),
    },
    {
      title: '库存',
      width: 120,
      render: (_, record: any) => (
        <>
          <div className="c-red">
            剩余：
            {record.stock}
            件
          </div>
          <div>
            总量：
            {record.total}
            件
          </div>
        </>
      ),
    },
    {
      title: '时间',
      width: 200,
      render: (_, record: any) => (
        <>
          <div>
            开始:
            {dateFormat(record.startAt)}
          </div>
          <div>
            结束:
            {dateFormat(record.endAt)}
          </div>
        </>
      ),
    },
    {
      title: '操作',
      width: 140,
      render: (_, record: any) => (
        <Space>
          <PerButton
            type="link"
            text="订单"
            class="c-primary"
            icon={null}
            p="addons.MiaoSha.orders"
            onClick={() => {
              navigate(`/miaosha/orders/index?id=${record.id}`)
            }}
            disabled={null}
          />
          <PerButton
            type="link"
            text="编辑"
            class="c-primary"
            icon={null}
            p="addons.MiaoSha.goods.update"
            onClick={() => {
              navigate(`/miaosha/goods/update?id=${record.id}`)
            }}
            disabled={null}
          />
          <PerButton
            type="link"
            text="删除"
            class="c-red"
            icon={null}
            p="addons.MiaoSha.goods.delete"
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
      content: '确认删除此活动？',
      centered: true,
      okText: '确认',
      cancelText: '取消',
      onOk() {
        if (loading)
          return

        setLoading(true)
        miaosha
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
            text="新建秒杀"
            class=""
            icon={null}
            p="addons.MiaoSha.goods.store"
            onClick={() => navigate('/miaosha/goods/create')}
            disabled={null}
          />
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

export default MiaoshaPage
