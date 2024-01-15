import client from "./internal/httpClient";

export function index() {
  return client.get("/backend/api/v1/dashboard", {});
}

export function systemInfo() {
  return client.get("/system/api/version/info", {});
}

export function statistic(params: any) {
  return client.get(`/backend/api/v1/dashboard/graph`, params);
}
