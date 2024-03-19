import client from './internal/httpClient'

// 优惠码列表
export function list(params: any) {
  return client.get('/trade/api/coupon/list', params)
}

// 批量删除优惠码
export function destroyMulti(params: any) {
  return client.post('/backend/api/v1/promoCode/delete/multi', params)
}

// 创建优惠码
export function create(params: any) {
  return client.post('/trade/api/coupon/add', params)
}

// 批量创建优惠码
export function createMulti(params: any) {
  return client.post('/backend/api/v1/promoCode/generator', params)
}

// 导入优惠码
export function importCode(params: any) {
  return client.post('/backend/api/v1/promoCode/import', params)
}
