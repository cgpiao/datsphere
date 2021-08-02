import axios from 'axios'
import {LS_TOKEN} from "./constants";

let instance = axios.create({
   baseURL: process.env.VUE_APP_API_HOST,
   timeout: 15000,
   headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      'x-platform': 'WEB',
   }
})
instance.interceptors.request.use((config) => {
   const token = localStorage.getItem(LS_TOKEN)
   if (config.data && config.data.constructor && 'FormData' === config.data.constructor.name) {
      config.headers['Content-Type'] = 'multipart/form-data'
   } else if (config.url.endsWith('download')) {
      config.responseType = 'blob'
   }
   if (token)
      config.headers['Authorization'] = 'Bearer ' + token
   return config
})

instance.interceptors.response.use((response) => {
   return response;
}, (error) => {
   if (error.response && error.response.status === 401) {
      localStorage.clear()
      window.location.href = '/'
   } else {
      return Promise.reject(error);
   }
});

export default instance
