const blobToString = (blob) => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = function () {
      // console.log('reader ==>', reader.result)
      const res = reader.result
        .split('')
        .map((v: any) => v.charCodeAt()) // 转码
        .map((v: any) => v.toString(16).toUpperCase()) // 转为 16 进制
        .map((v: any) => v.padStart(2, '0')) // 字符串填充
        .join('')
      resolve(res)
      // const ret = reader.
    }
    reader.readAsBinaryString(blob)
  })
}

const isGif = async (file): Promise<boolean> => {
  // GIF89a 和GIF87a
  // 前面6个16进制，'47 49 46 38 39 61' '47 49 46 38 37 61'
  const res = await blobToString(file.slice(0, 6))
  const isGif = res == '47 49 46 38 39 61' || res == '47 49 46 38 37 61'
  return isGif
}

const isPng = async (file): Promise<boolean> => {
  const res = await blobToString(file.slice(0, 8))
  const isPng = res == '89 50 4E 47 0D 0A 1A 0A'
  return isPng
}

const isJpg = async (file): Promise<boolean> => {
  const len: number = file.size
  const start = await blobToString(file.slice(0, 2))
  const tail = await blobToString(file.slice(-2, len))
  // const isJpg = start == 'FF D8' && tail == 'FF D9'
  // 判断尾部的这个還是有点问题
  const isJpg = start == 'FFD8'
  return isJpg
}
export const isImage = async (file) => {
  return (await isGif(file)) || (await isPng(file)) || (await isJpg(file))
}
