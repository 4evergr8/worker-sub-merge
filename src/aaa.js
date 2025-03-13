let mergedproxies = { proxies: [] }; // 初始化为包含空数组的对象// 初始化 mergedproxies 对象
mergedproxies['proxy-groups'] = [];










let jsonString = `
    [
    {
        "name": "🚀 节点选择",
        "type": "select",
        "proxies": [
            "♻️ 故障转移",
            "⚖️ 负载均衡",
            "[...proxyNames]"
        ]
    },
        {
            "name": "♻️ 故障转移",
            "type": "fallback",
            "url": "https://www.google.co300",
            "proxies": [
                "[...proxyNames]"
            ]
        },
        {
            "name": "⚖️ 负载均衡",
            "type": "load-balance",
            "strategy": "consistent-hashing",
            "url": "https://www.google.com/",
            "interval": "300",
            "proxies": [
                "[...proxyNames]"
            ]
        }
    ]

`

 mergedproxies['proxy-groups']= JSON.parse(jsonString);










// 将 proxy-groups 转换为 JSON 字符串
const jsonString = JSON.stringify(mergedproxies['proxy-groups']); // 使用 2 个空格缩进美化输出

// 输出 JSON 字符串
console.log("JSON String:", jsonString);