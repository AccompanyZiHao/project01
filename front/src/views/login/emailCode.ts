import { ref, reactive, computed } from 'vue'
import http from '@/util/http'

let timer = ref(0)

const sendEmailBtnText = computed(() => {
  if (timer.value <= 0) {
    return '获取邮件验证码'
  }
  return `${timer.value} s发送`
})
const sendEmailCode = async(email: string) => {
  const data: any = await http.get('/api/sendCode', { email })
  if(data?.code === 0){
    console.log('data.code :>> ', data.code);
  }

  timer.value = 10
  const timerId = setInterval(()=>{
    timer.value -=1
    if(timer.value === 0){
      clearInterval(timerId)
    }
  }, 1000)
}

export default {
  timer,
  sendEmailBtnText,
  sendEmailCode
}
