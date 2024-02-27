import client from './internal/httpClient'

// 条件分页查找试卷列表
export function list(params: any) {
  return client.get(`/exam/api/papers/getPapersPage`, params)
}

// 分类列表
export function create() {
  return client.get(`/exam/api/papers/sTag/list`, {})
}

export function store(params: any) {
  return client.post('/backend/addons/Paper/paper/create', params)
}

export function detail(id: number) {
  return client.get(`/backend/addons/Paper/paper/${id}`, {})
}

export function destroy(id: number) {
  return client.destroy(`/backend/addons/Paper/paper/${id}`)
}

export function update(id: number, params: any) {
  return client.put(`/backend/addons/Paper/paper/${id}`, params)
}

// 分类列表
export function categoryList(params: any) {
  return client.get(`/exam/api/papers/tag/list`, params)
}

export function categoryCreate() {
  return client.get(`/backend/addons/Paper/paper_category/create`, {})
}

// 删除分类
export function categoryDestroy(id: number) {
  return client.post(`/exam/api/papers/tag/delete/${id}`, {})
}

// 新增分类
export function categoryStore(params: any) {
  return client.post('/exam/api/papers/tag/add', params)
}

// 获取分类明细
export function categoryDetail(id: number) {
  return client.get(`/exam/api/papers/tag/getTagById/${id}`, {})
}

// 更新分类明细
export function categoryUpdate(id: number, params: any) {
  return client.post(`/exam/api/papers/tag/update/${id}`, params)
}

export function userPaper(id: number, params: any) {
  return client.get(`/backend/addons/Paper/paper/${id}/userPaper`, params)
}
export function stats(id: number, params: any) {
  return client.get(`/backend/addons/Paper/paper/${id}/statistics`, params)
}

export function userList(id: number, params: any) {
  return client.get(`/backend/addons/Paper/paper/${id}/user`, params)
}

export function userDel(id: number, ids: any) {
  return client.destroy(`/backend/addons/Paper/paper/${id}/user/${ids}`)
}

export function userAdd(id: number, params: any) {
  return client.post(`/backend/addons/Paper/paper/${id}/user`, params)
}

export function question(id: number, params: any) {
  return client.get(`/backend/addons/Paper/paper/${id}/questions`, params)
}

export function questionDestroy(id: number, ids: any) {
  return client.destroy(`/backend/addons/Paper/paper/${id}/questions/${ids}`)
}

export function questionDestoryMulti(id: number, params: any) {
  return client.post(
    `/backend/addons/Paper/paper/${id}/questions/deleteBatch`,
    params,
  )
}

export function questionList(id: number, params: any) {
  return client.get(`/backend/addons/Paper/paper/${id}/questions`, params)
}

export function questionStoreMulti(id: number, params: any) {
  return client.post(`/backend/addons/Paper/paper/${id}/questions`, params)
}

export function marking(id: number, ids: any, params: any) {
  return client.get(
    `/backend/addons/Paper/paper/${id}/userPaper/${ids}`,
    params,
  )
}

export function submitScore(param: any) {
  return client.post(
    `/backend/addons/Paper/paper/${param.id}/userPaper/${param.user_paper_id}`,
    param,
  )
}

export function paperJoinRecord(paperId: number, recordId: number) {
  return client.get(
    `/backend/addons/Paper/paper/${paperId}/userPaper/${recordId}/render`,
    {},
  )
}
