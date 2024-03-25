import client from './internal/httpClient'

// 证书列表
export function list(params: any) {
  return client.get('/user/api/certificate/list', params)
}

export function create(params: any) {
  return client.get('/user/api/certificate/', params)
}

// 创建证书
export function store(params: any) {
  return client.post('/user/api/certificate/add', params)
}

// 证书详情
export function detail(id: number) {
  return client.get(`/user/api/certificate/${id}/detail`, {})
}

// 更新证书
export function update(id: number, params: any) {
  return client.post(`/user/api/certificate/${id}/update`, params)
}

// 删除证书
export function destroy(id: number) {
  return client.post(`/user/api/certificate/${id}/delete`, {})
}

export function userList(id: number, params: any) {
  return client.get(`/backend/addons/Cert/cert/${id}/users`, params)
}

export function userImport(id: number, params: any) {
  return client.post(`/backend/addons/Cert/cert/${id}/user/import`, params)
}

export function userDelete(id: number, params: any) {
  return client.post(`/backend/addons/Cert/cert/${id}/user/destroy`, params)
}
