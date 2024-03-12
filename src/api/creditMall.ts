import client from './internal/httpClient'

// 返回积分商城列表
export function list(params: any) {
  return client.get('/trade/api/mall/list', params)
}

// 商品分类列表
export function create() {
  return client.get('/trade/api/mall/goods/types', {})
}

// 新建商品
export function store(params: any) {
  return client.post('/trade/api/mall/good/add', params)
}

// 商品明细
export function detail(id: number) {
  return client.get(`/trade/api/mall/good/${id}/detail`, {})
}

// 更新商品
export function update(id: number, params: any) {
  return client.post(`/trade/api/mall/good/${id}/update`, params)
}

// 根据id删除某个商品
export function destroy(id: number) {
  return client.post(`/trade/api/mall/good/${id}/delete`, {})
}

export function ordersList(params: any) {
  return client.get('/backend/addons/Credit1Mall/orders/index', params)
}

export function ordersDetail(id: number) {
  return client.get(`/backend/addons/Credit1Mall/orders/${id}`, {})
}

export function ordersUpdate(id: number, params: any) {
  return client.put(`/backend/addons/Credit1Mall/orders/${id}`, params)
}

export function ordersSend(id: number, params: any) {
  return client.post(`/backend/addons/Credit1Mall/orders/${id}/send`, params)
}
