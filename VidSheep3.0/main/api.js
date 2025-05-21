// 环境检测
const isLoon = typeof $persistentStore !== "undefined"; const isQuanX = typeof $prefs !== "undefined"; const isSurge = !isLoon && !isQuanX;
// 统一存储方法
const storage = { get: e => { let r = null; (isLoon || isSurge) && (r = $persistentStore.read(e)), isQuanX && (r = $prefs.valueForKey(e)); try { return r ? JSON.parse(r) : null } catch (e) { return r } }, set: (e, r) => { const t = "object" == typeof r ? JSON.stringify(r) : r; return isLoon || isSurge ? $persistentStore.write(t, e) : !!isQuanX && $prefs.setValueForKey(t, e) } };
// 统一通知方法
const notify = (title, subtitle, message) => { if (isLoon || isSurge) { $notification.post(title, subtitle, message) } else if (isQuanX) { $notify(title, subtitle, message) } };
// 统一 HTTP 请求方法
function fetchWithCallback(options, callback) { if (isLoon || isSurge) { if (options.method === "POST") { $httpClient.post(options, callback) } else { $httpClient.get(options, callback) } } else if (isQuanX) { $task.fetch(options).then(response => { callback(null, response, response.body) }).catch(error => { notify("本次请求出现问题", "", JSON.stringify(error)); callback(error, null, null) }) } }
// 统一返回状态
function responseStatus(success, data, array) { return { status: "HTTP/1.1 200 OK", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ success: `${success}`, data: { information: `${data}`, array: array, } }) } }
//时间戳函数getCurrent,addMinutes(timestamp, minutes),isValid(currentTimestamp, oldTimestamp)
const TimestampUtil = { getCurrent: function () { return new Date().getTime() }, addMinutes: function (timestamp, minutes) { return timestamp + minutes * 60 * 1000 }, isValid: function (currentTimestamp, oldTimestamp) { return currentTimestamp >= oldTimestamp } };

//api参数获取函数URLSearchParamsApi
function URLSearchParamsApi(queryString) { const params = {}; if (!queryString) return { get: (key) => params[key] || null }; const pairs = queryString.split('&'); for (let i = 0; i < pairs.length; i++) { const pair = pairs[i].split('='); const key = decodeURIComponent(pair[0]); const value = pair.length > 1 ? decodeURIComponent(pair[1]) : ''; params[key] = value } return { get: (key) => params[key] || null } }

// 根据 URL 和指定 key 数组返回解构后的对象
function parseUrlToParams(url, keys = []) { const queryString = url.split('?')[1]; const params = URLSearchParamsApi(queryString); const result = {}; keys.forEach(key => { result[key] = params.get(key) }); return result }


//初始用户数据定义
let vidSheepUserinfo = {
    BGimage: "https://img-new-cdn.whalean.com/wallpaper-material/ZDKOBkz6PwJN_1747635422985.jpg", // 图片地址
    BG_brightness: "", //背景明度
    auto_change_BG: true, //自动更换壁纸,24小时更换一次   
    current_timestamp: 0, //当前时间戳
    old_timestamp: 0, //上次更换时间戳
    default_source: 2, //默认搜索来源
    announcement: 1, //	用于是否展示公告
    initialization: false, //f表示未初始化,t表示已初始化
    tripartiteplayer: "SenPlayer://x-callback-url/play?url=", //三方播放器
    searchkeywords: ["小猪佩奇", "熊出没", "海绵宝宝", "奥特曼", "哆啦A梦", "名侦探柯南", "喜羊羊与灰太狼"], //搜索历史
    apiSources: {
        "1": "https://jszyapi.com/api.php/provide/vod?ac=detail&wd=",//急速资源
        "2": "https://caiji.moduapi.cc/api.php/provide/vod?ac=detail&wd=",//魔都资源
        "3": "https://suoniapi.com/api.php/provide/vod?ac=detail&wd=",//索尼资源
        "4": "https://subocaiji.com/api.php/provide/vod?ac=detail&wd=",//速播资源
        "5": "https://cj.lziapi.com/api.php/provide/vod?ac=detail&wd=",//量子资源
        "6": "https://cj.lziapi.com/api.php/provide/vod/from/lzm3u8/?ac=detail&wd=",//量子资源1
        "7": "https://p2100.net/api.php/provide/vod?ac=detail&wd=",//飘零资源
        "8": "https://img.smdyw.top/api.php/provide/vod?ac=detail&wd=",//苹果资源
        "9": "https://360zy.com/api.php/seaxml/vod?ac=detail&wd=",//360资源
        "10": "https://api.guangsuapi.com/api.php/provide/vod/from/gsm3u8/?ac=detail&wd=",//光束资源
        "11": "https://collect.wolongzyw.com/api.php/provide/vod?ac=detail&wd=",//卧龙资源
        "12": "https://bfzyapi.com/api.php/provide/vod?ac=detail&wd=",//暴风资源
        "13": "https://api.zuidapi.com/api.php/provide/vod/?ac=detail&wd=",//最大资源
    },  //搜索源
    spare_01: "",
    spare_02: {},
    spare_03: [],
}
// 用户数据初始化
let vidSheepUserinfoData = storage.get("vidSheepUserinfo"); if (!(vidSheepUserinfoData && vidSheepUserinfoData.initialization)) { vidSheepUserinfo.initialization = true; vidSheepUserinfoData = vidSheepUserinfo; storage.set("vidSheepUserinfo", vidSheepUserinfo) }; let vidSheepCollection = { vidlist: [] }; let vidSheepCollectionData = storage.get("vidSheepCollection"); if (!vidSheepCollectionData) { storage.set("vidSheepCollection", vidSheepCollection) }; let vidSheepRecent = { vidlist: [] }; let vidSheepRecentData = storage.get("vidSheepRecent"); if (!vidSheepRecentData) { storage.set("vidSheepRecent", vidSheepRecent) };


//获取请求url
const url = $request.url;
//路由处理
const routeHandlers = { main: { match: (url) => url.includes('/sheep/VidSheep/main'), handle: handleMain }, api: { match: (url) => url.includes('/sheep/VidSheep/api/'), handlers: { userinfo: { match: (url) => url.includes('/?userinfo'), handle: handleUserInfo }, announcement: { match: (url) => url.includes('/?announcement'), handle: handleUserInfo }, search: { match: (url) => url.includes('/?search'), handle: handleSearch }, searchkeywords: { match: (url) => url.includes('/?keywords'), handle: handleSearchKeywords }, AI: { match: (url) => url.includes('/?clearAI'), handle: handleClearAI }, recent: { match: (url) => url.includes('/?recent'), handle: handleRecent }, deleteRecent: { match: (url) => url.includes('/?deleteRecent'), handle: handleDeleteRecent }, collect: { match: (url) => url.includes('/?collect'), handle: handleCollect }, wallpaper: { match: (url) => url.includes('/?wallpaper'), handle: handleWallpaper } }, defaultHandler: () => $done(responseStatus("失败", "没有这个路由路径")) } };
//路由分发
function routeRequest(url, routeMap) { for (const routeKey in routeMap) { const route = routeMap[routeKey]; if (route.match(url)) { if (route.handlers) { for (const subRouteKey in route.handlers) { const subRoute = route.handlers[subRouteKey]; if (subRoute.match(url)) { return subRoute.handle() } } return route.defaultHandler ? route.defaultHandler() : $done({}) } if (route.handle) { return route.handle() } } } return $done({ status: "HTTP/1.1 404 Not Found", headers: { "Content-Type": "text/html" }, body: "<h1>404 Not Found</h1>" }) }



function handleMain() {
    const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
        content="width=device-width, initial-scale=1.0, minimum-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <link rel="icon" href="https://img.picgo.net/2025/04/24/IMG_2250359d907d7ba34f51.jpeg" type="image/x-icon">
    <link rel="apple-touch-icon" href="https://img.picgo.net/2025/04/24/IMG_2250359d907d7ba34f51.jpeg">
    <meta name="apple-mobile-web-app-title" content="VidSheep">
    <title>VidSheep</title>
    <link rel="stylesheet" href="https://at.alicdn.com/t/c/font_4885201_q3amtgf1jhl.css">
</head>
<style>
    #background {
        background-image: url('${vidSheepUserinfoData.BGimage}');
    }
</style>

<body>
    <!-- 背景 -->
    <div id="background"></div>
    <!-- 占顶 -->
    <div style="height:5%;"></div>
    <!-- 公告 -->
    <div class="announcement announcement_active stickyNotes math-notebook">
        <div class="stickyNotes_nail"></div>
        <div class="stickyNotes_nail_zhen"></div>
        <span style="margin-left:35%">VidSheep3.0</span>
        <ul style="margin-left:5%">
            <li>提升响应速度,更流畅的UI</li>
            <li>加入更多个性化设置</li>
            <li>解决进度条的问题</li>
            <li>解决不同设备UI适配问题</li>
            <li> <a href="https://github.com/SheepFJ/VidSheep" target="_blank">Stars</a> 支持一下作者～</li>
            <li>......</li>
            <li>......</li>
        </ul>
        <button id="announcementNO" class="announcementButton">不再提醒</button>
    </div>
    <!-- 灰色遮挡 -->
    <div id="iframe-popup-overlay" class="iframe-popup-overlay"></div>
    <!-- 公共弹出框-iframe播放 -->
    <div id="iframe-popup" class="iframe-popup-active">
        <div class="iframe-popup-header">
            <!-- 当前播放集数 -->
            <span id="iframe-popup-current-episode" class="iframe-popup-current-episode"></span>
            <!-- 关闭按钮 -->
            <button id="iframe-popup-close" class="iframe-popup-close-button">×</button>
        </div>
        <iframe src="" id="iframe-popup-iframe"></iframe>
        <div class="iframe-popup-buttons">
            <button class="iframe-popup-button iframe-popup-button-share">分享</button>
            <button class="iframe-popup-button iframe-popup-button-third">SenPlayer</button>
        </div>
    </div>
    <!-- 灰色遮罩层 -->
    <div id="popup-overlay" class="popup-overlay"></div>
    <!-- 公共弹出框 -->
    <div id="public-popup" class="public-popup-active">
        <div class="public-popup-content">
            <!-- clear-AI-popup-->
            <div id="clear-AI-popup" class="popup-content">
                <h2>AI推荐</h2>
                <span class="genre-list-span">选择0—3个标签</span>
                <ul class="genre-list">
                    <li>任意</li>
                    <li>喜剧</li>
                    <li>爱情</li>
                    <li>科幻</li>
                    <li>动作</li>
                    <li>悬疑</li>
                    <li>恐怖</li>
                    <li>剧情</li>
                    <li>动画</li>
                    <li>纪录片</li>
                    <li>犯罪</li>
                    <li>战争</li>
                    <li>历史</li>
                    <li>传记</li>
                    <li>音乐</li>
                    <li>歌舞</li>
                    <li>电视剧</li>
                    <li>电影</li>
                    <li>动漫</li>
                    <li>综艺</li>
                    <li>纪录片</li>
                    <li>知识</li>
                    <li>中国</li>
                    <li>美国</li>
                    <li>日本</li>
                    <li>韩国</li>
                    <li>泰国</li>
                    <li>印度</li>
                </ul>
            </div>
            <!-- play-popup 播放器展开-->
            <div id="play-popup" class="popup-content">
                <h2 id="1402">喜羊羊与灰太狼</h2>
                <img class="play-popup-img" src="https://tu.modututu.com/upload/vod/20230728-1/c69e53c6f16aea09c17f3212f94d5957.jpg"  alt="喜羊羊与灰太狼散打王之奇趣外星客">
                <span></span>
                <!-- 工具栏-分享-收藏-追更-三方 -->
                <div class="play-toolbar">
                    <input type="text" class="play-toolbar-input" placeholder="数字序号">
                    <button class="play-toolbar-button play-toolbar-button-search">跳转</button>                   
                    <button class="play-toolbar-button play-toolbar-button-collect">收藏</button>
                    <button class="play-toolbar-button play-toolbar-button-follow" style="display: none;">追更</button>                   
                    <button class="play-toolbar-button play-toolbar-button-reverse">倒转</button>
                </div>
                <ul class="play-list">                                   
                </ul>
            </div>
            <!-- 修改壁纸 -->
            <div id="modify-wallpaper" class="popup-content">
                <h2>修改壁纸</h2>
                <span style="margin-left: 35%;">壁纸随机更新</span>
                <!-- 壁纸列表容器 -->
                <div class="modify-wallpaper-content"></div>
            </div>
            <!-- 选择默认源 -->
            <div id="default-source" class="popup-content">
                <h2>选择默认源</h2>
            </div>
            <!-- 关于 -->
            <div id="about" class="popup-content">
                <h2>关于</h2>
            </div>
            <!-- 关闭 -->
            <button id="close-popup" class="close-popup">关闭</button>
           <button id="confirm-popup" class="confirm-popup">确认</button>
        </div>
    </div>
    <div id="main-container">
        <!-- 占顶 -->
        <div style="height: 6%;"></div>   
        <!-- 搜索 -->
        <div id="search-section" class="content-section active">
            <div class="search-container">
                <input type="text" placeholder="搜索影视资源..." class="search-input">
                <button class="search-button"><i class="iconfont icon-sousuo1"></i></button>
            </div>
            <select class="source-select">
                <option value="2" disabled selected>默认搜索源</option>
                <option value="1">急速资源</option>
                <option value="2">魔都资源</option>
                <option value="3">索尼资源</option>
                <option value="4">速播资源</option>
                <option value="5">量子资源</option>
                <option value="6">量子资源1</option>
                <option value="7">飘零资源</option>
                <option value="8">苹果资源</option>
                <option value="9">360资源</option>
                <option value="10">光束资源</option>
                <option value="11">卧龙资源</option>
                <option value="12">暴风资源</option>
                <option value="13">最大资源</option>
            </select>
            <!-- 最近搜索关键词 -->
            <div class="recent-search">
                <div class="recent-search-header">
                    <span class="recent-search-title">搜索历史</span>
                    <button class="clear-AI">AI推荐</button>
                    <button class="clear-history">删除历史</button>
                </div>
                <div class="recent-keywords">
                </div>
            </div>
            <!-- 搜索结果 -->
            <div class="search-results">
                <!-- 搜索展示 -->
                <div class="media-grid player-unity"></div>
                <!-- 无搜索结果 -->
                <div class="no-results">没有找到相关结果,请尝试切换源</div>
            </div>
        </div>
        <!-- 最近 -->
        <div id="list-section" class="content-section">
            <div class="search-results-list-header">
                <span class="search-results-list-title">最近列表</span>
            </div>
             <div class="buttons-container-list">
                    <button class="my-collect-list">我的收藏</button>
                    <button class="clear-history-list">清空最近</button>
            </div>
            <!-- 最近影视列表 -->
            <div class="search-results-list">
                <div class="media-grid-list player-unity"></div>
            </div>
            <!-- 我的收藏 -->
            <div class="search-collect-list">
                <!-- 我的收藏列表 -->
                <div class="media-grid-collect-list player-unity"></div>
            </div>
        </div>
        <!-- 发现 -->
        <div id="discover-section" class="content-section ">
            <!-- 修改壁纸 -->
            <div class="discover-item discover-wallpaper" >
                <div class="discover-icon">
                    <i class="iconfont icon-bizhishezhi"></i>
                </div>
                <div class="discover-title">
                    <span>修改壁纸</span>
                </div>
            </div>
            <!-- 选择默认源 -->
            <div class="discover-item discover-default-source" >
                <div class="discover-icon">
                    <i class="iconfont icon-moren"></i>
                </div>
                <div class="discover-title">
                    <span>选择默认源</span>
                </div>
            </div>
            <!-- 关于 -->
            <div class="discover-item discover-about" >
                <div class="discover-icon">
                    <i class="iconfont icon-guanyu"></i>
                </div>
                <div class="discover-title">
                    <span>关于</span>
                </div>
            </div>
        </div>
        <!-- 占底 -->
        <div style=" height: 35%;">
        </div>
    </div>
    <footer>
        <div id="bottom-nav">
            <div class="nav-button nav-active" id="searchBtn" onclick="showSection('search')">
                <i class="iconfont icon-sousuo"></i>
                <span>搜索</span>
            </div>
            <div class="nav-button" id="listBtn" onclick="showSection('list')">
                <i class="iconfont icon-zuijin"></i>
                <span>最近</span>
            </div>
            <div class="nav-button" id="discoverBtn" onclick="showSection('discover')">
                <i class="iconfont icon-faxian"></i>
                <span>发现</span>
            </div>
        </div>
    </footer>
    <script>
    //api数据定义
    const announcement = ${vidSheepUserinfoData.announcement}; //1的时候显示公告,0则隐藏
    </script>
    <script src=""></script>
</body>

</html>`;
    return $done({
        status: "HTTP/1.1 200 OK",
        headers: { "Content-Type": "text/html" },
        body: html
    });
}

// 公告等用户信息处理
function handleUserInfo() { const { announcement } = parseUrlToParams(url, ['announcement']); if (announcement) { vidSheepUserinfoData.announcement = 0; storage.set("vidSheepUserinfo", vidSheepUserinfoData); return $done(responseStatus("成功", "不再展示公告123")) } return $done(responseStatus("成功", "用户信息获取到了")) }
// 搜索
function handleSearch() {
    const { searchword, search } = parseUrlToParams(url, ['searchword', 'search']); const existingIndex = vidSheepUserinfoData.searchkeywords.indexOf(searchword); if (existingIndex !== -1) { vidSheepUserinfoData.searchkeywords.splice(existingIndex, 1) } vidSheepUserinfoData.searchkeywords.unshift(searchword); storage.set("vidSheepUserinfo", vidSheepUserinfoData); const baseUrl = vidSheepUserinfoData.apiSources[search]; if (!baseUrl) { return $done(responseStatus("失败", "不支持的搜索源")) } const requestUrl = baseUrl + encodeURIComponent(searchword); console.log(requestUrl + '============');
    return new Promise((resolve) => { fetchWithCallback({ url: requestUrl, method: "GET", headers: { "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3 Mobile/15E148 Safari/604.1", "Accept": "application/json", "Accept-Language": "zh-CN,zh-Hans;q=0.9" } }, (error, response, body) => { if (error) { resolve($done(responseStatus("失败", "搜索请求出错"))); return } try { const jsonBody = JSON.parse(body); let searchResult = { listlength: jsonBody.list.length, vidlist: [] }; jsonBody.list.forEach(item => { const cleanContent = item.vod_content ? item.vod_content.replace(/<\/?p>/g, '') : ""; const vidItem = { vid_id: item.vod_id || "", vid_name: item.vod_name || "", vid_img: item.vod_pic || "", vid_source: search, vid_content: cleanContent, vid_actor: item.vod_actor || "", vid_time_final: item.vod_time || "", vid_last_record: item.vod_last_record || "1" }; const vid_play_url = []; const vid_play_name = []; if (item.vod_play_url) { if (item.vod_play_url.includes('$$$')) { const sources = item.vod_play_url.split('$$$'); const episodes = sources[0].split('#'); episodes.forEach(episode => { const parts = episode.split('$'); if (parts.length === 2) { vid_play_name.push(parts[0]); vid_play_url.push(parts[1]) } }) } else { const episodes = item.vod_play_url.split('#'); episodes.forEach(episode => { const parts = episode.split('$'); if (parts.length === 2) { vid_play_name.push(parts[0]); vid_play_url.push(parts[1]) } }) } } vidItem.vid_play_url = vid_play_url; vidItem.vid_play_name = vid_play_name; if (vidSheepRecentData.vidlist.length >= 25) { vidSheepRecentData.vidlist.pop() } vidSheepRecentData.vidlist.unshift(vidItem); searchResult.vidlist.push(vidItem) }); storage.set("vidSheepRecent", vidSheepRecentData); resolve($done(responseStatus("成功", "搜索请求成功008", searchResult))) } catch (error) { resolve($done(responseStatus("失败", "搜索请求失败123"))) } }) });
}
// 获取最近搜索关键词
function handleSearchKeywords() { const { keywords } = parseUrlToParams(url, ['keywords']); if (keywords == "all") { const userSearchKeywords = vidSheepUserinfoData.searchkeywords; return $done(responseStatus("成功", userSearchKeywords, userSearchKeywords)) } if (keywords == "clear") { vidSheepUserinfoData.searchkeywords = []; storage.set("vidSheepUserinfo", vidSheepUserinfoData); return $done(responseStatus("成功", "搜索历史清空了")) } }
// AI推荐
function handleClearAI() { const { clearAI } = parseUrlToParams(url, ['clearAI']); return new Promise((resolve) => { const requestUrl = "https://omp7djvjwc5rouckyjz3q74nt40bgpgg.lambda-url.us-east-2.on.aws/process"; const requestHeaders = { 'Accept': `*/*`, 'Accept-Encoding': `gzip,deflate,br`, 'Connection': `keep-alive`, 'Content-Type': `application/json`, 'Host': `omp7djvjwc5rouckyjz3q74nt40bgpgg.lambda-url.us-east-2.on.aws`, 'User-Agent': `ChatBot%20iOS/1 CFNetwork/3826.400.120 Darwin/24.3.0`, 'Accept-Language': `zh-CN,zh-Hans;q=0.9` }; const requestBody = JSON.stringify({ "model": "gpt-4o", "messages": [{ "role": "system", "content": "你是一个有帮助的助手在 中文（简体） 语言" }, { "role": "user", "content": "推荐" }, { "content": "推荐4部高评分的关于" + clearAI + "的影视剧，仅列出名称，用逗号分隔，不要出现书名号等任何其他符号，如下格式：电视剧名称1，电视剧名称2，电视剧名称3，电视剧名称4", "role": "user" }], "temperature": 1, "stream": false }); fetchWithCallback({ url: requestUrl, method: "POST", headers: requestHeaders, body: requestBody }, (error, response, body) => { if (error) { console.log("AI推荐请求出错: " + error); resolve($done(responseStatus("失败", "AI推荐请求出错"))) } try { let combinedContent = ""; const contentRegex = /"content":"([^"]*)"/g; let match; while ((match = contentRegex.exec(body)) !== null) { combinedContent += match[1] } const contentArray = combinedContent.trim().split(/[，,]/); console.log("AI推荐内容: " + contentArray); resolve($done(responseStatus("成功", "AI推荐成功", contentArray))) } catch (e) { console.log("解析AI响应出错: " + e.message); resolve($done(responseStatus("失败", "解析AI响应出错"))) } }) }) }
// 获取最近搜索数据
function handleRecent() { const { recent } = parseUrlToParams(url, ['recent']); if (recent == "all") { return $done(responseStatus("成功获取最近列表", "获取最近搜索数据成功", vidSheepRecentData)) } if (recent == "clear") { vidSheepRecentData.vidlist = []; storage.set("vidSheepRecent", vidSheepRecentData); return $done(responseStatus("成功", "最近搜索数据清空了")) } }
// 删除最近搜索数据
function handleDeleteRecent() { const { deleteRecent } = parseUrlToParams(url, ['deleteRecent']); if (deleteRecent == "all") { vidSheepRecentData.vidlist = []; storage.set("vidSheepRecent", vidSheepRecentData); return $done(responseStatus("成功", "最近搜索数据全部清空了")) } vidSheepRecentData.vidlist.forEach(item => { if (item.vid_id == deleteRecent) { vidSheepRecentData.vidlist.splice(vidSheepRecentData.vidlist.indexOf(item), 1); storage.set("vidSheepRecent", vidSheepRecentData); return $done(responseStatus("成功", "最近搜索数据单项清空了")) } }) }
// 处理收藏数据
function handleCollect() { const urlParams = URLSearchParamsApi(url.split('?')[1]); const collect = urlParams.get('collect'); const state = urlParams.get('state') || ''; if (collect == "all") { return $done(responseStatus("成功获取收藏列表", "获取收藏数据成功", vidSheepCollectionData)) } if (state == 'add') { const collectDataItem = vidSheepRecentData.vidlist.find(item => item.vid_id == collect); if (collectDataItem) { const collectDataItemIndex = vidSheepCollectionData.vidlist.findIndex(item => item.vid_id == collect); if (collectDataItemIndex != -1) { vidSheepCollectionData.vidlist.splice(collectDataItemIndex, 1) } vidSheepCollectionData.vidlist.unshift(collectDataItem); storage.set("vidSheepCollection", vidSheepCollectionData); return $done(responseStatus("成功", "收藏数据添加成功")) } } vidSheepCollectionData.vidlist.forEach(item => { if (item.vid_id == collect) { vidSheepCollectionData.vidlist.splice(vidSheepCollectionData.vidlist.indexOf(item), 1); storage.set("vidSheepCollection", vidSheepCollectionData); return $done(responseStatus("成功", "收藏数据单项清空了")) } }) }
// 获取壁纸数据
function handleWallpaper() { const { wallpaper } = parseUrlToParams(url, ['wallpaper']); if (wallpaper == 'get') { const url = "https://mars-prod.whalean.com/poseidon-service/api/pubContent/getPublishContentRecommend?channelId=3&channelLabels=%E5%A3%81%E7%BA%B8%20%E9%A3%8E%E6%99%AF&channelName=%E9%A3%8E%E6%99%AF&needFindCollectStatus=1&needFindFollowStatus=1&needFindLikeStatus=1&needUserHeadSculpture=1&pageNo=1&pageSize=4&parentChannelId=1&parentChannelName=%E5%A3%81%E7%BA%B8&refresh_type=xl&scene=category&sortMode=new&userId=57934497"; const method = `GET`; const headers = { 'Accept': `application/json`, 'userId': `57934497`, 'Connection': `keep-alive`, 'extendedFields': `{"$os_version":"18.3.1","$device_id":"18B5AA5256AAA70E9032BA4C882AB4FF","distinct_id":"57934497","$os":"iOS","$screen_height":844,"$is_first_day":true,"$carrier":"unknow","$screen_width":390,"$model":"iPhone14,2","$wifi":false,"$network_type":"5G","$app_version":"6.9.35","$manufacturer":"Apple","channel_number":"","$project":"yaowang","appId":"1000","platform_type":"iOS","ab_param":""}`, 'Content-Type': `application/json`, 'Host': `mars-prod.whalean.com`, 'appkey': `mobile`, 'User-Agent': `YaoWang/6.9.35(iPhone;iOS 18.3.1;Scale/3.00)`, 'Accept-Language': `zh-Hans-CN;q=1,en-CN;q=0.9`, 'token': `2rpl0+V2MnSzovzaXsmFSg==`, 'Accept-Encoding': `gzip,deflate,br` }; const body = ``; const myRequest = { url: url, method: method, headers: headers, body: body }; return new Promise((resolve) => { fetchWithCallback(myRequest, (error, response, body) => { if (error) { console.log("获取壁纸数据失败: " + error); resolve($done(responseStatus("失败", "获取壁纸数据失败"))); return } try { const data = JSON.parse(body); const wallpaperUrls = []; data.data.forEach(item => { if (item.photos && item.photos.length > 0) { item.photos.forEach(photo => { if (photo.sourcePhoto && photo.sourcePhoto.url) { wallpaperUrls.push(photo.sourcePhoto.url) } }) } }); console.log(wallpaperUrls); resolve($done(responseStatus("成功", "获取壁纸数据成功", wallpaperUrls))) } catch (e) { console.log("解析壁纸数据出错: " + e.message); resolve($done(responseStatus("失败", "解析壁纸数据出错"))) } }) }) } vidSheepUserinfoData.BGimage = wallpaper; storage.set("vidSheepUserinfo", vidSheepUserinfoData); return $done(responseStatus("成功", "修改壁纸数据成功")) }
// 启动路由分发
routeRequest(url, routeHandlers);