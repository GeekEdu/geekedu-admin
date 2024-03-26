import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, DatePicker, Form, Input, Space, message } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import { miaosha } from '../../api/index'
import { titleAction } from '../../store/user/loginUserSlice'
import { BackBartment, HelperText, SelectResources } from '../../components'

const { RangePicker } = DatePicker

function MiaoshaCreatePage() {
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(false)
  const [title, setTitle] = useState<string>('')
  const [thumb, setThumb] = useState<string>('')
  const [goods_type, setGoodsType] = useState<string>('')
  const [original_charge, setOriginalCharge] = useState('')
  const [showSelectResWin, setShowSelectResWin] = useState<boolean>(false)

  useEffect(() => {
    document.title = '新建秒杀活动'
    dispatch(titleAction('新建秒杀活动'))
  }, [])

  const onFinish = (values: any) => {
    if (loading)
      return

    if (values.price < 0) {
      message.error('请输入正确的秒杀价')
      return
    }
    if (values.stock < 0) {
      message.error('请输入正确的库存')
      return
    }
    setLoading(true)
    values.goodsType = goods_type
    values.originPrice = original_charge
    values.goodsTitle = title
    values.goodsCover = thumb
    values.endAt = moment(new Date(values.startAt[1])).format(
      'YYYY-MM-DD HH:mm:ss',
    )
    values.startAt = moment(new Date(values.startAt[0])).format(
      'YYYY-MM-DD HH:mm:ss',
    )
    miaosha
      .store(values)
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
      <BackBartment title="新建秒杀活动" />
      <SelectResources
        open={showSelectResWin}
        enabledResource="vod,live,book,learnPath"
        onCancel={() => setShowSelectResWin(false)}
        onSelected={(result: any) => {
          form.setFieldsValue({
            goodsId: result.id,
          })
          setTitle(result.title)
          setThumb(result.thumb)
          if (result.resource_type === 'vod')
            setGoodsType('course')
          else
            setGoodsType(result.resource_type)

          setOriginalCharge(result.original_charge)
          setShowSelectResWin(false)
        }}
      >
      </SelectResources>
      <div className="float-left mt-30">
        <Form
          form={form}
          name="miaosha-create"
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 21 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="商品"
            name="goodsId"
            rules={[{ required: true, message: '请选择商品!' }]}
          >
            <Button
              loading={loading}
              type="primary"
              onClick={() => setShowSelectResWin(true)}
            >
              {title && (
                <span>
                  已选择「
                  {title}
                  」
                </span>
              )}
              {!title && <span>选择商品</span>}
            </Button>
          </Form.Item>
          <Form.Item
            label="秒杀价"
            name="price"
            rules={[{ required: true, message: '请输入秒杀价!' }]}
          >
            <Space align="baseline" style={{ height: 32 }}>
              <Form.Item
                name="price"
                rules={[{ required: true, message: '请输入秒杀价!' }]}
              >
                <Input
                  style={{ width: 300 }}
                  placeholder="请输入秒杀价"
                  allowClear
                  type="number"
                />
              </Form.Item>
              <div className="ml-10">
                <HelperText text="最小单位：元。不支持小数。"></HelperText>
              </div>
            </Space>
          </Form.Item>
          <Form.Item
            label="库存"
            name="stock"
            rules={[{ required: true, message: '请输入库存!' }]}
          >
            <Input
              type="number"
              style={{ width: 300 }}
              placeholder="请输入库存"
              allowClear
            />
          </Form.Item>
          <Form.Item
            label="活动时间"
            name="startAt"
            rules={[{ required: true, message: '请输入活动时间!' }]}
          >
            <RangePicker
              format="YYYY-MM-DD HH:mm:ss"
              showTime
              placeholder={['开始时间', '结束时间']}
            />
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

export default MiaoshaCreatePage
