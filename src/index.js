import yaml from 'js-yaml';


let group = `

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
let pre = `

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


let post = `

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

let warnings = ''









addEventListener('fetch', event => {
	event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
	const url = new URL(request.url);
	const links = url.searchParams.get('links'); // 获取查询参数中的 links 值
	const linkArray = links.split(','); // 假设链接之间用逗号分隔
	const resultString = linkArray.map(link => `#${link}\n`).join('');
	warnings += resultString;

	const headers = {
		'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
	};


	const fetchPromises = linkArray.map(link => fetch(link, { headers }).then(response => response.text()));
	const results = await Promise.all(fetchPromises);

	let mergedproxies = { proxies: [] }; // 初始化为包含空数组的对象

	results.forEach(result => {
		try {
			let proxies = yaml.load(result).proxies;
			mergedproxies.proxies = [...mergedproxies.proxies, ...proxies];
		} catch (error) {
			console.error("解析 YAML 时出错:", error);
		}
	});

	const proxyNames = mergedproxies.proxies.map(proxy => proxy.name);


	mergedproxies['proxy-groups'] = [];




	try {
		let readgroup = await BACKUP.get('group'); // 尝试从 KV 中获取 post

		if (readgroup === null) {
			warnings += '#KV配置成功，但无group键\n';
		}else {group = readgroup}
	} catch (error) {
		warnings += '#KV配置失败，使用默认group值\n';
	}




	mergedproxies['proxy-groups']= JSON.parse(group);
	mergedproxies['proxy-groups'].forEach(group => {
		group.proxies.push(...proxyNames);
	});







	//
	// mergedproxies['proxy-groups'].push(		{
	// 		name: "🚀 节点选择",
	// 		type: "select",
	// 		proxies: ['♻️ 故障转移', '⚖️ 负载均衡', ...proxyNames]
	// 	},
	// 	{
	// 		name: "♻️ 故障转移",
	// 		type: "fallback",
	// 		url: "https://www.google.com/", // 检测地址
	// 		interval: "300", // 检测间隔
	// 		proxies: [...proxyNames]
	// 	},
	// 	{
	//
	// 		name: "⚖️ 负载均衡",
	// 		type: "load-balance",
	// 		strategy: "consistent-hashing",
	// 		url: "https://www.google.com/", // 检测地址
	// 		interval: "300",
	// 		proxies: [...proxyNames]
	//
	// 	}
	//
	// );


	const content = yaml.dump(mergedproxies);


	try {
		let readpre = await BACKUP.get('pre'); // 尝试从 KV 中获取 post

		if (readpre === null) {
			warnings += '#KV配置成功，但无pre键\n';
		}else {pre = readpre}

	} catch (error) {
		warnings += '#KV配置失败，使用默认pre值\n';
	}


	try {
		let readpost = await BACKUP.get('post'); // 尝试从 KV 中获取 post

		if (readpost === null) {
			warnings += '#KV配置成功，但无post键\n';
		}else {post = readpost}

	} catch (error) {
		warnings += '#KV配置失败，使用默认post值\n';
	}









	try {
		await BACKUP.put(Date.now().toString(), warnings+content, { expirationTTL:(14 * 24 * 60 * 60) });
	} catch (error) {
		warnings +='#保存备份失败\n'

	}










	const finalcontent = warnings + pre + content + post;

























	// 设置 Content-Disposition
	let contentDisposition;
	if (linkArray.length === 1) {
		// 如果只有一个链接，直接从第一次 fetch 的响应中获取 Content-Disposition
		const response = await fetch(linkArray[0], { headers });
		let originalContentDisposition = response.headers.get('Content-Disposition');
		if (originalContentDisposition) {
			contentDisposition = originalContentDisposition;
		} else {
			contentDisposition = `inline; filename="${new URL(linkArray[0]).hostname}"`;
		}
	} else {
		// 如果有多个链接，统一设置文件名为“融合配置”
		contentDisposition = `inline; filename*=UTF-8''${encodeURIComponent('融合配置')}`;
	}

	// 返回合并后的内容
	return new Response(finalcontent, {
		status: 200,
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Content-Disposition': contentDisposition
		}
	});
}
