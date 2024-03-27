/*
 * @Author: Poison02 2069820192@qq.com
 * @Date: 2024-01-19 22:53:24
 * @LastEditors: Poison02 2069820192@qq.com
 * @LastEditTime: 2024-03-27 20:42:11
 * @FilePath: /geekedu-admin/src/api/stats.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import client from './internal/httpClient'

export function transactionList(params: any) {
  return client.get('/backend/api/v2/stats/transaction', params)
}

export function transactionGraph(params: any) {
  return client.get('/backend/api/v2/stats/transaction-graph', params)
}

// 商品销售top10数据
export function contentList(params: any) {
  return client.get('/trade/api/order/stat/sellCountTop', params)
}

export function memberList(params: any) {
  return client.get('/backend/api/v2/stats/user', params)
}

export function userGraph(params: any) {
  return client.get('/backend/api/v2/stats/user-graph', params)
}

export function userTops(params: any) {
  return client.get(`/backend/api/v2/stats/user-paid-top`, params)
}
