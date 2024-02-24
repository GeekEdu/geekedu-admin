import client from './internal/httpClient'

// 返回电子书列表
export function list(params: any) {
  return client.get(`/book/api/eBook/getEBookPage`, params)
}

// 电子书分类
export function create(params: any) {
  return client.get(`/label/api/category/getCategoryList`, params)
}

// 新建电子书
export function store(params: any) {
  return client.post('/book/api/eBook/add', params)
}

// 根据id查看电子书明细
export function detail(id: number) {
  return client.get(`/book/api/eBook/getEBookById/${id}`, {})
}

// 根据id删除电子书
export function destroy(id: number) {
  return client.post(`/book/api/eBook/delete/${id}`, {})
}

// 更新电子书
export function update(id: number, params: any) {
  return client.post(`/book/api/eBook/update/${id}`, params)
}

// 返回电子书评论列表
export function comments(params: any) {
  return client.get(`/ask/api/comments/getCommentsPage`, params)
}

// 批量删除电子书评论
export function commentDestoryMulti(params: any) {
  return client.post(
    `/ask/api/comments/deleteBatch`,
    params,
  )
}

export function commentMulti(params: any) {
  return client.post(
    `/backend/addons/meedu_books/book_comment/checked`,
    params,
  )
}

// 返回电子书分类列表
export function categoryList(params: any) {
  return client.get(`/label/api/category/getCategoryList`, params)
}

// 根据id删除指定电子书
export function categoryDestroy(id: number) {
  return client.post(`/label/api/category/delete/${id}`, {})
}

// 新增分类
export function categoryStore(params: any) {
  return client.post(
    '/label/api/category/add',
    params,
  )
}

// 根据id查看某一个分类
export function categoryDetail(params: any) {
  return client.get(`/label/api/category/getCategoryById`, params)
}

// 根据id更新分类
export function categoryUpdate(id: number, params: any) {
  return client.post(`/label/api/category/update/${id}`, params)
}

// 返回文章列表
export function articleList(params: any) {
  return client.get(`/book/api/eBook/article/list`, params)
}

export function articleCreate(params: any) {
  return client.get(`/backend/addons/meedu_books/book_article/create`, params)
}

export function articleDestroy(id: number) {
  return client.destroy(`/backend/addons/meedu_books/book_article/${id}`)
}

export function articleStore(params: any) {
  return client.post('/backend/addons/meedu_books/book_article/create', params)
}

export function articleDetail(id: number) {
  return client.get(`/backend/addons/meedu_books/book_article/${id}`, {})
}

export function articleUpdate(id: number, params: any) {
  return client.put(`/backend/addons/meedu_books/book_article/${id}`, params)
}

// 返回文章评论列表
export function articleComments(params: any) {
  return client.get(
    `/ask/api/comments/getCommentsPage`,
    params,
  )
}

// 批量删除文章评论
export function articleCommentDestoryMulti(params: any) {
  return client.post(
    `/ask/api/comments/delete/batch`,
    params,
  )
}

export function articleCommentMulti(params: any) {
  return client.post(
    `/backend/addons/meedu_books/article_comment/checked`,
    params,
  )
}

export function userList(id: number, params: any) {
  return client.get(`/backend/addons/meedu_books/book/${id}/users`, params)
}

export function userDel(id: number, params: any) {
  return client.post(`/backend/addons/meedu_books/book/${id}/user/del`, params)
}

export function userAdd(id: number, params: any) {
  return client.post(`/backend/addons/meedu_books/book/${id}/user/add`, params)
}

// 返回章节列表
export function chaptersList(params: any) {
  return client.get(`/book/api/eBook/chapter/list`, params)
}

export function chaptersDestroy(id: number) {
  return client.destroy(`/backend/addons/meedu_books/book_chapter/${id}`)
}

export function chaptersStore(params: any) {
  return client.post(`/backend/addons/meedu_books/book_chapter/create`, params)
}

export function chaptersDetail(id: number) {
  return client.get(`/backend/addons/meedu_books/book_chapter/${id}`, {})
}

export function chaptersUpdate(id: number, params: any) {
  return client.put(`/backend/addons/meedu_books/book_chapter/${id}`, params)
}
