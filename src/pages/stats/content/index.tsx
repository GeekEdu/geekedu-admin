import { useEffect, useState } from 'react'
import { Radio, Table, Tooltip } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import { InfoCircleOutlined } from '@ant-design/icons'
import { stats } from '../../../api/index'
import { titleAction } from '../../../store/user/loginUserSlice'
import { DayWeekMonth } from '../../../components/index'
import styles from './index.module.scss'

interface DataType {
  id: React.Key
  goods_name: string
  orders_count: number
  orders_paid_sum: number
}

function StatsContentPage() {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState<boolean>(false)
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [list, setList] = useState<any>([])
  const [refresh, setRefresh] = useState(false)
  const [goodsType, setGoodsType] = useState<string>('REPLAY_COURSE')
  const [start_at, setStartAt] = useState(
    moment().subtract(6, 'days').format('YYYY-MM-DD HH:mm:ss'),
  )
  const [end_at, setEndAt] = useState(
    moment().add(1, 'days').format('YYYY-MM-DD HH:mm:ss'),
  )
  const [typeList, setTypeList] = useState<any>([])
  const enabledAddons = useSelector(
    (state: any) => state.enabledAddonsConfig.value.enabledAddons,
  )

  useEffect(() => {
    document.title = '商品数据'
    dispatch(titleAction('商品数据'))
  }, [])

  useEffect(() => {
    getData()
  }, [page, size, start_at, end_at, goodsType, refresh])

  useEffect(() => {
    const typeList = [
      {
        name: '录播课',
        key: 'REPLAY_COURSE',
      },
    ]

    if (enabledAddons.Zhibo) {
      typeList.push({
        name: '直播课',
        key: 'LIVE_COURSE',
      })
    }

    if (enabledAddons.MeeduBooks) {
      typeList.push({
        name: '电子书',
        key: 'E_BOOK',
      })
    }

    if (enabledAddons.MeeduTopics) {
      typeList.push({
        name: '图文',
        key: 'IMAGE_TEXT',
      })
    }

    if (enabledAddons.LearningPaths) {
      typeList.push({
        name: '学习路径',
        key: 'LEARN_PATH',
      })
    }

    typeList.push({
      name: 'VIP会员',
      key: 'VIP',
    })
    setTypeList(typeList)
  }, [enabledAddons])

  const paginationPageChange = (page: number) => {
    setPage(page)
    setRefresh(!refresh)
  }

  const getData = () => {
    if (loading)
      return

    setLoading(true)
    stats
      .contentList({
        pageNum: page,
        pageSize: size,
        startAt: start_at,
        endAt: end_at,
        goodsType,
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

  const paginationReset = () => {
    setStartAt(moment().subtract(6, 'days').format('YYYY-MM-DD HH:mm:ss'))
    setEndAt(moment().add(1, 'days').format('YYYY-MM-DD HH:mm:ss'))
    setRefresh(!refresh)
  }

  const changeTimeContentTop = (start_at: any, end_at: any) => {
    setStartAt(start_at)
    setEndAt(end_at)
    paginationPageChange(1)
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
      title: (
        <div className="d-flex">
          <span className="mr-5">Top10销售额</span>
          <Tooltip placement="rightTop" title="团购秒杀活动销量不计入此列表统计">
            <InfoCircleOutlined />
          </Tooltip>
        </div>
      ),
      render: (_, record: any) => <span>{record.goodsName}</span>,
    },
    {
      title: '支付订单数',
      width: 250,
      render: (_, record: any) => <span>{record.orderCount}</span>,
    },
    {
      title: '支付总金额',
      width: 250,
      render: (_, record: any) => <span>{record.payTotal}</span>,
    },
  ]

  return (
    <div className={styles.el_content}>
      <div className={styles.el_top_row1}>
        <div className={styles.el_row_item}>
          <div className={styles.header}>
            <div className={styles.tabs}>
              <Radio.Group
                size="large"
                defaultValue={goodsType}
                buttonStyle="solid"
                onChange={(e) => {
                  setGoodsType(e.target.value)
                  paginationPageChange(1)
                }}
              >
                {typeList.length > 0
                && typeList.map((item: any) => (
                  <Radio.Button key={item.key} value={item.key}>
                    {item.name}
                  </Radio.Button>
                ))}
              </Radio.Group>
            </div>
            <div className={styles.controls}>
              <DayWeekMonth
                active={true}
                onChange={(start_at, end_at) => {
                  changeTimeContentTop(start_at, end_at)
                }}
              >
              </DayWeekMonth>
            </div>
          </div>
          <div className="float-left mt-15">
            <Table
              loading={loading}
              columns={columns}
              dataSource={list}
              rowKey={record => record.id}
              pagination={paginationProps}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
export default StatsContentPage
