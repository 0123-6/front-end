# MediaRecorder

这是用来进行媒体录制的接口

# 构造函数

## MediaRecorder()

```js
// 相机流
let mediaStream = null
// 全局mediaRecorder
let mediaRecorder = null
// 保持Blob的数组
const recordedChunks = []

// 打开相机
async function openCamera() {
  if (mediaStream) {
		console.error('摄像头已打开')
		return
	}
  
  try {
    // navigator.mediaDevices.getUserMedia()返回Promise，
  	// 成功的话为一个MediaStream对象，
  	// 失败的话触发reject方法
    mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    })
    // 将视频流绑定到视频元素上
    const videoElement = document.getElementById('video')
    videoElement.srcObject = mediaStream
  } catch (e) {
    console.log(e)
  }
}

// 关闭相机
function closeCamera() {
  if (!mediaStream) {
    console.error('摄像机未打开，无需关闭')
    return
  }
  
  // 释放掉硬件资源
  mediaStream.getTracks().forEach(track => track.stop())
  // 将mediaStream指向null
  mediaStream = null
  // 重置video元素的srcObject
	const videoElement = document.getElementById('video')
	videoElement.srcObject = null
}

// 创建mediaRecorder对象
function createMediaRecorder() {
  
  // 构造函数
  // const mediaRecorder = new MediaRecorder(stream, options)
  // stream是将要录制的流，比如MediaStream，由navigator.mediaDevices.getUserMedia({audio:true,video:true})产生
  // options：可以配置mimeType，但是貌似只有video/webm有效
  
  // 定义一个MediaRecorder
  mediaRecorder = new MediaRecorder(mediaStream, {
    // 貌似只支持video/webm这一种格式
    mimeType: 'video/webm',
  })
  // 定义事件
  // 当有新数据时，可能是到了start(number)指定的间隔，或者调用了stop()方法
  mediaRecorder.ondataavailable = function (e) {
    console.log('新的有效数据来了')
		console.log('event.data: ', e.data)
    recordedChunks.push(e.data)
  }
  // stop回调函数
  mediaRecorder.onstop = function () {
    console.log('录制已停止')
    // 将录制的数据合并为一个Blob对象
    const blob = new Blob(recordedChunks, {
      // 这里只是告知Blob文件格式，而不是转换为想要的格式，不可以瞎写
      type: 'video/webm'
    })
    // 1. 创建一个下载链接
    const downloadLink = document.createElement('a')
    downloadLink.href = URL.createObjectURL(blob)
    downloadLink.download = '前端录制的视频.webm'
    downloadLink.click()
    // 2. 传递给后端
    const formData = new FormData()
    formData.append('name': '韩佩江')
    formData.append('age', '25')
    formData.append('video', blob)
    // 调用相关API
    // setUser(formData)
    
    // 释放mediaRecorder对象
    mediaRecorder = null
    // 清空recordedChunks
    recordedChunks.length = 0
  }
}

// 开始录制
function beginRecord() {
  // 需要有相机的访问权
  if (!mediaStream) {
    console.error('摄像机未打开，请先打开摄像机')
    return
  }
  if (mediaRecorder) {
    console.error('正在录制中，不可重复点击')
    return
  }
  
  createMediaRecorder()
  // 开始录制
  nediaRecorder.start(1000)
  console.log('开始录制~')
}

// 停止录制函数,但相关逻辑需要在onstop回调函数中定义，因为此时还有缓冲区内容待放入recordedChunks，
// 不能直接进行发送等操作
function stopRecord() {
  if (!mediaRecorder) {
    console.error('录像机不存在，或已停止')
    return
  }
  
  mediaRecorder.stop()
  console.log('录制发送了停止指令')
}
```

# 属性

# 方法

# 事件

















































