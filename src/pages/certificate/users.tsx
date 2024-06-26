import { useEffect, useState } from 'react'
import { Button, Input, Modal, Space, Table, message } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import type { ColumnsType } from 'antd/es/table'
import { useDispatch, useSelector } from 'react-redux'
import { ExclamationCircleFilled } from '@ant-design/icons'
import { certificate } from '../../api/index'
import { BackBartment, PerButton, UserImportDialog } from '../../components'
import { titleAction } from '../../store/user/loginUserSlice'
import { checkUrl, dateFormat, getToken } from '../../utils/index'
import config from '../../js/config'

const { confirm } = Modal

interface DataType {
  id: React.Key
  userId: string
  createdTime: string
}

function CertificateUsersPage() {
  const result = new URLSearchParams(useLocation().search)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(false)
  const [list, setList] = useState<any>([])
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [refresh, setRefresh] = useState(false)
  const [user_id, setUserId] = useState('')
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([])
  const [importDialog, setImportDialog] = useState(false)
  const [id, setId] = useState(Number(result.get('id')))

  useEffect(() => {
    document.title = '证书授予学员'
    dispatch(titleAction('证书授予学员'))
  }, [])

  useEffect(() => {
    setId(Number(result.get('id')))
  }, [result.get('id')])

  useEffect(() => {
    getData()
  }, [page, size, id, refresh])

  const getData = () => {
    if (loading)
      return

    setLoading(true)
    certificate
      .userList(id, {
        pageNum: page,
        pageSize: size,
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
    setSelectedRowKeys([])
    setUserId('')
    setRefresh(!refresh)
  }

  const delUser = () => {
    if (selectedRowKeys.length === 0) {
      message.error('请选择需要删除的学员')
      return
    }
    confirm({
      title: '操作确认',
      icon: <ExclamationCircleFilled />,
      content: '确认删除授予选中的学员？',
      centered: true,
      okText: '确认',
      cancelText: '取消',
      onOk() {
        if (loading)
          return

        setLoading(true)
        certificate
          .userDelete(id, { ids: selectedRowKeys })
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

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      setSelectedRowKeys(selectedRowKeys)
    },
  }

  const columns: ColumnsType<DataType> = [
    {
      title: '学员ID',
      width: 150,
      render: (_, record: any) => <span>{record.userId}</span>,
    },
    {
      title: '学员',
      render: (_, record: any) => (
        <>
          {record.user && (
            <div className="user-item d-flex">
              <div className="avatar">
                <img src={record.user.avatar} width="40" height="40" />
              </div>
              <div className="ml-10">{record.user.name}</div>
            </div>
          )}
          {!record.user && <span className="c-red">学员不存在</span>}
        </>
      ),
    },
    {
      title: '手机号',
      width: 150,
      render: (_, record: any) => <span>{record.user?.phone}</span>,
    },
    {
      title: '证书编号',
      width: 400,
      render: (_, record: any) => <span>{record.cnum}</span>,
    },
    {
      title: '授予时间',
      width: 200,
      dataIndex: 'createdTime',
      render: (createdTime: string) => <span>{dateFormat(createdTime)}</span>,
    },
    {
      title: '操作',
      width: 100,
      render: (_, record: any) => (
        <Space>
          <PerButton
            type="link"
            text="下载"
            class="c-primary"
            icon={null}
            p="addons.cert.download"
            onClick={() => {
              download(record.user_id)
            }}
            disabled={null}
          />
        </Space>
      ),
    },
  ]

  const download = (uid: number) => {
    window.open(
      `${checkUrl(config.url)
        }backend/addons/Cert/cert/${
        id
        }/${
        uid
        }/download?token=${
        getToken()}`,
    )
  }

  return (
    <div className="geekedu-main-body">
      <BackBartment title="证书授予学员" />
      {/* <UserImportDialog
        open={importDialog}
        id={id}
        type="cert"
        name="证书授予批量导入模板"
        onCancel={() => setImportDialog(false)}
        onSuccess={() => {
          setImportDialog(false)
          resetData()
        }}
      >
      </UserImportDialog> */}
      <div className="float-left j-b-flex mb-30 mt-30">
        <div className="d-flex">
          {/* <PerButton
            type="primary"
            text="批量授予"
            class=""
            icon={null}
            p="addons.cert.user.import"
            onClick={() => setImportDialog(true)}
            disabled={null}
          /> */}

          <PerButton
            type="danger"
            text="撤销授予"
            class="ml-10"
            icon={null}
            p="addons.cert.user.destroy"
            onClick={() => delUser()}
            disabled={null}
          />
        </div>
        {/* <div className="d-flex">
          <Input
            value={user_id}
            onChange={(e) => {
              setUserId(e.target.value)
            }}
            allowClear
            style={{ width: 150 }}
            placeholder="学员ID"
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
        </div> */}
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
          rowKey={record => record.userId}
          pagination={paginationProps}
        />
      </div>
    </div>
  )
}

export default CertificateUsersPage
