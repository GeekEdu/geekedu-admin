import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
  Switch,
  Tabs,
  message,
} from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { creditMall } from '../../api/index'
import { titleAction } from '../../store/user/loginUserSlice'
import {
  BackBartment,
  HelperText,
  QuillEditor,
  SelectResources,
  UploadImageButton,
} from '../../components'

function CreditMallCreatePage() {
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(false)
  const [is_v, setIsV] = useState(false)
  const [resourceActive, setResourceActive] = useState<string>('base')
  const [goodsTypes, setGoodsTypes] = useState<any>([])
  const [showSelectResWin, setShowSelectResWin] = useState<boolean>(false)
  const [title, setTitle] = useState<string>('')
  const [thumb, setThumb] = useState<string>('')
  const [type, setType] = useState('')
  const types = [
    {
      key: 'base',
      label: '基础信息',
    },
    {
      key: 'dev',
      label: '可选信息',
    },
  ]

  useEffect(() => {
    document.title = '新建积分商品'
    dispatch(titleAction('新建积分商品'))
    form.setFieldsValue({ isShow: true, isVirtual: false })
    getParams()
  }, [])

  const getParams = () => {
    creditMall.create().then((res: any) => {
      const goodsTypes = res.data
      const arr = []
      for (let i = 0; i < goodsTypes.length; i++) {
        arr.push({
          label: goodsTypes[i].name,
          value: goodsTypes[i].sign,
        })
      }
      setGoodsTypes(arr)
    })
  }

  const onChange = (key: string) => {
    setResourceActive(key)
  }

  const onFinish = (values: any) => {
    if (loading)
      return

    if (!values.isVirtual)
      form.setFieldsValue({ goodsType: null, vId: null })

    if (values.isVirtual && !values.goodsType) {
      message.error('请选择虚拟商品类型')
      return
    }
    if (values.isVirtual && values.goodsType && !values.vId) {
      console.log(values.isVirtual, values.goodsType, values.vId)
      message.error('请选择虚拟商品')
      return
    }
    setLoading(true)
    creditMall
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

  const onSwitch = (checked: boolean) => {
    if (checked)
      form.setFieldsValue({ isShow: true })
    else
      form.setFieldsValue({ isShow: false })
  }

  const isVChange = (checked: boolean) => {
    if (checked) {
      form.setFieldsValue({ isVirtual: true })
      setIsV(true)
    }
    else {
      form.setFieldsValue({ isVirtual: false })
      setIsV(false)
    }
  }

  return (
    <div className="geekedu-main-body">
      <BackBartment title="新建积分商品" />
      <SelectResources
        open={showSelectResWin}
        enabledResource={type}
        onCancel={() => setShowSelectResWin(false)}
        onSelected={(result: any) => {
          form.setFieldsValue({
            vId: result.id,
            title: result.title,
            cover: result.thumb,
          })
          setTitle(result.title)
          setThumb(result.thumb)
          setShowSelectResWin(false)
        }}
      >
      </SelectResources>
      <div className="center-tabs mb-30">
        <Tabs
          defaultActiveKey={resourceActive}
          items={types}
          onChange={onChange}
        />
      </div>
      <div className="float-left">
        <Form
          form={form}
          name="creditMall-create"
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 21 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <div
            style={{ display: resourceActive === 'base' ? 'block' : 'none' }}
          >
            <Form.Item label="是否虚拟商品" name="isVirtual" valuePropName="checked">
              <Switch onChange={isVChange} />
            </Form.Item>
            {is_v && (
              <Form.Item name="goodsType" label="虚拟商品类型">
                <Select
                  style={{ width: 300 }}
                  allowClear
                  placeholder="请选择虚拟商品类型"
                  options={goodsTypes}
                  onChange={(e) => {
                    setType(e)
                  }}
                />
              </Form.Item>
            )}
            {is_v && type && (
              <Form.Item label="虚拟商品" name="isVirtual">
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
            )}
            {is_v && (
              <Form.Item label="商品id" name="vId">
                <Input
                  style={{ width: 200 }}
                />
              </Form.Item>
            )}
            <Form.Item
              label="商品名"
              name="title"
              rules={[{ required: true, message: '请输入商品名!' }]}
            >
              <Input
                style={{ width: 300 }}
                placeholder="请输入商品名"
                allowClear
              />
            </Form.Item>
            <Form.Item
              label="商品封面"
              name="cover"
              rules={[{ required: true, message: '请上传商品封面!' }]}
            >
              <UploadImageButton
                text="上传封面"
                onSelected={(url) => {
                  form.setFieldsValue({ cover: url })
                  setThumb(url)
                }}
              >
              </UploadImageButton>
            </Form.Item>
            {thumb && (
              <Row style={{ marginBottom: 22 }}>
                <Col span={3}></Col>
                <Col span={21}>
                  <div
                    className="contain-thumb-box"
                    style={{
                      backgroundImage: `url(${thumb})`,
                      width: 400,
                      height: 400,
                      backgroundColor: '#f4fafe',
                    }}
                  >
                  </div>
                </Col>
              </Row>
            )}
            <Form.Item
              label="价格"
              name="price"
              rules={[{ required: true, message: '请输入价格!' }]}
            >
              <Space align="baseline" style={{ height: 32 }}>
                <Form.Item
                  name="price"
                  rules={[{ required: true, message: '请输入价格!' }]}
                >
                  <Input
                    style={{ width: 300 }}
                    placeholder="单位：积分"
                    allowClear
                    type="number"
                  />
                </Form.Item>
                <div className="ml-10">
                  <HelperText text="价格最小单位为：积分，不支持小数"></HelperText>
                </div>
              </Space>
            </Form.Item>
            <Form.Item
              label="介绍"
              name="intro"
              rules={[{ required: true, message: '请输入介绍!' }]}
              style={{ height: 440 }}
            >
              <QuillEditor
                mode=""
                height={400}
                defaultValue=""
                isFormula={false}
                setContent={(value: string) => {
                  form.setFieldsValue({ intro: value })
                }}
              >
              </QuillEditor>
            </Form.Item>
            <Form.Item
              label="库存"
              name="stockCount"
              rules={[{ required: true, message: '请输入库存!' }]}
            >
              <Input
                type="number"
                style={{ width: 300 }}
                placeholder="商品库存数量"
                allowClear
              />
            </Form.Item>
          </div>
          <div style={{ display: resourceActive === 'dev' ? 'block' : 'none' }}>
            <Form.Item label="显示" name="isShow">
              <Space align="baseline" style={{ height: 32 }}>
                <Form.Item name="isShow" valuePropName="checked">
                  <Switch onChange={onSwitch} />
                </Form.Item>
                <div className="ml-10">
                  <HelperText text="控制用户是否能看到该商品"></HelperText>
                </div>
              </Space>
            </Form.Item>
          </div>
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

export default CreditMallCreatePage
