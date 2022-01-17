import http from '@/util/http'
import { ref } from 'vue'
import { isImage } from './checkPictureType'
import { calculateHashIdle, calculateHashWorker, calculateHashSample } from './calculateHash'
import { ElMessage } from 'element-plus'
import { uploadChunks } from './uploadChunk'
interface paramsType {
  hash: any
  ext: string
  size: number
}

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

let file: any = ref('')
const handleFileChange = (e) => {
  // 上传多个文件这里获取有点问题，只能上传单个的
  const files = e.target.files[0]
  // console.log('files :>> ', files)
  if (!files) return
  file.value = files
}

const CHUNK_SIZE = 0.01 * 1024 * 1024 // 0.01 M

const createFileChunk = (file: any, size: number = CHUNK_SIZE) => {
  const chunks = []
  let cur = 0
  while (cur < file.value.size) {
    chunks.push({ index: cur, file: file.value.slice(cur, cur + size) })
    cur += size
  }
  console.log('chunks :>> ', chunks)
  return chunks
}

let uploadProgress = ref(0)
let hashProgress = ref(0)
const uploadFile = async () => {
  // if (!(await isImage(file.value))) {
  //   ElMessage.warning('图片格式不正确！')
  //   return
  // }
  let chunks = createFileChunk(file)
  const hash = await calculateHashIdle(chunks, hashProgress)
  console.log('hash :>> ', hash)
  const hash2 = await calculateHashWorker(chunks, hashProgress)
  console.log('hash2 :>> ', hash2)
  const hash3 = await calculateHashSample(file, hashProgress)
  console.log('hash3 :>> ', hash3)

  const ext = file.value.name.split('.').pop()
  // 文件是否上传过，如果没有，是否有存在的切片
  const {
    data: { uploaded, uploadedList }
  } = await http.post('/checkfile', {
    hash,
    ext
  })
  if (uploaded) {
    // 秒传
    return ElMessage.success('秒传成功')
  }

  chunks = chunks.map((chunk, index) => {
    // 切片的名字 hash+index
    const name = hash + '-' + index
    return {
      hash,
      name,
      index,
      chunk: chunk.file,
      // 设置进度条，已经上传的，设为100
      progress: uploadedList.indexOf(name) > -1 ? 100 : 0
    }
  })
  const params: paramsType = {
    hash,
    ext,
    size: CHUNK_SIZE
  }
  await uploadChunks(chunks, uploadedList, params)
  // 完整的文件上传
  // const form = new FormData()
  // form.append('name', 'file')
  // form.append('files', file.value)
  // const result: any = await http.post('api/uploadFile', form, {
  //   onUploadProgress: ({ loaded, total }) => {
  //     uploadProgress.value = Number(((loaded / total) * 100).toFixed(2))
  //   }
  // })
  // if (result.code === 0) {
  //   ElMessage.success('上传成功！')
  // }
}
export const upload = () => {
  return {
    file,
    uploadFile,
    hashProgress,
    uploadProgress,
    handleFileChange
  }
}
