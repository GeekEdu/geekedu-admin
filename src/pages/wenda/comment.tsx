import { useEffect, useState } from 'react'
import { Modal, Table, message } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import type { ColumnsType } from 'antd/es/table'
import { useDispatch } from 'react-redux'
import { ExclamationCircleFilled } from '@ant-design/icons'
import { wenda } from '../../api/index'
import { titleAction } from '../../store/user/loginUserSlice'
import { BackBartment, PerButton } from '../../components'
import { dateFormat } from '../../utils/index'

const { confirm } = Modal

interface DataType {
  id: React.Key
  user_id: number
  vote_count: number
  created_at: string
}

function WendaCommentPage() {
  const result = new URLSearchParams(useLocation().search)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState<boolean>(false)
  const [list, setList] = useState<any>([])
  const [refresh, setRefresh] = useState(false)
  const [id, setId] = useState(Number(result.get('id')))
  const [answer_id, setAnswerId] = useState(Number(result.get('answer_id')))

  useEffect(() => {
    document.title = '问题评论'
    dispatch(titleAction('问题评论'))
  }, [])

  useEffect(() => {
    setId(Number(result.get('id')))
    setAnswerId(Number(result.get('answer_id')))
    getData()
  }, [result.get('id'), result.get('answer_id'), refresh])

  const getData = () => {
    if (loading)
      return

    setLoading(true)
    wenda
      .comment(answer_id)
      .then((res: any) => {
        setList(res.data)
        setLoading(false)
      })
      .catch((e) => {
        setLoading(false)
      })
  }

  const resetData = () => {
    setList([])
    setRefresh(!refresh)
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'ID',
      width: 40,
      render: (_, record: any) => <span>{record.id}</span>,
    },
    {
      title: '学员ID',
      width: 200,
      dataIndex: 'userId',
      render: (userId: number) => <span>{userId}</span>,
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
      title: '内容',
      width: 500,
      render: (_, record: any) => <div>{record.content}</div>,
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
      title: '时间',
      width: 200,
      dataIndex: 'createdTime',
      render: (createdTime: string) => <span>{dateFormat(createdTime)}</span>,
    },
    {
      title: '操作',
      width: 100,
      render: (_, record: any) => (
        <PerButton
          type="link"
          text="删除"
          class="c-red"
          icon={null}
          p="addons.Wenda.question.answers.comments.delete"
          onClick={() => {
            destory(answer_id, record.id)
          }}
          disabled={null}
        />
      ),
    },
  ]

  const destory = (id: number, cid: number) => {
    if (cid === 0)
      return

    confirm({
      title: '操作确认',
      icon: <ExclamationCircleFilled />,
      content: '确认删除此评论？',
      centered: true,
      okText: '确认',
      cancelText: '取消',
      onOk() {
        if (loading)
          return

        setLoading(true)
        wenda
          .destoryComment(id, cid)
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
      <BackBartment title="问题评论" />
      <div className="float-left mt-30">
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

export default WendaCommentPage
