import { useEffect, useState } from 'react'
import { Button, Input, Modal, Table, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { live } from '../../../api/index'

interface DataType {
  id: React.Key
  charge: number
}

interface PropsInterface {
  selected: any
  onChange: (result: any) => void
}

export function LiveComp(props: PropsInterface) {
  const [loading, setLoading] = useState<boolean>(false)
  const [list, setList] = useState<any>([])
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [refresh, setRefresh] = useState(false)
  const [keywords, setKeywords] = useState<string>('')

  useEffect(() => {
    getData()
  }, [page, size, refresh])

  const getData = () => {
    if (loading)
      return

    setLoading(true)
    live
      .list({
        pageNum: page,
        pageSize: size,
        sort: 'createdTime',
        order: 'desc',
        keywords,
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

  const resetList = () => {
    setPage(1)
    setSize(10)
    setList([])
    setKeywords('')
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
      title: '课程ID',
      width: 120,
      render: (_, record: any) => <span>{record.id}</span>,
    },
    {
      title: '课程',
      render: (_, record: any) => (
        <div className="d-flex">
          <div>
            <img src={record.cover} width="80" height="60" />
          </div>
          <div className="ml-15">{record.title}</div>
        </div>
      ),
    },
    {
      title: '价格',
      width: 120,
      dataIndex: 'price',
      render: (price: number) => (
        <span>
          ￥
          {price}
        </span>
      ),
    },
  ]

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      const row: any = selectedRows
      const newbox: any = []
      if (row) {
        for (let i = 0; i < row.length; i++) {
          const item = {
            type: 'live',
            id: row[i].id,
            title: row[i].title,
            thumb: row[i].cover,
            charge: row[i].price,
          }
          newbox.push(item)
        }
        props.onChange(newbox)
      }
    },
    getCheckboxProps: (record: any) => ({
      disabled: props.selected.includes(record.id), // 禁用的条件
    }),
  }

  return (
    <div className="float-left">
      <div className="float-left mb-15">
        <Input
          value={keywords}
          onChange={(e) => {
            setKeywords(e.target.value)
          }}
          allowClear
          style={{ width: 150 }}
          placeholder="关键字"
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
      <div className="float-left mb-15">
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
