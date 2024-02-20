import client from './internal/httpClient'

// 返回问题列表
export function list(params: any) {
  return client.get('/ask/api/question/getQuestionPage', params)
}

// 返回问题分类列表
export function category(params: any) {
  return client.get('/label/api/category/getCategoryList', params)
}

// 批量删除问题
export function destroyMulti(params: any) {
  return client.post(`/ask/api/question/delete`, params)
}

// 获取某个问题的回答列表
export function answer(id: number) {
  return client.get(`/ask/api/question/${id}/answers`, {})
}

// 将某个回答设为最佳回答
export function setAnswer(questionId: number, answerId: number) {
  return client.get(
    `/ask/api/question/${questionId}/answer/select/${answerId}`,
    {},
  )
}

// 删除某个问题的回答
export function destoryAnswer(questionId: number, answerId: number) {
  return client.post(`/ask/api/question/${questionId}/answer/delete/${answerId}`, {})
}

// 获取某个回答的所有评论
export function comment(id: number) {
  return client.get(
    `/ask/api/answer/${id}/comments`,
    {},
  )
}

// 删除评论
export function destoryComment(answerId: number, commentsId: number) {
  return client.post(
    `/ask/api/answer/${answerId}/comments/delete/${commentsId}?type=ASK_QUESTION`,
    {},
  )
}

// 新建问答分类
export function storeCate(params: any) {
  return client.post(`/label/api/category/add`, params)
}

// 根据id删除问答分类
export function destroyCate(id: number) {
  return client.post(`/label/api/category/delete/${id}`, {})
}

// 根据id和type获取分类详情
export function detailCate(params: any) {
  return client.get(`/label/api/category/getCategoryById`, params)
}

// 更新分类
export function updateCate(id: number, params: any) {
  return client.post(`/label/api/category/update/${id}`, params)
}
