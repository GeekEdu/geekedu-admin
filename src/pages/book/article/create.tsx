import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Switch,
  message,
} from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { ExclamationCircleFilled } from '@ant-design/icons'
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
import { getEditorKey, saveEditorKey } from '../../../utils/index'

const { confirm } = Modal

function BookArticleCreatePage() {
  const result = new URLSearchParams(useLocation().search)
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(false)
  const [categories, setCategories] = useState<any>([])
  const [tryFree, setTryFree] = useState(false)
  const [current, setCurrent] = useState('')
  const [editor, setEditor] = useState('')
  const [renderValue, setRenderValue] = useState('')
  const [bid, setBid] = useState(Number(result.get('book_id')))
  const tools = [
    { label: 'Markdown', value: 'markdown' },
    { label: '富文本编辑器', value: 'quill' },
  ]

  useEffect(() => {
    document.title = '添加电子书文章'
    dispatch(titleAction('添加电子书文章'))
    form.setFieldsValue({
      chapterId: [],
      isShow: true,
      isFreeRead: false,
    })
    if (bid) {
      getParams()
      getBook()
    }
  }, [bid])

  useEffect(() => {
    setBid(Number(result.get('book_id')))
  }, [result.get('book_id')])

  useEffect(() => {
    const localCurrent = getEditorKey()
    if (localCurrent === 'markdown')
      setEditor('MARKDOWN')
    else
      setEditor('RICHTEXT')

    const current = localCurrent || 'quill'
    setCurrent(current)
  }, [getEditorKey()])

  const getParams = () => {
    book.articleCreate({ bookId: bid }).then((res: any) => {
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
    })
  }

  const getBook = () => {
    book.detail(bid).then((res: any) => {
      setTryFree(res.data.price > 0)
    })
  }

  const onFinish = (values: any) => {
    if (loading)
      return

    if (getEditorKey() === 'markdown') {
      values.editor = 'MARKDOWN'
      values.renderContent = renderValue
    }
    else {
      values.editor = 'FULLEDITOR'
      values.renderContent = values.originalContent
    }
    values.bookId = bid
    values.groundingTime = moment(new Date(values.groundingTime)).format(
      'YYYY-MM-DD HH:mm:ss',
    )
    setLoading(true)
    book
      .articleStore(values)
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
    if (checked)
      form.setFieldsValue({ isFreeRead: true })
    else
      form.setFieldsValue({ isFreeRead: false })
  }

  return (
    <div className="geekedu-main-body">
      <BackBartment title="添加电子书文章" />
      <div className="float-left mt-30">
        <Form
          form={form}
          name="book-article-create"
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
          {tryFree && (
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
            <div className="flex flex-row">
              <div className="w-800px">
                {editor === 'MARKDOWN'
                  ? (
                    <MdEditor
                      height={800}
                      defautValue=""
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
                      defautValue=""
                      isFormula={false}
                      setContent={(value: string) => {
                        form.setFieldsValue({ originalContent: value })
                      }}
                    >
                    </QuillEditor>
                    )}
              </div>
              <div className="ml-30">
                <Select
                  value={current}
                  style={{ width: 150 }}
                  onChange={(e) => {
                    confirm({
                      title: '警告',
                      icon: <ExclamationCircleFilled />,
                      content: '切换编辑器将清空已编辑文章内容，是否切换？',
                      centered: true,
                      okText: '确认',
                      cancelText: '取消',
                      onOk() {
                        setCurrent(e)
                        saveEditorKey(e)
                      },
                      onCancel() {
                        console.log('Cancel')
                      },
                    })
                  }}
                  placeholder="请选择"
                  options={tools}
                />
              </div>
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

export default BookArticleCreatePage
