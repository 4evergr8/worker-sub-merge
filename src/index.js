import yaml from 'js-yaml';


import {pre,post,group} from "./strings.js";
import {html} from "./html.js";





addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {


    let warnings = ''
    let readpre = ''
    let readpost = ''
    let readgroup = ''
    let contentDisposition;



    if (new URL(request.url).searchParams.has('links'))
    {
        const links = new URL(request.url).searchParams.get('links'); // 获取查询参数中的 links 值
        const linkArray = links.split(','); // 假设链接之间用逗号分隔
        const resultString = linkArray.map(link => `#${link}\n`).join('');
        warnings += resultString;
        const now = new Date();
        const str = `#${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}\n`;
        warnings += str;




        const headers = {'User-Agent': 'clash-verge/v1.6.6'};


        const fetchPromises = linkArray.map(link => fetch(link, {headers}).then(response => response.text()));
        const results = await Promise.all(fetchPromises);

        let mergedProxies = { proxies: [] };

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
                const cached = await BACKUP.get(link);
                if (!cached) {
                    return new Response(
                        JSON.stringify({ error: `链接无效且未找到缓存: ${link}` }),
                        { status: 404, headers: { 'Content-Type': 'application/json' } }
                    );
                } else {
                    try {
                        parsed = yaml.load(cached);
                    } catch (e) {
                        return new Response(
                            JSON.stringify({ error: `缓存内容解析失败: ${link}` }),
                            { status: 500, headers: { 'Content-Type': 'application/json' } }
                        );
                    }
                }
            } else {
                await BACKUP.put(link, result, { expirationTTL: 15552000 }); // 6个月
            }

            mergedProxies.proxies.push(...parsed.proxies);
        }


        const proxyNames = mergedProxies.proxies.map(proxy => proxy.name);
        mergedProxies['proxy-groups'] = [];




        try {
            readpre = await BACKUP.get('pre'); // 尝试从 KV 中获取 pre
        } catch (error) {
            warnings += '#KV配置失败，使用默认pre值\n';
        }
        readpre = readpre || pre

        try {
            readpost = await BACKUP.get('post'); // 尝试从 KV 中获取 pre
        } catch (error) {
            warnings += '#KV配置失败，使用默认post值\n';
        }
        readpost = readpost || post


        try {
            readgroup = await BACKUP.get('group'); // 尝试从 KV 中获取 pre
        } catch (error) {
            warnings += '#KV配置失败，使用默认group值\n';
        }
        readgroup = readgroup || group






        mergedProxies['proxy-groups'] = JSON.parse(group);
        mergedProxies['proxy-groups'].forEach(group => {
            group.proxies.push(...proxyNames);
        });

        const content = yaml.dump(mergedProxies);



        let finalContent = warnings + readpre + content + readpost;


        try {
            await BACKUP.put(Date.now().toString(), finalContent, {expirationTTL: (432000)});
        } catch (error) {
            finalContent = '#保存备份失败\n'+finalContent
        }







        if (linkArray.length === 1) {
            const response = await fetch(linkArray[0], {headers});
            contentDisposition = response.headers.get('Content-Disposition') || `inline; filename="${new URL(linkArray[0]).hostname}"`;
        } else {
            contentDisposition = `inline; filename*=UTF-8''${encodeURIComponent('融合配置')}`;// 如果有多个链接，统一设置文件名为“融合配置”
        }


        return new Response(finalContent, {
            status: 200,
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Content-Disposition': contentDisposition
            }
        });


    }


    else if (new URL(request.url).searchParams.has('linkss')) {

    }

    else{

        return new Response(decodeURIComponent(escape(atob(html))), {
            headers: { "Content-Type": "text/html" }
        });
    }





}
