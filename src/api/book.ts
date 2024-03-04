import client from './internal/httpClient'

// 返回电子书列表
export function list(params: any) {
  return client.get(`/book/api/eBook/getEBookPage`, params)
}

// 电子书分类
export function create(params: any) {
  return client.get(`/book/api/eBook/category/list`, params)
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
  return client.get(`/book/api/eBook/comments`, params)
}

// 批量删除电子书评论
export function commentDestoryMulti(params: any) {
  return client.post(
    `/book/api/eBook/comment/delete/batch`,
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
  return client.get(`/book/api/eBook/category/list`, params)
}

// 根据id删除指定分类
export function categoryDestroy(id: number) {
  return client.post(`/book/api/eBook/category/delete/${id}`, {})
}

// 新增分类
export function categoryStore(params: any) {
  return client.post(
    '/book/api/eBook/category/add',
    params,
  )
}

// 根据id查看某一个分类
export function categoryDetail(id: number) {
  return client.get(`/book/api/eBook/category/${id}`, {})
}

// 根据id更新分类
export function categoryUpdate(id: number, params: any) {
  return client.post(`/book/api/eBook/category/update/${id}`, params)
}

// 返回文章列表
export function articleList(params: any) {
  return client.get(`/book/api/eBook/article/list`, params)
}

// 文章章节列表
export function articleCreate(params: any) {
  return client.get(`/book/api/eBook/chapter/list`, params)
}

// 根据id删除文章
export function articleDestroy(id: number) {
  return client.post(`/book/api/eBook/article/delete/${id}`, {})
}

// 新建文章
export function articleStore(params: any) {
  return client.post('/book/api/eBook/article/add', params)
}

// 根据id查看文章明细
export function articleDetail(id: number) {
  return client.get(`/book/api/eBook/getEBookArticleById/${id}`, {})
}

// 更新文章
export function articleUpdate(id: number, params: any) {
  return client.post(`/book/api/eBook/article/update/${id}`, params)
}

// 返回文章评论列表
export function articleComments(params: any) {
  return client.get(
    `/book/api/eBook/article/comments`,
    params,
  )
}

// 批量删除文章评论
export function articleCommentDestoryMulti(params: any) {
  return client.post(
    `/book/api/eBook/article/comment/delete/batch`,
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

// 根据id删除章节
export function chaptersDestroy(id: number) {
  return client.post(`/book/api/eBook/chapter/delete/${id}`, {})
}

// 新增章节
export function chaptersStore(params: any) {
  return client.post(`/book/api/eBook/chapter/add`, params)
}

// 根据id查看章节明细
export function chaptersDetail(id: number) {
  return client.get(`/book/api/eBook/chapter/${id}`, {})
}

// 更新章节
export function chaptersUpdate(id: number, params: any) {
  return client.post(`/book/api/eBook/chapter/update/${id}`, params)
}
