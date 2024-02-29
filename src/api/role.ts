import client from './internal/httpClient'

export function list() {
  return client.get('/user/api/member/vip/list', {})
}

export function store(params: any) {
  return client.post('/user/api/member/vip/add', params)
}

export function detail(id: number) {
  return client.get(`/user/api/member/vip/${id}`, {})
}

export function update(id: number, params: any) {
  return client.post(`/user/api/member/vip/update/${id}`, params)
}

export function destroy(id: number) {
  return client.post(`/user/api/member/vip/delete/${id}`, {})
}
