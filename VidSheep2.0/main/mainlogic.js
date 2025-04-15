const isLoon = typeof $persistentStore !== "undefined";
const isQuanX = typeof $prefs !== "undefined";
const isSurge = !isLoon && !isQuanX;
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
const TimestampUtil = {
    getCurrent: function () {
        return new Date().getTime();
    },
    addMinutes: function (timestamp, minutes) {
        return timestamp + minutes * 60 * 1000;
    },
    isValid: function (currentTimestamp, oldTimestamp) {
        return currentTimestamp >= oldTimestamp;
    }
};
const nowtime = TimestampUtil.getCurrent();
const defaultUserData = {
    "backgroundimage": "https://mfiles.alphacoders.com/853/853922.jpg",
    "username": "小羊羔子1009",
    "imageauto": "true", 
    "time_up": "2025-04-07 10:00:00",
    "usersettingsimage": "false", 
    "statusbarcolor": "rgba(0,0,0,0.8)",
    "theme": "true",
    "initial": "false", 
    "currentTimestamp": 0,
    "oldTimestamp": 0,
    "historical_storage": {
        "current_index": 0,
        "max_storage": 20
    },
    "brightness": 0.5, 
    "vague": 2,
    "source": 1,
};
let userData = storage.get("sheep_userdata");
if (!userData) {
    storage.set("sheep_userdata", JSON.stringify(defaultUserData));
    userData = defaultUserData;
} else {
    try {
        userData = JSON.parse(userData);
        if (userData.initial === "true" || !userData.initial) {
            userData = defaultUserData;
            userData.initial = "false";
            storage.set("sheep_userdata", JSON.stringify(userData));
        }
    } catch (e) {
        storage.set("sheep_userdata", JSON.stringify(defaultUserData));
        userData = defaultUserData;
    }
}
if (userData.imageauto === "true" && TimestampUtil.isValid(nowtime, userData.oldTimestamp)) {

    userData.currentTimestamp = nowtime;
    userData.oldTimestamp = TimestampUtil.addMinutes(nowtime, 1440);
    storage.set("sheep_userdata", JSON.stringify(userData));

    const wallpaperRequest = {
        url: "https://api.52vmy.cn/api/wl/word/bing/tu",
        headers: {
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3 Mobile/15E148 Safari/604.1'
        }
    };
    fetchWithCallback(wallpaperRequest, (error, response, body) => {
        try {
            const responseData = typeof body === 'string' ? JSON.parse(body) : body;
            const imageUrl = responseData?.data?.phone_url;

            if (imageUrl) {
                userData.backgroundimage = imageUrl;
                storage.set("sheep_userdata", JSON.stringify(userData));
                notify("壁纸更新成功", "", imageUrl);
            } else {
                notify("壁纸更新失败", "", "未找到图片地址");
            }
        } catch (e) {
            console.log("解析错误：", e);
            notify("壁纸更新失败", "", "数据解析错误：" + e.message);
        }
        finishScript();
    });
} else {
    finishScript();
}
function finishScript() {
    const backgroundImage = userData.backgroundimage;
    const username = userData.username;
    const brightness = userData.brightness;
    const vague = userData.vague;
    const source = userData.source;

    const html = `<!DOCTYPE html>
    <html lang="zh-CN">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">
        <title>VidSheep</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/SheepFJ/VidSheep/VidSheep2.0/css/main.css">
        <link rel="stylesheet" href="https://at.alicdn.com/t/c/font_4885201_i2n2iwmepf.css">
    </head>
    <style>
        body::before {
            background-image: url(${backgroundImage});
        }
        body::after {
    background: rgba(18, 18, 18, ${brightness});
    backdrop-filter: blur(${vague}px);
}       
    </style>
    <body>   
        <div id="main-container"></div>
        <div id="play-container"> </div>
        <div id="recent-container"></div> 
        <div id="discover-container">
            <div id="discover-list"></div>
            <div id="discover-content"></div>
        </div>
        <div id="loading-results"></div>
        <div id="user-container"></div>
        <div id="PopUpWindow"></div>
        <footer>
            <div id="bottom-nav">
                <div class="nav-button" id="searchBtn" onclick="showSearch()">
                    <i class="iconfont icon-sousuo"></i>
                    <span>搜索</span>
                </div>
                <div class="nav-button" id="listBtn" onclick="showList()">
                    <i class="iconfont icon-zuijin"></i>
                    <span>最近</span>
                </div>
                <div class="nav-button nav-active" id="disCover" onclick="disCover()">
                    <i class="iconfont icon-faxian"></i>
                    <span>发现</span>
                </div>

              <!-- <div class="nav-button " id="profileBtn" onclick="showProfile()">
                    <i class="iconfont icon-wode"></i>
                    <span>我的</span>
                </div>  -->
            </div>
        </footer>
    </body>
    <script>
        const username = "${username}";
        const backgroundImage = "${backgroundImage}";
        const brightness = ${brightness};
        const vague = ${vague};
        const source = ${source};
    </script>   
    <script src="https://cdn.jsdelivr.net/gh/SheepFJ/VidSheep/VidSheep2.0/js/main.js"></script>
    </html>`;
    $done({
        status: "HTTP/1.1 200 OK",
        headers: { "Content-Type": "text/html" },
        body: html
    });
}