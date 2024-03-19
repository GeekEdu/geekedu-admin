/*
 * @Author: Poison02 2069820192@qq.com
 * @Date: 2024-01-19 22:53:24
 * @LastEditors: Poison02 2069820192@qq.com
 * @LastEditTime: 2024-03-19 13:20:12
 * @FilePath: /geekedu-admin/src/api/order.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import client from './internal/httpClient'

// 订单列表
export function list(params: any) {
  return client.get('/trade/api/order/list', params)
}

export function refund(id: number, params: any) {
  return client.post(`/backend/api/v1/order/${id}/refund`, params)
}

export function refundList(params: any) {
  return client.get('/backend/api/v1/order/refund/list', params)
}

export function refundDestroy(id: number) {
  return client.destroy(`/backend/api/v1/order/refund/${id}`)
}

// 订单详情
export function detail(id: string) {
  return client.get(`/trade/api/order/${id}/detail`, {})
}

export function setPaid(id: number) {
  return client.get(`/backend/api/v1/order/${id}/finish`, {})
}

export function rechargeOrders(params: any) {
  return client.get('/backend/addons/TemplateOne/recharge/orders', params)
}

export function withdrawOrders(params: any) {
  return client.get('/backend/addons/multi_level_share/withdraw/index', params)
}

export function withdrawOrdersSubmit(params: any) {
  return client.post(
    '/backend/addons/multi_level_share/withdraw/handle',
    params,
  )
}
