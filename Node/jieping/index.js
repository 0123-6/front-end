const puppeteer = require('puppeteer');
const cron = require('node-cron');

async function captureScreenshot() {
    // 启动无头浏览器
    const browser = await puppeteer.launch({ headless: true });

    // 创建一个新的页面
    const page = await browser.newPage();
		
		// 设置视口大小，避免页面内容被截断
    await page.setViewport({ width: 1920, height: 1080 });

		// 访问 Vue.js 中文官网
    await page.goto('https://cn.vuejs.org/', { waitUntil: 'networkidle2' });

		// 等待页面加载完成
    await page.waitForSelector('h1');  // 等待页面加载完成，选择一个页面中的元素作为标志
		
		// 截图并保存到本地，设置 fullPage 为 true 截取整个页面
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_'); // 获取当前时间戳作为文件名的一部分
		await page.screenshot({ path: `vuejs_cn_screenshot_${timestamp}.png`, fullPage: true });

    console.log('Screenshot saved');

    // 关闭浏览器
    await browser.close();
}

// 执行截图操作
captureScreenshot().catch(console.error);

// 每天9点和21点执行截图任务
cron.schedule('0 9 * * *', () => {  // 每天9点执行
    captureScreenshot().catch(console.error);
});

cron.schedule('0 21 * * *', () => {  // 每天21点执行
    captureScreenshot().catch(console.error);
});
