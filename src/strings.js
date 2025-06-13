export let pre = `



port: 7890
socks-port: 7891
mode: rule  #此项拥有默认值，默认为规则模式
allow-lan: false  #允许其他设备经过 Clash 的代理端口访问互联网
log-level: debug  #Clash 内核输出日志的等级，仅在控制台和控制页面输出
ipv6: true  #是否允许内核接受 IPv6 流量
disable-keep-alive: true  #禁用 TCP Keep Alive，在 Android 默认为 true
unified-delay: true  #开启统一延迟时，会计算 RTT，以消除连接握手等带来的不同类型节点的延迟差异
tcp-concurrent: true  #启用 TCP 并发连接，将会使用 dns 解析出的所有 IP 地址进行连接，使用第一个成功的连接
geodata-mode: true  #更改 geoip 使用文件，mmdb 或者 dat，可选 true/false,true为 dat
geodata-loader: standard  #GEO 文件加载模式
geo-auto-update: true  #自动更新 GEO
geo-update-interval: 24  #更新间隔，单位为小时
geox-url:
  geoip: "https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/geoip.dat"
  geosite: "https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/geosite.dat"
  mmdb: "https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/geoip.metadb"
  asn: "https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/GeoLite2-ASN.mmdb"
global-ua: clash.meta  #自定义外部资源下载时使用的的 UA，默认为 clash.meta
etag-support: true  #外部资源下载的 ETag 支持，默认为 true

dns:
  enable: true  #是否启用，如为 false，则使用系统 DNS 解析
  cache-algorithm: arc  #支持的算法：lru: Least Recently Used, 默认值 arc: Adaptive Replacement Cache
  prefer-h3: false  #DOH 优先使用 http/3
  listen: 0.0.0.0:1053  #DNS 服务监听，支持 udp, tcp
  ipv6: true  #是否解析 IPV6, 如为 false, 则回应 AAAA 的空解析
  enhanced-mode: fake-ip  #mihomo 的 DNS 处理模式
  fake-ip-range: 198.18.0.1/16  #fakeip 下的 IP 段设置，tun 的默认 IPV4 地址 也使用此值作为参考
  fake-ip-filter:  #fakeip 过滤，以下地址不会下发 fakeip 映射用于连接
    - "+.lan"
    - "+.local"
    - "+.msftconnecttest.com"
    - "+.msftncsi.com"
    - "localhost.ptlogin2.qq.com"
    - "localhost.sec.qq.com"
    - "localhost.work.weixin.qq.com"
    - 'geosite:private'
  fake-ip-filter-mode: blacklist  #可选 blacklist/whitelist，默认blacklist，whitelist 即只有匹配成功才返回 fake-ip 
  use-hosts: false  #是否回应配置中的 hosts，默认 true
  use-system-hosts: true  #是否查询系统 hosts，默认 true
  respect-rules: true  #dns 连接遵守路由规则，需配置 proxy-server-nameserver
  default-nameserver:  #默认 DNS, 用于解析 DNS 服务器 的域名，必须为 IP, 可为加密 DNS
    - tls://119.28.28.28:853
    - tls://119.29.29.29:853
    - tls://223.5.5.5:853
    - tls://223.5.5.6:853
  nameserver-policy:
    "geosite:private,cn,geolocation-cn": system
    "geoip:cn": system
  proxy-server-nameserver:  #代理节点域名解析服务器，仅用于解析代理节点的域名，如果不填则遵循 nameserver-policy、nameserver 和 fallback 的配置
    - tls://119.28.28.28:853
    - tls://119.29.29.29:853
    - tls://223.5.5.5:853
    - tls://223.5.5.6:853
  direct-nameserver:  #用于 direct 出口域名解析的 DNS 服务器，如果不填则遵循 nameserver-policy、nameserver 和 fallback 的配置
    - system
  direct-nameserver-follow-policy: false  #是否遵循 nameserver-policy，默认为不遵守，仅当 direct-nameserver 不为空时生效
  nameserver:  #默认的域名解析服务器
    - https://8.8.4.4/dns-query
    - https://8.8.8.8/dns-query
    - https://1.1.1.1/dns-query
    - https://1.0.0.1/dns-query
`

export let group = `


proxy-groups:
  - name: 🚀自动选择
    type: url-test
    url: https://telegram.org
    interval: '120'
    lazy: true
    timeout: '2000'
    max-failed-times: '2'
    tolerance: 100
    icon: https://www.clashverge.dev/assets/icons/speed.svg
    exclude-filter: 官网|剩余|套餐|超时|群组
    proxies: []
  - name: 📍节点选择
    type: select
    timeout: '2000'
    max-failed-times: '2'
    icon: https://www.clashverge.dev/assets/icons/adjust.svg
    proxies:
      - 🚀自动选择
      - ♻️轮询均衡
      - 📄散列均衡
  - name: 🔮人工智能
    type: url-test
    url: https://chatgpt.com
    interval: '120'
    lazy: true
    timeout: '2000'
    max-failed-times: '2'
    tolerance: 100
    icon: https://www.clashverge.dev/assets/icons/chatgpt.svg
    exclude-filter: 🇨🇳|官网|剩余|套餐|超时|群组|HK|香港|🇭🇰|MO|澳门|🇲🇴|AR|阿根廷|🇦🇷|PK|巴基斯坦|🇵🇰IR|伊朗|🇮🇷|RU|俄罗斯|🇷🇺
    proxies: []
  - name: 📺国外媒体
    type: url-test
    url: https://open.spotify.com
    interval: '120'
    lazy: true
    timeout: '2000'
    max-failed-times: '2'
    tolerance: 100
    icon: https://www.clashverge.dev/assets/icons/youtube.svg
    proxies: []
  - name: 🇯🇵日本网站
    type: url-test
    url: https://dlsite.com
    interval: '120'
    lazy: true
    timeout: '2000'
    max-failed-times: '2'
    icon: https://www.clashverge.dev/assets/icons/guard.svg
    proxies: []
  - name: 🔗全局直连
    type: select
    timeout: '2000'
    max-failed-times: '2'
    icon: https://www.clashverge.dev/assets/icons/link.svg
    exclude-filter: 官网|剩余|套餐|超时|群组
    proxies:
      - DIRECT
      - 📍节点选择
  - name: 🚧全局拦截
    type: select
    timeout: '2000'
    max-failed-times: '2'
    icon: https://www.clashverge.dev/assets/icons/block.svg
    exclude-filter: 官网|剩余|套餐|超时|群组
    proxies:
      - REJECT
      - 📍节点选择
  - name: ♻️轮询均衡
    type: load-balance
    strategy: round-robin
    url: https://telegram.org
    interval: 123
    lazy: true
    timeout: '2000'
    max-failed-times: '2'
    hidden: true
    icon: https://www.clashverge.dev/assets/icons/balance.svg
    exclude-filter: 官网|剩余|套餐|超时|群组
    proxies: []
  - name: 📄散列均衡
    type: load-balance
    strategy: consistent-hashing
    url: https://telegram.org
    interval: 120
    lazy: true
    timeout: '2000'
    max-failed-times: '2'
    hidden: true
    icon: https://www.clashverge.dev/assets/icons/merry_go.svg
    exclude-filter: 官网|剩余|套餐|超时|群组
    proxies: []

`

export let rule = `


rules:
  - DOMAIN-REGEX,\\b(ads\\.|ad\\.)\\S+,🚧全局拦截
  - DOMAIN-KEYWORD, .ad., 🚧全局拦截
  - DOMAIN-KEYWORD, .ads.,🚧全局拦截
  - GEOSITE,category-ads-all,🚧全局拦截


  - DOMAIN-KEYWORD,openai,🔮人工智能
  - DOMAIN-KEYWORD,gemini,🔮人工智能
  - DOMAIN-KEYWORD,claude,🔮人工智能
  - DOMAIN-KEYWORD,chatgpt,🔮人工智能
  - GEOSITE,openai,🔮人工智能
  
  
  - GEOSITE,spotify,📺国外媒体
  - GEOSITE,tiktok,📺国外媒体
  - GEOSITE,youtube,📺国外媒体 
  

  - DOMAIN-KEYWORD,dlsite,🇯🇵日本网站
  - DOMAIN-KEYWORD,dmm,🇯🇵日本网站
  - DOMAIN-KEYWORD,fantia,🇯🇵日本网站
  - GEOIP,jp,🇯🇵日本网站
  

  - GEOSITE,bilibili,🔗全局直连
  - GEOSITE,cn,🔗全局直连
  - GEOIP,cn,🔗全局直连
  - GEOSITE,private,DIRECT
  - GEOIP,private,DIRECT,no-resolve

  
  - MATCH,📍节点选择

`
