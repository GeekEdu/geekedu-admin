import { useEffect, useState } from 'react'
import {
  Button,
  DatePicker,
  Drawer,
  Dropdown,
  Input,
  Modal,
  Select,
  Space,
  Table,
  message,
} from 'antd'
import type { MenuProps } from 'antd'
import { useNavigate } from 'react-router-dom'
import type { ColumnsType } from 'antd/es/table'
import { useDispatch, useSelector } from 'react-redux'
import { DownOutlined, ExclamationCircleFilled } from '@ant-design/icons'
import moment from 'moment'
import { member } from '../../api/index'
import { PerButton, TagsTooltip, VhtmlTooltip } from '../../components'
import { titleAction } from '../../store/user/loginUserSlice'
import { dateFormat } from '../../utils/index'
import filterIcon from '../../assets/img/icon-filter.png'
import filterHIcon from '../../assets/img/icon-filter-h.png'
import { SendMessageDialog } from './components/message-send'
import { ConfigUpdateDialog } from './components/config-update'
import { MemberCreateDialog } from './components/create'
import { MemberUpdateDialog } from './components/update'

const { confirm } = Modal
const { RangePicker } = DatePicker

interface DataType {
  id: React.Key
  created_at: string
  credit1: number
}

function MemberPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(false)
  const [list, setList] = useState<any>([])
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [refresh, setRefresh] = useState(false)
  const [keywords, setKeywords] = useState<string>('')
  const [role_id, setRoleId] = useState<any>([])
  const [roles, setRoles] = useState<any>([])
  const [tag_id, setTagId] = useState<any>([])
  const [tags, setTags] = useState<any>([])
  const [created_at, setCreatedAt] = useState<any>([])
  const [createdAts, setCreatedAts] = useState<any>([])
  const [drawer, setDrawer] = useState(false)
  const [showStatus, setShowStatus] = useState<boolean>(false)
  const [userRemark, setUserRemark] = useState<any>({})
  const [mid, setMid] = useState(0)
  const [visiable, setVisiable] = useState<boolean>(false)
  const [editVisible, setEditVisible] = useState<boolean>(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([])
  const [showAddWin, setShowAddWin] = useState<boolean>(false)
  const [showUpdateWin, setShowUpdateWin] = useState<boolean>(false)

  useEffect(() => {
    document.title = '学员列表'
    dispatch(titleAction('学员列表'))
  }, [])

  useEffect(() => {
    getData()
  }, [page, size, refresh])

  const getData = () => {
    if (loading)
      return

    setLoading(true)
    member
      .list({
        pageNum: page,
        pageSize: size,
        sort: 'id',
        order: 'desc',
        keywords,
        vipId: role_id,
        tagId: tag_id,
        createdTime: created_at.join(','),
      })
      .then((res: any) => {
        setList(res.data.data.data)
        setTotal(res.data.data.total)
        const userRemark = res.data.userRemarks
        if (userRemark.length !== 0)
          setUserRemark(userRemark)

        const roles = res.data.vip
        const arr: any = []
        roles.map((item: any) => {
          arr.push({
            label: item.name,
            value: item.id,
          })
        })
        setRoles(arr)
        const tags = res.data.tags
        const arr2: any = []
        tags.map((item: any) => {
          arr2.push({
            label: item.name,
            value: item.id,
          })
        })
        setTags(arr2)
        setLoading(false)
      })
      .catch((e) => {
        setLoading(false)
      })
  }

  useEffect(() => {
    if (
      (created_at && created_at.length > 0)
      || (tag_id && tag_id.length !== 0)
      || (role_id && role_id.length !== 0)
      || keywords
    )
      setShowStatus(true)
    else
      setShowStatus(false)
  }, [created_at, role_id, tag_id, keywords])

  const resetList = () => {
    setPage(1)
    setSize(10)
    setList([])
    setSelectedRowKeys([])
    setKeywords('')
    setCreatedAts([])
    setCreatedAt([])
    setTagId([])
    setRoleId([])
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

  const addMember = () => {
    setShowAddWin(true)
  }

  const sendMessageMulti = () => {
    if (selectedRowKeys.length === 0) {
      message.error('请选择需要发消息的学员')
      return
    }
    setMid(0)
    setVisiable(true)
  }

  const editMulti = () => {
    if (selectedRowKeys.length === 0) {
      message.error('请先勾选要批量设置的学员')
      return
    }
    setEditVisible(true)
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'ID',
      width: '6%',
      render: (_, record: any) => <span>{record.id}</span>,
    },
    {
      title: '学员',
      width: '15%',
      render: (_, record: any) => (
        <>
          <div className="user-item d-flex">
            <div className="avatar">
              <img src={record.avatar} width="40" height="40" />
            </div>
            <div className="ml-10">{record.name}</div>
          </div>
        </>
      ),
    },
    {
      title: '手机号码',
      width: '11%',
      render: (_, record: any) => (
        <>
          {record.phone && <span>{record.phone}</span>}
          {!record.phone && <span>-</span>}
        </>
      ),
    },
    {
      title: 'VIP类型',
      width: '8%',
      render: (_, record: any) => (
        <>
          {record.vip && <span>{record.vip.name}</span>}
          {!record.vip && <span>-</span>}
        </>
      ),
    },
    {
      title: '积分',
      width: '8%',
      dataIndex: 'points',
      render: (points: number) => <span>{points}</span>,
    },
    {
      title: '标签',
      width: '10%',
      render: (_, record: any) => (
        <>
          {record?.tag.length > 0 && (
            <TagsTooltip tags={record?.tag}></TagsTooltip>
          )}
          {record?.tag.length === 0 && <span>-</span>}
        </>
      ),
    },
    {
      title: '备注信息',
      width: '9%',
      render: (_, record: any) => (
        <>
          {userRemark[record.id] && (
            <VhtmlTooltip label={userRemark[record.id].remark}></VhtmlTooltip>
          )}
          {!userRemark[record.id] && <span>-</span>}
        </>
      ),
    },
    {
      title: '注册时间',
      width: '14%',
      dataIndex: 'createdTime',
      render: (createdTime: string) => <span>{dateFormat(createdTime)}</span>,
    },
    {
      title: '账号状态',
      width: '6%',
      render: (_, record: any) => (
        <>
          {record?.isFrozen && <span className="c-red">·冻结</span>}
          {!record?.isFrozen && <span className="c-green">·正常</span>}
        </>
      ),
    },
    {
      title: '操作',
      width: '10%',
      fixed: 'right',
      render: (_, record: any) => {
        const items: MenuProps['items'] = [
          {
            key: '1',
            label: (
              <PerButton
                type="link"
                text="编辑资料"
                class="c-primary"
                icon={null}
                p="member.update"
                onClick={() => {
                  updateMember(record.id)
                }}
                disabled={null}
              />
            ),
          },
          {
            key: '2',
            label: (
              <PerButton
                type="link"
                text="站内消息"
                class="c-primary"
                icon={null}
                p="member.message.send"
                onClick={() => {
                  setMid(record.id)
                  setVisiable(true)
                }}
                disabled={null}
              />
            ),
          },
          {
            key: '3',
            label: (
              <PerButton
                type="link"
                text={lockText(record)}
                class="c-red"
                icon={null}
                p="member.update"
                onClick={() => {
                  lockMember(record)
                }}
                disabled={null}
              />
            ),
          },
          {
            key: '4',
            label: (
              <PerButton
                type="link"
                text="删除账号"
                class="c-red"
                icon={null}
                p="member.destroy"
                onClick={() => {
                  removeMember(record.id)
                }}
                disabled={null}
              />
            ),
          },
        ]
        return (
          <Space>
            <PerButton
              type="link"
              text="详情"
              class="c-primary"
              icon={null}
              p="member.detail"
              onClick={() => {
                navigate(`/member/${record.id}`)
              }}
              disabled={null}
            />
            <Dropdown menu={{ items }}>
              <Button
                type="link"
                className="c-primary"
                onClick={e => e.preventDefault()}
              >
                <Space size="small" align="center">
                  更多
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
          </Space>
        )
      },
    },
  ]

  const updateMember = (id: number) => {
    setMid(id)
    setShowUpdateWin(true)
  }

  const lockMember = (item: any) => {
    let text = '冻结后此账号将无法登录，确认冻结？'
    let value = 1
    if (item.is_lock === 1) {
      text = '解冻后此账号将正常登录，确认解冻？'
      value = 0
    }
    confirm({
      title: '警告',
      icon: <ExclamationCircleFilled />,
      content: text,
      centered: true,
      okText: '确认',
      cancelText: '取消',
      onOk() {
        member
          .editMulti({
            user_ids: [item.id],
            field: 'is_lock',
            value,
          })
          .then(() => {
            message.success('成功')
            resetData()
          })
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }

  const removeMember = (uid: number) => {
    confirm({
      title: '警告',
      icon: <ExclamationCircleFilled />,
      content: '删除学员账号将删除其所有数据，确认删除？',
      centered: true,
      okText: '确认',
      cancelText: '取消',
      onOk() {
        member.destroy(uid).then(() => {
          message.success('成功')
          resetData()
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

  const lockText = (item: any) => {
    let text = '冻结账号'
    if (item.is_lock === 1)
      text = '解冻账号'

    return text
  }

  const disabledDate = (current: any) => {
    return current && current >= moment().add(0, 'days') // 选择时间要大于等于当前天。若今天不能被选择，去掉等号即可。
  }

  return (
    <div className="geekedu-main-body">
      <SendMessageDialog
        open={visiable}
        mid={mid}
        ids={selectedRowKeys}
        onCancel={() => setVisiable(false)}
        onSuccess={() => {
          setVisiable(false)
          resetData()
        }}
      >
      </SendMessageDialog>
      <ConfigUpdateDialog
        tags={tags}
        roles={roles}
        open={editVisible}
        ids={selectedRowKeys}
        onCancel={() => setEditVisible(false)}
        onSuccess={() => {
          setEditVisible(false)
          resetData()
        }}
      >
      </ConfigUpdateDialog>
      <MemberCreateDialog
        open={showAddWin}
        roles={roles}
        onCancel={() => setShowAddWin(false)}
        onSuccess={() => {
          setShowAddWin(false)
          resetData()
        }}
      >
      </MemberCreateDialog>
      <MemberUpdateDialog
        id={mid}
        open={showUpdateWin}
        roles={roles}
        onCancel={() => setShowUpdateWin(false)}
        onSuccess={() => {
          setShowUpdateWin(false)
          setMid(0)
          resetData()
        }}
      >
      </MemberUpdateDialog>
      <div className="float-left j-b-flex mb-30">
        <div className="d-flex">
          <PerButton
            type="primary"
            text="新建学员"
            class=""
            icon={null}
            p="member.store"
            onClick={() => addMember()}
            disabled={null}
          />
          <PerButton
            type="primary"
            text="学员批量导入"
            class="ml-10"
            icon={null}
            p="member.store"
            onClick={() => navigate('/member/import')}
            disabled={null}
          />
          <PerButton
            type="primary"
            text="批量发消息"
            class="ml-10"
            icon={null}
            p="member.message.send"
            onClick={() => sendMessageMulti()}
            disabled={null}
          />
          <PerButton
            type="primary"
            text="批量设置"
            class="ml-10"
            icon={null}
            p="member.update"
            onClick={() => editMulti()}
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
            placeholder="昵称或手机号"
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
      <div className="float-left mb-30 check-num">
        已选择
        {selectedRowKeys.length}
        项
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
                placeholder="昵称"
              />
              <Select
                style={{ width: '100%', marginTop: 20 }}
                value={role_id}
                onChange={(e) => {
                  setRoleId(e)
                }}
                allowClear
                placeholder="VIP会员"
                options={roles}
              />
              <Select
                style={{ width: '100%', marginTop: 20 }}
                value={tag_id}
                onChange={(e) => {
                  setTagId(e)
                }}
                allowClear
                placeholder="学员标签"
                options={tags}
              />
              <RangePicker
                disabledDate={disabledDate}
                format="YYYY-MM-DD HH:mm:ss"
                value={createdAts}
                style={{ marginTop: 20 }}
                onChange={(date, dateString) => {
                  setCreatedAt(dateString)
                  setCreatedAts(date)
                }}
                placeholder={['注册-开始日期', '注册-结束日期']}
              />
            </div>
          </Drawer>
          )
        : null}
    </div>
  )
}

export default MemberPage
