# Clash订阅修改及合并工具
### 基于[Cloudflare Workers©](https://workers.cloudflare.com/)进行部署，可自定义域名  
### 测试链接[merge.4evergr8.workers.dev](https://merge.4evergr8.workers.dev?links=https://raw.githubusercontent.com/MetaCubeX/mihomo/refs/heads/Meta/docs/config.yaml)


## 部署  
1，将仓库内的worker.js中的内容复制粘贴到[Cloudflare Workers©](https://workers.cloudflare.com/)即可  
2，如需使用自定义配置，可创建任意名称的[KV存储器](https://developers.cloudflare.com/kv/)，使用`BACKUP`作为变量名即可  
## 访问链接格式：  
多链接：  
```plaintext
Worker链接?links=https://aaa.aaa,https://bbb.bbb,https://ccc.ccc
```
单链接：
```plaintext
Worker链接?links=https://aaa.aaa
```




## 自定义配置
键名：group，用于自定义代理组配置，示例如下：
```plaintext

    [
    {
        "name": "🚀 节点选择",
        "type": "select",
        "proxies": [
            "♻️ 故障转移",
            "⚖️ 负载均衡"
        ]
    },
        {
            "name": "♻️ 故障转移",
            "type": "fallback",
            "url": "https://www.google.com/",
            "interval": "300",
            "proxies": [
            
            ]
        },
        {
            "name": "⚖️ 负载均衡",
            "type": "load-balance",
            "strategy": "consistent-hashing",
            "url": "https://www.google.com/",
            "interval": "300",
            "proxies": [
            
            ]
        }
    ]


```
键名：pre，用于自定义代理前的所有内容，示例如下
```plaintext

port: 7890
socks-port: 7891
allow-lan: false
mode: Rule
log-level: silent
external-controller: :9090
dns:
  enable: true
  nameserver:
    - 119.29.29.29
    - 223.5.5.5
  fallback:
    - 8.8.8.8
    - 8.8.4.4
    - tls://1.0.0.1:853
    - tls://dns.google:853

```
键名：post，用于自定义代理后的所有内容，示例如下
```plaintext

rules:
  - DOMAIN-KEYWORD,github,🚀 节点选择
  - DOMAIN-KEYWORD,twitter,🚀 节点选择
  - DOMAIN-KEYWORD,youtube,🚀 节点选择
  - DOMAIN-KEYWORD,google,🚀 节点选择
  - DOMAIN-KEYWORD,telegra,🚀 节点选择

  - GEOSITE,gfw,🚀 节点选择
  - GEOSITE,cn,DIRECT
  - GEOIP,private,DIRECT,no-resolve
  - GEOIP,CN,DIRECT
  - MATCH,🚀 节点选择

```



