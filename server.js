const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
app.use(express.json());
app.use(express.static(__dirname));

// 访问统计存储路径（本地持久化）
const statsFile = path.join(__dirname, 'stats.json');

// ... (初始化和保存统计的逻辑保持不变)

app.get('/', trackVisit, (req, res) => { 
    res.sendFile(path.join(__dirname, 'index.html')); 
});

// 新增：支持访问 V30 页面
app.get('/v30', (req, res) => {
    res.sendFile(path.join(__dirname, 'v30.html'));
});

app.get('/v30.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'v30.html'));
});

// 隐藏的统计查看接口
app.get('/admin-stats-hidden', (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    res.json({
        success: true,
        message: "统计数据（隐藏）",
        total: stats.totalVisits,
        today: stats.dailyVisits[today] || 0,
        history: stats.dailyVisits
    });
});

// 模拟商业逻辑：根据不同关键词返回不同赞美语
function getMockAIResponse(desc) {
    const database = [
        { praise: "这件墨绿色长裙衬托出您深邃而优雅的气质，仿佛森林中的贵族。", keywords: ["低调奢华", "复古光影", "侧身特写"] },
        { praise: "这套职场西装展现了您干练又不失柔美的一面，气场全开。", keywords: ["都市街拍", "行走动态", "眼神杀"] },
        { praise: "简约的白T牛仔裤，在您身上穿出了最纯粹的高级感。", keywords: ["极简主义", "自然光线", "抓拍瞬间"] }
    ];
    // 随机返回一个，模拟 AI 的不确定性
    return database[Math.floor(Math.random() * database.length)];
}

app.post('/webhook/order-complete', async (req, res) => {
    console.log("👉 收到业务触发:", req.body.description);
    // 模拟 1 秒的“思考时间”，增加真实感
    setTimeout(() => {
        const result = getMockAIResponse(req.body.description);
        console.log("✅ 模拟 AI 生成成功");
        res.json({ success: true, data: result });
    }, 1000);
});

module.exports = app;

if (require.main === module) {
    app.listen(3000, () => { console.log("🚀 演示版服务器已启动，无需 API Key！"); });
}
