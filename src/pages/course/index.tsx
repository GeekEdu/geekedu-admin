import { useEffect, useState } from 'react'
import {
  Button,
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
import { course } from '../../api/index'
import { titleAction } from '../../store/user/loginUserSlice'
import { OptionBar, PerButton, ThumbBar } from '../../components'
import { dateFormat } from '../../utils/index'
import filterIcon from '../../assets/img/icon-filter.png'
import filterHIcon from '../../assets/img/icon-filter-h.png'

const { confirm } = Modal

interface DataType {
  id: React.Key
  published_at: string
}

function CoursePage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(false)
  const [list, setList] = useState<any>([])
  const [pageNum, setPageNum] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [refresh, setRefresh] = useState(false)
  const [keywords, setKeywords] = useState<string>('')
  const [category_id, setCategoryId] = useState([])
  const [id, setId] = useState<string>('')
  const [categories, setCategories] = useState<any>([])
  const [drawer, setDrawer] = useState(false)
  const [showStatus, setShowStatus] = useState<boolean>(false)

  // 初始化界面
  useEffect(() => {
    // 界面标题
    document.title = '录播课'
    // 浏览器标签名
    dispatch(titleAction('录播课'))
    getParams()
  }, [])

  useEffect(() => {
    getData()
  }, [pageNum, pageSize, refresh])

  useEffect(() => {
    if ((category_id && category_id.length !== 0) || id || keywords)
      setShowStatus(true)
    else
      setShowStatus(false)
  }, [category_id, id, keywords])

  // 请求录播课数据
  const getData = () => {
    if (loading)
      return

    setLoading(true)
    // 发送请求
    course
      .list({
        pageNum,
        pageSize,
        sort: 'id',
        order: 'desc',
        keywords,
        cid: category_id,
        id,
      })
      .then((res: any) => {
        setList(res.data.courses.data)
        setTotal(res.data.courses.total)
        setLoading(false)
      })
      .catch((e) => {
        setLoading(false)
      })
  }

  // 请求课程分类数据
  const getParams = () => {
    course.getCourseCategory({
      type: 'REPLAY_COURSE',
    }).then((res: any) => {
      const categories = res.data
      const box: any = []
      for (let i = 0; i < categories.length; i++) {
        // 判断是否有二级分类
        if (categories[i].children.length > 0) {
          box.push({
            label: categories[i].name,
            value: categories[i].id,
          })
          const children = categories[i].children
          for (let j = 0; j < children.length; j++) {
            children[j].name = `|----${children[j].name}`
            box.push({
              label: children[j].name,
              value: children[j].id,
            })
          }
        }
        else {
          box.push({
            label: categories[i].name,
            value: categories[i].id,
          })
        }
      }
      setCategories(box)
    })
  }

  // 刷新页面函数
  const resetList = () => {
    setPageNum(1)
    setPageSize(10)
    setList([])
    setKeywords('')
    setCategoryId([])
    setId('')
    setRefresh(!refresh)
  }

  // 定义分页类
  const paginationProps = {
    current: pageNum, // 当前页码
    pageSize, // 每页展示条数
    total, // 总条数
    onChange: (page: number, pageSize: number) =>
      handlePageChange(page, pageSize), // 改变页码的函数
    showSizeChanger: true,
  }

  const handlePageChange = (page: number, pageSize: number) => {
    setPageNum(page)
    setPageSize(pageSize)
  }

  // 定义表格 使用 antd 的组件 ColumnsType
  // 参数为 列名 列宽 列内容
  const columns: ColumnsType<DataType> = [
    {
      title: 'ID',
      width: '6%',
      // 生成复杂数据的渲染函数，参数分别为当前行的值，当前行数据，行索引
      render: (_, record: any) => <span>{record.id}</span>, // 课程数据id
    },
    {
      title: '课程',
      width: '30%',
      render: (_, record: any) => (
        <ThumbBar
          width={120}
          value={record.pictureLink}
          height={90}
          title={record.title}
          border={4}
        >
        </ThumbBar>
      ), // 课程图片 + 课程名 作为组件封装
    },
    {
      title: '分类',
      width: '12%',
      render: (_, record: any) => (
        <>
          {record.category && <span>{record?.category?.name || '-'}</span>}
          {!record.category && <span className="c-red">数据不完整</span>}
        </>
      ),
    },
    {
      title: '价格',
      width: '8%',
      render: (_, record: any) => (
        <div>
          {record.price}
          元
        </div>
      ),
    },
    {
      title: '销量',
      width: '8%',
      render: (_, record: any) => <span>{record.sellNum}</span>,
    },
    {
      title: '上架时间',
      width: '14%',
      dataIndex: 'published_at',
      render: (_, record: any) => <span>{dateFormat(record.groundingTime)}</span>,
    },
    {
      title: '是否显示',
      width: '8%',
      render: (_, record: any) => (
        record.isShow
          ? (
            <>
              <span className="c-green">· 显示</span>
            </>
            )
          : (
            <>
              <span className="c-red">· 隐藏</span>
            </>
            )
        // <>
        //   {record.isShow && <span className="c-green">· 显示</span>}
        //   {record.isShow && <span className="c-red">· 隐藏</span>}
        // </>
      ),
    },
    {
      title: '操作',
      width: '14%',
      fixed: 'right',
      // 下拉菜单
      render: (_, record: any) => {
        const items: MenuProps['items'] = [
          {
            key: '1',
            label: (
              <PerButton
                type="link"
                text="编辑"
                class="c-primary"
                icon={null}
                p="course.update"
                onClick={() => {
                  navigate(`/course/vod/update?id=${record.id}`)
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
                text="附件"
                class="c-primary"
                icon={null}
                p="course_attach"
                onClick={() => {
                  navigate(`/course/vod/attach/index?course_id=${record.id}`)
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
                text="删除"
                class="c-red"
                icon={null}
                p="course.destroy"
                onClick={() => {
                  destory(record.id)
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
              text="课时"
              class="c-primary"
              icon={null}
              p="video"
              onClick={() => {
                navigate(
                  `/course/vod/video/index?course_id=${
                  record.id
                     }&title=${
                     record.title}`,
                )
              }}
              disabled={null}
            />
            <PerButton
              type="link"
              text="学员"
              class="c-primary"
              icon={null}
              p="course.subscribes"
              onClick={() => {
                navigate(`/course/vod/${record.id}/view`)
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

  // 重置数据
  const resetData = () => {
    setPageNum(1)
    setList([])
    setRefresh(!refresh)
  }

  // 删除
  const destory = (id: number) => {
    if (id === 0)
      return

    // 确认弹窗
    confirm({
      title: '操作确认',
      // Modal对话框自定义icon
      icon: <ExclamationCircleFilled />,
      content: '确认删除此课程？',
      centered: true,
      okText: '确认',
      cancelText: '取消',
      onOk() {
        if (loading)
          return

        setLoading(true)
        // 调用删除请求
        course
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

  return (
    <div className="meedu-main-body">
      {/* 导航栏 */}
      <div className="float-left j-b-flex mb-30">
        <div className="d-flex">
          <PerButton
            type="primary"
            text="新建录播课"
            class=""
            icon={null}
            p="course.store"
            onClick={() => navigate('/course/vod/create')}
            disabled={null}
          />
          <PerButton
            type="primary"
            text="录播课分类"
            class="ml-10"
            icon={null}
            p="courseCategory"
            onClick={() => navigate('/course/vod/category/index')}
            disabled={null}
          />
          <PerButton
            type="primary"
            text="课程评论"
            class="ml-10"
            icon={null}
            p="course_comment"
            onClick={() => navigate('/course/vod/components/vod-comments')}
            disabled={null}
          />
          <PerButton
            type="primary"
            text="课时评论"
            class="ml-10"
            icon={null}
            p="video_comment"
            onClick={() => navigate('/course/vod/video/comments')}
            disabled={null}
          />
          <PerButton
            type="primary"
            text="课时批量导入"
            class="ml-10"
            icon={null}
            p="video.store"
            onClick={() => navigate('/course/vod/video-import')}
            disabled={null}
          />
          <OptionBar
            text="播放器配置"
            value="/system/playerConfig?referer=%2Fcourse%2Fvod%2Findex"
          >
          </OptionBar>
        </div>
        {/* 搜索框 */}
        <div className="d-flex">
          <Input
            value={keywords}
            onChange={(e) => {
              setKeywords(e.target.value)
            }}
            allowClear
            style={{ width: 150 }}
            placeholder="课程名称关键字"
          />
          <Button className="ml-10" onClick={resetList}>
            清空
          </Button>
          <Button
            className="ml-10"
            type="primary"
            onClick={() => {
              setPageNum(1)
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
        {/* 表格 */}
        <Table
          loading={loading}
          columns={columns}
          dataSource={list}
          rowKey={record => record.id}
          pagination={paginationProps}
        />
      </div>
      {drawer
        ? (
          // 抽屉
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
                    setPageNum(1)
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
                placeholder="课程名称关键字"
              />
              <Select
                style={{ width: '100%', marginTop: 20 }}
                value={category_id}
                onChange={(e) => {
                  setCategoryId(e)
                }}
                allowClear
                placeholder="分类"
                options={categories}
              />
              <Input
                style={{ marginTop: 20 }}
                value={id}
                onChange={(e) => {
                  setId(e.target.value)
                }}
                allowClear
                placeholder="课程ID"
              />
            </div>
          </Drawer>
          )
        : null}
    </div>
  )
}

export default CoursePage
