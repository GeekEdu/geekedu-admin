import client from "./internal/httpClient";

export function index() {
  return client.get("/system/api/dashboard", {});
}

export function systemInfo() {
  return client.get("/system/api/version/info", {});
}

export function statistic(params: any) {
  return client.get(`/system/api/dashboard/graph`, params);
}
