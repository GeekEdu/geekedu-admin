import { useEffect, useState } from 'react'
import { Button, Input, Modal, Table, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { role } from '../../../api/index'

interface DataType {
  id: React.Key
  charge: number
}

interface PropsInterface {
  selected: any
  onChange: (result: any) => void
}

export function RoleComp(props: PropsInterface) {
  const [loading, setLoading] = useState<boolean>(false)
  const [list, setList] = useState<any>([])
  const [keys, setKeys] = useState<any>([])
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    setKeys(props.selected)
  }, [props.selected])

  useEffect(() => {
    getData()
  }, [refresh])

  const getData = () => {
    if (loading)
      return

    setLoading(true)
    role
      .list()
      .then((res: any) => {
        setList(res.data)
        setLoading(false)
      })
      .catch((e) => {
        setLoading(false)
      })
  }

  const resetList = () => {
    setList([])
    setRefresh(!refresh)
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'ID',
      width: 120,
      render: (_, record: any) => <span>{record.id}</span>,
    },
    {
      title: 'VIP',
      render: (_, record: any) => <div>{record.name}</div>,
    },
    {
      title: '价格',
      width: 120,
      dataIndex: 'charge',
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
      const row: any = selectedRows[0]
      setKeys(selectedRowKeys)
      const newbox = []
      if (row) {
        const item = {
          type: 'vip',
          id: row.id,
          name: row.name,
          thumb: null,
          price: row.price,
        }
        newbox.push(item)
        props.onChange(newbox)
      }
    },
    selectedRowKeys: keys,
  }

  return (
    <div className="float-left">
      <div className="float-left mb-15">
        <Table
          rowSelection={{
            type: 'radio',
            ...rowSelection,
          }}
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
