import moment from 'moment'

declare const window: any

// 从localstorage中拿到token
export function getToken(): string {
  return window.localStorage.getItem('geekedu-admin-token') || ''
}

// 在localstorage中存token
export function setToken(token: string) {
  window.localStorage.setItem('geekedu-admin-token', token)
}

// 清除token
export function clearToken() {
  window.localStorage.removeItem('geekedu-admin-token')
}

// 日期格式化
export function dateFormat(dateStr: string) {
  if (!dateStr)
    return ''

  return moment(dateStr).format('YYYY-MM-DD HH:mm')
}

export function dateWholeFormat(dateStr: string) {
  if (!dateStr)
    return ''

  return moment(dateStr).format('YYYY-MM-DD HH:mm:ss')
}

export function yearFormat(dateStr: string) {
  if (!dateStr)
    return ''

  return moment(dateStr).format('YYYY-MM-DD')
}

// 生成uuid
export function generateUUID(): string {
  let guid = ''
  for (let i = 1; i <= 32; i++) {
    const n = Math.floor(Math.random() * 16.0).toString(16)
    guid += n
    if (i === 8 || i === 12 || i === 16 || i === 20)
      guid += '-'
  }
  return guid
}

export function transformBase64ToBlob(
  base64: string,
  mime: string,
  filename: string,
): File {
  const arr = base64.split(',')
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--)
    u8arr[n] = bstr.charCodeAt(n)

  return new File([u8arr], filename, { type: mime })
}

export function getHost() {
  return `${window.location.protocol}//${window.location.host}/`
}

export function inStrArray(array: string[], value: string): boolean {
  for (let i = 0; i < array.length; i++) {
    if (array[i] === value)
      return true
  }
  return false
}

// 校验url
export function checkUrl(value: any) {
  let url = value
  const str = url.substr(url.length - 1, 1)
  if (str !== '/')
    url = `${url}/`

  return url
}

// 密码校验
export function passwordRules(value: any) {
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{12,25}$/
  const result = re.test(value)
  if (!result)
    return '密码至少包含大写字母，小写字母，数字，且不少于12位'
}

export function getUrl() {
  return `${window.location.protocol}//${window.location.host}`
}

export function saveEditorKey(key: string) {
  window.localStorage.setItem('geekedu-editor-key', key)
}

export function getEditorKey() {
  return window.localStorage.getItem('geekedu-editor-key')
}

export function codeRender(el: any) {
  if (!el)
    return

  const blocks = el.querySelectorAll('pre') || el.querySelectorAll('code')
  blocks.forEach((block: any) => {
    window.hljs.highlightBlock(block)
  })
  return el
}

export function latexRender(el: any) {
  if (!el)
    return

  const reg1 = new RegExp('&nbsp;', 'g')
  const reg2 = new RegExp('&amp;', 'g')
  const reg3 = new RegExp('nbsp;', 'g')
  const reg4 = new RegExp('amp;', 'g')
  el.innerHTML = el.innerHTML.replace(reg1, '')
  el.innerHTML = el.innerHTML.replace(reg2, '&')
  el.innerHTML = el.innerHTML.replace(reg3, '')
  el.innerHTML = el.innerHTML.replace(reg4, '')
  window.renderMathInElement(el, {
    delimiters: [
      { left: '$$', right: '$$', display: true },
      { left: '$', right: '$', display: false },
      { left: '\\(', right: '\\)', display: false },
      { left: '\\[', right: '\\]', display: true },
    ],
    macros: {
      '\\ge': '\\geqslant',
      '\\le': '\\leqslant',
      '\\geq': '\\geqslant',
      '\\leq': '\\leqslant',
    },
    options: {
      skipHtmlTags: ['noscript', 'style', 'textarea', 'pre', 'code'],
      // 跳过mathjax处理的元素的类名，任何元素指定一个类 tex2jax_ignore 将被跳过，多个累=类名'class1|class2'
      ignoreHtmlClass: 'tex2jax_ignore',
    },
    svg: {
      fontCache: 'global',
    },
    throwOnError: false,
  })

  return el
}

export function parseVideo(file: File): Promise<VideoParseInfo> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.muted = true
    video.setAttribute('src', URL.createObjectURL(file))
    video.setAttribute('autoplay', 'autoplay')
    video.setAttribute('crossOrigin', 'anonymous') // 设置跨域 否则toDataURL导出图片失败
    video.setAttribute('width', '400') // 设置大小，如果不设置，下面的canvas就要按需设置
    video.setAttribute('height', '300')
    video.currentTime = 7 // 视频时长，一定要设置，不然大概率白屏
    video.addEventListener('loadeddata', () => {
      const canvas = document.createElement('canvas')
      const width = video.width // canvas的尺寸和图片一样
      const height = video.height
      canvas.width = width // 画布大小，默认为视频宽高
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx)
        return reject('无法捕获视频帧')

      ctx.drawImage(video, 0, 0, width, height) // 绘制canvas
      const dataURL = canvas.toDataURL('image/png') // 转换为base64
      video.remove()
      const info: VideoParseInfo = {
        poster: dataURL,
        duration: Number.parseInt(`${video.duration}`),
      }
      return resolve(info)
    })
  })
}
export function wechatUrlRules(url: string) {
  if (
    !url.substring(0, 8).match('https://')
    && !url.substring(0, 7).match('http://')
  )
    return '地址必须携带http://或https://协议'
}
