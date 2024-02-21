import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Space,
  Spin,
  Switch,
  message,
} from 'antd'
import { useDispatch } from 'react-redux'
import dayjs from 'dayjs'
import moment from 'moment'
import { topic } from '../../api/index'
import { titleAction } from '../../store/user/loginUserSlice'
import {
  BackBartment,
  HelperText,
  MdEditor,
  PerButton,
  QuillEditor,
  UploadImageButton,
} from '../../components'

function TopicUpdatePage() {
  const result = new URLSearchParams(useLocation().search)
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [init, setInit] = useState<boolean>(true)
  const [loading, setLoading] = useState<boolean>(false)
  const [categories, setCategories] = useState<any>([])
  const [price, setPrice] = useState(0)
  const [originalPrice, setOriginalPrice] = useState(0)
  const [isFree, setIsFree] = useState(true)
  const [coverLink, setCoverLink] = useState<string>('')
  const [editor, setEditor] = useState('')
  const [freeValue, setFreeValue] = useState('')
  const [defaultValue, setDefaultValue] = useState('')
  const [id, setId] = useState(Number(result.get('id')))
  const [renderValue, setRenderValue] = useState('')
  const [freeRenderValue, setFreeRenderValue] = useState('')

  useEffect(() => {
    document.title = '编辑图文'
    dispatch(titleAction('编辑图文'))
    initData()
  }, [id])

  useEffect(() => {
    setId(Number(result.get('id'))) // 设置id为当前图文id
  }, [result.get('id')])

  const initData = async () => {
    await getParams()
    await getDetail()
    setInit(false)
  }

  // 获取某个图文明细
  const getDetail = async () => {
    if (id === 0)
      return

    const res: any = await topic.detail(id)
    const data = res.data
    // 填充表单
    form.setFieldsValue({
      categoryId: data.categoryId, // 分类id
      title: data.title, // 图文标题
      coverLink: data?.coverLink, // 封面
      isShow: data.isShow, // 是否展示
      isVipFree: data?.isVipFree, // 是否vip免费
      originalContent: data.originalContent, // 原始内容
      freeContent: data?.freeContent, // 免费内容
      price: data.parice, // 价格
      groundingTime: dayjs(data.groundingTime, 'YYYY-MM-DD HH:mm:ss'), // 上架时间
    })
    // 如果有价格，那么就不是免费的，将付费开关打开
    if (data?.price > 0) {
      form.setFieldsValue({ isFree: false })
      setIsFree(false)
    }
    else {
      form.setFieldsValue({ isFree: true })
      setIsFree(true)
    }
    setPrice(data?.price)
    setDefaultValue(data?.originalContent)
    setFreeValue(data?.freeContent)
    setFreeRenderValue(data?.freeContentRender)
    setRenderValue(data?.renderContent)
    setOriginalPrice(data?.price)
    setCoverLink(data?.coverLink)
    setEditor(data?.editor)
  }

  // 获取所有图文分类数据
  const getParams = async () => {
    const res: any = await topic.create({ type: 'IMAGE_TEXT' })
    const categories = res.data
    const box: any = []
    for (let i = 0; i < categories.length; i++) {
      box.push({
        label: categories[i].name,
        value: categories[i].id,
      })
    }
    setCategories(box)
  }

  const onFinish = (values: any) => {
    if (loading)
      return

    if (values.isFree) { // 若免费 则都滞空
      values.price = 0
      values.isVipFree = false
      values.freeContent = ''
      values.freeContentRender = ''
      setFreeRenderValue('')
    }

    if (Number(values.price) % 1 !== 0) {
      message.error('图文价格必须为整数')
      return
    }

    if (!values.isFree && Number(values.price) <= 0) {
      message.error('图文价格必须输入且大于0')
      return
    }
    values.editor = editor
    // 判断编辑器类型，看是否渲染
    if (editor === 'MARKDOWN') {
      values.renderContent = renderValue
      values.freeContentRender = freeRenderValue
    }
    else {
      values.renderContent = values.originalContent
      values.freeContentRender = values.freeContent
    }
    // 格式化上架时间
    values.groundingTime = moment(new Date(values.groundingTime)).format(
      'YYYY-MM-DD HH:mm:ss',
    )
    // values.is_need_login = 0
    setLoading(true)
    topic
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

  // 选择是否展示
  const onSwitch = (checked: boolean) => {
    if (checked)
      form.setFieldsValue({ isShow: 1 })
    else
      form.setFieldsValue({ isShow: 0 })
  }

  // 选择是否vip免费
  const isVipChange = (checked: boolean) => {
    if (checked)
      form.setFieldsValue({ isVipFree: true })
    else
      form.setFieldsValue({ isVipFree: false })
  }

  const isVChange = (checked: boolean) => {
    if (checked) {
      form.setFieldsValue({ isFree: true, price: 0 })
      setIsFree(true)
      setPrice(0)
    }
    else {
      form.setFieldsValue({ isFree: false, originalPrice })
      setPrice(originalPrice)
      setIsFree(false)
    }
  }

  return (
    <div className="meedu-main-body">
      <BackBartment title="编辑图文" />
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
          name="topic-update"
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 21 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            name="categoryId"
            label="所属分类"
            rules={[{ required: true, message: '请选择分类!' }]}
          >
            <Space align="baseline" style={{ height: 32 }}>
              <Form.Item
                name="categoryId"
                rules={[{ required: true, message: '请选择分类!' }]}
              >
                <Select
                  style={{ width: 300 }}
                  allowClear
                  placeholder="请选择分类"
                  options={categories}
                />
              </Form.Item>
              <div>
                <PerButton
                  type="link"
                  text="分类管理"
                  class="c-primary"
                  icon={null}
                  p="addons.meedu_topics.category.list"
                  onClick={() => {
                    navigate('/topic/category/index')
                  }}
                  disabled={null}
                />
              </div>
            </Space>
          </Form.Item>
          <Form.Item
            label="图文名称"
            name="title"
            rules={[{ required: true, message: '请输入图文名称!' }]}
          >
            <Input
              style={{ width: 300 }}
              placeholder="请输入图文名称"
              allowClear
            />
          </Form.Item>
          <Form.Item
            label="图文封面"
            name="coverLink"
            rules={[{ required: true, message: '请上传图文封面!' }]}
          >
            <Space align="baseline" style={{ height: 32 }}>
              <Form.Item
                name="coverLink"
                rules={[{ required: true, message: '请上传图文封面!' }]}
              >
                <UploadImageButton
                  text="选择图片"
                  onSelected={(url) => {
                    form.setFieldsValue({ coverLink: url })
                    setCoverLink(url)
                  }}
                >
                </UploadImageButton>
              </Form.Item>
              <div className="ml-10">
                <HelperText text="建议尺寸400x300 宽高比4:3"></HelperText>
              </div>
            </Space>
          </Form.Item>
          {coverLink && (
            <Row style={{ marginBottom: 22 }}>
              <Col span={3}></Col>
              <Col span={21}>
                <div
                  className="normal-thumb-box"
                  style={{
                    backgroundImage: `url(${coverLink})`,
                    width: 200,
                    height: 150,
                  }}
                >
                </div>
              </Col>
            </Row>
          )}
          <Form.Item label="免费" name="isFree" valuePropName="checked">
            <Switch onChange={isVChange} />
          </Form.Item>
          {!isFree && (
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
                    placeholder="单位：元"
                    allowClear
                    type="number"
                    onChange={(e) => {
                      setPrice(Number(e.target.value))
                    }}
                  />
                </Form.Item>
                <div className="ml-10">
                  <HelperText text="请输入整数"></HelperText>
                </div>
              </Space>
            </Form.Item>
          )}
          {price > 0 && (
            <Form.Item label="会员免费" name="isVipFree">
              <Space align="baseline" style={{ height: 32 }}>
                <Form.Item name="isVipFree" valuePropName="checked">
                  <Switch onChange={isVipChange} />
                </Form.Item>
                <div className="ml-10">
                  <HelperText text="如果开启该选项，则购买VIP会员的学员可以无需购买即可观看该文章。"></HelperText>
                </div>
              </Space>
            </Form.Item>
          )}
          <Form.Item label="上架时间" required={true}>
            <Space align="baseline" style={{ height: 32 }}>
              <Form.Item
                name="groundingTime"
                rules={[{ required: true, message: '请选择上架时间!' }]}
              >
                <DatePicker
                  format="YYYY-MM-DD HH:mm:ss"
                  style={{ width: 300 }}
                  showTime
                  placeholder="请选择上架时间"
                />
              </Form.Item>
              <div className="ml-10">
                <HelperText text="上架时间越晚，排序越靠前"></HelperText>
              </div>
            </Space>
          </Form.Item>
          <Form.Item label="显示" name="isShow">
            <Space align="baseline" style={{ height: 32 }}>
              <Form.Item name="isShow" valuePropName="checked">
                <Switch onChange={onSwitch} />
              </Form.Item>
              <div className="ml-10">
                <HelperText text="关闭后此图文在前台隐藏显示"></HelperText>
              </div>
            </Space>
          </Form.Item>
          {price > 0 && (
            <>
              <Form.Item
                label="免费内容"
                name="freeContent"
                rules={[{ required: true, message: '请输入付费内容!' }]}
                style={{ height: 840 }}
              >
                <div className="w-800px">
                  {editor === 'MARKDOWN'
                    ? (
                      <MdEditor
                        height={800}
                        defaultValue={defaultValue}
                        setContent={(value: string, renderValue: string) => {
                          form.setFieldsValue({ freeContent: value })
                          setFreeRenderValue(renderValue)
                        }}
                      >
                      </MdEditor>
                      )
                    : (
                      <QuillEditor
                        mode=""
                        height={800}
                        defaultValue={freeValue}
                        isFormula={false}
                        setContent={(value: string) => {
                          form.setFieldsValue({ freeContent: value })
                        }}
                      >
                      </QuillEditor>
                      )}
                </div>
              </Form.Item>
              <Form.Item
                label="付费内容"
                name="originalContent"
                rules={[{ required: true, message: '请输入付费内容!' }]}
                style={{ height: 840 }}
              >
                <div className="w-800px">
                  {editor === 'MARKDOWN'
                    ? (
                      <MdEditor
                        height={800}
                        defaultValue={defaultValue}
                        setContent={(value: string, renderValue: string) => {
                          form.setFieldsValue({ originalContent: value })
                          setRenderValue(renderValue)
                        }}
                      >
                      </MdEditor>
                      )
                    : (
                      <QuillEditor
                        mode=""
                        height={800}
                        defaultValue={defaultValue}
                        isFormula={false}
                        setContent={(value: string) => {
                          form.setFieldsValue({ originalContent: value })
                        }}
                      >
                      </QuillEditor>
                      )}
                </div>
              </Form.Item>
            </>
          )}
          {price === 0 && (
            <Form.Item
              label="文章内容"
              name="originalContent"
              rules={[{ required: true, message: '请输入文章内容!' }]}
              style={{ height: 840 }}
            >
              <div className="w-800px">
                {editor === 'MARKDOWN'
                  ? (
                    <MdEditor
                      height={800}
                      defaultValue={defaultValue}
                      setContent={(value: string, renderValue: string) => {
                        form.setFieldsValue({ originalContent: value })
                        setRenderValue(renderValue)
                      }}
                    >
                    </MdEditor>
                    )
                  : (
                    <QuillEditor
                      mode=""
                      height={800}
                      defaultValue={defaultValue}
                      isFormula={false}
                      setContent={(value: string) => {
                        form.setFieldsValue({ originalContent: value })
                      }}
                    >
                    </QuillEditor>
                    )}
              </div>
            </Form.Item>
          )}
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

export default TopicUpdatePage
