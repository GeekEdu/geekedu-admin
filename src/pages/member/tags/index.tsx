import { useEffect, useState } from 'react'
import { Button, Modal, Space, Table, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import type { ColumnsType } from 'antd/es/table'
import { useDispatch } from 'react-redux'
import { ExclamationCircleFilled } from '@ant-design/icons'
import { member } from '../../../api/index'
import { titleAction } from '../../../store/user/loginUserSlice'
import { BackBartment } from '../../../components'

const { confirm } = Modal

interface DataType {
  id: React.Key
  name: string
}

function MemberTagsPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(false)
  const [list, setList] = useState<any>([])
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    document.title = '标签管理'
    dispatch(titleAction('标签管理'))
  }, [])

  useEffect(() => {
    getData()
  }, [page, size, refresh])

  const getData = () => {
    if (loading)
      return

    setLoading(true)
    member
      .tagList({
        pageNum: page,
        pageSize: size,
        type: 'MEMBERS',
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
      title: '标签名',
      dataIndex: 'name',
      render: (name: string) => <span>{name}</span>,
    },
    {
      title: '操作',
      width: 130,
      render: (_, record: any) => (
        <Space>
          <Button
            type="link"
            className="c-primary"
            onClick={() => {
              navigate(`/member/tag/update?id=${record.id}`)
            }}
          >
            编辑
          </Button>

          <Button
            type="link"
            className="c-red"
            onClick={() => {
              destroy(record.id)
            }}
          >
            编辑
          </Button>
        </Space>
      ),
    },
  ]

  const resetData = () => {
    setList([])
    setRefresh(!refresh)
  }

  const destroy = (id: number) => {
    if (id === 0)
      return

    confirm({
      title: '操作确认',
      icon: <ExclamationCircleFilled />,
      content: '确认删除此标签？',
      centered: true,
      okText: '确认',
      cancelText: '取消',
      onOk() {
        if (loading)
          return

        setLoading(true)
        member
          .tagDestroy(id)
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
      <BackBartment title="标签管理" />
      <div className="float-left  mt-30 mb-30">
        <Button type="primary" onClick={() => navigate('/member/tag/create')}>
          添加标签
        </Button>
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

export default MemberTagsPage
