// 通用工具函数和环境检测
const isLoon = typeof $persistentStore !== "undefined";
const isQuanX = typeof $prefs !== "undefined";
const isSurge = typeof $httpClient !== "undefined" && typeof $prefs === "undefined";

// 统一存储方法
const storage = {
    get: key => {
        if (isLoon || isSurge) return $persistentStore.read(key);
        return $prefs.valueForKey(key);
    },
    set: (key, value) => {
        if (isLoon || isSurge) return $persistentStore.write(value, key);
        return $prefs.setValueForKey(value, key);
    }
};

// 统一 HTTP 请求方法
function fetchWithCallback(options, callback) {
    if (isLoon || isSurge) {
        const httpMethod = options.method === "POST" ? $httpClient.post : $httpClient.get;
        httpMethod(options, (error, response, body) => {
            callback(error, response, body);
        });
    } else {
        // QuanX 或其他环境
        const method = options.method || "GET";
        const fetchOptions = { method, url: options.url, headers: options.headers || {}, body: options.body || null };

        $task.fetch(fetchOptions).then(response => {
            callback(null, response, response.body);
        }).catch(error => callback(error, null, null));
    }
}

// 路由处理
const url = $request.url;

// 处理搜索请求 (sheepweb001.js)
if (url.includes('/sheep/videoPolymerization/videoword/')) {
    handleSearchRequest();
}
// 处理展示请求 (sheepzhanshi.js)
else if (url.includes('/sheep/videoPolymerization/zhanshi/')) {
    handleDisplayRequest();
}
// 处理主页请求 (sheepweb.js)
else {
    handleMainPageRequest();
}

// 处理搜索请求的函数 (sheepweb001.js 的主要逻辑)
function handleSearchRequest() {
    const urlMatch = $request.url.match(/sheep\/videoPolymerization\/videoword\/([^\/]+)\/\?wd=(.*)/);
    if (!urlMatch) {
        $done({ body: JSON.stringify({ error: "无效的请求格式" }) });
        return;
    }

    const source = urlMatch[1];
    const wd = decodeURIComponent(urlMatch[2]);

    // 定义不同 source 对应的 API 地址
    const apiSources = {
        "1": "https://caiji.moduapi.cc/api.php/provide/vod?ac=detail&wd=",
        "2": "https://cj.lziapi.com/api.php/provide/vod/from/lzm3u8/?ac=detail&wd="
    };

    // 获取对应 API 地址
    const baseUrl = apiSources[source];
    if (!baseUrl) {
        $done({ body: JSON.stringify({ error: "不支持的 source" }) });
        return;
    }

    // 构建完整请求 URL
    const requestUrl = baseUrl + encodeURIComponent(wd);

    // 发送请求
    fetchData(requestUrl, new URL(requestUrl).host);
}

// 处理数据获取和存储
function fetchData(url, host) {
    const headers = {
        "Sec-Fetch-Dest": "empty",
        "Connection": "keep-alive",
        "Accept-Encoding": "gzip, deflate, br",
        "Priority": "u=3, i",
        "Sec-Fetch-Site": "cross-site",
        "Origin": "https://movies.disney.com",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3 Safari/605.1.15",
        "Sec-Fetch-Mode": "cors",
        "Referer": "https://movies.disney.com/",
        "Host": host,
        "Accept-Language": "zh-CN,zh-Hans;q=0.9",
        "Accept": "*/*"
    };

    const myRequest = { url, method: "GET", headers };

    if (isLoon || isSurge) {
        $httpClient.get(myRequest, (error, response, body) => {
            if (error) {
                $done({ body: JSON.stringify({ error: "网络错误", detail: error }) });
                return;
            }

            if (response.status === 200) {
                try {
                    const json = JSON.parse(body);
                    storeVodData(json.list || []);
                    $done({ body: JSON.stringify({ success: "数据已存储", list: json.list }) });
                } catch (e) {
                    $done({ body: JSON.stringify({ error: "解析失败" }) });
                }
            } else {
                $done({ body: JSON.stringify({ error: "API 请求失败" }) });
            }
        });
    } else {
        // QuanX
        $task.fetch(myRequest).then(response => {
            if (response.statusCode === 200) {
                try {
                    const json = JSON.parse(response.body);
                    storeVodData(json.list || []);
                    $done({ body: JSON.stringify({ success: "数据已存储", list: json.list }) });
                } catch (e) {
                    $done({ body: JSON.stringify({ error: "解析失败" }) });
                }
            } else {
                $done({ body: JSON.stringify({ error: "API 请求失败" }) });
            }
        }, reason => {
            $done({ body: JSON.stringify({ error: "网络错误", detail: reason }) });
        });
    }
}

// 存储影视数据到本地
function storeVodData(vodList) {
    for (let i = 0; i < vodList.length; i++) {
        let vod = vodList[i];

        let vodName = vod.vod_name; // 标题
        let vodPic = vod.vod_pic; // 图片地址
        let vodContent = vod.vod_content; // 简介
        let vodPlayUrl = vod.vod_play_url; // 播放地址

        // 解析播放地址
        let episodes = [];
        let playParts = vodPlayUrl.split("#");  // 根据#符号分隔

        for (let j = 0; j < playParts.length; j++) {
            let episodeDetails = playParts[j].split("$");
            let episodeTitle = episodeDetails[0];
            let episodeUrl = episodeDetails[1] || "";
            episodes.push(`${episodeTitle}: ${episodeUrl}`);
        }

        // 拼接存储格式
        let storeValue = [vodName, vodPic, vodContent, ...episodes].join(",");

        // 存储到本地
        let key = `sheep_vod_info_${i}`; // 例如：sheep_vod_info_0, sheep_vod_info_1 ...
        storage.set(key, storeValue);
    }
}

// 处理展示请求的函数
function handleDisplayRequest() {
    const urlMatch = $request.url.match(/sheep_vod_info_(\d+)/);
    if (!urlMatch) {
        $done({ status: "HTTP/1.1 400 Bad Request", body: "请求格式错误" });
        return;
    }

    // 添加特殊处理逻辑
    if (urlMatch[1] === "1000") {
        // 收集所有存在的视频数据
        let allVodData = [];
        for (let i = 0; i <= 20; i++) {
            const key = `sheep_vod_info_${i}`;
            const data = storage.get(key);
            if (data) {
                const vodArray = data.split(",");
                allVodData.push({
                    title: vodArray[0],
                    pic: vodArray[1],
                    content: vodArray[2],
                    index: i
                });
            }
        }

        // 生成列表页面 HTML
        const html = `
        <!DOCTYPE html>
        <html lang="zh">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">
            <title>影视列表</title>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/SheepFJ/VidSheep/VidSheep/css/playlist.css">
        </head>
        <body>
            <h1>影视列表</h1>
            <div class="grid">
                ${allVodData.map(vod => `
                    <div class="item" onclick="loadVideoInfo(${vod.index})">
                        <img src="${vod.pic}" alt="${vod.title}">
                        <p>${vod.title}</p>
                    </div>
                `).join('')}
            </div>
            <script>
                function loadVideoInfo(index) {
                    fetch("https://api.sheep.com/sheep/videoPolymerization/zhanshi/sheep_vod_info_" + index)
                        .then(res => res.text())
                        .then(html => {
                            document.documentElement.innerHTML = html.replace(/<html[^>]*>|<\/html>/g, '');
                        })
                        .catch(err => console.error("加载详情失败", err));
                }
            </script>
        </body>
        </html>
        `;

        $done({ status: "HTTP/1.1 200 OK", headers: { "Content-Type": "text/html" }, body: html });
        return;
    }

    const key = `sheep_vod_info_${urlMatch[1]}`;
    const vodData = storage.get(key);

    if (!vodData) {
        $done({ status: "HTTP/1.1 404 Not Found", body: "未找到该视频信息" });
        return;
    }

    // 解析存储的数据
    const vodArray = vodData.split(",");
    const vodTitle = vodArray[0];  // 标题
    const vodPic = vodArray[1];  // 图片地址
    const vodContent = vodArray[2];  // 简介
    const episodes = vodArray.slice(3);  // 剧集信息

    // 生成 HTML 播放页面
    const html = `<!DOCTYPE html>
    <html lang="zh">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">
        <title>${vodTitle}</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/SheepFJ/VidSheep/VidSheep/css/playpage.css">
    </head>
    <body>
        <div id="content" class="content-container">
            <div class="movie-info">
                <h2>${vodTitle}</h2>
                <img src="${vodPic}" alt="${vodTitle}">
                <p>${vodContent}</p>
            </div>
            
            <div class="episodes">
                ${episodes.map((ep, index) => {
        const [epTitle, epUrl] = ep.split(": ");
        return `<a href="${epUrl}" target="_blank" class="episode-btn">${epTitle}</a>`;
    }).join('')}
            </div>
        </div>

        <button class="float-back" onclick="showList()">←</button>

        <script>
            function showList() {
                fetch("https://api.sheep.com/sheep/videoPolymerization/zhanshi/sheep_vod_info_1000")
                    .then(res => res.text())
                    .then(html => {
                        document.documentElement.innerHTML = html.replace(/<html[^>]*>|<\/html>/g, '');
                    })
                    .catch(err => console.error("加载列表失败", err));
            }
        </script>
    </body>
    </html>
    `;

    $done({ status: "HTTP/1.1 200 OK", headers: { "Content-Type": "text/html" }, body: html });
}

// 处理主页请求的函数 (sheepweb.js 的主要逻辑)
function handleMainPageRequest() {
    const html = `<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">

    <title>影视搜索</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/SheepFJ/VidSheep/VidSheep/css/main.css">
</head>
<body>
    <!-- 顶部状态栏背景 -->
    <div class="status-bar-background"></div>
    
    <div id="main-container">
        <h1>影视搜索</h1>
        <div class="search-form">
            <input type="text" id="searchInput" placeholder="输入影视名称">
            <select id="sourceSelect">
                <option value="1">源1</option>
                <option value="2">源2</option>
            </select>
            <button onclick="search()">搜索</button>
        </div>
        <!-- 加载动画 -->
        <div id="results"></div>
    </div>

    <!-- 底部导航 -->
    <div id="bottom-nav">
        <div class="nav-button active" id="searchBtn" onclick="showSearch()">搜索</div>
        <div class="nav-button" id="listBtn" onclick="showList()">最近</div>
        <div class="nav-button" id="profileBtn" onclick="showProfile()">我的</div>
    </div>

    <script src="https://cdn.jsdelivr.net/gh/SheepFJ/VidSheep/VidSheep/js/main.js">
    </script>
</body>
</html>`;

    $done({ status: "HTTP/1.1 200 OK", headers: { "Content-Type": "text/html" }, body: html });
}