import { useEffect, useState } from 'react'
import { Modal, Space, Table, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ExclamationCircleFilled } from '@ant-design/icons'
import { book } from '../../../api/index'
import { titleAction } from '../../../store/user/loginUserSlice'
import { BackBartment, PerButton } from '../../../components'
import { CourseChapterCreateDialog } from '../components/chapter-create'
import { CourseChapterUpdateDialog } from '../components/chapter-update'

const { confirm } = Modal

interface DataType {
  id: React.Key
  title: string
}

function BookChapterPage() {
  const dispatch = useDispatch()
  const result = new URLSearchParams(useLocation().search)
  const [loading, setLoading] = useState<boolean>(false)
  const [list, setList] = useState<any>([])
  const [refresh, setRefresh] = useState(false)
  const [showAddWin, setShowAddWin] = useState<boolean>(false)
  const [showUpdateWin, setShowUpdateWin] = useState<boolean>(false)
  const [updateId, setUpdateId] = useState<number>(0)
  const [cid, setCid] = useState(Number(result.get('bid')))

  useEffect(() => {
    document.title = '电子书章节管理'
    dispatch(titleAction('电子书章节管理'))
  }, [])

  useEffect(() => {
    setCid(Number(result.get('bid')))
  }, [result.get('bid')])

  useEffect(() => {
    getData()
  }, [cid, refresh])

  const getData = () => {
    if (loading)
      return

    setLoading(true)
    book
      .chaptersList({
        bookId: cid,
      })
      .then((res: any) => {
        setList(res.data)
        setLoading(false)
      })
      .catch((e) => {
        setLoading(false)
      })
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'ID',
      width: 150,
      render: (_, record: any) => <span>{record.id}</span>,
    },
    {
      title: '排序',
      width: 150,
      render: (_, record: any) => <span>{record.sort}</span>,
    },
    {
      title: '章节',
      render: (_, record: any) => (
        <span>
          {record.name}
          {' '}
        </span>
      ),
    },
    {
      title: '操作',
      width: 160,
      fixed: 'right',
      render: (_, record: any) => (
        <Space>
          <PerButton
            type="link"
            text="编辑"
            class="c-primary"
            icon={null}
            p="addons.meedu_books.book_chapter.update"
            onClick={() => {
              setUpdateId(record.id)
              setShowUpdateWin(true)
            }}
            disabled={null}
          />
          <PerButton
            type="link"
            text="删除"
            class="c-red"
            icon={null}
            p="addons.meedu_books.book_chapter.delete"
            onClick={() => {
              destory(record.id)
            }}
            disabled={null}
          />
        </Space>
      ),
    },
  ]

  const resetData = () => {
    setList([])
    setRefresh(!refresh)
  }

  const destory = (id: number) => {
    if (id === 0)
      return

    confirm({
      title: '操作确认',
      icon: <ExclamationCircleFilled />,
      content: '确认删除此章节？',
      centered: true,
      okText: '确认',
      cancelText: '取消',
      onOk() {
        if (loading)
          return

        setLoading(true)
        book
          .chaptersDestroy(id)
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
      <BackBartment title="电子书章节管理" />
      <CourseChapterCreateDialog
        cid={cid}
        open={showAddWin}
        onCancel={() => setShowAddWin(false)}
        onSuccess={() => {
          resetData()
          setShowAddWin(false)
        }}
      >
      </CourseChapterCreateDialog>
      <CourseChapterUpdateDialog
        id={updateId}
        cid={cid}
        open={showUpdateWin}
        onCancel={() => setShowUpdateWin(false)}
        onSuccess={() => {
          resetData()
          setShowUpdateWin(false)
        }}
      >
      </CourseChapterUpdateDialog>
      <div className="float-left  mt-30 mb-30">
        <PerButton
          type="primary"
          text="添加章节"
          class=""
          icon={null}
          p="addons.meedu_books.book_chapter.store"
          onClick={() => setShowAddWin(true)}
          disabled={null}
        />
      </div>
      <div className="float-left">
        <Table
          loading={loading}
          columns={columns}
          dataSource={list}
          rowKey={record => record.id}
          pagination={false}
        />
      </div>
    </div>
  )
}

export default BookChapterPage
