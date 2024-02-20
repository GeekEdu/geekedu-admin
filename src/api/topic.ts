import client from './internal/httpClient'

export function list(params: any) {
  return client.get(`/backend/addons/meedu_topics/topic/index`, params)
}

export function create() {
  return client.get(`/backend/addons/meedu_topics/topic/create`, {})
}

export function store(params: any) {
  return client.post('/backend/addons/meedu_topics/topic/create', params)
}

// 查看某个图文的详情
export function detail(id: number) {
  return client.get(`/backend/addons/meedu_topics/topic/${id}`, {})
}

export function destroy(id: number) {
  return client.destroy(`/backend/addons/meedu_topics/topic/${id}`)
}

export function update(id: number, params: any) {
  return client.put(`/backend/addons/meedu_topics/topic/${id}`, params)
}

export function comments(params: any) {
  return client.get(`/backend/addons/meedu_topics/comment`, params)
}

export function commentDestory(id: number) {
  return client.destroy(`/backend/addons/meedu_topics/comment/${id}`)
}

export function commentMulti(params: any) {
  return client.post(`/backend/addons/meedu_topics/comment/check`, params)
}

export function userList(id: number, params: any) {
  return client.get(`/backend/addons/meedu_topics/topic/${id}/users`, params)
}

export function order(params: any) {
  return client.get(`/backend/addons/meedu_topics/orders`, params)
}

export function userDel(params: any) {
  return client.post(`/backend/addons/meedu_topics/order/user/del`, params)
}

export function userAdd(params: any) {
  return client.post(`/backend/addons/meedu_topics/order/user/add`, params)
}

// 返回分类列表
export function categoryList(params: any) {
  return client.get(`/label/api/category/getCategoryList`, params)
}

// 根据id删除分类
export function categoryDestroy(id: number) {
  return client.post(`/label/api/category/delete/${id}`, {})
}

// 新增分类
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
