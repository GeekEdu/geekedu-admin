import { useEffect, useState } from 'react'
import { Button, Modal, Select, Space, Table, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ExclamationCircleFilled } from '@ant-design/icons'
import { book } from '../../../api/index'
import { titleAction } from '../../../store/user/loginUserSlice'
import { BackBartment, PerButton } from '../../../components'
import { dateFormat } from '../../../utils/index'

const { confirm } = Modal

interface DataType {
  id: React.Key
  published_at: string
}

function BookArticlePage() {
  const result = new URLSearchParams(useLocation().search)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(false)
  const [list, setList] = useState<any>([])
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(100)
  const [total, setTotal] = useState(0)
  const [refresh, setRefresh] = useState(false)
  const [category_id, setCategoryId] = useState([])
  const [categories, setCategories] = useState<any>([])
  const [id, setId] = useState(Number(result.get('bid')))
  const [title, setTitle] = useState(String(result.get('title')))

  useEffect(() => {
    document.title = '电子书文章管理'
    dispatch(titleAction('电子书文章管理'))
  }, [])

  useEffect(() => {
    setId(Number(result.get('bid')))
    setTitle(String(result.get('title')))
  }, [result.get('bid'), result.get('title')])

  useEffect(() => {
    getData()
  }, [id, page, size, refresh])

  const getData = () => {
    if (loading)
      return

    setLoading(true)
    book
      .articleList({
        pageNum: page,
        pageSize: size,
        sort: 'groundingTime',
        order: 'asc',
        bookId: id,
        chapterId: category_id,
      })
      .then((res: any) => {
        setList(res.data.data.data)
        setTotal(res.data.data.total)
        const categories = res.data.chapters
        const box: any = []
        for (let i = 0; i < categories.length; i++) {
          box.push({
            label: categories[i].name,
            value: categories[i].id,
          })
        }
        setCategories(box)
        setLoading(false)
      })
      .catch((e) => {
        setLoading(false)
      })
  }

  const resetList = () => {
    setPage(1)
    setSize(100)
    setList([])
    setCategoryId([])
    setRefresh(!refresh)
  }

  const resetData = () => {
    setPage(1)
    setList([])
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
      render: (_, record: any) => <span>{record.id}</span>,
    },
    {
      title: '标题',
      width: 500,
      render: (_, record: any) => (
        <>
          {record.chapter && (
            <>
              <span>{record.chapter.name}</span>
              <span className="mx-5">/</span>
            </>
          )}
          <span>{record.title}</span>
        </>
      ),
    },
    {
      title: '浏览',
      width: 150,
      render: (_, record: any) => (
        <span>
          {record.readCount}
          次
        </span>
      ),
    },
    {
      title: '上架时间',
      dataIndex: 'groundingTime',
      render: (groundingTime: string) => <span>{dateFormat(groundingTime)}</span>,
    },
    {
      title: '操作',
      width: 120,
      fixed: 'right',
      render: (_, record: any) => (
        <Space>
          <PerButton
            type="link"
            text="编辑"
            class="c-primary"
            icon={null}
            p="addons.meedu_books.book_article.update"
            onClick={() => {
              navigate(
                `/meedubook/article/update?id=${record.id}&bid=${id}`,
              )
            }}
            disabled={null}
          />
          <PerButton
            type="link"
            text="删除"
            class="c-red"
            icon={null}
            p="addons.meedu_books.book_article.delete"
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
      title: '警告',
      icon: <ExclamationCircleFilled />,
      content: '确认操作？',
      centered: true,
      okText: '确认',
      cancelText: '取消',
      onOk() {
        if (loading)
          return

        setLoading(true)
        book
          .articleDestroy(id)
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

  return (
    <div className="geekedu-main-body">
      <BackBartment title={title} />
      <div className="float-left j-b-flex mb-30 mt-30">
        <div className="d-flex">
          <PerButton
            type="primary"
            text="添加"
            class=""
            icon={null}
            p="addons.meedu_books.book_article.store"
            onClick={() => navigate(`/meedubook/article/create?book_id=${id}`)}
            disabled={null}
          />
          <PerButton
            type="primary"
            text="文章章节"
            class="ml-10"
            icon={null}
            p="addons.meedu_books.book_chapter.list"
            onClick={() => navigate(`/meedubook/chapter/index?bid=${id}`)}
            disabled={null}
          />
        </div>
        <div className="d-flex">
          <Select
            style={{ width: 150, marginLeft: 10 }}
            value={category_id}
            onChange={(e) => {
              setCategoryId(e)
            }}
            allowClear
            placeholder="章节"
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

export default BookArticlePage
