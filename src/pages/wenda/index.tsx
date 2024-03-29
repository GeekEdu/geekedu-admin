import { useEffect, useState } from 'react'
import {
  Button,
  DatePicker,
  Drawer,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  message,
} from 'antd'
import { useNavigate } from 'react-router-dom'
import type { ColumnsType } from 'antd/es/table'
import { useDispatch, useSelector } from 'react-redux'
import { ExclamationCircleFilled } from '@ant-design/icons'
import { wenda } from '../../api/index'
import { titleAction } from '../../store/user/loginUserSlice'
import { OptionBar, PerButton } from '../../components'
import { dateFormat } from '../../utils/index'
import filterIcon from '../../assets/img/icon-filter.png'
import filterHIcon from '../../assets/img/icon-filter-h.png'

const { confirm } = Modal
const { RangePicker } = DatePicker

interface DataType {
  id: React.Key
  user_id: number
  title: string
  view_times: number
  vote_count: number
  answer_count: number
  credit1: number
  created_at: string
}

function WendaPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(false)
  const [list, setList] = useState<any>([])
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [refresh, setRefresh] = useState(false)
  const [keywords, setKeywords] = useState<string>('')
  const [user_id, setUserId] = useState('')
  const [category_id, setCategoryId] = useState<any>([])
  const [status, setStatus] = useState(-1)
  const [created_at, setCreatedAt] = useState<any>([])
  const [createdAts, setCreatedAts] = useState<any>([])
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([])
  const [categories, setCategories] = useState<any>([])
  const [drawer, setDrawer] = useState(false)
  const [showStatus, setShowStatus] = useState(false)
  const statusTypes = [
    {
      value: -1,
      label: '全部',
    },
    {
      value: 0,
      label: '未解决',
    },
    {
      value: 1,
      label: '已解决',
    },
  ]

  useEffect(() => {
    document.title = '站内问答'
    dispatch(titleAction('站内问答'))
    getParams()
  }, [])

  useEffect(() => {
    getData()
  }, [page, size, refresh])

  useEffect(() => {
    if (
      (created_at && created_at.length > 0)
      || (category_id && category_id.length !== 0)
      || user_id
      || keywords
      || status !== -1
    )
      setShowStatus(true)
    else
      setShowStatus(false)
  }, [created_at, category_id, user_id, keywords, status])

  const getData = () => {
    if (loading)
      return

    setLoading(true)
    wenda
      .list({
        pageNum: page,
        pageSize: size,
        sort: 'id',
        order: 'desc',
        userId: user_id,
        categoryId: category_id,
        status,
        createdTime: created_at.join(','),
        keywords,
      })
      .then((res: any) => {
        setList(res.data.data.data)
        setTotal(res.data.data.total)
        setLoading(false)
      })
      .catch((e) => {
        setLoading(false)
      })
  }

  const getParams = () => {
    wenda.category({
      type: 'ASK_QUESTION',
    }).then((res: any) => {
      const categories = res.data
      const arr = []
      for (let i = 0; i < categories.length; i++) {
        arr.push({
          label: categories[i].name,
          value: categories[i].id,
        })
      }
      setCategories(arr)
    })
  }

  const resetList = () => {
    setPage(1)
    setSize(10)
    setList([])
    setSelectedRowKeys([])
    setKeywords('')
    setUserId('')
    setCategoryId([])
    setStatus(-1)
    setCreatedAt([])
    setRefresh(!refresh)
  }

  const destorymulti = () => {
    if (selectedRowKeys.length === 0) {
      message.error('请选择需要操作的数据')
      return
    }
    confirm({
      title: '操作确认',
      icon: <ExclamationCircleFilled />,
      content: '确认删除选中的问题？',
      centered: true,
      okText: '确认',
      cancelText: '取消',
      onOk() {
        if (loading)
          return

        setLoading(true)
        wenda
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

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      setSelectedRowKeys(selectedRowKeys)
    },
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
      title: '分类',
      width: 100,
      render: (_, record: any) => <span>{record?.category?.name || '-'}</span>,
    },
    {
      title: '学员',
      width: 300,
      render: (_, record: any) => (
        <>
          {record.user && (
            <div className="user-item d-flex">
              <div className="avatar">
                <img src={record.user.avatar} width="40" height="40" />
              </div>
              <div className="ml-10">{record.user.userName}</div>
            </div>
          )}
          {!record.user && <span className="c-red">学员不存在</span>}
        </>
      ),
    },
    {
      title: '标题',
      width: 400,
      dataIndex: 'title',
      render: (title: string) => <span>{title}</span>,
    },
    {
      title: '地区',
      width: 100,
      render: (_, record: any) => (
        <>
          {record.user && (
            <span>{record?.user.province.split('|')[0]}</span>
          )}
          {!record.user && <span className="c-red">地区不存在</span>}
        </>
      ),
    },
    {
      title: '浏览器',
      width: 100,
      render: (_, record: any) => (
        <>
          {record.user && (
            <span>{record?.user.browser}</span>
          )}
          {!record.user && <span className="c-red">未知浏览器</span>}
        </>
      ),
    },
    {
      title: '浏览',
      width: 120,
      dataIndex: 'viewCount',
      render: (viewCount: number) => (
        <span>
          {viewCount}
          次
        </span>
      ),
    },
    {
      title: '答案',
      width: 120,
      dataIndex: 'answerCount',
      render: (answerCount: number) => (
        <span>
          {answerCount}
          个
        </span>
      ),
    },
    {
      title: '积分',
      width: 120,
      dataIndex: 'rewardScore',
      render: (rewardScore: number) => (
        <span>
          {rewardScore}
          积分
        </span>
      ),
    },
    {
      title: '状态',
      width: 120,
      render: (_, record: any) => (
        <>
          {record.questionStatus && (
            <Tag color="success">{record.statusText}</Tag>
          )}
          {!record.questionStatus && (
            <Tag color="default">{record.statusText}</Tag>
          )}
        </>
      ),
    },
    {
      title: '创建时间',
      width: 200,
      dataIndex: 'createdTime',
      render: (createdTime: string) => <span>{dateFormat(createdTime)}</span>,
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 80,
      render: (_, record: any) => (
        <PerButton
          type="link"
          text="回答"
          class="c-primary"
          icon={null}
          p="addons.Wenda.question.answers"
          onClick={() => {
            navigate(
              `/wenda/question/answer?id=${
              record.id
                 }&status=${
                 record.status}`,
            )
          }}
          disabled={null}
        />
      ),
    },
  ]

  return (
    <div className="geekedu-main-body">
      <div className="float-left j-b-flex mb-30">
        <div className="d-flex">
          <PerButton
            type="primary"
            text="问答分类"
            class=""
            icon={null}
            p="addons.Wenda.category.list"
            onClick={() => navigate('/wenda/question/category/index')}
            disabled={null}
          />
          <Button
            type="primary"
            className="ml-10"
            danger
            onClick={() => destorymulti()}
          >
            批量删除
          </Button>
          <OptionBar
            text="问答配置"
            value="/system/config?key=问答"
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
            placeholder="标题关键字"
          />
          <Select
            style={{ width: 150, marginLeft: 10 }}
            value={category_id}
            onChange={(e) => {
              setCategoryId(e)
            }}
            allowClear
            placeholder="分类"
            options={categories}
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
        <Table
          rowSelection={{
            type: 'checkbox',
            ...rowSelection,
          }}
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
                value={keywords}
                onChange={(e) => {
                  setKeywords(e.target.value)
                }}
                allowClear
                placeholder="关键字"
              />
              <Select
                style={{ marginTop: 20, width: '100%' }}
                value={category_id}
                onChange={(e) => {
                  setCategoryId(e)
                }}
                allowClear
                placeholder="分类"
                options={categories}
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
              <Select
                style={{ marginTop: 20, width: '100%' }}
                value={status}
                onChange={(e) => {
                  setStatus(e)
                }}
                allowClear
                placeholder="状态"
                options={statusTypes}
              />
              <RangePicker
                format="YYYY-MM-DD HH:mm:ss"
                value={createdAts}
                style={{ marginTop: 20 }}
                onChange={(date, dateString) => {
                  setCreatedAt(dateString)
                  setCreatedAts(date)
                }}
                placeholder={['日期-开始', '日期-结束']}
              />
            </div>
          </Drawer>
          )
        : null}
    </div>
  )
}

export default WendaPage
