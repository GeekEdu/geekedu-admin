import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Switch,
  message,
} from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import { course } from '../../api/index'
import { titleAction } from '../../store/user/loginUserSlice'
import {
  BackBartment,
  HelperText,
  PerButton,
  QuillEditor,
  UploadImageButton,
} from '../../components'

function CourseCreatePage() {
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(false)
  const [categories, setCategories] = useState<any>([])
  const [isFree, setIsFree] = useState(0)
  const [thumb, setThumb] = useState<string>('')
  const [visiable, setVisiable] = useState<boolean>(false)

  useEffect(() => {
    document.title = '新建录播课程'
    dispatch(titleAction('新建录播课程'))
    form.setFieldsValue({ is_show: 1, is_free: 0 })
    setIsFree(0)
    setVisiable(false)
    getParams()
  }, [])

  const getParams = () => {
    course.getCourseCategory({
      type: 'REPLAY_COURSE',
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

  const onFinish = (values: any) => {
    if (loading)
      return

    if (values.isFree)
      values.price = 0

    if (Number(values.price) % 1 !== 0) {
      message.error('课程价格必须为整数型')
      return
    }
    if (!values.isFree && Number(values.price) <= 0) {
      message.error('课程未设置免费时价格应该大于0')
      return
    }
    // values.render_desc = values.original_desc
    values.groundingTime = moment(new Date(values.groundingTime)).format(
      'YYYY-MM-DD HH:mm:ss',
    )
    setLoading(true)
    course
      .store(values)
      .then((res: any) => {
        setLoading(false)
        setVisiable(true)
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
      form.setFieldsValue({ isFree: true })
      setIsFree(1)
    }
    else {
      form.setFieldsValue({ isFree: false })
      setIsFree(0)
    }
  }

  const goVideo = () => {
    course
      .list({
        page: 1,
        size: 1,
        sort: 'id',
        order: 'desc',
      })
      .then((res: any) => {
        navigate(
          `/course/vod/video/index?course_id=${
          res.data.courses.data[0].id
             }&title=${
             res.data.courses.data[0].title}`,
          { replace: true },
        )
      })
  }

  return (
    <div className="geekedu-main-body">
      <BackBartment title="新建录播课程" />
      <div className="float-left mt-30">
        <Form
          form={form}
          name="course-create"
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
                  p="courseCategory"
                  onClick={() => {
                    navigate('/course/vod/category/index')
                  }}
                  disabled={null}
                />
              </div>
            </Space>
          </Form.Item>
          <Form.Item
            label="课程名称"
            name="title"
            rules={[{ required: true, message: '请输入课程名称!' }]}
          >
            <Input
              style={{ width: 300 }}
              placeholder="请输入课程名称"
              allowClear
            />
          </Form.Item>
          <Form.Item
            label="课程封面"
            name="coverLink"
            rules={[{ required: true, message: '请上传课程封面!' }]}
          >
            <Space align="baseline" style={{ height: 32 }}>
              <Form.Item
                name="coverLink"
                rules={[{ required: true, message: '请上传课程封面!' }]}
              >
                <UploadImageButton
                  text="选择图片"
                  onSelected={(url) => {
                    form.setFieldsValue({ coverLink: url })
                    setThumb(url)
                  }}
                >
                </UploadImageButton>
              </Form.Item>
              <div className="ml-10">
                <HelperText text="长宽比4:3，建议尺寸：400x300像素"></HelperText>
              </div>
            </Space>
          </Form.Item>
          {thumb && (
            <Row style={{ marginBottom: 22 }}>
              <Col span={3}></Col>
              <Col span={21}>
                <div
                  className="contain-thumb-box"
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
          <Form.Item label="免费" name="is_free" valuePropName="checked">
            <Switch onChange={isVChange} />
          </Form.Item>
          {isFree === 0 && (
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
                  />
                </Form.Item>
                <div className="ml-10">
                  <HelperText text="最小单位“元”，不支持小数"></HelperText>
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
                <HelperText text="关闭后此课程在前台隐藏显示"></HelperText>
              </div>
            </Space>
          </Form.Item>
          <Form.Item
            label="简短介绍"
            name="description"
            rules={[{ required: true, message: '请输入简短介绍!' }]}
          >
            <Input.TextArea
              style={{ width: 800 }}
              placeholder="请填写课程简单介绍"
              allowClear
              rows={4}
              maxLength={150}
              showCount
            />
          </Form.Item>
          <Form.Item
            label="详情介绍"
            name="intro"
            rules={[{ required: true, message: '请输入详情介绍!' }]}
            style={{ height: 840 }}
          >
            <div className="w-800px">
              <QuillEditor
                mode=""
                height={800}
                defaultValue=""
                isFormula={false}
                setContent={(value: string) => {
                  form.setFieldsValue({ intro: value })
                }}
              >
              </QuillEditor>
            </div>
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
      {visiable
        ? (
          <Modal
            title=""
            centered
            onCancel={() => {
              setVisiable(false)
              navigate('/course/vod/index', { replace: true })
            }}
            cancelText="暂不排课"
            okText="立即排课"
            open={true}
            width={500}
            maskClosable={false}
            onOk={() => {
              setVisiable(false)
              goVideo()
            }}
          >
            <div
              className="text-center"
              style={{ marginTop: 30, marginBottom: 30 }}
            >
              <span>新建录播课成功，请在课程中添加课时排课吧！</span>
            </div>
          </Modal>
          )
        : null}
    </div>
  )
}

export default CourseCreatePage
