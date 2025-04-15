const isLoon = typeof $persistentStore !== "undefined";
const isQuanX = typeof $prefs !== "undefined";
const isSurge = !isLoon && !isQuanX;
function log(message) {
    // console.log(`[VidSheep] ${message}`);
}
const storage = {
    get: key => {
        if (isLoon || isSurge) return $persistentStore.read(key);
        if (isQuanX) return $prefs.valueForKey(key);
        return null;
    },
    set: (key, value) => {
        if (isLoon || isSurge) return $persistentStore.write(value, key);
        if (isQuanX) return $prefs.setValueForKey(value, key);
        return false;
    }
};
const notify = (title, subtitle, message) => {
    if (isLoon || isSurge) {
        $notification.post(title, subtitle, message);
    } else if (isQuanX) {
        $notify(title, subtitle, message);
    }
};
function fetchWithCallback(options, callback) {
    if (isLoon || isSurge) {
        if (options.method === "POST") {
            $httpClient.post(options, callback);
        } else {
            $httpClient.get(options, callback);
        }
    } else if (isQuanX) {
        $task.fetch(options).then(response => {
            callback(null, response, response.body);
        }).catch(error => {
            notify("请求失败", "", JSON.stringify(error));
            callback(error, null, null);
        });
    }
}
let userData = {};
try {
    const rawData = storage.get("sheep_userdata");
    userData = rawData ? JSON.parse(rawData) : {};
    if (!userData.historical_storage) {
        userData.historical_storage = {
            current_index: 0,
            max_storage: 20
        };
        storage.set("sheep_userdata", JSON.stringify(userData));
    }
} catch (e) {
    log(`解析userData失败: ${e.message}`);
    userData = {
        historical_storage: {
            current_index: 0,
            max_storage: 20
        }
    };
    storage.set("sheep_userdata", JSON.stringify(userData));
}
const url = $request.url;
const routeHandlers = {
    userInfo: {
        match: (url) => url.includes('/userinfo/'),
        handlers: {
            username: {
                match: (url) => url.includes('/username/'),
                handle: handleUsernameRequest
            },
        },
        defaultHandler: () => $done({})
    },
    videoSearch: {
        match: (url) => url.includes('/videoword/'),
        handle: handleSearchRequest
    },
    videoDetail: {
        match: (url) => url.includes('/videolist/'),
        handle: handleVideoDetailRequest
    },
    api: {
        match: (url) => url.includes('/api/'),
        handlers: {
            backimage: {
                match: (url) => url.includes('/backimage/'),
                handle: handleBackimageRequest
            },
            collect: {
                match: (url) => url.includes('/collect/'),
                handle: handleCollectRequest,
            },
            exhibit:{
                match: (url) => url.includes('/exhibit'),
                handle: handleCollectExhibitRequest
            },
            source: {
                match: (url) => url.includes('/source/'),
                handle: handleSourceRequest
            }
        },
        defaultHandler: () => $done({ body: JSON.stringify({ error: "无效的API请求" }) })
    }
};
function routeRequest(url, routeMap) {
    for (const routeKey in routeMap) {
        const route = routeMap[routeKey];
        if (route.match(url)) {
            if (route.handlers) {
                for (const subRouteKey in route.handlers) {
                    const subRoute = route.handlers[subRouteKey];
                    if (subRoute.match(url)) {
                        return subRoute.handle();
                    }
                }
                return route.defaultHandler ? route.defaultHandler() : $done({});
            }
            if (route.handle) {
                return route.handle();
            }
        }
    }
    return $done({});
}
routeRequest(url, routeHandlers);
function handleSearchRequest() {
    try {
        const urlMatch = $request.url.match(/sheep\/videoPolymerization\/videoword\/([^\/]+)\/\?wd=(.*)/);
        if (!urlMatch) {
            log("无效的请求格式");
            $done({ body: JSON.stringify({ error: "无效的请求格式" }) });
            return;
        }
        const source = urlMatch[1];
        const wd = decodeURIComponent(urlMatch[2]);
        log(`搜索来源: ${source}, 关键词: ${wd}`);
        const apiSources = {
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
            "13": "https://api.zuidapi.com/api.php/provide/vod/?ac=detail&wd=",//最大
        };
        const baseUrl = apiSources[source];
        if (!baseUrl) {
            log(`不支持的来源: ${source}`);
            $done({ body: JSON.stringify({ error: "不支持的 source" }) });
            return;
        }

        // 构建完整请求 URL
        const requestUrl = baseUrl + encodeURIComponent(wd);
        log(`请求URL: ${requestUrl}`);
        fetchWithCallback({
            url: requestUrl,
            method: "GET",
            headers: {
                "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3 Mobile/15E148 Safari/604.1",
                "Accept": "application/json",
                "Accept-Language": "zh-CN,zh-Hans;q=0.9"
            }
        }, (error, response, body) => {
            if (error) {
                log(`请求失败: ${JSON.stringify(error)}`);
                notify("请求失败", "", JSON.stringify(error));
                $done({ body: JSON.stringify({ error: "网络错误", detail: error.message || error }) });
                return;
            }

            try {
                if (!body) {
                    throw new Error("响应内容为空");
                }
                
                // 解析JSON响应
                const json = JSON.parse(body);
                if (!json || !json.list) {
                    throw new Error("返回结果格式不正确");
                }
                const storedResult = storeVodData(json.list || []);
                log(`数据解析成功, 共找到 ${json.list.length} 个结果`);
                $done({ 
                    body: JSON.stringify({ 
                        success: "成功获取数据", 
                        total: json.list.length,
                        data: storedResult.data,
                        index_info: storedResult.index_info
                    }) 
                });
            } catch (e) {
                log(`解析失败: ${e.message}`);
                $done({ body: JSON.stringify({ error: "解析失败", message: e.message }) });
            }
        });
    } catch (e) {
        log(`处理搜索请求失败: ${e.message}`);
        $done({ body: JSON.stringify({ error: "处理请求失败", message: e.message }) });
    }
}
function storeVodData(vodList) {
    let storedData = {};  // 用于存储所有视频数据的对象
    let successCount = 0;
    let indexMapping = {}; // 添加索引映射对象
    let startIndex = null; // 记录本次存储的起始索引
    let currentIndex = userData.historical_storage.current_index || 0;
    const maxStorage = userData.historical_storage.max_storage || 20;
    
    // 记录本次存储起始的索引值
    startIndex = currentIndex;

    for (let i = 0; i < vodList.length; i++) {
        try {
            let vod = vodList[i];
            
            if (!vod) {
                log(`第${i}项视频数据为空`);
                continue;
            }

            let vodName = vod.vod_name || "未知标题"; // 标题
            let vodPic = vod.vod_pic || ""; // 图片地址
            let vodContent = vod.vod_content || "无简介"; // 简介
            let vodPlayUrl = vod.vod_play_url || ""; // 播放地址

            // 解析播放地址
            let episodes = [];
            if (vodPlayUrl) {
                let playParts = vodPlayUrl.split("#");  // 根据#符号分隔

                for (let j = 0; j < playParts.length; j++) {
                    if (!playParts[j]) continue;
                    
                    let episodeDetails = playParts[j].split("$");
                    let episodeTitle = episodeDetails[0] || `第${j+1}集`;
                    let episodeUrl = episodeDetails[1] || "";
                    episodes.push(`${episodeTitle}: ${episodeUrl}`);
                }
            }
            let storeValue = [vodName, vodPic, vodContent, ...episodes].join(",");
            let key = `sheep_vod_info_${currentIndex}`;

            indexMapping[i] = currentIndex;
            
            // 更新循环索引
            currentIndex = (currentIndex + 1) % maxStorage;
            
            // 更新存储索引
            userData.historical_storage.current_index = currentIndex;
            storage.set("sheep_userdata", JSON.stringify(userData));
            
            // 存储到本地
            let storeResult = storage.set(key, storeValue);
            
            if (storeResult) {
                // 添加到返回对象
                storedData[key] = storeValue;
                successCount++;
            } else {
                log(`存储第${i}项数据失败，键：${key}`);
            }
        } catch (e) {
            log(`处理第${i}项数据失败: ${e.message}`);
        }
    }

    // 存储索引映射信息到localStorage
    storage.set("sheep_index_mapping", JSON.stringify({
        startIndex: startIndex,
        mapping: indexMapping,
        timestamp: new Date().getTime()
    }));

    log(`成功存储 ${successCount}/${vodList.length} 条数据，当前索引：${userData.historical_storage.current_index}`);
    log(`存储索引映射：起始索引=${startIndex}, 映射关系=${JSON.stringify(indexMapping)}`);
    
    // 返回存储数据对象，并添加映射信息
    return {
        data: storedData,
        index_info: {
            start_index: startIndex,
            mapping: indexMapping
        }
    };
}

// 新增处理影片详情请求的函数
function handleVideoDetailRequest() {
    try {
        const urlMatch = $request.url.match(/sheep\/videoPolymerization\/videolist\/(\d+)/);
        if (!urlMatch) {
            log("无效的详情请求格式");
            $done({ body: JSON.stringify({ error: "无效的请求格式" }) });
            return;
        }
        
        // 获取请求的视频索引（即前端列表中的位置）
        const listIndex = parseInt(urlMatch[1]);

        // 如果listIndex为999，则返回sheep_vod_info_0 到maxStorage的所有信息到前端
        if (listIndex === 999) {
            log("请求所有已存储的影片信息");
            const maxStorage = userData.historical_storage?.max_storage || 20;
            const allStoredData = {};
            let totalFound = 0;
            
            // 遍历所有可能的索引查找数据
            for (let i = 0; i < maxStorage; i++) {
                const tempKey = `sheep_vod_info_${i}`;
                const tempInfo = storage.get(tempKey);
                if (tempInfo) {
                    allStoredData[tempKey] = tempInfo;
                    totalFound++;
                }
            }
            
            if (totalFound > 0) {
                log(`找到${totalFound}条存储的影片信息`);
                const responseData = {
                    success: "获取所有影片信息成功",
                    total: totalFound,
                    data: allStoredData
                };
                $done({ body: JSON.stringify(responseData) });
                return;
            } else {
                log("未找到任何存储的影片信息");
                $done({ body: JSON.stringify({ error: "未找到任何存储的影片信息" }) });
                return;
            }
        }

        log(`获取详情, 列表索引: ${listIndex}`);
        
        // 尝试从索引映射中查找实际存储键
        let actualKey = null;
        const mappingInfo = storage.get("sheep_index_mapping");
        
        if (mappingInfo) {
            try {
                const mappingData = JSON.parse(mappingInfo);
                
                // 检查映射数据中是否有这个索引的映射
                if (mappingData.mapping && mappingData.mapping[listIndex] !== undefined) {
                    // 找到实际存储的索引
                    const storageIndex = mappingData.mapping[listIndex];
                    actualKey = `sheep_vod_info_${storageIndex}`;
                    log(`从映射找到实际存储键: ${actualKey}, 原始列表索引: ${listIndex}`);
                }
            } catch (e) {
                log(`解析索引映射数据失败: ${e.message}`);
            }
        }
        
        // 如果没有找到映射，使用直接索引
        if (!actualKey) {
            actualKey = `sheep_vod_info_${listIndex}`;
            log(`无映射数据，直接使用列表索引作为存储键: ${actualKey}`);
        }
        
        // 从本地存储中获取对应索引的影片信息
        const storedVodInfo = storage.get(actualKey);
        
        if (!storedVodInfo) {
            log(`未找到影片信息, 键: ${actualKey}`);
            
            // 尝试搜索所有可能的索引
            const maxStorage = userData.historical_storage?.max_storage || 20;
            let foundInfo = null;
            let foundKey = null;
            
            // 遍历所有可能的索引查找数据
            for (let i = 0; i < maxStorage; i++) {
                const tempKey = `sheep_vod_info_${i}`;
                const tempInfo = storage.get(tempKey);
                if (tempInfo) {
                    // 存储最后一个找到的信息作为备用
                    foundInfo = tempInfo;
                    foundKey = tempKey;
                }
            }
            
            // 如果找到了任何信息，使用最后找到的作为响应
            if (foundInfo) {
                log(`未找到键${actualKey}，但找到备选数据，键: ${foundKey}`);
                const responseData = {
                    success: "剧集信息获取成功(备选)",
                    total: 1,
                    data: {
                        [foundKey]: foundInfo
                    },
                    actual_index: foundKey.replace('sheep_vod_info_', '')
                };
                $done({ body: JSON.stringify(responseData) });
                return;
            }
            
            // 如果完全没有找到数据，返回错误
            $done({ body: JSON.stringify({ error: "未找到任何影片信息", request_index: listIndex }) });
            return;
        }
        
        log(`成功获取影片信息, 键: ${actualKey}, 长度: ${storedVodInfo.length}`);
        // 构建响应对象
        const responseData = {
            success: "剧集信息获取成功",
            total: 1,
            data: {
                [actualKey]: storedVodInfo
            },
            actual_index: actualKey.replace('sheep_vod_info_', '')
        };
        
        $done({ body: JSON.stringify(responseData) });
    } catch (e) {
        log(`处理详情请求失败: ${e.message}`);
        $done({ body: JSON.stringify({ error: "处理详情请求失败", message: e.message }) });
    }
}

// 处理用户名请求
function handleUsernameRequest() {
    try {
        const match = url.match(/\/videoPolymerization\/userinfo\/username\/([^\/\?]+)/);
        if (match && match[1]) {
            // url编码转换
            const username = decodeURIComponent(match[1]);
            userData.username = username;
            const saved = storage.set("sheep_userdata", JSON.stringify(userData));
            log(`保存用户名结果: ${saved ? '成功' : '失败'}`);
        }
        // 以json格式响应
        $done({
            body: JSON.stringify(userData)
        });
    } catch (e) {
        log(`处理用户名请求失败: ${e.message}`);
        $done({ body: JSON.stringify({ error: e.message }) });
    }
}

// 处理壁纸设置请求
function handleBackimageRequest() {
    try {
        log(`处理壁纸设置请求: ${url}`);
        
        // 解析URL中的参数
        const urlObj = new URL(url);
        const params = urlObj.searchParams;
        
        // 获取壁纸URL、亮度和模糊度参数
        const wallpaperUrl = params.get('url');
        const brightness = params.get('mingdu');
        const blur = params.get('mohu');
        
        log(`壁纸参数: URL=${wallpaperUrl}, 亮度=${brightness}, 模糊度=${blur}`);
        
        // 验证参数
        if (!wallpaperUrl) {
            log('壁纸URL参数缺失');
            $done({ body: JSON.stringify({ error: "壁纸URL参数缺失" }) });
            return;
        }
        
        // 解析亮度和模糊度值，并应用默认值（如果参数无效）
        const parsedBrightness = parseFloat(brightness);
        const parsedBlur = parseInt(blur);
        
        // 更新用户数据
        userData.backgroundimage = wallpaperUrl;
        userData.brightness = !isNaN(parsedBrightness) ? Math.min(1, Math.max(0, parsedBrightness)) : 0.5;
        userData.vague = !isNaN(parsedBlur) ? Math.min(10, Math.max(0, parsedBlur)) : 2;
        userData.imageauto = "false";             // 禁用自动更新壁纸
        userData.usersettingsimage = "true";      // 标记为用户设置的壁纸
        
        // 保存更新后的用户数据
        const saved = storage.set("sheep_userdata", JSON.stringify(userData));
        
        if (saved) {
            log('壁纸设置已保存');
            $done({ 
                body: JSON.stringify({ 
                    success: true, 
                    message: "壁纸设置已保存",
                    data: {
                        url: wallpaperUrl,
                        brightness: userData.brightness,
                        blur: userData.vague
                    }
                }) 
            });
        } else {
            log('保存壁纸设置失败');
            $done({ body: JSON.stringify({ error: "保存设置失败" }) });
        }
    } catch (e) {
        log(`处理壁纸设置请求失败: ${e.message}`);
        $done({ body: JSON.stringify({ error: `处理请求失败: ${e.message}` }) });
    }
}

// 处理收藏请求
function handleCollectRequest() {
    try {
        log(`处理收藏请求: ${url}`);
        
        // 从URL中提取要收藏的视频ID
        const match = url.match(/\/collect\/([^\/\?]+)/);
        if (!match || !match[1]) {
            log('无效的收藏请求：未指定视频ID');
            $done({ body: JSON.stringify({ error: "请指定要收藏的视频ID" }) });
            return;
        }
        
        const videoId = match[1];
        log(`收藏视频ID: ${videoId}`);
        
        // 从本地存储中读取该视频信息
        const videoInfo = storage.get(videoId);
        if (!videoInfo) {
            log(`未找到视频信息: ${videoId}`);
            $done({ body: JSON.stringify({ error: "未找到指定视频信息" }) });
            return;
        }
        
        // 查找最大的收藏索引并生成新的收藏ID
        let maxIndex = -1;
        for (let i = 0; i < 100; i++) { // 设置一个合理的上限以避免无限循环
            const testKey = `sheep_collect_${i}`;
            if (storage.get(testKey)) {
                maxIndex = i;
            } else if (i > maxIndex + 1) { // 如果超过已知的最大索引+1，停止查找
                break;
            }
        }
        
        // 新的收藏ID使用 maxIndex + 1
        const newIndex = maxIndex + 1;
        const collectId = `sheep_collect_${newIndex}`;
        
        // 保存收藏信息
        const saved = storage.set(collectId, videoInfo);
        if (!saved) {
            log(`保存收藏失败: ${collectId}`);
            $done({ body: JSON.stringify({ error: "保存收藏失败" }) });
            return;
        }
        
        log(`收藏成功: ${collectId}`);
        $done({ 
            body: JSON.stringify({ 
                success: true, 
                message: "收藏成功",
                data: {
                    collect_id: collectId,
                    video_id: videoId
                }
            }) 
        });
    } catch (e) {
        log(`处理收藏请求失败: ${e.message}`);
        $done({ body: JSON.stringify({ error: `处理收藏请求失败: ${e.message}` }) });
    }
}

// 处理收藏展示请求
function handleCollectExhibitRequest() {
    try {
        log(`处理收藏展示请求`);
        
        // 直接搜索所有可能的收藏记录
        const collects = {};
        let validCount = 0;
        
        // 设置一个合理的上限以避免无限循环
        for (let i = 0; i < 1000; i++) {
            const collectId = `sheep_collect_${i}`;
            const collectInfo = storage.get(collectId);
            
            if (collectInfo) {
                collects[collectId] = collectInfo;
                validCount++;
            } else if (validCount > 0 && i > validCount + 10) {
                // 如果已找到一些记录，且当前索引远大于找到的记录数，可以提前结束搜索
                // 这里+10是留出一些空间，避免因为删除的记录导致提前结束
                break;
            }
        }
        
        if (validCount === 0) {
            log('没有收藏记录');
            $done({ 
                body: JSON.stringify({ 
                    success: true,
                    message: "没有收藏记录",
                    total: 0,
                    data: {}
                }) 
            });
            return;
        }
        
        log(`找到${validCount}条收藏记录`);
        $done({ 
            body: JSON.stringify({ 
                success: true,
                message: `找到${validCount}条收藏记录`,
                total: validCount,
                data: collects
            }) 
        });
    } catch (e) {
        log(`处理收藏展示请求失败: ${e.message}`);
        $done({ body: JSON.stringify({ error: `处理收藏展示请求失败: ${e.message}` }) });
    }
}

// 处理默认源设置请求
function handleSourceRequest() {
    try {
        log(`处理默认源设置请求: ${url}`);
        
        // 从URL中提取要设置的源ID
        const match = url.match(/\/source\/([^\/\?]+)/);
        if (!match || !match[1]) {
            log('无效的源设置请求：未指定源ID');
            $done({ body: JSON.stringify({ error: "请指定要设置的源ID" }) });
            return;
        }
        
        const sourceId = match[1];
        log(`设置默认源ID: ${sourceId}`);
        
        // 验证源ID是否有效（在1-13之间）
        const sourceNum = parseInt(sourceId);
        if (isNaN(sourceNum) || sourceNum < 1 || sourceNum > 13) {
            log(`无效的源ID: ${sourceId}`);
            $done({ body: JSON.stringify({ error: "无效的源ID，请提供1-13之间的数字" }) });
            return;
        }
        
        // 更新用户数据中的源设置
        userData.source = sourceId;
        
        // 保存更新后的用户数据
        const saved = storage.set("sheep_userdata", JSON.stringify(userData));
        
        if (saved) {
            log(`默认源已更新为: ${sourceId}`);
            $done({ 
                body: JSON.stringify({ 
                    success: true, 
                    message: "默认源设置已保存",
                    data: {
                        source: sourceId
                    }
                }) 
            });
        } else {
            log('保存默认源设置失败');
            $done({ body: JSON.stringify({ error: "保存设置失败" }) });
        }
    } catch (e) {
        log(`处理默认源设置请求失败: ${e.message}`);
        $done({ body: JSON.stringify({ error: `处理请求失败: ${e.message}` }) });
    }
}
