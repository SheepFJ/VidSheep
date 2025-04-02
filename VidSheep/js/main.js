// 当前活动页面
let currentPage = 'search';

function setActiveButton(buttonId) {
    document.querySelectorAll('.nav-button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(buttonId).classList.add('active');
}
//动画载入函数
function loadAnimation(results) {
    results.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%;">
            <div class="loading"></div>
            <div class="loading-text">加载中...</div>
        </div>
    `;
}

function search() {
    var wd = encodeURIComponent(document.getElementById("searchInput").value);
    var source = document.getElementById("sourceSelect").value;

    if (!wd) {
        alert("请输入搜索内容");
        return;
    }

    // 显示加载提示
    var results = document.getElementById("results");
    loadAnimation(results);

    var apiUrl = "https://api.sheep.com/sheep/videoPolymerization/videoword/" + source + "/?wd=" + wd;

    fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
            results.innerHTML = "";

            if (!data.list || data.list.length === 0) {
                results.innerHTML = '<div class="no-results">未找到相关影视，尝试切换源~</div>';
                return;
            }

            data.list.forEach((vod, index) => {
                var container = document.createElement("div");
                container.className = "movie-container";
                container.style.width = "calc(33.33% - 30px)"; // 确保每行显示三个

                var img = document.createElement("img");
                img.src = vod.vod_pic;
                img.onerror = function () { this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTUwIiB2aWV3Qm94PSIwIDAgMTAwIDE1MCIgZmlsbD0iIzMzMyI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxNTAiIGZpbGw9IiMyMjIiLz48dGV4dCB4PSI1MCIgeT0iNzUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2FhYSI+无图片</dGV4dD48L3N2Zz4='; };
                img.onclick = function () { loadVideoInfo(index); };

                var title = document.createElement("p");
                title.textContent = vod.vod_name;

                container.appendChild(img);
                container.appendChild(title);
                results.appendChild(container);

                // **存储到本地，便于匹配点击事件**
                localStorage.setItem("sheep_vod_info_" + index, JSON.stringify(vod));
            });
        })
        .catch(err => {
            console.error("请求失败", err);
            results.innerHTML = '<div class="no-results">搜索失败，请稍后重试</div>';
        });
}

function loadVideoInfo(vodId) {

    var results = document.getElementById("main-container");
    loadAnimation(results);

    var apiUrl = "https://api.sheep.com/sheep/videoPolymerization/zhanshi/sheep_vod_info_" + vodId;

    fetch(apiUrl)
        .then(res => res.text())
        .then(html => {
            document.getElementById("main-container").innerHTML = html;
        })
        .catch(err => {
            console.error("加载详情失败", err);
            document.getElementById("main-container").innerHTML = '<div class="no-results">加载详情失败，请稍后重试</div>';
        });
}

function showSearch() {
    currentPage = 'search';
    setActiveButton('searchBtn');
    document.getElementById("main-container").innerHTML = `
        <h1>影视搜索</h1>
        <div class="search-form">
            <input type="text" id="searchInput" placeholder="输入影视名称">
            <select id="sourceSelect">
                <option value="1">源1</option>
                <option value="2">源2</option>
            </select>
            <button onclick="search()">搜索</button>
        </div>
        <div id="results"></div>
    `;
}

function showList() {
    currentPage = 'list';
    setActiveButton('listBtn');
    var results = document.getElementById("main-container");
    loadAnimation(results);

    fetch("https://api.sheep.com/sheep/videoPolymerization/zhanshi/sheep_vod_info_1000")
        .then(res => res.text())
        .then(html => {
            document.getElementById("main-container").innerHTML = html;
        })
        .catch(err => {
            console.error("加载列表失败", err);
        });
}


