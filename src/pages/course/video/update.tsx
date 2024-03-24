import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Button,
  DatePicker,
  Form,
  Input,
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
import { course, media } from '../../../api/index'
import { titleAction } from '../../../store/user/loginUserSlice'
import {
  BackBartment,
  HelperText,
  InputDuration,
  PerButton,
  UploadVideoDialog,
} from '../../../components'

function CourseVideoUpdatePage() {
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const result = new URLSearchParams(useLocation().search)
  const navigate = useNavigate()
  const [init, setInit] = useState<boolean>(true)
  const [loading, setLoading] = useState<boolean>(false)
  const [resourceActive, setResourceActive] = useState<string>('base')
  const [chapters, setChapters] = useState<any>([])
  const [isFree, setIsFree] = useState(1)
  const [charge, setCharge] = useState(0)
  const [freeSeconds, setFreeSeconds] = useState(0)
  const [duration, setDuration] = useState(0)
  const [tit, setTit] = useState<string>('')
  const [title, setTitle] = useState<string>('')
  const [showUploadVideoWin, setShowUploadVideoWin] = useState<boolean>(false)
  const [cid, setCid] = useState(Number(result.get('course_id')))
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
    document.title = '编辑课时'
    dispatch(titleAction('编辑课时'))
    initData()
  }, [cid, id])

  useEffect(() => {
    setCid(Number(result.get('course_id')))
    setId(Number(result.get('id')))
  }, [result.get('course_id'), result.get('id')])

  const initData = async () => {
    await getParams()
    await getCourse()
    await getDetail()
    setInit(false)
  }

  const getDetail = async () => {
    if (id === 0)
      return

    const res: any = await course.videoDetail(id)
    const data = res.data
    form.setFieldsValue({
      title: data.title,
      chapterId: data.chapterId === 0 ? null : data.chapterId,
      isShow: !data.isShow,
      banDrag: data.banDrag,
      // aliyun_video_id: data?.aliyun_video_id,
      videoId: data.videoId,
      tencentVideoId: data.tencentId,
      groundingTime: dayjs(data.groundingTime, 'YYYY-MM-DD HH:mm:ss'),
    })
    setDuration(data.duration)
    setFreeSeconds(data.freeSeconds)
  }

  const getParams = async () => {
    const res: any = await course.videoCreate(cid)
    const chapters = res.data
    if (chapters.length > 0) {
      const box: any = []
      for (let i = 0; i < chapters.length; i++) {
        box.push({
          label: chapters[i].name,
          value: chapters[i].id,
        })
      }
      setChapters(box)
    }
  }

  const getCourse = async () => {
    const res: any = await course.detail(cid)
    const data = res.data
    setIsFree(data.isFree)
    if (data.isFree) {
      setCharge(0)
      setFreeSeconds(0)
      form.setFieldsValue({ freeSeconds: 0 })
    }
    else {
      setCharge(data.price)
    }
  }

  const onFinish = (values: any) => {
    if (loading)
      return

    if (!values.videoId && !values.tencentVideoId) {
      message.error('请上传课程视频')
      return
    }
    if (chapters.length > 0 && !values.chapterId) {
      message.error('请选择所属章节')
      return
    }
    if (values.isShow)
      values.isShow = false
    else
      values.isShow = true

    values.groundingTime = moment(new Date(values.groundingTime)).format(
      'YYYY-MM-DD HH:mm:ss',
    )
    values.price = charge
    values.courseId = cid
    values.freeSeconds = Number(freeSeconds)
    values.duration = Number(duration)
    setLoading(true)
    course
      .videoUpdate(id, values)
      .then((res: any) => {
        message.success('成功')
        setLoading(false)
        navigate(-1)
      })
      .catch((e) => {
        setLoading(false)
      })
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  const onChange = (key: string) => {
    setResourceActive(key)
  }

  const onBanChange = (checked: boolean) => {
    if (checked)
      form.setFieldsValue({ banDrag: true })
    else
      form.setFieldsValue({ banDrag: false })
  }

  const onShowChange = (checked: boolean) => {
    if (checked)
      form.setFieldsValue({ isShow: true })
    else
      form.setFieldsValue({ isShow: false })
  }

  return (
    <div className="geekedu-main-body">
      <BackBartment title="编辑课时" />
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
          name="course-video-update"
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
            <Form.Item label="上传课时">
              <Button
                type="primary"
                onClick={() => setShowUploadVideoWin(true)}
              >
                <span>重新选择视频</span>
                {tit && (
                  <span className="ml-10">
                    {tit.replace('.m3u8', '').replace('.mp4', '')}
                  </span>
                )}
              </Button>
            </Form.Item>
            <Form.Item
              label="课时名称"
              name="title"
              rules={[{ required: true, message: '请输入课时名称!' }]}
            >
              <Input
                style={{ width: 300 }}
                placeholder="请输入课时名称"
                allowClear
                onChange={(e) => {
                  setTitle(e.target.value)
                }}
              />
            </Form.Item>
            <Form.Item
              label="课时时长"
              name="duration"
              rules={[{ required: true, message: '请输入课时时长!' }]}
            >
              <Space align="baseline" style={{ height: 32 }}>
                <InputDuration
                  value={duration}
                  disabled={false}
                  onChange={(val: number) => {
                    setDuration(val)
                    form.setFieldsValue({ duration: val })
                  }}
                >
                </InputDuration>
                <div className="ml-10">
                  <HelperText text="后台会根据课时时长统计学员学习进度"></HelperText>
                </div>
              </Space>
            </Form.Item>

            {isFree === 0 && (
              <Form.Item label="可试看时长" name="freeSeconds">
                <Space align="baseline" style={{ height: 32 }}>
                  <InputDuration
                    value={freeSeconds}
                    disabled={false}
                    onChange={(val: number) => {
                      setFreeSeconds(val)
                      form.setFieldsValue({ freeSeconds: val })
                    }}
                  >
                  </InputDuration>
                  <div className="ml-10">
                    <HelperText text="设置此课时免费试看时长（此配置对本地存储或URL视频无效）"></HelperText>
                  </div>
                </Space>
              </Form.Item>
            )}

            <Form.Item label="所属章节" name="chapterId">
              <Space align="baseline" style={{ height: 32 }}>
                <Form.Item name="chapterId">
                  <Select
                    style={{ width: 300 }}
                    allowClear
                    placeholder="请选择所属章节"
                    options={chapters}
                  />
                </Form.Item>
                <div>
                  <PerButton
                    type="link"
                    text="章节管理"
                    class="c-primary"
                    icon={null}
                    p="course_chapter"
                    onClick={() => {
                      navigate(`/course/vod/chapter/index?course_id=${cid}`)
                    }}
                    disabled={null}
                  />
                </div>
              </Space>
            </Form.Item>

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
          </div>

          <div style={{ display: resourceActive === 'dev' ? 'block' : 'none' }}>
            <Form.Item label="禁止快进播放" name="banDrag">
              <Space align="baseline" style={{ height: 32 }}>
                <Form.Item name="banDrag" valuePropName="checked">
                  <Switch onChange={onBanChange} />
                </Form.Item>
                <div className="ml-10">
                  <HelperText text="打开后学员学习此课时无法快进"></HelperText>
                </div>
              </Space>
            </Form.Item>

            <Form.Item label="隐藏课时" name="isShow">
              <Space align="baseline" style={{ height: 32 }}>
                <Form.Item name="isShow" valuePropName="checked">
                  <Switch onChange={onShowChange} />
                </Form.Item>
                <div className="ml-10">
                  <HelperText text="打开后课时在前台将隐藏显示"></HelperText>
                </div>
              </Space>
            </Form.Item>

            {/* <Form.Item label="阿里云视频文件ID" name="aliyun_video_id">
              <Input
                style={{ width: 300 }}
                placeholder="阿里云视频文件ID"
                allowClear
              />
            </Form.Item> */}

            <Form.Item label="腾讯云视频文件ID" name="tencentVideoId">
              <Input
                style={{ width: 300 }}
                placeholder="腾讯云视频文件ID"
                allowClear
              />
            </Form.Item>

            <Form.Item label="视频ID" name="videoId">
              <Input style={{ width: 300 }} placeholder="视频ID" allowClear />
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
      <UploadVideoDialog
        open={showUploadVideoWin}
        onCancel={() => setShowUploadVideoWin(false)}
        onSuccess={(video: any) => {
          form.setFieldsValue({ duration: video.duration })
          setDuration(video.duration)
          if (video.mediaSource === 'aliyun') {
            form.setFieldsValue({
              aliyun_video_id: video.mediaId,
              tencentVideoId: null,
              videoId: null,
            })
            setTit(video.title)
          }
          else if (video.mediaSource === 'tencent') {
            form.setFieldsValue({
              aliyun_video_id: null,
              tencentVideoId: video.mediaId,
              videoId: video.id,
            })
            setTit(video.title)
          }
          else if (video.mediaSource === 'local') {
            media.localVideoUrl(video.mediaId, {}).then((res: any) => {
              form.setFieldsValue({
                aliyun_video_id: null,
                tencentId: null,
                videoLink: res.data.videoLink,
              })
              setTit(video.title)
            })
          }
          setShowUploadVideoWin(false)
        }}
      >
      </UploadVideoDialog>
    </div>
  )
}

export default CourseVideoUpdatePage
