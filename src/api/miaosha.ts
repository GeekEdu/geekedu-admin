import client from './internal/httpClient'

// 秒杀列表
export function list(params: any) {
  return client.get('/trade/api/seckill/list', params)
}

export function create(params: any) {
  return client.get('/trade/api/seckill/', params)
}

// 新增秒杀
export function store(params: any) {
  return client.post('/trade/api/seckill/add', params)
}

// 秒杀详情
export function detail(id: number) {
  return client.get(`/trade/api/seckill/${id}/detail`, {})
}

// 更新秒杀
export function update(id: number, params: any) {
  return client.post(`/trade/api/seckill/${id}/update`, params)
}

// 删除秒杀
export function destroy(id: number) {
  return client.post(`/trade/api/seckill/${id}/delete`, {})
}

export function ordersList(params: any) {
  return client.get('/backend/addons/MiaoSha/orders/index', params)
}
