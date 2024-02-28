import client from './internal/httpClient'

// 模拟考详情
export function list(params: any) {
  return client.get(`/exam/api/mock/list`, params)
}

export function create(params: any) {
  return client.get(`/exam/api/mock/tag/list`, params)
}

// 新增模拟考
export function store(params: any) {
  return client.post('/exam/api/mock/add', params)
}

// 根据id查看模拟考详情
export function detail(id: number) {
  return client.get(`/exam/api/mock/getMockById/${id}`, {})
}

// 根据id删除模拟考
export function destroy(id: number) {
  return client.destroy(`/exam/api/mock/delete/${id}`)
}

// 更新模拟考
export function update(id: number, params: any) {
  return client.put(`/exam/api/mock/update/${id}`, params)
}

export function userPaper(id: number, params: any) {
  return client.get(`/backend/addons/Paper/mock_paper/${id}/records`, params)
}

export function stats(id: number, params: any) {
  return client.get(
    `/backend/addons/Paper/mock_paper/${id}/statistics`,
    params,
  )
}

export function userList(id: number, params: any) {
  return client.get(`/backend/addons/Paper/mock_paper/${id}/users`, params)
}

export function userDel(id: number, params: any) {
  return client.post(
    `/backend/addons/Paper/mock_paper/${id}/user/delete`,
    params,
  )
}

export function userAdd(id: number, params: any) {
  return client.post(
    `/backend/addons/Paper/mock_paper/${id}/user/insert`,
    params,
  )
}

export function mockPaperJoinRecord(paperId: number, recordId: number) {
  return client.get(
    `/backend/addons/Paper/mock_paper/${paperId}/userPaper/${recordId}`,
    {},
  )
}
