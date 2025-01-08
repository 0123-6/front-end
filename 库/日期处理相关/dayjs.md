# dayjs

```bash
npm install dayjs
```

```ts
import dayjs from 'dayjs'
dayjs().format()

const today = dayjs().format('YYYY-MM-DD')// 输出格式为 '2024-11-28'
dayjs(new Date()).format('YYYY-MM-DD')

// 格式化时间
export const dateToYYYYMMDD = date => dayjs(date).format('YYYY-MM-DD')
```

