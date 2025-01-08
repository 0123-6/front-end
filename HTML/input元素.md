# input元素

通过使用文件API，web可以要求用户选择本地文件，然后读取这些文件的内容。这种选择可以通过2种方式实现

- \<input type="file"\>标签
- 拖放操作

```html
<body>
  <input type="file" id="file" onchange="handleChange(event)"/>
  
  <script>
    function handleChange(event) {
			console.log('event', event.target.files)
			formData.append('file', event.target.files[0])
			// debugger
			fetch('https://mock.apifox.com/m1/1998724-1718330-default/file', {
				method: 'POST',
				body: formData
			}).then(response => response.json())
				.then(data => {
					debugger
					console.log('data: ', data) 
				})
		}
  </script>
</body>
```

当我们使用FormData时，HTTP的请求头会自动设置Content-Type: multipart/form-data

# input常用属性

- type：表明类型，type="file",表示读取文件
- multiple 可以选择多个文件
- accept 以逗号分隔，表示接收的类型，如image/\*,video/\*,text/\*,*/\*,

## 唯一文件类型说明符

**唯一文件类型说明符**是一个字符串，表示在 `file` 类型的 [`input`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/input) 元素中用户可以选择的文件类型。每个唯一文件类型说明符可以采用下列形式之一：

- 一个以英文句号（“.”）开头的合法的不区分大小写的文件名扩展名。例如：`.jpg`、`.pdf` 或 `.doc`。
- 一个不带扩展名的 MIME 类型字符串。
- 字符串 `audio/*`，表示“任何音频文件”。
- 字符串 `video/*`，表示“任何视频文件”。
- 字符串 `image/*`，表示“任何图片文件”。

`accept` 属性的值是包含一个或多个（用逗号分隔）唯一文件类型说明符的字符串。例如，一个文件选择器需要能被表示成一张图片的内容，包括标准的图片格式和 PDF 文件，大概是这样的：

```html
<input type="file" accept="image/*,.pdf" />
```

# 2种方式实现

默认的input type=file样式很丑，我们自定义实现

公共方法

```js
function showFile(file) {
	const fileType = file.type
	if (/^image\//.test(fileType)) {
		const imgElement = document.getElementById('img')
		imgElement.src = URL.createObjectURL(file)
	} else if (/^video\//.test(fileType)) {
		const videoElement = document.getElementById('video')
		videoElement.src = URL.createObjectURL(file)
	}
}

async function setUser(file) {
  showFile(file)
	const formData = new FormData()
	formData.append('name', '夏翀')
	formData.append('age', 25)
	formData.append('file', file)
	try {
		const response = await fetch('https://mock.apifox.com/m1/1998724-1718330-default/file', {
			method: 'POST',
			body: formData,
		})
		const responseData = await response.json()
		console.log('responseData: ', responseData)
	} catch (e) {
		console.error(e)
	}
}
```

## 点击自定义元素

```html
<body>
  <!--自定义元素-->
  <div class="class-1" onclick="handleClick()"></div>
  
  <script>
    function handleClick() {
			const inputElement = document.createElement('input')
			inputElement.type='file'
			inputElement.addEventListener('change', () => {
				setUser(inputElement.files[0])
				// 销毁input
				inputElement.remove()
			})
			inputElement.click()
		}
  </script>
</body>
```

## 拖放实现

```html
<body>
  <div class="class-2"
	     ondragenter="dragEnter(event)"
	     ondragover="dragOver(event)"
	     ondrop="drop(event)"></div>
  
  <script>
    function dragEnter(e) {
			e.stopPropagation()
			e.preventDefault()
		}
    
    function dragOver(e) {
			e.stopPropagation()
			e.preventDefault()
		}
    
    function drop(e) {
			e.stopPropagation()
			e.preventDefault()
			setUser(e.dataTransfer.files[0])
		}
  </script>
</body>
```







































































