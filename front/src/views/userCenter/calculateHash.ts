import sparkMD5 from 'spark-md5'
interface chunksType {
  index: number
  file: any
}
// 使用 webwork
export const calculateHashWorker = async (chunks: Array<chunksType>, hashProgress: any) => {
  return new Promise((resolve) => {
    // 这里使用 @ 会找不到资源文件
    const worker = new Worker('/hash/index.js')
    worker.postMessage({ chunks })
    worker.onmessage = (e) => {
      const { progress, hash } = e.data
      hashProgress.value = Number(progress.toFixed(2))
      if (hash) {
        resolve(hash)
      }
    }
  })
}
// 借鉴 fiber 利用 requestIdleCallback
export const calculateHashIdle = async (chunks: Array<chunksType>, hashProgress: any) => {
  return new Promise((resolve) => {
    const spark = new sparkMD5.ArrayBuffer()
    let count = 0
    const appendToSpark = async (file: any) => {
      return new Promise((resolve): void => {
        const reader = new FileReader()
        reader.readAsArrayBuffer(file)
        reader.onload = (e) => {
          spark.append(e.target.result)
          resolve()
        }
      })
    }

    const workLoop = async (deadline) => {
      // timeRemaining 获取当前帧的剩余时间
      while (count < chunks.length && deadline.timeRemaining() > 1) {
        // 空闲时间，且有任务
        await appendToSpark(chunks[count].file)
        count++
        if (count < chunks.length) {
          hashProgress.value = Number(((100 * count) / chunks.length).toFixed(2))
        } else {
          hashProgress.value = 100
          resolve(spark.end())
        }
      }
      window.requestIdleCallback(workLoop)
    }
    window.requestIdleCallback(workLoop)
  })
}

// 两个hash配合
// 抽样hash 不算全量
export const calculateHashSample = async (file: any, hashProgress: any) => {
  // 布隆过滤器  判断一个数据存在与否 损失一小部分的精度，换取效率
  // 1个G的文件，抽样后5M以内
  // hash一样，文件不一定一样
  // hash不一样，文件一定不一样
  return new Promise((resolve) => {
    const size = file.value.size
    const offset = 2 * 1024 * 1024 // 2M
    // 第一个2M，最后一个区块数据全要
    // 中间的去前后两个字节
    let chunks = [file.value.slice(0, offset)]

    let cur = offset
    while (cur < size) {
      if (cur + offset >= size) {
        // 最后一个区块
        chunks.push(file.value.slice(cur, cur + offset))
      } else {
        // 中间的区块
        const mid = cur + offset / 2
        const end = cur + offset
        chunks.push(file.value.slice(cur, cur + 2))
        chunks.push(file.value.slice(mid, mid + 2))
        chunks.push(file.value.slice(end - 2, end))
      }
      cur += offset
    }

    const spark = new sparkMD5.ArrayBuffer()
    const reader = new FileReader()
    // 中间的，取前中后各2各字节
    reader.readAsArrayBuffer(new Blob(chunks))
    reader.onload = (e) => {
      spark.append(e.target.result)
      hashProgress.value = 100
      resolve(spark.end())
    }
  })
}
