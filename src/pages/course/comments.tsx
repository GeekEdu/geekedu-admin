import { useEffect, useState } from 'react'
import { Button, DatePicker, Modal, Table, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useDispatch, useSelector } from 'react-redux'
import { ExclamationCircleFilled } from '@ant-design/icons'
import moment from 'moment'
import { course } from '../../api/index'
import { titleAction } from '../../store/user/loginUserSlice'
import { BackBartment, PerButton } from '../../components'
import { dateFormat } from '../../utils/index'

const { confirm } = Modal
const { RangePicker } = DatePicker

interface DataType {
  id: React.Key
  created_at: string
  user_id: number
}

function CourseCommentsPage() {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState<boolean>(false)
  const [list, setList] = useState<any>([])
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [refresh, setRefresh] = useState(false)
  const [users, setUsers] = useState<any>({})
  const [user_id, setUserId] = useState('')
  const [created_at, setCreatedAt] = useState<any>([])
  const [createdAts, setCreatedAts] = useState<any>([])
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([])

  useEffect(() => {
    document.title = '课程评论'
    dispatch(titleAction('课程评论'))
  }, [])

  useEffect(() => {
    getData()
  }, [page, size, refresh])

  const getData = () => {
    if (loading)
      return

    setLoading(true)
    course
      .commentList({
        pageNum: page,
        pageSize: size,
        cType: 'REPLAY_COURSE',
        user_id: null,
        course_id: null,
        createdTime: created_at.join(','),
      })
      .then((res: any) => {
        setList(res.data.data.data)
        setTotal(res.data.data.total)
        setUsers(res.data.users)
        setLoading(false)
      })
      .catch((e) => {
        setLoading(false)
      })
  }

  const delMulti = () => {
    if (selectedRowKeys.length === 0) {
      message.error('请选择需要操作的数据')
      return
    }

    confirm({
      title: '操作确认',
      icon: <ExclamationCircleFilled />,
      content: '确认删除选中的评论？',
      centered: true,
      okText: '确认',
      cancelText: '取消',
      onOk() {
        if (loading)
          return

        setLoading(true)
        course
          .commentDestroy({
            ids: selectedRowKeys,
            type: 'REPLAY_COURSE',
          })
          .then(() => {
            setLoading(false)
            message.success('成功')
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

  const resetList = () => {
    setPage(1)
    setSize(10)
    setList([])
    setSelectedRowKeys([])
    setUserId('')
    setCreatedAts([])
    setCreatedAt([])
    setRefresh(!refresh)
  }

  const resetData = () => {
    setPage(1)
    setList([])
    setSelectedRowKeys([])
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
      title: '学员',
      width: 240,
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
              <div className="ml-10">{users[record.userId].userName}</div>
            </div>
          )}
          {!users[record.userId] && <span className="c-red">学员不存在</span>}
        </>
      ),
    },
    {
      title: '课程',
      width: 300,
      render: (_, record: any) => (
        <>{record.course && <span>{record.course.title}</span>}</>
      ),
    },
    {
      title: '内容',
      width: 500,
      render: (_, record: any) => (
        <div dangerouslySetInnerHTML={{ __html: record.content }}></div>
      ),
    },
    {
      title: '地区',
      width: 150,
      dataIndex: 'province',
      render: (_, record: any) => (
        <>
          {record.user && (
            <span>{record?.user.province.split('|')[0]}</span>
          )}
          {!record.user && <span className="c-red">用户不存在</span>}
        </>
      ),
    },
    {
      title: '浏览器',
      width: 150,
      dataIndex: 'browser',
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
      title: '评论时间',
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

  const disabledDate = (current: any) => {
    return current && current >= moment().add(0, 'days') // 选择时间要大于等于当前天。若今天不能被选择，去掉等号即可。
  }

  return (
    <div className="geekedu-main-body">
      <BackBartment title="课程评论" />
      <div className="float-left j-b-flex mb-30 mt-30">
        <div className="d-flex">
          <PerButton
            type="danger"
            text="删除"
            class=""
            icon={null}
            p="course_comment.destroy"
            onClick={() => delMulti()}
            disabled={null}
          />
        </div>
        <div className="d-flex">
          <RangePicker
            disabledDate={disabledDate}
            format="YYYY-MM-DD HH:mm:ss"
            value={createdAts}
            style={{ marginLeft: 10 }}
            onChange={(date, dateString) => {
              setCreatedAt(dateString)
              setCreatedAts(date)
            }}
            placeholder={['评论时间-开始', '评论时间-结束']}
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
    </div>
  )
}

export default CourseCommentsPage
