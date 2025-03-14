
export let group = `

    [
    	{
        "name": "🚀 节点选择",
        "type": "select",
        "icon": "https://github.com/DustinWin/ruleset_geodata/releases/download/icon/appletv.png",
        "proxies": [
            "♻️ 故障转移",
            "⚖️ 负载均衡"
        	]
    	},
    	{
        "name": "🌍 全球直连",
        "type": "select",
        "proxies": [
            "DIRECT"
        	]
    	},
    	{
        "name": "🚫全球拦截",
        "type": "select",
        "proxies": [
            "REJECT"
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

`
export let pre = `

port: 7890
socks-port: 7891
mode: Rule
allow-lan: false
log-level: silent
ipv6: true
disable-keep-alive: true
unified-delay: true
tcp-concurrent: true
geodata-loader: standard
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

`
export let post = `

rule-providers:
  ads:
    type: http
    behavior: domain
    format: mrs
    proxy: ♻️ 故障转移
    path: ./rules/ads.mrs
    url: "https://github.com/DustinWin/ruleset_geodata/releases/download/mihomo-ruleset/ads.mrs"
    interval: 86400
  networktest:
    type: http
    behavior: classical
    format: text
    proxy: ♻️ 故障转移
    path: ./rules/networktest.list
    url: "https://github.com/DustinWin/ruleset_geodata/releases/download/mihomo-ruleset/networktest.list"
    interval: 86400
  tld-proxy:
    type: http
    behavior: domain
    proxy: ♻️ 故障转移
    format: mrs
    path: ./rules/tld-proxy.mrs
    url: "https://github.com/DustinWin/ruleset_geodata/releases/download/mihomo-ruleset/tld-proxy.mrs"
    interval: 86400
  proxy:
    type: http
    behavior: domain
    proxy: ♻️ 故障转移
    format: mrs
    path: ./rules/proxy.mrs
    url: "https://github.com/DustinWin/ruleset_geodata/releases/download/mihomo-ruleset/proxy.mrs"
    interval: 86400
  telegramip:
    type: http
    behavior: ipcidr
    format: mrs
    proxy: ♻️ 故障转移
    path: ./rules/telegramip.mrs
    url: "https://github.com/DustinWin/ruleset_geodata/releases/download/mihomo-ruleset/telegramip.mrs"
    interval: 86400
  
  trackerslist:
    type: http
    behavior: domain
    format: mrs
    proxy: ♻️ 故障转移
    path: ./rules/trackerslist.mrs
    url: "https://github.com/DustinWin/ruleset_geodata/releases/download/mihomo-ruleset/trackerslist.mrs"
    interval: 86400
  youtube:
    type: http
    behavior: domain
    proxy: ♻️ 故障转移
    format: mrs
    path: ./rules/youtube.mrs
    url: "https://github.com/DustinWin/ruleset_geodata/releases/download/mihomo-ruleset/youtube.mrs"
    interval: 86400

  tiktok:
    type: http
    behavior: domain
    format: mrs
    proxy: ♻️ 故障转移
    path: ./rules/tiktok.mrs
    url: "https://github.com/DustinWin/ruleset_geodata/releases/download/mihomo-ruleset/tiktok.mrs"
    interval: 86400
  ai:
    type: http
    behavior: domain
    format: mrs
    proxy: ♻️ 故障转移
    path: ./rules/ai.mrs
    url: "https://github.com/DustinWin/ruleset_geodata/releases/download/mihomo-ruleset/ai.mrs"
    interval: 86400
  microsoft-cn:
    type: http
    behavior: domain
    format: mrs
    proxy: ♻️ 故障转移
    path: ./rules/microsoft-cn.mrs
    url: "https://github.com/DustinWin/ruleset_geodata/releases/download/mihomo-ruleset/microsoft-cn.mrs"
    interval: 86400

  google-cn:
    type: http
    behavior: domain
    format: mrs
    proxy: ♻️ 故障转移
    path: ./rules/google-cn.mrs
    url: "https://github.com/DustinWin/ruleset_geodata/releases/download/mihomo-ruleset/google-cn.mrs"
    interval: 86400

  games-cn:
    type: http
    behavior: domain
    format: mrs
    proxy: ♻️ 故障转移
    path: ./rules/games-cn.mrs
    url: "https://github.com/DustinWin/ruleset_geodata/releases/download/mihomo-ruleset/games-cn.mrs"
    interval: 86400
  applications:
    type: http
    behavior: classical
    format: text
    proxy: ♻️ 故障转移
    path: ./rules/applications.list
    url: "https://github.com/DustinWin/ruleset_geodata/releases/download/mihomo-ruleset/applications.list"
    interval: 86400
  bilibili:
    type: http
    behavior: domain
    format: mrs
    proxy: ♻️ 故障转移
    path: ./rules/bilibili.mrs
    url: "https://github.com/DustinWin/ruleset_geodata/releases/download/mihomo-ruleset/bilibili.mrs"
    interval: 86400

  tld-cn:
    type: http
    behavior: domain
    format: mrs
    proxy: ♻️ 故障转移
    path: ./rules/tld-cn.mrs
    url: "https://github.com/DustinWin/ruleset_geodata/releases/download/mihomo-ruleset/tld-cn.mrs"
    interval: 86400

  cn:
    type: http
    behavior: domain
    format: mrs
    proxy: ♻️ 故障转移
    path: ./rules/cn.mrs
    url: "https://github.com/DustinWin/ruleset_geodata/releases/download/mihomo-ruleset/cn.mrs"
    interval: 86400

  cnip:
    type: http
    behavior: ipcidr
    format: mrs
    proxy: ♻️ 故障转移
    path: ./rules/cnip.mrs
    url: "https://github.com/DustinWin/ruleset_geodata/releases/download/mihomo-ruleset/cnip.mrs"
    interval: 86400
  private:
    type: http
    behavior: domain
    format: mrs
    proxy: ♻️ 故障转移
    path: ./rules/private.mrs
    url: "https://github.com/DustinWin/ruleset_geodata/releases/download/mihomo-ruleset/private.mrs"
    interval: 86400
  privateip:
    type: http
    behavior: ipcidr
    format: mrs
    proxy: ♻️ 故障转移
    path: ./rules/privateip.mrs
    url: "https://github.com/DustinWin/ruleset_geodata/releases/download/mihomo-ruleset/privateip.mrs"
    interval: 86400




rules:
  - DOMAIN-REGEX,\\b(ads\\.|ad\\.)\\S+,🚫全球拦截
  - DOMAIN-KEYWORD, .ad., 🚫全球拦截
  - DOMAIN-KEYWORD, .ads., 🚫全球拦截
  
  - RULE-SET,ads,🚫全球拦截
  - RULE-SET,networktest,🚀 节点选择
  - RULE-SET,tld-proxy,🚀 节点选择
  - RULE-SET,proxy,🚀 节点选择
  - RULE-SET,telegramip,🚀 节点选择,no-resolve
  - RULE-SET,trackerslist,🚀 节点选择
  - RULE-SET,youtube,🚀 节点选择
  - RULE-SET,tiktok,🚀 节点选择
  - RULE-SET,ai,🚀 节点选择
  - RULE-SET,microsoft-cn,🌍 全球直连
  - RULE-SET,google-cn,🌍 全球直连
  - RULE-SET,games-cn,🌍 全球直连
  - RULE-SET,applications,🌍 全球直连
  - RULE-SET,bilibili,🌍 全球直连
  - RULE-SET,tld-cn,🌍 全球直连
  - RULE-SET,cn,🌍 全球直连
  - RULE-SET,cnip,🌍 全球直连
  - RULE-SET,private,DIRECT
  - RULE-SET,privateip,DIRECT,no-resolve
  

  - DOMAIN-KEYWORD,github,🚀 节点选择
  - DOMAIN-KEYWORD,twitter,🚀 节点选择
  - DOMAIN-KEYWORD,google,🚀 节点选择
  - DOMAIN-KEYWORD,telegra,🚀 节点选择

  - GEOSITE,youtube,🚀 节点选择             
  - GEOSITE,bilibili,🌍 全球直连
  - GEOSITE,private,DIRECT
  - GEOSITE,cn,🌍 全球直连

  - GEOIP,telegram,🚀 节点选择       
  - GEOIP,private,DIRECT,no-resolve
  - GEOIP,cn,🌍 全球直连
  
  - MATCH,🚀 节点选择

`