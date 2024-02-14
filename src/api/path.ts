import client from "./internal/httpClient";

export function list(params: any) {
  return client.get(`/backend/addons/LearningPaths/path/index`, params);
}

// 返回分类列表
export function create(params: any) {
  return client.get(`/label/api/category/getCategoryList`, params);
}

export function store(params: any) {
  return client.post("/backend/addons/LearningPaths/path/create", params);
}

export function detail(id: number) {
  return client.get(`/backend/addons/LearningPaths/path/${id}`, {});
}

export function update(id: number, params: any) {
  return client.put(`/backend/addons/LearningPaths/path/${id}`, params);
}

export function destroy(id: number) {
  return client.destroy(`/backend/addons/LearningPaths/path/${id}`);
}

export function users(id: number, params: any) {
  return client.get(`/backend/addons/LearningPaths/path/${id}/users`, params);
}

// 分页返回分类列表
export function categoryList(params: any) {
  return client.get(`/label/api/category/getCategoryPage`, params);
}

// 根据id删除分类
export function categoryDestroy(id: number) {
  return client.post(`/label/api/category/delete/${id}`, {});
}

// 新增分类
// export function categoryCreate(params: any) {
//   return client.get(`/label/api/category/add`, params);
// }

// 新增分类
export function categoryStore(params: any) {
  return client.post("/label/api/category/add", params);
}

// 根据id查看分类
export function categoryDetail(params: any) {
  return client.get(`/label/api/category/getCategoryById`, params);
}

// 更新分类
export function categoryUpdate(id: number, params: any) {
  return client.post(`/label/api/category/update/${id}`, params);
}

export function stepList(params: any) {
  return client.get(`/backend/addons/LearningPaths/v2/step/index`, params);
}

export function stepDestroy(id: number) {
  return client.destroy(`/backend/addons/LearningPaths/v2/step/${id}`);
}

export function stepCreate() {
  return client.get(`/backend/addons/LearningPaths/v2/step/create`, {});
}

export function stepStore(params: any) {
  return client.post("/backend/addons/LearningPaths/v2/step/create", params);
}

export function stepDetail(id: number) {
  return client.get(`/backend/addons/LearningPaths/v2/step/${id}`, {});
}

export function stepUpdate(id: number, params: any) {
  return client.put(`/backend/addons/LearningPaths/v2/step/${id}`, params);
}
