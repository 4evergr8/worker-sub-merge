import yaml from 'js-yaml';

import {pre, post, group} from "./strings.js";
import {html} from "./html.js";

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event));
});

async function handleRequest(event) {
    const request = event.request;

    let warnings = '';
    let contentDisposition;

    if (new URL(request.url).searchParams.has('links')) {
        const links = new URL(request.url).searchParams.get('links'); // 获取查询参数中的 links 值
        const linkArray = links.split(','); // 假设链接之间用逗号分隔
        const resultString = linkArray.map(link => `#${link}\n`).join('');
        warnings += resultString;
        const now = new Date();
        const str = `#${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}\n`;
        warnings += str;

        const headers = {'User-Agent': 'clash-verge/v1.6.6'};

        // 先fetch所有链接，拿到响应对象（包含headers和body）
        const fetchPromises = linkArray.map(link => fetch(link, {headers}));
        const responses = await Promise.all(fetchPromises);

        // 解析文件名（仅单链接时）
        let fileName = null;
        let extraHeaders = {};

        if (linkArray.length === 1) {
            const cd = responses[0].headers.get('Content-Disposition');
            if (cd) {
                const match = cd.match(/filename\*?=([^;]+)/i);
                if (match) {
                    let name = match[1].trim();
                    if (name.toLowerCase().startsWith("utf-8''")) {
                        name = decodeURIComponent(name.slice(7));
                    } else {
                        name = name.replace(/^["']|["']$/g, '');
                    }
                    fileName = `🌀${name}`;
                }
            }
            // 尝试获取 subscription-userinfo
            const subInfo = responses[0].headers.get('subscription-userinfo');
            if (subInfo) extraHeaders['subscription-userinfo'] = subInfo;
        }

        // 拿响应文本内容
        const results = await Promise.all(responses.map(r => r.text()));

        let mergedProxies = {proxies: []};

        for (let i = 0; i < results.length; i++) {
            const result = results[i];
            const link = linkArray[i];
            let parsed;

            try {
                parsed = yaml.load(result);
            } catch (e) {
                parsed = null;
            }

            if (!parsed?.proxies || !Array.isArray(parsed.proxies) || parsed.proxies.length === 0) {
                // 解析无效，从KV取备份
                const cached = await BACKUP.get(link);
                if (!cached) {
                    return new Response(
                        JSON.stringify({error: `链接无效且未找到缓存: ${link}`}),
                        {status: 432, headers: {'Content-Type': 'application/json'}}
                    );
                }
                parsed = yaml.load(cached); // 假设缓存总能解析，无需try-catch
            } else {
                // 解析有效，异步写入KV，不阻塞响应
                event.waitUntil(
                    BACKUP.put(link, result, {expirationTTL: 15552000}).catch(() => {
                        warnings = '#保存备份失败\n' + warnings;
                    })
                );
            }

            mergedProxies.proxies.push(...parsed.proxies);
        }

        const proxyNames = mergedProxies.proxies.map(proxy => proxy.name);
        mergedProxies['proxy-groups'] = JSON.parse(group);

        mergedProxies['proxy-groups'].forEach((group, index) => {
            if (index !== 1 && index !== 5 && index !== 6 && index !== 7) {
                group.proxies.push(...proxyNames);
            }
        });

        const content = yaml.dump(mergedProxies);

        let finalContent = warnings + pre + content + post;

        function encodeRFC5987ValueChars(str) {
            const encoder = new TextEncoder();
            const bytes = encoder.encode(str);
            return Array.from(bytes).map(b => '%' + b.toString(16).toUpperCase().padStart(2, '0')).join('');
        }

        if (!fileName) {
            // 没拿到文件名，使用 hostname 做文件名
            fileName = `🌀${new URL(linkArray[0]).hostname}`;
        }
        if (linkArray.length > 1) {
            fileName = '🌀融合配置';
        }

        contentDisposition = `attachment; filename*=UTF-8''${encodeRFC5987ValueChars(fileName)}`;

        return new Response(finalContent, {
            status: 200,
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Content-Disposition': contentDisposition,
                ...extraHeaders
            }
        });

    } else {
        return new Response(decodeURIComponent(escape(atob(html))), {
            headers: {"Content-Type": "text/html"}
        });
    }
}
