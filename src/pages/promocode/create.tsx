import { useEffect, useState } from 'react'
import { Button, DatePicker, Form, Input, Space, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import { promocode } from '../../api/index'
import { titleAction } from '../../store/user/loginUserSlice'
import { BackBartment, HelperText } from '../../components'

function PromoCodeCreatePage() {
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    document.title = '新建优惠码'
    dispatch(titleAction('新建优惠码'))
  }, [])

  const onFinish = (values: any) => {
    if (loading)
      return

    setLoading(true)
    values.expiredTime = moment(new Date(values.expiredTime)).format(
      'YYYY-MM-DD HH:mm:ss',
    )
    promocode
      .create(values)
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
      <BackBartment title="新建优惠码" />
      <div className="float-left mt-30">
        <Form
          form={form}
          name="promoCode-create"
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 21 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="优惠码"
            name="couponCode"
            rules={[{ required: true, message: '请输入优惠码!' }]}
          >
            <Space align="baseline" style={{ height: 32 }}>
              <Form.Item
                name="couponCode"
                rules={[{ required: true, message: '请输入优惠码!' }]}
              >
                <Input
                  style={{ width: 300 }}
                  placeholder="请输入优惠码"
                  allowClear
                />
              </Form.Item>
              <div className="ml-10">
                <HelperText text="请勿使用大写U或者小写u开头"></HelperText>
              </div>
            </Space>
          </Form.Item>

          <Form.Item
            label="优惠码数量"
            name="couponTotal"
            rules={[{ required: true, message: '请输入优惠码数量!' }]}
          >
            <Space align="baseline" style={{ height: 32 }}>
              <Form.Item
                name="couponTotal"
                rules={[{ required: true, message: '请输入优惠码数量!' }]}
              >
                <Input
                  style={{ width: 300 }}
                  type="number"
                  placeholder="请输入优惠码数量"
                  allowClear
                />
              </Form.Item>
              <div className="ml-10">
                <HelperText text="请勿使用大写U或者小写u开头"></HelperText>
              </div>
            </Space>
          </Form.Item>

          <Form.Item
            label="优惠码描述"
            name="couponDesc"
            rules={[{ required: true, message: '请输入优惠码描述!' }]}
          >
            <Space align="baseline" style={{ height: 32 }}>
              <Form.Item
                name="couponDesc"
                rules={[{ required: true, message: '请输入优惠码描述!' }]}
              >
                <Input
                  style={{ width: 300 }}
                  placeholder="请输入优惠码描述"
                  allowClear
                />
              </Form.Item>
              <div className="ml-10">
                <HelperText text="请勿使用大写U或者小写u开头"></HelperText>
              </div>
            </Space>
          </Form.Item>

          <Form.Item label="到期时间" required={true}>
            <Space align="baseline" style={{ height: 32 }}>
              <Form.Item
                name="expiredTime"
                rules={[{ required: true, message: '请选择到期时间!' }]}
              >
                <DatePicker
                  format="YYYY-MM-DD HH:mm:ss"
                  style={{ width: 300 }}
                  showTime
                  placeholder="请选择到期时间"
                />
              </Form.Item>
              <div className="ml-10">
                <HelperText text="过期时间到了之后优惠码便无法使用了"></HelperText>
              </div>
            </Space>
          </Form.Item>
          <Form.Item
            label="面值"
            name="couponPrice"
            rules={[{ required: true, message: '请输入面值!' }]}
          >
            <Space align="baseline" style={{ height: 32 }}>
              <Form.Item
                name="couponPrice"
                rules={[{ required: true, message: '请输入面值!' }]}
              >
                <Input
                  type="number"
                  style={{ width: 300 }}
                  placeholder="请输入面值"
                  allowClear
                />
              </Form.Item>
              <div className="ml-10">
                <HelperText text="请输入整数。不支持小数。可在收银台抵扣的金额。"></HelperText>
              </div>
            </Space>
          </Form.Item>
          <Form.Item
            label="最低使用金额"
            name="couponLimit"
            rules={[{ required: true, message: '请输入最低使用金额!' }]}
          >
            <Space align="baseline" style={{ height: 32 }}>
              <Form.Item
                name="couponLimit"
                rules={[{ required: true, message: '请输入最低使用金额!' }]}
              >
                <Input
                  type="number"
                  style={{ width: 300 }}
                  placeholder="请输入最低使用金额"
                  allowClear
                />
              </Form.Item>
              <div className="ml-10">
                <HelperText text="请输入整数。不支持小数。使用优惠码满足的最低金额"></HelperText>
              </div>
            </Space>
          </Form.Item>
          <Form.Item
            label="可使用次数"
            name="useLimit"
            rules={[{ required: true, message: '请输入可使用次数!' }]}
          >
            <Space align="baseline" style={{ height: 32 }}>
              <Form.Item
                name="useLimit"
                rules={[{ required: true, message: '请输入可使用次数!' }]}
              >
                <Input
                  type="number"
                  style={{ width: 300 }}
                  placeholder="请输入可使用次数"
                  allowClear
                />
              </Form.Item>
              <div className="ml-10">
                <HelperText text="请输入整数。0意味着不限制。"></HelperText>
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
export default PromoCodeCreatePage
