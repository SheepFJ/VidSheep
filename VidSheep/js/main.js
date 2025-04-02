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

function showProfile() {
    currentPage = 'profile';
    setActiveButton('profileBtn');
    document.getElementById("main-container").innerHTML = `
        <div style="padding: 20px; border-radius: 12px; margin-top: 30px; max-width: 400px; margin-left: auto; margin-right: auto;">
            <h1 style="text-align: center; margin-bottom: 25px;">SHEEP</h1>
            
            <!-- 可折叠列表 -->
            <div class="collapsible-container">
                <!-- 关于我们 -->
                <div class="collapsible-item">
                    <div class="collapsible-header">
                        <span>关于</span>
                        <span class="arrow">▼</span>
                    </div>
                    <div class="collapsible-content">
                        <div style="text-align: left; color: #ddd; line-height: 1.6; padding: 10px;">
                            <h3 style="color: #f39c12; margin-top: 10px;">版本信息</h3>
                            <p>当前版本:<a href=" https://t.me/sheep_007xiaoyang/43" style="color: #3498db; text-decoration: none;" target="_blank">v1.0.0</a> </p>
                            <p>更新日期: 2025-03-31</p>
                            <p>更新内容:</p>
                            <ul style="padding-left: 20px;">
                                <li>优化了页面布局</li>
                                <li>兼容Loon</li>
                            </ul>
                            
                            <h3 style="color: #f39c12; margin-top: 20px;">关注/反馈</h3>
                            <p>GitHub: <a href="https://github.com/SheepFJ/VidSheep" style="color: #3498db; text-decoration: none;" target="_blank">SheepFJ</a></p>
                            <p>TG群组: <a href="https://t.me/sheep_007_xiaoyang" style="color: #3498db; text-decoration: none;" target="_blank">Sheep交流反馈</a></p>
                            
            
                        </div>
                    </div>
                </div>
                
                <!-- 设置 -->
                <div class="collapsible-item">
                    <div class="collapsible-header">
                        <span>设置</span>
                        <span class="arrow">▼</span>
                    </div>
                    <div class="collapsible-content">
                        <div style="text-align: left; color: #ddd; line-height: 1.6; padding: 10px;">
                            <p>装修中...</p>
                            <!-- 这里可以添加设置选项 -->
                        </div>
                    </div>
                </div>
                
                <!-- 收藏 -->
                <div class="collapsible-item">
                    <div class="collapsible-header">
                        <span>我的收藏</span>
                        <span class="arrow">▼</span>
                    </div>
                    <div class="collapsible-content">
                        <div style="text-align: left; color: #ddd; line-height: 1.6; padding: 10px;">
                            <p>装修中...</p>
                            <!-- 这里可以添加收藏列表 -->
                        </div>
                    </div>
                </div>
                
                <!-- 免责声明 -->
                <div class="collapsible-item">
                    <div class="collapsible-header">
                        <span>声明</span>
                        <span class="arrow">▼</span>
                    </div>
                    <div class="collapsible-content">
                        <div style="text-align: left; color: #ddd; line-height: 1.6; padding: 10px;">
                            <p>本工具仅供学习交流使用，请勿用于非法用途。所有内容均来自互联网，与开发者无关。</p>
                        </div>
                    </div>
                </div>
               <div class="collapsible-item">
                    <div class="collapsible-header">
                        <span>历史版本</span>
                        <span class="arrow">▼</span>
                    </div>
                    <div class="collapsible-content">
                        <div style="text-align: left; color: #ddd; line-height: 1.6; padding: 10px;">

                            <h3 style="color: #f39c12; margin-top: 10px;">v1.0.0</h3>
                            <p>更新时间: 2025-03-31</p>
                            <p>更新内容:</p>
                            <ul style="padding-left: 20px;">
                                <li>优化了页面布局</li>
                                <li>兼容Loon</li>
                            </ul>
                        
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <style>
            .collapsible-container {
                width: 100%;
            }
            .collapsible-item {
                margin-bottom: 10px;
                border-radius: 8px;
                overflow: hidden;
                background: rgba(30, 30, 30, 0.6);
            }
            .collapsible-header {
                padding: 15px;
                background: rgba(50, 50, 50, 0.6);
                color: #f39c12;
                font-weight: bold;
                cursor: pointer;
                display: flex;
                justify-content: space-between;
                align-items: center;
                transition: background 0.3s;
            }
            .collapsible-header:hover {
                background: rgba(60, 60, 60, 0.6);
            }
            .collapsible-content {
                max-height: 0;
                overflow: hidden;
                transition: max-height 0.3s ease-out;
            }
            .arrow {
                transition: transform 0.3s;
            }
            .active .arrow {
                transform: rotate(180deg);
            }
            .active + .collapsible-content {
                max-height: 1000px; /* 足够大的高度以显示内容 */
            }
        </style>
    `;


    // 定义toggleCollapsible函数在全局作用域
    window.toggleCollapsible = function (element) {
        // 先关闭所有已打开的折叠项
        const allActiveHeaders = document.querySelectorAll('.collapsible-header.active');
        allActiveHeaders.forEach(header => {
            if (header !== element) {
                header.classList.remove('active');
                const content = header.nextElementSibling;
                content.style.maxHeight = "0";
            }
        });

        // 切换当前点击的折叠项
        element.classList.toggle('active');
        const content = element.nextElementSibling;

        if (element.classList.contains('active')) {
            content.style.maxHeight = content.scrollHeight + "px";
        } else {
            content.style.maxHeight = "0";
        }
    };

    // 使用setTimeout确保DOM已经更新
    setTimeout(() => {
        // 添加折叠功能
        const collapsibleHeaders = document.querySelectorAll('.collapsible-header');
        collapsibleHeaders.forEach(header => {
            header.addEventListener('click', function () {
                toggleCollapsible(this);
            });
        });
    }, 100);
}
