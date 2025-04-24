import yaml from 'js-yaml';


import {pre,post,group} from "./strings.js";
import {html} from "./html.js";

let warnings = ''
let readpre = ''
let readpost = ''
let readgroup = ''
let contentDisposition;



addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {

    if (new URL(request.url).searchParams.has('links'))
    {
        const links = new URL(request.url).searchParams.get('links'); // 获取查询参数中的 links 值
        const linkArray = links.split(','); // 假设链接之间用逗号分隔
        const resultString = linkArray.map(link => `#${link}\n`).join('');
        warnings += resultString;

        const headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'};


        const fetchPromises = linkArray.map(link => fetch(link, {headers}).then(response => response.text()));
        const results = await Promise.all(fetchPromises);

        let mergedProxies = {proxies: []}; // 初始化为包含空数组的对象

        results.forEach(result => {
            try {
                let proxies = yaml.load(result).proxies;
                mergedProxies.proxies = [...mergedProxies.proxies, ...proxies];
            } catch (error) {
                console.error("解析 YAML 时出错:", error);
            }
        });

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
