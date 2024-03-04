import client from './internal/httpClient'

// 返回图文列表
export function list(params: any) {
  return client.get(`/book/api/imageText/getImageTextPageCondition`, params)
}

// 返回图文分类列表
export function create(params: any) {
  return client.get(`/book/api/imageText/category/list`, params)
}

// 新增图文
export function store(params: any) {
  return client.post('/book/api/imageText/add', params)
}

// 查看某个图文的详情
export function detail(id: number) {
  return client.get(`/book/api/imageText/getImageTextById/${id}`, {})
}

// 根据id删除图文
export function destroy(id: number) {
  return client.post(`/book/api/imageText/delete/${id}`, {})
}

// 根据id更新图文
export function update(id: number, params: any) {
  return client.post(`/book/api/imageText/update/${id}`, params)
}

// 返回图文评论列表
export function comments(params: any) {
  return client.get(`/book/api/imageText/comments`, params)
}

// 根据id删除图文评论
export function commentDestory(id: number) {
  return client.post(`/book/api/imageText/comment/delete/${id}?cType=IMAGE_TEXT`, {})
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
export function categoryList() {
  return client.get(`/book/api/imageText/category/list`, {})
}

// 根据id删除分类
export function categoryDestroy(id: number) {
  return client.post(`/book/api/imageText/category/delete/${id}`, {})
}

// 新增分类
export function categoryStore(params: any) {
  return client.post('/book/api/imageText/category/add', params)
}

// 根据id查看某一个分类
export function categoryDetail(id: number) {
  return client.get(`/book/api/imageText/category/${id}`, {})
}

// 根据id更新分类
export function categoryUpdate(id: number, params: any) {
  return client.post(`/book/api/imageText/category/update/${id}`, params)
}
