/*
 * @Author: Poison02 2069820192@qq.com
 * @Date: 2024-01-19 22:53:24
 * @LastEditors: Poison02 2069820192@qq.com
 * @LastEditTime: 2024-03-16 15:59:35
 * @FilePath: /geekedu-admin/src/api/home.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import client from './internal/httpClient'

// dashboard信息
export function index() {
  return client.get('/system/api/dashboard', {})
}

// 系统信息
export function systemInfo() {
  return client.get('/system/api/version/info', {})
}

// dashboard 统计分析图表
export function statistic(params: any) {
  return client.get(`/system/api/dashboard/graph`, params)
}
