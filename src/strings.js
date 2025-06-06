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

export let group = `

    [
    	{
        "name": "节点选择",
        "type": "select",
        "proxies": [
            "自动选择",
            "轮询均衡",
            "哈希均衡",
            "粘性均衡"
        	]
    	},
    	{
        "name": "全球直连",
        "type": "select",
        "proxies": [
            "DIRECT",
            "节点选择"
        	]
    	},
        {
        "name": "漏网之鱼",
        "type": "select",
        "proxies": [
            "节点选择",
            "DIRECT",
            "REJECT"
        	]
    	},
    	{
        "name": "全球拦截",
        "type": "select",
        "proxies": [
            "REJECT",
            "节点选择"
        	]
    	},
        {
        "name": "自动选择",
        "type": "url-test",
        "url": "https://android.chat.openai.com",
        "interval": "300",
        "lazy": true,
        "icon": "😁",
        "proxies": [
            ]
        },
        {
        "name": "轮询均衡",
        "type": "load-balance",
        "strategy": "round-robin",
        "url": "https://android.chat.openai.com",
        "interval": "300",
        "lazy": true,
        "proxies": [    
            ]
        },
        {
        "name": "哈希均衡",
        "type": "load-balance",
        "strategy": "consistent-hashing",
        "url": "https://android.chat.openai.com",
        "interval": "300",
        "lazy": true,
        "proxies": [    
            ]
        },
        {
        "name": "粘性均衡",
        "type": "load-balance",
        "strategy": "sticky-sessions",
        "url": "https://android.chat.openai.com",
        "interval": "300",
        "lazy": true,
        "proxies": [    
            ]
        }
    ]

`

export let post = `


rules:
  - DOMAIN-REGEX,\\b(ads\\.|ad\\.)\\S+,全球拦截
  - DOMAIN-KEYWORD, .ad., 全球拦截
  - DOMAIN-KEYWORD, .ads.,全球拦截


  - DOMAIN-KEYWORD,twitter,节点选择
  - DOMAIN-KEYWORD,telegra,节点选择
  - DOMAIN-KEYWORD,google,节点选择
  - DOMAIN-KEYWORD,github,节点选择


  - GEOSITE,youtube,节点选择
  - GEOIP,telegram,节点选择             
  - GEOSITE,bilibili,全球直连
  - GEOSITE,cn,全球直连
  - GEOIP,cn,全球直连
  - GEOSITE,private,DIRECT
  - GEOIP,private,DIRECT,no-resolve

  
  - MATCH,漏网之鱼

`
