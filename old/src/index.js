import yaml from 'js-yaml';
import {pre, rule, group} from "./strings.js";
import {html} from "./html.js";

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event));
});

async function handleRequest(event) {
    const request = event.request;

    let warnings = '';
    let contentDisposition;

    if (new URL(request.url).searchParams.has('links')) {
        const link = new URL(request.url).searchParams.get('links');
        warnings += `#${link}\n`;
        const now = new Date();
        const str = `#${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}\n`;
        warnings += str;

        const headers = {'User-Agent': 'clash-verge/v1.6.6'};
        const response = await fetch(link, {headers});
        const cd = response.headers.get('Content-Disposition');
        const subInfo = response.headers.get('subscription-userinfo');

        let fileName = null;
        let extraHeaders = {};

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

        if (subInfo) extraHeaders['subscription-userinfo'] = subInfo;

        const result = await response.text();

        let parsed;
        try {
            parsed = yaml.load(result);
        } catch (e) {
            parsed = null;
        }

        const hasProxies = parsed?.proxies && Array.isArray(parsed.proxies) && parsed.proxies.length > 0;
        const hasProxyProviders = parsed?.['proxy-providers'] && Object.keys(parsed['proxy-providers']).length > 0;

        let content = null;

        if (hasProxies || hasProxyProviders) {
            const filtered = {};
            if (hasProxies) filtered.proxies = parsed.proxies;
            if (hasProxyProviders) filtered['proxy-providers'] = parsed['proxy-providers'];

            content = yaml.dump(filtered);  // 只输出这两个字段
            event.waitUntil(
                BACKUP.put(link, content, {expirationTTL: 15552000}).catch(() => {})
            );
        } else {
            const cached = await BACKUP.get(link);
            if (!cached) {
                return new Response(
                    JSON.stringify({error: `链接无效且未找到缓存: ${link}`}),
                    {status: 432, headers: {'Content-Type': 'application/json'}}
                );
            }
            content = cached;
            warnings += "#已使用备份"
        }


        let finalContent = warnings + pre + content + group + rule;

        function encodeRFC5987ValueChars(str) {
            const encoder = new TextEncoder();
            const bytes = encoder.encode(str);
            return Array.from(bytes).map(b => '%' + b.toString(16).toUpperCase().padStart(2, '0')).join('');
        }

        function getRootDomain(hostname) {
            const parts = hostname.split('.');
            if (parts.length >= 2) {
                return parts.slice(-2).join('.');
            }
            return hostname;
        }

        if (!fileName) {
            const hostname = new URL(link).hostname;
            const rootDomain = getRootDomain(hostname);
            fileName = `🌀${rootDomain}`;
        }

        contentDisposition = `inline; filename*=UTF-8''${encodeRFC5987ValueChars(fileName)}`;

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
