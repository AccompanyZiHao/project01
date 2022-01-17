import http from '@/util/http'

interface uploadChunksType {
  name: string
  [propName: string]: any
}

export const uploadChunks = async (
  uploadedList: Array<string> = [],
  chunks: Array<uploadChunksType>,
  params
) => {
  const requests = chunks
    .filter((chunk) => uploadedList.indexOf(chunk.name) == -1)
    .map((chunk, index) => {
      // 转成promise
      const form = new FormData()
      form.append('chunk', chunk.chunk)
      form.append('hash', chunk.hash)
      form.append('name', chunk.name)
      // form.append('index',chunk.index)
      return { form, index: chunk.index, error: 0 }
    })
    .map(({ form, index }) =>
      http.post('/uploadfile', form, {
        onUploadProgress: (progress) => {
          // 每个区块有自己的进度条，整体的进度条需要计算
          chunks[index].progress = Number(((progress.loaded / progress.total) * 100).toFixed(2))
        }
      })
    )

  await Promise.all(requests)
  const ret = await http.post('/mergefile', params)
  const url = ret.data.url
  await http.put('/user/info', { url: '/api' + url })
}
