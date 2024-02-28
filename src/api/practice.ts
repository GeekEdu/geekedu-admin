import client from './internal/httpClient'

// 练习列表
export function list(params: any) {
  return client.get(`/exam/api/practice/list`, params)
}

// 练习 分类列表
export function create() {
  return client.get(`/exam/api/practice/tag/list`, {})
}

// 新增练习
export function store(params: any) {
  return client.post('/exam/api/practice/add', params)
}

// 根据id获取练习明细
export function detail(id: number) {
  return client.get(`/exam/api/practice/getPracticeById/${id}`, {})
}

// 批量删除练习
export function destroy(params: any) {
  return client.post(`/exam/api/practice/delete/batch`, params)
}

// 更新练习
export function update(id: number, params: any) {
  return client.put(`/exam/api/practice/update/${id}`, params)
}

export function userList(id: number, params: any) {
  return client.get(`/backend/addons/Paper/practice/${id}/users`, params)
}

export function userDel(id: number, params: any) {
  return client.post(
    `/backend/addons/Paper/practice/${id}/user/delete`,
    params,
  )
}

export function userAdd(id: number, params: any) {
  return client.post(
    `/backend/addons/Paper/practice/${id}/user/insert`,
    params,
  )
}

export function userProgress(id: number, ids: any) {
  return client.get(
    `/backend/addons/Paper/practice/${id}/user/${ids}/progress`,
    {},
  )
}

// 章节列表
export function chapterList(params: any) {
  return client.get(`/exam/api/practice/chapter/list`, params)
}

// export function chapterCreate() {
//   return client.get(`/backend/addons/Paper/practice_chapter/create`, {})
// }

// 批量删除章节
export function chaptersDestoryMulti(params: any) {
  return client.post(
    `/exam/api/practice/chapter/delete/batch`,
    params,
  )
}

// 新增章节
export function chaptersStore(params: any) {
  return client.post(`/exam/api/practice/chapter/add`, params)
}

// 根据id查找章节明细
export function chaptersDetail(id: number) {
  return client.get(`/exam/api/practice/chapter/getChapterById/${id}`, {})
}

// 更新章节
export function chaptersUpdate(id: number, params: any) {
  return client.post(`/exam/api/practice/chapter/update/${id}`, params)
}

export function questionList(id: number, params: any) {
  return client.get(
    `/backend/addons/Paper/practice_chapter/${id}/questions`,
    params,
  )
}

export function questionCreate(id: number, params: any) {
  return client.get(
    `/backend/addons/Paper/practice_chapter/${id}/questions/params`,
    params,
  )
}

export function questionDestoryMulti(id: number, params: any) {
  return client.post(
    `/backend/addons/Paper/practice_chapter/${id}/questions/delete`,
    params,
  )
}

export function questionStoreMulti(id: number, params: any) {
  return client.post(
    `/backend/addons/Paper/practice_chapter/${id}/questions`,
    params,
  )
}
