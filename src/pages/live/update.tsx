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
  Tabs,
  message,
} from 'antd'
import { useDispatch } from 'react-redux'
import dayjs from 'dayjs'
import moment from 'moment'
import { live } from '../../api/index'
import { titleAction } from '../../store/user/loginUserSlice'
import {
  BackBartment,
  HelperText,
  PerButton,
  QuillEditor,
  UploadImageButton,
} from '../../components'

function LiveUpdatePage() {
  const result = new URLSearchParams(useLocation().search)
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [init, setInit] = useState<boolean>(true)
  const [loading, setLoading] = useState<boolean>(false)
  const [resourceActive, setResourceActive] = useState<string>('base')
  const [categories, setCategories] = useState<any>([])
  const [teachers, setTeachers] = useState<any>([])
  const [isFree, setIsFree] = useState(0)
  const [thumb, setThumb] = useState<string>('')
  const [poster, setPoster] = useState<string>('')
  const [defautValue, setDefautValue] = useState('')
  const [original_charge, setOriginalCharge] = useState(0)
  const [original_vip_can_view, setOriginalVipCanView] = useState(0)
  const [id, setId] = useState(Number(result.get('id')))
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
    document.title = '编辑直播课程'
    dispatch(titleAction('编辑直播课程'))
    initData()
  }, [id])

  useEffect(() => {
    setId(Number(result.get('id')))
  }, [result.get('id')])

  const initData = async () => {
    await getParams()
    await getDetail()
    setInit(false)
  }

  const getDetail = async () => {
    if (id === 0)
      return

    const res: any = await live.detail(id)
    const data = res.data
    form.setFieldsValue({
      categoryId: data.categoryId,
      title: data.title,
      cover: data.cover,
      isShow: data.isShow,
      // assistant_id: data.assistant_id === 0 ? [] : data.assistant_id,
      teacherId: data.teacherId,
      vipCanView: data.vipCanView,
      intro: data.intro,
      renderDesc: data.renderDesc,
      price: data.price,
      poster: data.poster,
      groundingTime: dayjs(data.groundingTime, 'YYYY-MM-DD HH:mm:ss'),
    })
    if (data.price > 0)
      setIsFree(0)
    else
      setIsFree(1)

    setOriginalCharge(data.price)
    setOriginalVipCanView(data.vipCanView)
    setDefautValue(data.renderDesc)
    setThumb(data.cover)
    setPoster(data.poster)
  }

  const getParams = async () => {
    const res: any = await live.create()
    const categories = res.data.categories
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
    // const assistants = res.data.teachers.assistant
    // const box2: any = []
    // for (let i = 0; i < assistants.length; i++) {
    //   box2.push({
    //     label: assistants[i].name,
    //     value: assistants[i].id,
    //   })
    // }
    // setAssistants(box2)
    const teachers = res.data.teachers
    const box3: any = []
    for (let i = 0; i < teachers.length; i++) {
      box3.push({
        label: teachers[i].name,
        value: teachers[i].id,
      })
    }
    setTeachers(box3)
  }

  const onChange = (key: string) => {
    setResourceActive(key)
  }

  const onFinish = (values: any) => {
    if (loading)
      return

    if (values.price == 0)
      values.vipCanView = false

    // values.render_desc = values.original_desc
    values.groundingTime = moment(new Date(values.groundingTime)).format(
      'YYYY-MM-DD HH:mm:ss',
    )
    setLoading(true)
    live
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

  const isFreeChange = (checked: boolean) => {
    if (checked) {
      form.setFieldsValue({ price: 0, vipCanView: false })
      setIsFree(1)
    }
    else {
      form.setFieldsValue({
        price: original_charge,
        vipCanView: original_vip_can_view,
      })
      setIsFree(0)
    }
  }

  const onSwitch = (checked: boolean) => {
    if (checked)
      form.setFieldsValue({ isShow: true })
    else
      form.setFieldsValue({ isShow: false })
  }

  const onVipChange = (checked: boolean) => {
    if (checked)
      form.setFieldsValue({ vipCanView: true })
    else
      form.setFieldsValue({ vipCanView: false })
  }

  return (
    <div className="geekedu-main-body">
      <BackBartment title="编辑直播课程" />
      <div className="center-tabs mb-30">
        <Tabs
          defaultActiveKey={resourceActive}
          items={types}
          onChange={onChange}
        />
      </div>
      {init && (
        <div className="float-left text-center">
          <Spin></Spin>
        </div>
      )}
      <div style={{ display: init ? 'none' : 'block' }} className="float-left">
        <Form
          form={form}
          name="live-update"
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
            <Form.Item
              label="所属分类"
              name="categoryId"
              rules={[{ required: true, message: '请选择所属分类!' }]}
            >
              <Space align="baseline" style={{ height: 32 }}>
                <Form.Item
                  name="categoryId"
                  rules={[{ required: true, message: '请选择所属分类!' }]}
                >
                  <Select
                    style={{ width: 300 }}
                    allowClear
                    placeholder="请选择所属分类"
                    options={categories}
                  />
                </Form.Item>
                <div>
                  <PerButton
                    type="link"
                    text="分类管理"
                    class="c-primary"
                    icon={null}
                    p="addons.Zhibo.course_category.list"
                    onClick={() => {
                      navigate('/live/course/category/index')
                    }}
                    disabled={null}
                  />
                </div>
              </Space>
            </Form.Item>
            <Form.Item
              label="讲师"
              name="teacherId"
              rules={[{ required: true, message: '请选择讲师!' }]}
            >
              <Space align="baseline" style={{ height: 32 }}>
                <Form.Item
                  name="teacherId"
                  rules={[{ required: true, message: '请选择讲师!' }]}
                >
                  <Select
                    style={{ width: 300 }}
                    allowClear
                    placeholder="请选择讲师"
                    options={teachers}
                  />
                </Form.Item>
                <div>
                  <PerButton
                    type="link"
                    text="讲师管理"
                    class="c-primary"
                    icon={null}
                    p="addons.Zhibo.teacher.list"
                    onClick={() => {
                      navigate('/live/teacher/index')
                    }}
                    disabled={null}
                  />
                </div>
              </Space>
            </Form.Item>
            {/* <Form.Item label="助教" name="assistant_id">
              <Space align="baseline" style={{ height: 32 }}>
                <Form.Item name="assistant_id">
                  <Select
                    style={{ width: 300 }}
                    allowClear
                    placeholder="请选择助教"
                    options={assistants}
                  />
                </Form.Item>
                <div className="ml-10">
                  <HelperText text="可选择助教辅助讲师直播"></HelperText>
                </div>
              </Space>
            </Form.Item> */}
            <Form.Item
              label="课程名"
              name="title"
              rules={[{ required: true, message: '请输入课程名!' }]}
            >
              <Input
                style={{ width: 300 }}
                placeholder="请输入课程名"
                allowClear
              />
            </Form.Item>
            <Form.Item
              label="课程封面"
              name="cover"
              rules={[{ required: true, message: '请上传课程封面!' }]}
            >
              <Space align="baseline" style={{ height: 32 }}>
                <Form.Item
                  name="cover"
                  rules={[{ required: true, message: '请上传课程封面!' }]}
                >
                  <UploadImageButton
                    text="选择图片"
                    onSelected={(url) => {
                      form.setFieldsValue({ cover: url })
                      setThumb(url)
                    }}
                  >
                  </UploadImageButton>
                </Form.Item>
                <div className="ml-10">
                  <HelperText text="推荐尺寸400x300 宽高比4:3"></HelperText>
                </div>
              </Space>
            </Form.Item>
            {thumb && (
              <Row style={{ marginBottom: 22 }}>
                <Col span={3}></Col>
                <Col span={21}>
                  <div
                    className="normal-thumb-box"
                    style={{
                      backgroundImage: `url(${thumb})`,
                      width: 200,
                      height: 150,
                    }}
                  >
                  </div>
                </Col>
              </Row>
            )}
            <Form.Item label="免费" valuePropName="checked" key={isFree}>
              <Switch defaultChecked={isFree === 1} onChange={isFreeChange} />
            </Form.Item>
            <div style={{ display: isFree === 0 ? 'block' : 'none' }}>
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
                      placeholder="请输入价格"
                      allowClear
                      type="number"
                    />
                  </Form.Item>
                  <div className="ml-10">
                    <HelperText text="最小单位“元”，不支持小数"></HelperText>
                  </div>
                </Space>
              </Form.Item>
            </div>
            <Form.Item
              label="上架时间"
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
            <Form.Item label="显示" name="isShow">
              <Space align="baseline" style={{ height: 32 }}>
                <Form.Item name="isShow" valuePropName="checked">
                  <Switch onChange={onSwitch} />
                </Form.Item>
                <div className="ml-10">
                  <HelperText text="关闭后此直播课在前台隐藏显示"></HelperText>
                </div>
              </Space>
            </Form.Item>
            <div style={{ display: isFree === 0 ? 'block' : 'none' }}>
              <Form.Item label="会员免费" name="vipCanView">
                <Space align="baseline" style={{ height: 32 }}>
                  <Form.Item name="vipCanView" valuePropName="checked">
                    <Switch onChange={onVipChange} />
                  </Form.Item>
                  <div className="ml-10">
                    <HelperText text="如果启用会员免费那么购买VIP会员的学员将可以无需购买直接观看直播。"></HelperText>
                  </div>
                </Space>
              </Form.Item>
            </div>
            <Form.Item
              label="简短介绍"
              name="intro"
              rules={[{ required: true, message: '请输入简短介绍!' }]}
            >
              <Input.TextArea
                style={{ width: 800 }}
                placeholder="请输入简短介绍"
                allowClear
                rows={4}
                maxLength={150}
                showCount
              />
            </Form.Item>
            <Form.Item
              label="详细介绍"
              name="renderDesc"
              rules={[{ required: true, message: '请输入详细介绍!' }]}
              style={{ height: 440 }}
            >
              <div className="w-800px">
                <QuillEditor
                  mode=""
                  height={400}
                  defaultValue={defautValue}
                  isFormula={false}
                  setContent={(value: string) => {
                    form.setFieldsValue({ renderDesc: value })
                  }}
                >
                </QuillEditor>
              </div>
            </Form.Item>
          </div>
          <div style={{ display: resourceActive === 'dev' ? 'block' : 'none' }}>
            <Form.Item label="播放封面" name="poster">
              <Space align="baseline" style={{ height: 32 }}>
                <UploadImageButton
                  text="上传播放封面"
                  onSelected={(url) => {
                    form.setFieldsValue({ poster: url })
                    setPoster(url)
                  }}
                >
                </UploadImageButton>
                <div className="ml-10">
                  {poster && (
                    <Button
                      onClick={() => {
                        form.setFieldsValue({ poster: '' })
                        setPoster('')
                      }}
                    >
                      清空
                    </Button>
                  )}
                </div>
                <div className="ml-10">
                  <HelperText text="播放封面是在进入直播时播放器显示的图片。推荐尺寸：1200x500"></HelperText>
                </div>
              </Space>
            </Form.Item>
            {poster && (
              <Row style={{ marginBottom: 22 }}>
                <Col span={3}></Col>
                <Col span={21}>
                  <div
                    className="normal-thumb-box"
                    style={{
                      backgroundImage: `url(${poster})`,
                      width: 400,
                      height: 166.7,
                    }}
                  >
                  </div>
                </Col>
              </Row>
            )}
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

export default LiveUpdatePage
