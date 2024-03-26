import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button, DatePicker, Form, Input, Space, Spin, message } from 'antd'
import { useDispatch } from 'react-redux'
import dayjs from 'dayjs'
import moment from 'moment'
import { miaosha } from '../../api/index'
import { titleAction } from '../../store/user/loginUserSlice'
import { BackBartment, HelperText } from '../../components'

const { RangePicker } = DatePicker

function MiaoshaUpdatePage() {
  const result = new URLSearchParams(useLocation().search)
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [init, setInit] = useState<boolean>(true)
  const [loading, setLoading] = useState<boolean>(false)
  const [title, setTitle] = useState<string>('')
  const [thumb, setThumb] = useState<string>('')
  const [goods_type, setGoodsType] = useState<string>('')
  const [original_charge, setOriginalCharge] = useState('')
  const [goods_id, setGoodsId] = useState(0)
  const [num, setNum] = useState(0)
  const [id, setId] = useState(Number(result.get('id')))

  useEffect(() => {
    document.title = '编辑秒杀活动'
    dispatch(titleAction('编辑秒杀活动'))
    initData()
  }, [id])

  useEffect(() => {
    setId(Number(result.get('id')))
  }, [result.get('id')])

  const initData = async () => {
    await getDetail()
    setInit(false)
  }

  const getDetail = async () => {
    if (id === 0)
      return

    const res: any = await miaosha.detail(id)
    const data = res.data
    const arr: any = [
      dayjs(data.startAt, 'YYYY-MM-DD HH:mm:ss'),
      dayjs(data.endAt, 'YYYY-MM-DD HH:mm:ss'),
    ]
    form.setFieldsValue({
      price: data.price,
      startAt: arr,
    })
    setThumb(data.goodsCover)
    setOriginalCharge(data.originPrice)
    setTitle(data.goodsTitle)
    setGoodsId(data.goodsId)
    setGoodsType(data.goodsType)
    setNum(data.stock)
  }

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
    values.goodsId = goods_id
    values.goodsType = goods_type
    values.stock = num
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
      .update(id, values)
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
      <BackBartment title="编辑秒杀活动" />
      {init && (
        <div className="float-left text-center mt-30">
          <Spin></Spin>
        </div>
      )}
      <div
        style={{ display: init ? 'none' : 'block' }}
        className="float-left mt-30"
      >
        <Form
          form={form}
          name="miaosha-update"
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 21 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
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

export default MiaoshaUpdatePage
