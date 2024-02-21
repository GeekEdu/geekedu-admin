import { useEffect, useState } from 'react'
import {
  Button,
  Col,
  Empty,
  Image,
  Modal,
  Pagination,
  Row,
  Spin,
  message,
} from 'antd'
import { useDispatch } from 'react-redux'
import { CheckOutlined, ExclamationCircleFilled } from '@ant-design/icons'
import { UploadImageSub } from '../../../components/upload-image-button/upload-image-sub'
import { titleAction } from '../../../store/user/loginUserSlice'
import { media } from '../../../api/index'
import { PerButton } from '../../../components'
import styles from './index.module.scss'

const { confirm } = Modal

interface ImageItem {
  id: string
  createdTime: string
  source: string
  name: string
  path: string
  url: string
}

function ResourceImagesPage() {
  const dispatch = useDispatch()
  const [imageList, setImageList] = useState<ImageItem[]>([])
  const [refresh, setRefresh] = useState(false)
  const [pageNum, setPageNum] = useState(1)
  const [pageSize, setPageSize] = useState(32)
  const [total, setTotal] = useState(0)
  const [selectKey, setSelectKey] = useState<number[]>([])
  const [visibleArr, setVisibleArr] = useState<boolean[]>([])
  const [hoverArr, setHoverArr] = useState<boolean[]>([])
  const [loading, setLoading] = useState(false)
  const [delLoading, setDelLoading] = useState(false)

  // 初始化页面标题
  useEffect(() => {
    document.title = '图片库'
    dispatch(titleAction('图片库'))
  }, [])

  // 加载图片列表
  useEffect(() => {
    getImageList()
  }, [refresh, pageNum, pageSize])

  // 删除图片
  const removeResource = () => {
    if (selectKey.length === 0)
      return

    confirm({
      title: '操作确认',
      icon: <ExclamationCircleFilled />,
      content: '确认删除选中图片？',
      centered: true,
      okText: '确认',
      cancelText: '取消',
      okButtonProps: { loading: delLoading },
      onOk() {
        if (delLoading)
          return

        setDelLoading(true)
        media
          .destroyImages({
            ids: selectKey,
          })
          .then(() => {
            setDelLoading(false)
            message.success('删除成功')
            resetImageList()
          })
          .catch((e) => {
            setDelLoading(false)
          })
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }

  // 获取图片列表
  const getImageList = () => {
    setLoading(true)
    // 请求获取图片列表
    media
      .imagesList({
        pageNum,
        pageSize,
      })
      .then((res: any) => {
        setTotal(res.data.data.total)
        setImageList(res.data.data.data)
        const data: ImageItem[] = res.data.data.data
        const arr = []
        for (let i = 0; i < data.length; i++)
          arr.push(false)

        setVisibleArr(arr)
        setHoverArr(arr)
        setLoading(false)
      })
      .catch((err: any) => {
        setLoading(false)
        console.log('错误,', err)
      })
  }
  // 重置列表
  const resetImageList = () => {
    setPageNum(1)
    setImageList([])
    setSelectKey([])
    setRefresh(!refresh)
  }

  const onChange = (e: any, id: number) => {
    // 阻止默认事件
    e.preventDefault()
    e.stopPropagation()
    const arr = [...selectKey]
    if (!arr.includes(id))
      arr.push(id)
    else
      arr.splice(arr.indexOf(id), 1)

    setSelectKey(arr)
  }

  const selectAll = () => {
    const arr = []
    for (let i = 0; i < imageList.length; i++)
      arr.push(imageList[i].id)

    setSelectKey(arr)
  }

  const cancelAll = () => {
    setSelectKey([])
  }

  const showImage = (index: number, value: boolean) => {
    const arr = [...visibleArr]
    arr[index] = value
    setVisibleArr(arr)
  }

  const showHover = (index: number, value: boolean) => {
    const arr = [...hoverArr]
    for (let i = 0; i < arr.length; i++)
      arr[i] = false

    arr[index] = value
    setHoverArr(arr)
  }

  return (
    <>
      <div className="geekedu-main-body">
        <Row style={{ marginBottom: 24 }}>
          <Col span={24}>
            <div className="j-b-flex">
              <div className="d-flex">
                <UploadImageSub
                  from={0}
                  onUpdate={() => {
                    resetImageList()
                  }}
                >
                </UploadImageSub>
                <PerButton
                  type="danger"
                  text="删除"
                  class="ml-10"
                  icon={null}
                  p="media.image.delete.multi"
                  onClick={() => removeResource()}
                  disabled={selectKey.length === 0}
                  loading={delLoading}
                />
              </div>
              <div className="d-flex"></div>
            </div>
          </Col>
        </Row>
        {loading && (
          <div className="float-left d-j-flex mt-24">
            <Spin size="large" />
          </div>
        )}
        {!loading && imageList.length === 0 && (
          <div className="d-flex">
            <Col span={24}>
              <Empty description="暂无图片" />
            </Col>
          </div>
        )}
        <div className={styles['images-box']}>
          {!loading
          && imageList.map((item: any, index: number) => (
            <div
              key={item.id}
              className={`${styles.imageItem} ref-image-item`}
              style={{ backgroundImage: `url(${item.url})` }}
              onClick={() => showImage(index, true)}
              onMouseOver={() => showHover(index, true)}
              onMouseOut={() => showHover(index, false)}
            >
              {hoverArr[index] && (
                <i
                  className={styles.checkbox}
                  onClick={e => onChange(e, item.id)}
                >
                </i>
              )}
              {selectKey.includes(item.id) && (
                <i
                  className={styles.checked}
                  onClick={e => onChange(e, item.id)}
                >
                  <CheckOutlined />
                </i>
              )}
              <Image
                width={200}
                style={{ display: 'none' }}
                src={item.url}
                preview={{
                  visible: visibleArr[index],
                  src: item.url,
                  onVisibleChange: (value) => {
                    showImage(index, value)
                  },
                }}
              />
            </div>
          ))}
        </div>
        {!loading && imageList.length > 0 && (
          <Col
            span={24}
            style={{
              display: 'flex',
              flexDirection: 'row-reverse',
              marginTop: 24,
            }}
          >
            <Pagination
              onChange={(currentPage, currentSize) => {
                setPageNum(currentPage)
                setPageSize(currentSize)
              }}
              defaultCurrent={pageNum}
              total={total}
              pageSize={pageSize}
            />
          </Col>
        )}
      </div>
    </>
  )
}

export default ResourceImagesPage
