import yaml from 'js-yaml';



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

`


let post = `

rules:
  - DOMAIN-KEYWORD, ad., REJECT
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

`
let group = `

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
