import qs from 'qs'
import axiosInit from './axios'

const { service } = axiosInit
export default {
  get(url: string, params: any) {
    return service({
      url,
      params,
      method: 'GET'
    })
  },
  post(url: string, params: any) {
    // "Content-Type": "application/x-www-form-urlencoded"
    return service({
      url,
      data: params,
      method: 'POST'
    })
  },
  postJSON(url: string, params: any) {
    // "Content-Type": "application/x-www-form-urlencoded"
    // const merchantId='b46121'
    // const secretKey= '850060741842313217'
    return service.post(url, {
      ...params
    })
  }
}
