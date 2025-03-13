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
            "lazy": false,
            "proxies": [
            
            ]
        },
        {
            "name": "⚖️ 负载均衡",
            "type": "load-balance",
            "strategy": "consistent-hashing",
            "url": "https://www.google.com/",
            "interval": "300",
            "lazy": false,
            "proxies": [
            
            ]
        }
    ]


```
键名：pre，用于自定义代理前的所有内容，示例如下
```plaintext

port: 7890
socks-port: 7891
mode: Rule
allow-lan: false
log-level: silent
ipv6: true
disable-keep-alive: true
unified-delay: true
tcp-concurrent: true
geodata-mode: true
geodata-loader: standard
geo-auto-update: true
geo-update-interval: 24
geox-url:
  geoip: "https://cdn.jsdelivr.net/gh/DustinWin/ruleset_geodata@mihomo/geoip.dat" #private、cn、netflix 和 telegram
  geosite: "https://github.com/DustinWin/ruleset_geodata/releases/download/mihomo/geosite-all.dat" #fakeip-filter、fakeip-filter-lite、private、ads、trackerslist、microsoft-cn、apple-cn、google-cn、games-cn、netflix、disney、max、primevideo、appletv、youtube、tiktok、bilibili、ai、networktest、tld-proxy、proxy、tld-cn 和 cn
  mmdb: "https://cdn.jsdelivr.net/gh/DustinWin/ruleset_geodata@mihomo/Country-lite.mmdb" #private、cn和 telegram
  asn: "https://github.com/xishang0128/geoip/releases/download/latest/GeoLite2-ASN.mmdb" #netflix 和 telegram
global-ua: clash.meta
external-controller: :9090

dns:
  enable: true
  cache-algorithm: lru
  prefer-h3: false
  use-hosts: true
  use-system-hosts: true
  respect-rules: false
  listen: 0.0.0.0:1053
  ipv6: false
  default-nameserver:
    - system
  enhanced-mode: fake-ip
  fake-ip-range: 198.18.0.1/16
  fake-ip-filter-mode: blacklist
  fake-ip-filter:
    - 'geosite:private'
    - '*.lan'
  nameserver-policy:
    '+.arpa': '10.0.0.1'
    '+.internal.crop.com': '10.0.0.1'
    'geosite:cn': system

  nameserver:
    - https://doh.pub/dns-query
    - https://101.102.103.104/dns-query#skip-cert-verify=true
    - https://public.dns.iij.jp/dns-query
    - https://dns.flyme.cc/dns-query
  fallback:
    - tls://1.1.1.1#RULES
    - tls://8.8.8.8#RULES
    - https://101.102.103.104/dns-query#skip-cert-verify=true
    - https://public.dns.iij.jp/dns-query
  proxy-server-nameserver:
    - https://doh.pub/dns-query
  direct-nameserver:

  direct-nameserver-follow-policy:
  fallback-filter:
    geoip: false
    geoip-code: CN
    geosite:
    ipcidr:
      - 240.0.0.0/4
    domain:

```
键名：post，用于自定义代理后的所有内容，示例如下
```plaintext

rules:
  - DOMAIN-KEYWORD,github,🚀 节点选择
  - DOMAIN-KEYWORD,twitter,🚀 节点选择
  - DOMAIN-KEYWORD,google,🚀 节点选择
  - DOMAIN-KEYWORD,telegra,🚀 节点选择

  - GEOSITE,proxy,🚀 节点选择
  - GEOSITE,youtube,🚀 节点选择           
  - GEOSITE,bilibili,DIRECT
  - GEOSITE,private,DIRECT
  - GEOSITE,cn,DIRECT

  - GEOIP,telegram,🚀 节点选择       
  - GEOIP,private,DIRECT,no-resolve
  - GEOIP,cn,DIRECT
  
  - MATCH,🚀 节点选择


```



