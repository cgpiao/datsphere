import httpClient from "./httpClient";
import {AxiosResponse} from "axios";

const account = {
   show: () => httpClient.get<AxiosResponse<string>>("/account"),
   login: (data) => httpClient.post<AxiosResponse<string>>("/login", data),
   register: (data) => httpClient.post<AxiosResponse<string>>("/register", data),
   forgotPassword: (data) => httpClient.post<AxiosResponse<string>>("/forgot-password", data),
   resetPassword: (data) => httpClient.post<AxiosResponse<string>>("/reset-password", data),
   changePassword: (data) => httpClient.post<AxiosResponse<string>>("/change-password", data),
}

const codes = {
   send: data => httpClient.post<AxiosResponse<string>>("/codes/send", data)
}

const files = {
   index: (queries) => httpClient.get('files',  { params: queries }),
   create: (data) => httpClient.post('files', data),
   update: (id, data) => httpClient.put(`files/${id}`, data),
   show: id => httpClient.get(`files/${id}`),
   upload: form => httpClient.post('upload', form),
   download: id => httpClient.get(`files/${id}/download`),
   back: (id, payload) => httpClient.post(`files/${id}/back`, payload),
   clear: (id, payload) => httpClient.post(`files/${id}/clear`, payload),
   delete: id => httpClient.delete(`files/${id}`),
   rename: (id, data) => httpClient.post(`files/${id}/rename`, data),
}

const hashes = {
   pin: (cid, data) => httpClient.post(`hashes/${cid}/pin`, data)
}

export default {
   account,
   files,
   codes,
   hashes,
}
