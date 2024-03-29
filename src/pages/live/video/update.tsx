import { useEffect, useState } from 'react'
import {
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  Space,
  Spin,
  message,
} from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import moment from 'moment'
import dayjs from 'dayjs'
import { live } from '../../../api/index'
import { titleAction } from '../../../store/user/loginUserSlice'
import { BackBartment, HelperText, PerButton } from '../../../components'

function LiveVideoUpdatePage() {
  const result = new URLSearchParams(useLocation().search)
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [chapters, setChapters] = useState<any>([])
  const [init, setInit] = useState<boolean>(true)
  const [loading, setLoading] = useState<boolean>(false)
  const [id, setId] = useState(Number(result.get('id')))
  const [course_id, setCourseId] = useState(Number(result.get('course_id')))

  useEffect(() => {
    document.title = '编辑直播排课'
    dispatch(titleAction('编辑直播排课'))
    initData()
  }, [id, course_id])

  useEffect(() => {
    setId(Number(result.get('id')))
    setCourseId(Number(result.get('course_id')))
  }, [result.get('id'), result.get('course_id')])

  const initData = async () => {
    await getParams()
    await getDetail()
    setInit(false)
  }

  const getDetail = async () => {
    if (id === 0)
      return

    const res: any = await live.videoDetail(id)
    if (res.data.chapterId === 0) {
      form.setFieldsValue({
        chapterId: [],
      })
    }
    else {
      form.setFieldsValue({
        chapterId: res.data.chapterId,
      })
    }

    form.setFieldsValue({
      title: res.data.title,
      liveTime: dayjs(res.data.liveTime, 'YYYY-MM-DD HH:mm:ss'),
      estimateDuration: res.data.estimateDuration / 60,
    })
  }

  const getParams = async () => {
    // const res: any = await live.videoCreate()
    const res: any = await live.chaptersList(course_id)
    // const data = res.data.chapters[course_id]
    const data = res.data
    if (data && data.length > 0) {
      const arr: any = []
      for (let i = 0; i < data.length; i++) {
        arr.push({
          label: data[i].name,
          value: data[i].id,
        })
      }
      setChapters(arr)
    }
  }

  const onFinish = (values: any) => {
    if (loading)
      return

    setLoading(true)
    values.liveTime = moment(new Date(values.liveTime)).format(
      'YYYY-MM-DD HH:mm:ss',
    )
    values.courseId = course_id
    values.estimateDuration = values.estimateDuration * 60
    values.isShow = true
    live
      .videoUpdate(id, values)
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
      <BackBartment title="编辑直播排课" />
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
          name="live-video-update"
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 21 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item label="章节" name="chapterId">
            <Space align="baseline" style={{ height: 32 }}>
              <Form.Item name="chapterId">
                <Select
                  style={{ width: 300 }}
                  allowClear
                  placeholder="请选择章节"
                  options={chapters}
                />
              </Form.Item>
              <div>
                <PerButton
                  type="link"
                  text="章节管理"
                  class="c-primary"
                  icon={null}
                  p="addons.Zhibo.course_chapter.list"
                  onClick={() => {
                    navigate(`/live/course/chapter/index?id=${id}`)
                  }}
                  disabled={null}
                />
              </div>
            </Space>
          </Form.Item>
          <Form.Item
            label="直播标题"
            name="title"
            rules={[{ required: true, message: '请输入直播标题!' }]}
          >
            <Input
              style={{ width: 300 }}
              placeholder="请输入直播标题"
              allowClear
            />
          </Form.Item>
          <Form.Item
            label="直播时间"
            name="liveTime"
            rules={[{ required: true, message: '请选择直播时间!' }]}
          >
            <DatePicker
              format="YYYY-MM-DD HH:mm:ss"
              style={{ width: 300 }}
              showTime
              placeholder="请选择到期时间"
            />
          </Form.Item>

          <Form.Item
            label="预估直播时长"
            name="estimateDuration"
            rules={[{ required: true, message: '请输入预估直播时长!' }]}
          >
            <Space align="center">
              <Form.Item
                style={{ marginBottom: 0 }}
                name="estimateDuration"
                rules={[{ required: true, message: '请输入预估直播时长!' }]}
              >
                <Input
                  type="number"
                  addonAfter="分钟"
                  style={{ width: 300 }}
                  placeholder="请输入预估直播时长"
                  allowClear
                />
              </Form.Item>
              <div className="ml-10">
                <HelperText text="学员观看直播超过此时长即代表学完此课时"></HelperText>
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
export default LiveVideoUpdatePage
