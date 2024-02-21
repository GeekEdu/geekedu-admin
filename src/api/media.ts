import client from './internal/httpClient'

// 选择图片组件中 返回图片列表
export function imageList(params: any) {
  return client.get('/res/api/file/images', params)
}

export function videoList(params: any) {
  return client.get('/backend/addons/LocalUpload/video/index', params)
}

export function destroyVideo(id: number) {
  return client.destroy(`/backend/addons/LocalUpload/video/${id}`)
}

export function videoAliyunTokenRefresh(params: any) {
  return client.post('/backend/api/v1/video/token/aliyun/refresh', params)
}

export function videoAliyunTokenCreate(params: any) {
  return client.post('/backend/api/v1/video/token/aliyun/create', params)
}

// 上传视频到腾讯云 获取上传的签名
// export function videoTencentToken(params: any) {
//   return client.post('/res/api/media/getUploadSignature', params)
// }
export function videoTencentToken() {
  return client.get('/res/api/media/getUploadSignature', {})
}

export function videoLocalUpload(params: any) {
  return client.post('/backend/addons/LocalUpload/upload', params)
}

// 返回视频列表
export function newVideoList(params: any) {
  return client.get('/res/api/media/getVideoPage', params)
}

// 保存视频到数据库
export function storeVideo(params: any) {
  return client.post('/res/api/media/video/add', params)
}

// 批量删除视频
export function newDestroyVideo(params: any) {
  return client.post(`/res/api/media/video/delete`, params)
}

export function aliyunTranscode(params: any) {
  return client.post(`/backend/addons/AliyunHls/transcode-submit`, params)
}

export function aliyunTranscodeRecords(params: any) {
  return client.get(`/backend/addons/AliyunHls/transcode-records`, params)
}

// 腾讯云视频加密
export function tencentTranscode(params: any) {
  return client.post(
    `/backend/addons/TencentCloudHls/transcode-submit`,
    params,
  )
}

export function tencentTranscodeRecords(params: any) {
  return client.get(
    `/backend/addons/TencentCloudHls/transcode-records`,
    params,
  )
}

export function localDestroyVideo(params: any) {
  return client.post(`/backend/addons/LocalUpload/video/delete`, params)
}

export function localVideoUrl(id: number, params: any) {
  return client.get(`/backend/addons/LocalUpload/video/${id}/play`, params)
}

// 资源库中 返回图片列表
export function imagesList(params: any) {
  return client.get('/res/api/file/images', params)
}

// 批量删除图片
export function destroyImages(params: any) {
  return client.post(`/res/api/file/delete/batch`, params)
}
