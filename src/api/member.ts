import client from './internal/httpClient'

// 返回学员列表
export function list(params: any) {
  return client.get('/user/api/member/list', params)
}

// vip列表
export function create(params: any) {
  return client.get('/backend/api/v1/member/create', params)
}

// 新增学员
export function store(params: any) {
  return client.post('/backend/api/v1/member', params)
}

// 根据id获取学员详情
export function edit(id: number) {
  return client.get(`/user/api/member/detail/${id}`, {})
}

// 更新学员
export function update(id: number, params: any) {
  return client.put(`/backend/api/v1/member/${id}`, params)
}

// 删除学员
export function destroy(id: number) {
  return client.destroy(`/backend/api/v2/member/${id}`)
}

export function editMulti(params: any) {
  return client.put(`/backend/api/v1/member/field/multi`, params)
}

export function sendMessageMulti(params: any) {
  return client.post('/backend/api/v1/member/message/multi', params)
}

export function sendMessage(id: number, params: any) {
  return client.post(`/backend/api/v1/member/${id}/message`, params)
}

export function userImport(params: any) {
  return client.post('/backend/api/v1/member/import', params)
}

// 学员详情
export function detail(id: number) {
  return client.get(`/backend/api/v1/member/${id}/detail`, {})
}

export function userOrders(id: number, params: any) {
  return client.get(`/backend/api/v1/member/${id}/detail/userOrders`, params)
}

export function userVodWatchRecords(params: any) {
  return client.get(`/backend/api/v2/member/courses`, params)
}

export function userVideoWatchRecords(params: any) {
  return client.get(`/backend/api/v2/member/course/progress`, params)
}

export function userVideos(params: any) {
  return client.get(`/backend/api/v2/member/videos`, params)
}

export function userInviteRecords(id: number, params: any) {
  return client.get(`/backend/api/v1/member/${id}/detail/userInvite`, params)
}

export function userCredit1(id: number, params: any) {
  return client.get(
    `/backend/api/v1/member/${id}/detail/credit1Records`,
    params,
  )
}

export function userBalanceRecords(params: any) {
  return client.get(
    `/backend/addons/multi_level_share/member/balanceRecords`,
    params,
  )
}

export function userIOSRecords(params: any) {
  return client.get(
    `/backend/addons/TemplateOne/member/credit2Records`,
    params,
  )
}

export function credit1Change(params: any) {
  return client.post(`/backend/api/v1/member/credit1/change`, params)
}

export function IOSRecharge(params: any) {
  return client.post(`/backend/addons/TemplateOne/member/recharge`, params)
}

export function tagRecharge(id: number, params: any) {
  return client.put(`/backend/api/v1/member/${id}/tags`, params)
}

// 学员标签列表展示
export function tagList(params: any) {
  return client.get(`/label/api/category/getCategoryPage`, params)
}

export function tagCreate() {
  return client.get(`/backend/api/v1/member/tag/create`, {})
}

// 新增分类
export function tagStore(params: any) {
  return client.post(`/label/api/category/add`, params)
}

// 根据id查看分类明细
export function tagDetail(params: any) {
  return client.get(`/label/api/category/getCategoryById/`, params)
}

// 更新分类
export function tagUpdate(id: number, params: any) {
  return client.post(`/label/api/category/update/${id}`, params)
}

// 删除分类
export function tagDestroy(id: number) {
  return client.post(`/label/api/category/delete/${id}`, {})
}

export function remarkUpdate(id: number, params: any) {
  return client.put(`/backend/api/v1/member/${id}/remark`, params)
}
