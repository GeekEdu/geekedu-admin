/*
 * @Author: Poison02 2069820192@qq.com
 * @Date: 2024-02-16 23:22:23
 * @LastEditors: Poison02 2069820192@qq.com
 * @LastEditTime: 2024-03-14 13:09:46
 * @FilePath: /geekedu-admin/src/pages/learningpath/index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useEffect, useState } from 'react'
import {
  Button,
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
import { path } from '../../api/index'
import { titleAction } from '../../store/user/loginUserSlice'
import { PerButton, ThumbBar } from '../../components'
import { dateFormat } from '../../utils/index'

const { confirm } = Modal

interface DataType {
  id: React.Key
  published_at: string
}

function LearnPathPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(false)
  const [list, setList] = useState<any>([])
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [refresh, setRefresh] = useState(false)
  const [keywords, setKeywords] = useState<string>('')
  const [category_id, setCategoryId] = useState([])
  const [categories, setCategories] = useState<any>([])

  useEffect(() => {
    document.title = '学习路径'
    dispatch(titleAction('学习路径'))
    getParams()
  }, [])

  useEffect(() => {
    getData()
  }, [page, size, refresh])

  const getData = () => {
    if (loading)
      return

    setLoading(true)
    path
      .list({
        pageNum: page,
        pageSize: size,
        keywords,
        categoryId: category_id,
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

  const getParams = () => {
    path.create({
      type: 'LEARN_PATH',
    }).then((res: any) => {
      const categories = res.data
      const box: any = []
      for (let i = 0; i < categories.length; i++) {
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

  const resetList = () => {
    setPage(1)
    setSize(10)
    setList([])
    setKeywords('')
    setCategoryId([])
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
      width: '6%',
      render: (_, record: any) => <span>{record.id}</span>,
    },
    {
      title: '学习路径',
      width: '22%',
      render: (_, record: any) => (
        <ThumbBar
          width={120}
          value={record.cover}
          height={90}
          title={record.name}
          border={4}
        >
        </ThumbBar>
      ),
    },
    {
      title: '分类',
      width: '8%',
      render: (_, record: any) => <span>{record?.category?.name || '-'}</span>,
    },
    {
      title: '价格',
      width: '12%',
      render: (_, record: any) => (
        <>
          <div>
            现价：
            {record.price}
            元
          </div>
          <div style={{ color: '#666' }} className="original-charge">
            原价：
            {record.originPrice}
            元
          </div>
        </>
      ),
    },
    {
      title: '包含步骤',
      width: '8%',
      render: (_, record: any) => (
        <span>
          {record.stepCount}
          个步骤
        </span>
      ),
    },
    {
      title: '包含课程',
      width: '8%',
      render: (_, record: any) => (
        <span>
          {record.courseCount}
          个课程
        </span>
      ),
    },
    {
      title: '上架时间',
      width: '14%',
      dataIndex: 'groundingTime',
      render: (groundingTime: string) => <span>{dateFormat(groundingTime)}</span>,
    },
    {
      title: '是否显示',
      width: '8%',
      render: (_, record: any) => (
        <>
          {record.isShow && <span className="c-green">· 显示</span>}
          {!record.isShow && <span className="c-red">· 隐藏</span>}
        </>
      ),
    },
    {
      title: '操作',
      width: '14%',
      fixed: 'right',
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
                p="addons.learnPaths.path.update"
                onClick={() => {
                  navigate(`/learningpath/path/update?id=${record.id}`)
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
                text="删除"
                class="c-red"
                icon={null}
                p="addons.learnPaths.path.delete"
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
              text="步骤"
              class="c-primary"
              icon={null}
              p="addons.learnPaths.step.list"
              onClick={() => {
                navigate(
                  `/learningpath/step/index?id=${
                  record.id
                     }&title=${
                     record.name}`,
                )
              }}
              disabled={null}
            />
            <PerButton
              type="link"
              text="学员"
              class="c-primary"
              icon={null}
              p="addons.learnPaths.path.users"
              onClick={() => {
                navigate(`/learningpath/path/user?id=${record.id}`)
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

  const resetData = () => {
    setPage(1)
    setList([])
    setRefresh(!refresh)
  }

  const destory = (id: number) => {
    if (id === 0)
      return

    confirm({
      title: '操作确认',
      icon: <ExclamationCircleFilled />,
      content: '确认删除此学习路径？',
      centered: true,
      okText: '确认',
      cancelText: '取消',
      onOk() {
        if (loading)
          return

        setLoading(true)
        path
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
    <div className="geekedu-main-body">
      <div className="float-left j-b-flex mb-30">
        <div className="d-flex">
          <PerButton
            type="primary"
            text="新建学习路径"
            class=""
            icon={null}
            p="addons.learnPaths.path.store"
            onClick={() => navigate('/learningpath/path/create')}
            disabled={null}
          />
          <PerButton
            type="primary"
            text="学习路径分类"
            class="ml-10"
            icon={null}
            p="addons.learnPaths.category.list"
            onClick={() => navigate('/learningpath/path/category/index')}
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
            placeholder="课程关键字"
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

export default LearnPathPage
