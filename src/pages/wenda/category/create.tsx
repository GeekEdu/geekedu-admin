import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Form, Input, Space, message } from 'antd'
import { useDispatch } from 'react-redux'
import { wenda } from '../../../api/index'
import { titleAction } from '../../../store/user/loginUserSlice'
import { BackBartment, HelperText } from '../../../components'

function WendaCategoriesCreatePage() {
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    document.title = '新建问答分类'
    dispatch(titleAction('新建问答分类'))
  }, [])

  const onFinish = (values: any) => {
    if (loading)
      return

    setLoading(true)
    const insertValue: any = {
      ...values,
      type: 'ASK_QUESTION',
    }
    wenda
      .storeCate(insertValue)
      .then((res: any) => {
        setLoading(false)
        message.success('保存成功！')
        navigate(-1)
      })
      .catch((e) => {
        setLoading(false)
      })
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <div className="geekedu-main-body">
      <BackBartment title="新建问答分类" />
      <div className="float-left mt-30">
        <Form
          form={form}
          name="wenda-category-create"
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 21 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="分类名"
            name="name"
            rules={[{ required: true, message: '请输入分类名!' }]}
          >
            <Input
              style={{ width: 300 }}
              placeholder="请输入分类名"
              allowClear
            />
          </Form.Item>
          <Form.Item
            label="排序"
            name="sort"
            rules={[{ required: true, message: '请输入排序!' }]}
          >
            <Space align="baseline" style={{ height: 32 }}>
              <Form.Item
                name="sort"
                rules={[{ required: true, message: '请输入排序!' }]}
              >
                <Input
                  style={{ width: 300 }}
                  placeholder="请输入排序"
                  allowClear
                  type="number"
                />
              </Form.Item>
              <div className="ml-10">
                <HelperText text="请输入整数。小数排在前，大数排在后"></HelperText>
              </div>
            </Space>
          </Form.Item>
        </Form>
      </div>
      <div className="bottom-menus">
        <div className="bottom-menus-box">
          <div>
            <Button
              loading={loading}
              type="primary"
              onClick={() => form.submit()}
            >
              保存
            </Button>
          </div>
          <div className="ml-24">
            <Button type="default" onClick={() => navigate(-1)}>
              取消
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WendaCategoriesCreatePage
