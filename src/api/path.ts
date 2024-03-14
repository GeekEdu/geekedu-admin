import client from './internal/httpClient'

// 学习路径列表
export function list(params: any) {
  return client.get(`/book/api/path/list`, params)
}

// 返回分类列表
export function create(params: any) {
  return client.get(`/label/api/category/getCategoryList`, params)
}

// 创建学习路径
export function store(params: any) {
  return client.post('/book/api/path/add', params)
}

// 学习路径详情
export function detail(id: number) {
  return client.get(`/book/api/path/${id}/detail`, {})
}

// 更新学习路径
export function update(id: number, params: any) {
  return client.post(`/book/api/path/${id}/update`, params)
}

// 删除学习路径
export function destroy(id: number) {
  return client.post(`/book/api/path/${id}/delete`, {})
}

export function users(id: number, params: any) {
  return client.get(`/backend/addons/LearningPaths/path/${id}/users`, params)
}

// 分页返回分类列表
export function categoryList(params: any) {
  return client.get(`/label/api/category/getCategoryPage`, params)
}

// 根据id删除分类
export function categoryDestroy(id: number) {
  return client.post(`/label/api/category/delete/${id}`, {})
}

// 新增分类
// export function categoryCreate(params: any) {
//   return client.get(`/label/api/category/add`, params);
// }

// 新增分类
export function categoryStore(params: any) {
  return client.post('/label/api/category/add', params)
}

// 根据id查看分类
export function categoryDetail(params: any) {
  return client.get(`/label/api/category/getCategoryById`, params)
}

// 更新分类
export function categoryUpdate(id: number, params: any) {
  return client.post(`/label/api/category/update/${id}`, params)
}

// 步骤列表
export function stepList(id: number) {
  return client.get(`/book/api/path/${id}/step/list`, {})
}

// 删除步骤
export function stepDestroy(id: number) {
  return client.post(`/book/api/path/step/${id}/delete`, {})
}

// export function stepCreate() {
//   return client.get(`/backend/addons/LearningPaths/v2/step/create`, {})
// }

// 新增步骤
export function stepStore(params: any) {
  return client.post('/book/api/path/step/add', params)
}

// 步骤详情
export function stepDetail(id: number) {
  return client.get(`/book/api/path/step/${id}/detail`, {})
}

// 更新步骤
export function stepUpdate(id: number, params: any) {
  return client.post(`/book/api/path/step/${id}/update`, params)
}
