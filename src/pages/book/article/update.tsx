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
  message,
} from 'antd'
import { useDispatch } from 'react-redux'
import dayjs from 'dayjs'
import moment from 'moment'
import { book } from '../../../api/index'
import { titleAction } from '../../../store/user/loginUserSlice'
import {
  BackBartment,
  HelperText,
  MdEditor,
  PerButton,
  QuillEditor,
} from '../../../components'

function BookArticleUpdatePage() {
  const result = new URLSearchParams(useLocation().search)
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [init, setInit] = useState<boolean>(true)
  const [loading, setLoading] = useState<boolean>(false)
  const [categories, setCategories] = useState<any>([])
  const [tryRead, setTryRead] = useState(false)
  const [defautValue, setDefautValue] = useState('')
  const [editor, setEditor] = useState('')
  const [renderValue, setRenderValue] = useState('')
  const [id, setId] = useState(Number(result.get('id')))
  const [bid, setBid] = useState(Number(result.get('bid')))

  useEffect(() => {
    document.title = '编辑电子书文章'
    dispatch(titleAction('编辑电子书文章'))
    initData()
  }, [id, bid])

  useEffect(() => {
    setId(Number(result.get('id')))
    setBid(Number(result.get('bid')))
    getDetail()
  }, [result.get('id'), result.get('bid')])

  const initData = async () => {
    await getBook()
    await getParams()
    await getDetail()
    setInit(false)
  }

  const getDetail = async () => {
    if (id === 0)
      return

    const res: any = await book.articleDetail(id)
    const data = res.data
    form.setFieldsValue({
      chapterId: data.chapterId === 0 ? [] : data.chapterId,
      title: data.title,
      isShow: data.isShow,
      isFreeRead: data.isFreeRead,
      originalContent: data.originalContent,
      // charge: data.charge,
      groundingTime: dayjs(data.groundingTime, 'YYYY-MM-DD HH:mm:ss'),
    })
    setEditor(data.editor)
    setDefautValue(data.originalContent)
    setRenderValue(data.renderContent)
    setTryRead(data.isFreeRead)
  }

  const getParams = async () => {
    const res: any = await book.articleCreate({
      bookId: bid,
    })
    const categories = res.data
    if (categories) {
      const box: any = []
      for (let i = 0; i < categories.length; i++) {
        box.push({
          label: categories[i].name,
          value: categories[i].id,
        })
      }
      setCategories(box)
    }
  }

  const getBook = async () => {
    const res: any = await book.detail(bid)
    setTryRead(res.data.price > 0)
  }

  const onFinish = (values: any) => {
    if (loading)
      return

    values.editor = editor
    if (editor === 'MARKDOWN')
      values.renderContent = renderValue
    else
      values.renderContent = values.originalContent

    values.bookId = bid
    values.groundingTime = moment(new Date(values.groundingTime)).format(
      'YYYY-MM-DD HH:mm:ss',
    )
    setLoading(true)
    book
      .articleUpdate(id, values)
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

  const isVipChange = (checked: boolean) => {
    if (checked) {
      form.setFieldsValue({ isFreeRead: true })
      setTryRead(true)
    }
    else {
      form.setFieldsValue({ isFreeRead: false })
      setTryRead(false)
    }
  }

  return (
    <div className="geekedu-main-body">
      <BackBartment title="编辑电子书文章" />
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
          name="book-article-update"
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 21 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item name="chapterId" label="章节">
            <Space align="baseline" style={{ height: 32 }}>
              <Form.Item name="chapterId">
                <Select
                  style={{ width: 300 }}
                  allowClear
                  placeholder="请选择章节"
                  options={categories}
                />
              </Form.Item>
              <div>
                <PerButton
                  type="link"
                  text="章节管理"
                  class="c-primary"
                  icon={null}
                  p="addons.meedu_books.book_chapter.list"
                  onClick={() => {
                    navigate(`/meedubook/chapter/index?bid=${bid}`)
                  }}
                  disabled={null}
                />
              </div>
            </Space>
          </Form.Item>
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: '请输入标题!' }]}
          >
            <Input style={{ width: 300 }} placeholder="请输入标题" allowClear />
          </Form.Item>
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
          {tryRead && (
            <Form.Item label="试看" name="isFreeRead">
              <Space align="baseline" style={{ height: 32 }}>
                <Form.Item name="isFreeRead" valuePropName="checked">
                  <Switch onChange={isVipChange} />
                </Form.Item>
                <div className="ml-10">
                  <HelperText text="开启试看的话未购买电子书学员可直接浏览该篇文章。"></HelperText>
                </div>
              </Space>
            </Form.Item>
          )}
          <Form.Item label="显示文章" name="isShow">
            <Space align="baseline" style={{ height: 32 }}>
              <Form.Item name="isShow" valuePropName="checked">
                <Switch onChange={onSwitch} />
              </Form.Item>
              <div className="ml-10">
                <HelperText text="关闭后电子书文章在前台隐藏显示"></HelperText>
              </div>
            </Space>
          </Form.Item>
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
                    defaultValue={defautValue}
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
                    defaultValue={defautValue}
                    isFormula={false}
                    setContent={(value: string) => {
                      form.setFieldsValue({ originalContent: value })
                    }}
                  >
                  </QuillEditor>
                  )}
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
    </div>
  )
}

export default BookArticleUpdatePage
