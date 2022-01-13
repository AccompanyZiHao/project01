import http from '@/util/http'
import { ref } from 'vue'
import { isImage } from './checkPictureType'
import { ElMessage } from 'element-plus'

// 绑定事件
export const bindEvents = (dragDom, file) => {
  const drag = dragDom.value
  drag.addEventListener('dragover', (e) => {
    drag.style.borderColor = 'red'
    e.preventDefault()
  })
  drag.addEventListener('dragleave', (e) => {
    drag.style.borderColor = '#eee'
    e.preventDefault()
  })
  drag.addEventListener('drop', (e) => {
    const fileList = e.dataTransfer.files
    // console.log('fileList :>> ', fileList)
    drag.style.borderColor = '#eee'
    file.value = fileList[0]
    e.preventDefault()
  })
}

let file = ref('')
const handleFileChange = (e) => {
  // 上传多个文件这里获取有点问题，只能上传单个的
  const files = e.target.files[0]
  // console.log('files :>> ', files)
  if (!files) return
  file.value = files
}

let uploadProgress = ref(0)
const uploadFile = async () => {
  if (!await isImage(file.value)) {
    ElMessage.warning('图片格式不正确！')
    return
  }

  const form = new FormData()
  form.append('name', 'file')
  form.append('files', file.value)
  const result: any = await http.post('api/uploadFile', form, {
    onUploadProgress: ({ loaded, total }) => {
      uploadProgress.value = Number(((loaded / total) * 100).toFixed(2))
    }
  })
  if (result.code === 0) {
    ElMessage.success('上传成功！')
  }
}
export const upload = () => {
  return {
    file,
    uploadFile,
    uploadProgress,
    handleFileChange,
  }
}
