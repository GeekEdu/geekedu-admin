import client from './internal/httpClient'

// 线上课详情

// 后台返回录播课列表
export function list(params: any) {
  return client.get(`/course/api/courses`, params)
}

// 后台返回录播课分类列表
export function getCourseCategory(params: any) {
  return client.get(`/label/api/category/getCategoryList`, params)
}

// 新增录播课
export function store(params: any) {
  return client.post('/course/api/add', params)
}

// 根据id获取课程明细
export function detail(id: number) {
  return client.get(`/course/api/getCourseById/${id}`, {})
}

// 根据id删除课程
export function destroy(id: number) {
  return client.destroy(`/course/api/delete/${id}`)
}

// 更新课程
export function update(id: number, params: any) {
  return client.put(`/course/api/update/${id}`, params)
}

// 获取播放地址
export function playUrl(courseId: number, hourId: number) {
  return client.get(`/api/v1/course/${courseId}/hour/${hourId}`, {})
}

// 记录学员观看时长
export function record(courseId: number, hourId: number, duration: number) {
  return client.get(`/api/v1/course/${courseId}/hour/${hourId}/record`, {
    duration,
  })
}

export function userImport(id: number, params: any) {
  return client.post(`/backend/api/v1/course/${id}/subscribe/import`, params)
}

// 后台分页返回录播课分类列表
export function categoryList(params: any) {
  return client.get(`/label/api/category/getCategoryPage`, params)
}

// 根据id删除分类
export function categoryDestroy(id: number) {
  return client.post(`/label/api/category/delete/${id}`, {})
}

export function categoryCreate() {
  return client.get(`/backend/api/v1/courseCategory/create`, {})
}

// 后台新建录播课分类
export function categoryStore(params: any) {
  return client.post('/label/api/category/add', params)
}

// 根据id查看某一个分类
export function categoryDetail(params: any) {
  return client.get(`/label/api/category/getCategoryById`, params)
}

// 根据id更新分类
export function categoryUpdate(id: number, params: any) {
  return client.post(`/label/api/category/update/${id}`, params)
}

// 返回课程评论列表
export function commentList(params: any) {
  return client.get(`/course/api/getCommentsList`, params)
}

// 批量删除课程评论
export function commentDestroy(params: any) {
  return client.post(`/course/api/comments/delete/batch`, params)
}

// 返回课时列表
export function videoList(params: any) {
  return client.get(`/course/api/section/getSectionList`, params)
}

// 批量删除课时
export function videoDestoryMulti(params: any) {
  return client.post(`/course/api/section/delete/batch`, params)
}

// 返回课程章节列表
export function videoCreate(id: number) {
  return client.get(`/course/api/${id}/chapter/getChapterList`, {})
}

// 新建课时
export function videoStore(params: any) {
  return client.post('/course/api/section/add', params)
}

// 返回课时明细
export function videoDetail(id: number) {
  return client.get(`/course/api/section/getSectionById/${id}`, {})
}

// 更新课时
export function videoUpdate(id: number, params: any) {
  return client.post(`/course/api/section/${id}/update`, params)
}

export function videoSubscribe(id: number, params: any) {
  return client.get(`/backend/api/v1/video/${id}/subscribes`, params)
}

export function videoSubscribeDestory(id: number, params: any) {
  return client.get(`/backend/api/v1/video/${id}/subscribe/delete`, params)
}

export function videoWatchRecords(id: number, params: any) {
  return client.get(`/backend/api/v1/video/${id}/watch/records`, params)
}

export function videoImportAct(params: any) {
  return client.post('/backend/api/v1/video/import', params)
}

export function videoCommentList(params: any) {
  return client.get(`/backend/api/v1/video_comment`, params)
}

export function videoCommentDestroy(params: any) {
  return client.post(`/backend/api/v1/video_comment/delete`, params)
}

export function recordsList(id: number, params: any) {
  return client.get(`/backend/api/v1/course/${id}/watch/records`, params)
}

export function recordsDestroy(id: number, params: any) {
  return client.post(
    `/backend/api/v1/course/${id}/watch/records/delete`,
    params,
  )
}

export function recordsDetail(id: number, userId: number, params: any) {
  return client.get(
    `/backend/api/v1/course/${id}/user/${userId}/watch/records`,
    params,
  )
}

export function subUsers(id: number, params: any) {
  return client.get(`/backend/api/v1/course/${id}/subscribes`, params)
}

export function subUsersAdd(id: number, params: any) {
  return client.post(`/backend/api/v1/course/${id}/subscribe/create`, params)
}

export function subUsersDel(id: number, params: any) {
  return client.get(`/backend/api/v1/course/${id}/subscribe/delete`, params)
}

export function attachList(params: any) {
  return client.get(`/backend/api/v1/course_attach`, params)
}

export function attachStore(params: any) {
  return client.post(`/backend/api/v1/course_attach`, params)
}

export function attachDestory(id: number) {
  return client.destroy(`/backend/api/v1/course_attach/${id}`)
}

// 返回章节列表
export function chaptersList(id: number) {
  return client.get(`/course/api/${id}/chapter/getChapterList`, {})
}

// 删除章节
export function chaptersDestroy(cId: number, id: number) {
  return client.post(`/course/api/${cId}/chapter/delete/${id}`, {})
}

// 新增章节
export function chaptersStore(cId: number, params: any) {
  return client.post(`/course/api/${cId}/chapter/add`, params)
}

// 获取章节明细
export function chaptersDetail(cId: number, id: number) {
  return client.get(`/course/api/${cId}/chapter/getChapterById/${id}`, {})
}

// 更新章节
export function chaptersUpdate(cId: number, id: number, params: any) {
  return client.post(`/course/api/${cId}/chapter/update/${id}`, params)
}

export function aliyunHlsList(params: any) {
  return client.get(`/backend/addons/AliyunHls/videos`, params)
}

export function aliyunHlsSubmit(params: any) {
  return client.post(
    `/backend/addons/AliyunHls/videos/submitTransTask`,
    params,
  )
}

export function tencentHlsList(params: any) {
  return client.get(`/backend/addons/TencentCloudHls/videos`, params)
}

export function tencentHlsSubmit(params: any) {
  return client.get(
    `/backend/addons/TencentCloudHls/videos/submitTransTask`,
    params,
  )
}
