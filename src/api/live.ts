import client from './internal/httpClient'

// 直播课列表
export function list(params: any) {
  return client.get(`/course/api/live/course/list`, params)
}

// 直播课分类
export function create() {
  return client.get(`/course/api/live/course/category/list`, {})
}

// 新增直播课
export function store(params: any) {
  return client.post('/course/api/live/course/add', params)
}

// 直播课明细
export function detail(id: number) {
  return client.get(`/course/api/live/course/${id}/detail`, {})
}

// 删除直播课
export function destroy(id: number) {
  return client.post(`/course/api/live/course/${id}/delete`, {})
}

// 更新直播课
export function update(id: number, params: any) {
  return client.post(`/course/api/live/course/${id}/update`, params)
}

// 分页获取评论列表
export function comment(params: any) {
  return client.get(`/course/api/live/course/getCommentsList`, params)
}
export function stats(id: number, params: any) {
  return client.get(`/backend/addons/zhibo/course/${id}/stats`, params)
}

// 批量删除课程评论
export function commentDestoryMulti(params: any) {
  return client.post(`/course/api/live/course/comments/delete/batch`, params)
}

export function commentCheck(params: any) {
  return client.post(`/backend/addons/zhibo/course_comment/check`, params)
}

export function userImport(id: number, params: any) {
  return client.post(`/backend/addons/zhibo/course/${id}/user/import`, params)
}

export function userList(id: number, params: any) {
  return client.get(`/backend/addons/zhibo/course/${id}/users`, params)
}

export function watchUsers(id: number, params: any) {
  return client.get(`/backend/addons/zhibo/course/${id}/watch-users`, params)
}

export function userDel(id: number, params: any) {
  return client.post(`/backend/addons/zhibo/course/${id}/user/del`, params)
}

export function userAdd(id: number, params: any) {
  return client.post(`/backend/addons/zhibo/course/${id}/user/add`, params)
}

// 直播课分类列表
export function categoryList(params: any) {
  return client.get(`/label/api/category/getCategoryList?type=LIVE_COURSE`, params)
}

// 直播课分类删除
export function categoryDestroy(id: number) {
  return client.post(`/label/api/category/delete/${id}`, {})
}

export function categoryCreate() {
  return client.get(`/label/api/category`, {})
}

// 直播课分类添加
export function categoryStore(params: any) {
  return client.post('/label/api/category/add', params)
}

// 直播课分类详情
export function categoryDetail(params: any) {
  return client.get(`/label/api/category/getCategoryById`, params)
}

// 直播课分类修改
export function categoryUpdate(id: number, params: any) {
  return client.post(`/label/api/category/update/${id}`, params)
}

export function teacherList(params: any) {
  return client.get(`/backend/addons/zhibo/teacher/index`, params)
}

export function teacherDestroy(id: number) {
  return client.destroy(`/backend/addons/zhibo/teacher/${id}`)
}

export function teacherCreate() {
  return client.get(`/backend/addons/zhibo/teacher/create`, {})
}

export function teacherStore(params: any) {
  return client.post('/backend/addons/zhibo/teacher/create', params)
}

export function teacherDetail(id: number) {
  return client.get(`/backend/addons/zhibo/teacher/${id}`, {})
}

export function teacherUpdate(id: number, params: any) {
  return client.put(`/backend/addons/zhibo/teacher/${id}`, params)
}

export function videoList(params: any) {
  return client.get(`/backend/addons/zhibo/course_video/index`, params)
}

export function videoDestory(id: number) {
  return client.destroy(`/backend/addons/zhibo/course_video/${id}`)
}

export function videoCreate() {
  return client.get(`/backend/addons/zhibo/course_video/create`, {})
}

export function videoStore(params: any) {
  return client.post('/backend/addons/zhibo/course_video/create', params)
}

export function videoDetail(id: number) {
  return client.get(`/backend/addons/zhibo/course_video/${id}`, {})
}

export function videoUpdate(id: number, params: any) {
  return client.put(`/backend/addons/zhibo/course_video/${id}`, params)
}

export function videoStats(id: number) {
  return client.get(`/backend/addons/zhibo/course_video/${id}/stats`, {})
}

export function videoChats(id: number, ids: number, params: any) {
  return client.get(`/backend/addons/zhibo/chat/${id}/${ids}`, params)
}

export function videoChatDestoryMulti(params: any) {
  return client.post(`/backend/addons/zhibo/chat/delete`, params)
}

export function videoWatchUsers(id: number, params: any) {
  return client.get(
    `/backend/addons/zhibo/course_video/${id}/watch-users`,
    params,
  )
}

// 直播课章节列表
export function chaptersList(id: number) {
  return client.get(`/course/api/live/course/${id}/chapter/getChapterList`, {})
}

// 直播课章节删除
export function chaptersDestroy(id: number) {
  return client.destroy(`/course/api/live/course//chapter/delete/${id}`)
}

// 直播课章节添加
export function chaptersStore(params: any) {
  return client.post(`/course/api/live/course/chapter/add`, params)
}

// 直播课章节详情
export function chaptersDetail(id: number) {
  return client.get(`/course/api/live/course/chapter/getChapterById/${id}`, {})
}

// 直播课章节更新
export function chaptersUpdate(id: number, params: any) {
  return client.put(`/course/api/live/course/chapter/update/${id}`, params)
}
