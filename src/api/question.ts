import client from './internal/httpClient'

// 返回题库列表数据
export function list(params: any) {
  return client.get(`/exam/api/questions/getQuestionsPage`, params)
}

// 返回题目数据中的类型、分类、等级
export function create() {
  return client.get(`/exam/api/questions/questionTypeList`, {})
}

export function store(params: any) {
  return client.post('/backend/addons/Paper/question/create', params)
}

export function detail(id: number) {
  return client.get(`/exam/api/questions/getQuestionById/${id}`, {})
}

export function destroyMulti(params: any) {
  return client.post(`/backend/addons/Paper/question/destroy/multi`, params)
}

export function update(id: number, params: any) {
  return client.put(`/backend/addons/Paper/question/${id}`, params)
}

export function importing(param: any) {
  return client.post('/exam/api/questions/import/add', param)
}

// 试题分类列表
export function categoryList(params: any) {
  return client.get(`/exam/api//questions/category/list`, params)
}

//
export function categoryCreate() {
  return client.get(`/backend/addons/Paper/question_category/create`, {})
}

// 根据id删除分类
export function categoryDestroy(id: number) {
  return client.post(`/exam/api/questions/category/delete/${id}?type=QUESTIONS`, {})
}

// 新建试题分类
export function categoryStore(params: any) {
  return client.post('/exam/api/questions/category/add', params)
}

// 根据id返回分类明细
export function categoryDetail(id: number, params: any) {
  return client.get(`/exam/api/questions/category/${id}`, params)
}

// 更新分类
export function categoryUpdate(id: number, params: any) {
  return client.post(`/exam/api/questions/category/update/${id}`, params)
}
