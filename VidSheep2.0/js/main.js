// 打开关闭user对话栏
function toggleCollapsible(element) {
    // 关闭其他折叠项
    document.querySelectorAll('.user-collapsible-header.user-active').forEach(header => {
        if (header !== element) {
            header.classList.remove('user-active');
            header.nextElementSibling.style.maxHeight = "0";
        }
    });

    // 切换当前折叠项
    element.classList.toggle('user-active');
    const content = element.nextElementSibling;
    content.style.maxHeight = element.classList.contains('user-active') ? content.scrollHeight + "px" : "0";
}

// 关闭名称修改弹窗
function closeUsernamePopup() {
    const popUpWindow = document.getElementById('PopUpWindow');
    popUpWindow.style.display = 'none';
}

// 确认修改名称
function confirmUsernameEdit() {
    const newUsername = document.getElementById('newUsername').value.trim();
    if (!newUsername) {
        alert('用户名不能为空！');
        return;
    }

    // 发送请求修改用户名
    fetch(`https://api.sheep.com/sheep/videoPolymerization/userinfo/username/${encodeURIComponent(newUsername)}`)
        .then(response => response.json())
        .then(data => {
            if (data && data.username) {
                document.querySelector('.user-title').textContent = data.username;
                closeUsernamePopup();
            } else {
                alert('修改失败，请稍后重试！');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('修改失败，请稍后重试！');
        });
}

// 页面加载时清空play-container
document.addEventListener('DOMContentLoaded', function() {
    // 确保加载页面时play-container为空
    const playContainer = document.getElementById('play-container');
    if (playContainer) playContainer.innerHTML = '';
});

// 我的页面--关于--历史版本
function showProfile() {
    // 隐藏播放容器
    const playContainer = document.getElementById('play-container');
    if (playContainer) {
        playContainer.style.display = 'none';
        playContainer.innerHTML = '';
    }
    
    // 隐藏最近观看容器
    const recentContainer = document.getElementById('recent-container');
    if (recentContainer) {
        recentContainer.classList.remove('visible');
        recentContainer.style.display = 'none';
    }
    
    // 隐藏主容器
    const mainContainer = document.getElementById("main-container");
    if (mainContainer) {
        mainContainer.style.display = 'none';
    }
    
    // 隐藏发现容器
    const discoverContainer = document.getElementById('discover-container');
    if (discoverContainer) {
        discoverContainer.style.display = 'none';
    }
    
    // 使用用户容器而不是主容器
    const userContainer = document.getElementById("user-container");
    if (!userContainer) return;
    
    userContainer.innerHTML = `
    <div class="username-container">
        <h1 class="user-title">${username}</h1>
        <i class="iconfont icon-xiugai xiuGaiUserName"></i>
    </div>
    <!-- 可折叠列表 -->
    <div class="user-collapsible-container">
        <!-- 关于我们 -->
        <div class="user-collapsible-item">
            <div class="user-collapsible-header">
                <span>关于</span>
                <span class="arrow">▼</span>
            </div>
            <div class="user-collapsible-content">
                <div class="user-content">
                    <h3 class="version-title">版本信息</h3>
                    <p>当前版本:<a href="https://t.me/sheep_007xiaoyang/43" target="_blank">v1.0.0</a></p>
                    <p>更新日期: 2025-03-31</p>
                    <p>更新内容:</p>
                    <ul class="update-list">
                        <li>优化了页面布局</li>
                        <li>兼容Loon</li>
                    </ul>

                    <h3 class="feedback-title">关注/反馈</h3>
                    <p>GitHub: <a href="https://github.com/SheepFJ/QuantumultX" target="_blank">SheepFJ</a></p>
                    <p>TG群组: <a href="https://t.me/sheep_007_xiaoyang" target="_blank">Sheep交流反馈</a></p>
                </div>
            </div>
        </div>

        <!-- 设置 -->
        <div class="user-collapsible-item">
            <div class="user-collapsible-header">
                <span>设置</span>
                <span class="arrow">▼</span>
            </div>
            <div class="user-collapsible-content">
                <div class="user-content">
                    <p>装修中...</p>
                    <!-- 这里可以添加设置选项 -->
                </div>
            </div>
        </div>

        <!-- 收藏 -->
        <div class="user-collapsible-item">
            <div class="user-collapsible-header">
                <span>我的收藏</span>
                <span class="arrow">▼</span>
            </div>
            <div class="user-collapsible-content">
                <div class="user-content">
                    <p>装修中...</p>
                    <!-- 这里可以添加收藏列表 -->
                </div>
            </div>
        </div>

        <!-- 免责声明 -->
        <div class="user-collapsible-item">
            <div class="user-collapsible-header">
                <span>声明</span>
                <span class="arrow">▼</span>
            </div>
            <div class="user-collapsible-content">
                <div class="user-content">
                    <p>本工具仅供学习交流使用，请勿用于非法用途。所有内容均来自互联网，与开发者无关。</p>
                </div>
            </div>
        </div>
        <!-- 历史版本 -->
        <div class="user-collapsible-item">
            <div class="user-collapsible-header">
                <span>历史版本</span>
                <span class="arrow">▼</span>
            </div>
            <div class="user-collapsible-content">
                <div class="user-content">
                    <h3 class="version-title">v1.0.0</h3>
                    <p>更新时间: 2025-03-31</p>
                    <p>更新内容:</p>
                    <ul class="update-list">
                        <li>优化了页面布局</li>
                        <li>兼容Loon</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
`;
    // 显示用户容器
    userContainer.style.display = 'block';
}

// 等待动画加载
function loadAnimation(loadingResults) {
    loadingResults.innerHTML = `
     <div class="loading-all">
         <div class="loading-animation"></div>
         <div class="loading-text">加载中...</div>
     </div>
 `;
}

// 搜素事件
function showSearch() {
    // 隐藏播放容器
    const playContainer = document.getElementById('play-container');
    if (playContainer) {
        playContainer.style.display = 'none';
        playContainer.innerHTML = '';
    }
    
    // 隐藏最近观看容器
    const recentContainer = document.getElementById('recent-container');
    if (recentContainer) {
        recentContainer.classList.remove('visible');
        recentContainer.style.display = 'none';
    }
    
    // 隐藏用户容器
    const userContainer = document.getElementById('user-container');
    if (userContainer) {
        userContainer.style.display = 'none';
    }
    
    // 隐藏发现容器
    const discoverContainer = document.getElementById('discover-container');
    if (discoverContainer) {
        discoverContainer.style.display = 'none';
    }
    
    // 清空loading-results
    const loadingResults = document.getElementById("loading-results");
    if (loadingResults) {
        loadingResults.innerHTML = "";
    }
    
    // 获取主容器
    const mainContainer = document.getElementById("main-container");
    
    // 检查是否已经有搜索表单，如果有则不重新创建
    const existingSearchForm = mainContainer.querySelector('.search-form');
    if (!existingSearchForm) {
        mainContainer.innerHTML = `
            <h1 class="search-title">影视搜索</h1>
            <div class="search-form">
                <input class="search-input" type="text" id="searchInput" placeholder="输入影视名称">
                <select class="search-select" id="sourceSelect">
                    <option value="1" ${source === 1 ? 'selected' : ''}>急速资源</option>
                    <option value="2" ${source === 2 ? 'selected' : ''}>魔都资源</option>
                    <option value="3" ${source === 3 ? 'selected' : ''}>索尼资源</option>
                    <option value="4" ${source === 4 ? 'selected' : ''}>速播资源</option>
                    <option value="5" ${source === 5 ? 'selected' : ''}>量子资源</option>
                    <option value="6" ${source === 6 ? 'selected' : ''}>量子资源1</option>
                    <option value="7" ${source === 7 ? 'selected' : ''}>飘零资源</option>
                    <option value="8" ${source === 8 ? 'selected' : ''}>苹果资源</option>
                    <option value="9" ${source === 9 ? 'selected' : ''}>360资源</option>
                    <option value="10" ${source === 10 ? 'selected' : ''}>光束资源</option>
                    <option value="11" ${source === 11 ? 'selected' : ''}>卧龙资源</option>
                    <option value="12" ${source === 12 ? 'selected' : ''}>暴风资源</option>
                    <option value="13" ${source === 13 ? 'selected' : ''}>最大资源</option>
                </select>
                <button class="search-button">搜索</button>
            </div>
            <div id="search-imgplay"></div>
        `;
    }
    
    // 显示主容器
    mainContainer.style.display = 'block';
}

// 解析视频数据的通用函数
function parseVideoData(dataString) {
    if (!dataString) {
        return {
            title: '未知标题',
            image: '',
            description: '暂无简介',
            episodes: []
        };
    }
    
    try {
        const parts = dataString.split(',');
        return {
            title: parts[0] || '未知标题',
            image: parts[1] || '',
            description: parts[2] || '暂无简介',
            episodes: parts.slice(3) || []
        };
    } catch (error) {
        console.error('解析视频数据失败:', error);
        return {
            title: '解析错误',
            image: '',
            description: '数据解析失败',
            episodes: []
        };
    }
}

// 处理详情数据的函数
function processDetailData(detailData) {
    // 如果是对象，获取第一个值
    let dataString = '';
    
    if (typeof detailData === 'object') {
        // 如果是具有data属性的API响应
        if (detailData.data && Object.values(detailData.data).length > 0) {
            dataString = Object.values(detailData.data)[0];
        } 
        // 如果直接是数据对象
        else if (Object.values(detailData).length > 0) {
            dataString = Object.values(detailData)[0];
        }
    } 
    // 如果已经是字符串
    else if (typeof detailData === 'string') {
        dataString = detailData;
    }
    
    return parseVideoData(dataString);
}

// 辅助函数：复制文本到剪贴板
function copyToClipboard(text, callback) {
    // 优先使用现代Clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function() {
            if (callback) callback(true);
        }).catch(function(err) {
            console.error('Clipboard API失败:', err);
            fallbackCopy();
        });
    } else {
        fallbackCopy();
    }

    // 备用复制方法
    function fallbackCopy() {
        try {
            // 创建临时textarea元素
            const textArea = document.createElement('textarea');
            textArea.value = text;
            
            // 设置样式避免闪烁
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            
            // 选择并复制文本
            textArea.focus();
            textArea.select();
            
            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);
            
            if (callback) callback(successful);
        } catch (err) {
            console.error('Fallback复制失败:', err);
            if (callback) callback(false);
        }
    }
}

// 搜索
function search() {
    const searchInput = document.getElementById("searchInput");
    if (!searchInput) {
        console.error("搜索输入框不存在");
        return;
    }
    
    const wd = encodeURIComponent(searchInput.value);
    const sourceSelect = document.getElementById("sourceSelect");
    if (!sourceSelect) {
        console.error("源选择框不存在");
        return;
    }
    
    const source = sourceSelect.value;

    if (!wd) {
        alert("请输入搜索内容");
        return;
    }

    // 显示加载提示
    const results = document.getElementById("loading-results");
    if (results) loadAnimation(results);

    const apiUrl = "https://api.sheep.com/sheep/videoPolymerization/videoword/" + source + "/?wd=" + wd;

    fetch(apiUrl)
        .then(res => res.json())
        .then(response => {
            if (results) results.innerHTML = "";
            
            // 获取搜索结果容器
            const searchImgPlay = document.getElementById("search-imgplay");
            if (!searchImgPlay) {
                console.error("搜索结果容器不存在");
                return;
            }
            
            // 清空先前的搜索结果
            searchImgPlay.innerHTML = "";
            
            if (!response.success || response.total === 0 || !response.data) {
                searchImgPlay.innerHTML = '<div class="no-results">未找到相关影视，尝试切换源~</div>';
                return;
            }

            // 创建结果容器
            const resultsContainer = document.createElement('div');
            resultsContainer.className = 'results-grid';
            
            // 保存索引映射信息到localStorage
            if (response.index_info) {
                localStorage.setItem('current_search_index_info', JSON.stringify(response.index_info));
                console.log("保存索引映射信息:", response.index_info);
            }
            
            // 遍历返回的数据
            Object.entries(response.data).forEach(([key, value], index) => {
                // 使用通用函数解析数据
                const videoData = parseVideoData(value);
                
                // 创建电影容器
                const container = document.createElement("div");
                container.className = "movie-container";
                
                // 创建图片
                const img = document.createElement("img");
                img.src = videoData.image;
                img.onerror = function() { 
                    this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTUwIiB2aWV3Qm94PSIwIDAgMTAwIDE1MCIgZmlsbD0iIzMzMyI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxNTAiIGZpbGw9IiMyMjIiLz48dGV4dCB4PSI1MCIgeT0iNzUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2FhYSI+无图片</dGV4dD48L3N2Zz4='; 
                };
                
                // 创建标题
                const title = document.createElement("div");
                title.className = "movie-title";
                title.textContent = videoData.title;
                
                // 添加点击事件 - 修改为请求详情API
                container.addEventListener('click', function() {
                    // 显示加载动画
                    const loadingResults = document.getElementById("loading-results");
                    if (loadingResults) loadAnimation(loadingResults);
                    
                    // 获取当前列表索引（搜索结果中的位置）
                    const listIndex = index;
                    
                    // 保存当前列表索引到localStorage
                    localStorage.setItem('currentMovieIndex', listIndex);
                    
                    // 发送请求获取详情
                    const detailUrl = `https://api.sheep.com/sheep/videoPolymerization/videolist/${listIndex}`;
                    
                    fetch(detailUrl)
                        .then(res => res.json())
                        .then(detailResponse => {
                            // 清除加载动画
                            if (loadingResults) loadingResults.innerHTML = "";
                            
                            // 如果存在实际索引，保存它
                            if (detailResponse.actual_index !== undefined) {
                                localStorage.setItem('currentMovieActualIndex', detailResponse.actual_index);
                            }
                            
                            // 渲染详情页面
                            if (detailResponse.success && detailResponse.data) {
                                renderVideoDetail(detailResponse.data);
                            } else {
                                alert("获取影片详情失败，请稍后重试");
                            }
                        })
                        .catch(err => {
                            console.error("详情请求失败", err);
                            if (loadingResults) loadingResults.innerHTML = "";
                            alert("网络错误，请稍后重试");
                        });
                });
                
                // 组装元素
                container.appendChild(img);
                container.appendChild(title);
                resultsContainer.appendChild(container);
            });
            
            // 添加到页面
            searchImgPlay.appendChild(resultsContainer);
        })
        .catch(err => {
            console.error("请求失败", err);
            const searchImgPlay = document.getElementById("search-imgplay");
            if (searchImgPlay) {
                searchImgPlay.innerHTML = '<div class="no-results">搜索失败，请稍后重试</div>';
            }
        });
}

// 新的详情页面渲染函数
function renderVideoDetail(detailData) {
    // 获取播放容器，但不清空它，只确保它可见
    const playContainer = document.getElementById('play-container');
    if (!playContainer) return;
    
    // 不完全清空播放容器，只确保播放容器可见
    playContainer.style.display = 'block';
    
    // 清空之前的video-detail元素而不是整个容器
    const oldDetailPage = playContainer.querySelector('.video-detail');
    if (oldDetailPage) {
        playContainer.removeChild(oldDetailPage);
    }
    
    // 清空loading-results
    const loadingResults = document.getElementById('loading-results');
    if (loadingResults) loadingResults.innerHTML = '';
    
    // 使用封装函数处理详情数据
    const videoData = processDetailData(detailData);
    
    // 保存当前电影信息到本地存储
    localStorage.setItem('currentMovie', JSON.stringify(videoData));
    
    // 创建详情页容器
    const detailPage = document.createElement('div');
    detailPage.className = 'video-detail';
    
    // 创建返回按钮 - 改为图标
    const backButton = document.createElement('button');
    backButton.className = 'back-button';
    backButton.innerHTML = '<i class="iconfont icon-fanhui"></i>';
    backButton.title = '返回';
    backButton.addEventListener('click', function() {
        // 隐藏播放容器，但不清空内容
        if (playContainer) {
            playContainer.style.display = 'none';
        }
        
        // 检查是否是从最近观看列表进入的详情页
        const fromRecentList = localStorage.getItem('fromRecentList');
        if (fromRecentList === 'true') {
            // 清除标记
            localStorage.removeItem('fromRecentList');
            
            // 直接调用 showList 函数显示最近观看列表
            showList();
        } else {
            // 不是从最近观看列表进入，显示主容器
            const mainContainer = document.getElementById('main-container');
            if (mainContainer) {
                mainContainer.style.display = 'block';
            }
        }
    });
    
    // 创建头部区域
    const header = document.createElement('div');
    header.className = 'video-header';
    
    // 创建影片图片
    const movieImage = document.createElement('img');
    movieImage.className = 'video-image';
    movieImage.src = videoData.image;
    movieImage.onerror = function() { 
        this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTUwIiB2aWV3Qm94PSIwIDAgMTAwIDE1MCIgZmlsbD0iIzMzMyI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxNTAiIGZpbGw9IiMyMjIiLz48dGV4dCB4PSI1MCIgeT0iNzUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2FhYSI+无图片</dGV4dD48L3N2Zz4='; 
    };
    
    // 创建影片信息
    const movieInfo = document.createElement('div');
    movieInfo.className = 'video-info';
    
    // 添加标题
    const movieTitle = document.createElement('h1');
    movieTitle.className = 'video-title';
    movieTitle.textContent = videoData.title;
    
    // 添加描述
    const movieDescription = document.createElement('p');
    movieDescription.className = 'video-description';
    movieDescription.textContent = videoData.description;
    
    // 添加信息到头部
    movieInfo.appendChild(movieTitle);
    movieInfo.appendChild(movieDescription);
    header.appendChild(movieImage);
    header.appendChild(movieInfo);
    
    // 创建可滚动的内容区域
    const contentArea = document.createElement('div');
    contentArea.className = 'video-content-area';
    
    // 创建播放器容器（初始隐藏）
    const playerContainer = document.createElement('div');
    playerContainer.className = 'player-container';
    playerContainer.style.display = 'none';
    playerContainer.id = 'player-container';
    
    // 创建播放器标题
    const playerTitle = document.createElement('h2');
    playerTitle.className = 'player-title';
    playerTitle.textContent = '正在播放';
    
    // 创建播放器iframe容器
    const playerFrame = document.createElement('div');
    playerFrame.className = 'player-frame';
    playerFrame.id = 'player-frame';
    
    // 添加播放器元素
    playerContainer.appendChild(playerTitle);
    playerContainer.appendChild(playerFrame);
    
    // 创建当前播放信息显示和分享按钮容器
    const nowPlayingContainer = document.createElement('div');
    nowPlayingContainer.className = 'now-playing-container';
    nowPlayingContainer.style.display = 'none';
    
    // 创建当前播放信息
    const nowPlaying = document.createElement('div');
    nowPlaying.className = 'now-playing';
    nowPlaying.id = 'now-playing';
    
    // 创建分享按钮
    const shareButton = document.createElement('button');
    shareButton.className = 'share-button';
    shareButton.innerHTML = '<i class="iconfont icon-fenxiang"></i>';
    shareButton.title = '复制播放地址';
    
    // 创建收藏按钮
    const collectButton = document.createElement('button');
    collectButton.className = 'collect-button';
    collectButton.innerHTML = '<i class="iconfont icon-shoucang"></i>';
    collectButton.title = '收藏视频';
    
    // 创建外部播放按钮
    const externalPlayButton = document.createElement('button');
    externalPlayButton.className = 'external-play-button';
    externalPlayButton.innerHTML = '<i class="iconfont icon-Gc_85_face-Skip"></i>';
    externalPlayButton.title = '使用SenPlayer播放';
    
    // 添加外部播放按钮点击事件
    externalPlayButton.addEventListener('click', function() {
        if (currentEpisodeUrl) {
            // 构建SenPlayer URL方案
            const senPlayerUrl = `SenPlayer://x-callback-url/play?url=${encodeURIComponent(currentEpisodeUrl)}`;
            
            // 跳转到SenPlayer
            window.location.href = senPlayerUrl;
        } else {
            alert('无法获取当前播放资源链接');
        }
    });
    
    // 添加到播放信息容器
    nowPlayingContainer.appendChild(nowPlaying);
    nowPlayingContainer.appendChild(shareButton);
    nowPlayingContainer.appendChild(collectButton);
    nowPlayingContainer.appendChild(externalPlayButton);
    
    // 创建复制成功提示
    const copyToast = document.createElement('div');
    copyToast.className = 'copy-toast';
    copyToast.textContent = '已复制到剪贴板';
    document.body.appendChild(copyToast);
    
    // 创建选集按钮
    const selectEpisodesButton = document.createElement('button');
    selectEpisodesButton.className = 'select-episodes-button';
    selectEpisodesButton.innerHTML = '<i class="iconfont icon-liebiao"></i> 点击选择剧集';
    selectEpisodesButton.id = 'select-episodes-button';
    
    // 创建剧集列表
    const episodesContainer = document.createElement('div');
    episodesContainer.className = 'episodes-container';
    episodesContainer.id = 'episodes-container';
    
    // 创建剧集标题行
    const episodesTitleRow = document.createElement('div');
    episodesTitleRow.className = 'episodes-title';
    
    // 创建剧集标题
    const episodesTitle = document.createElement('span');
    episodesTitle.textContent = '选集';
    
    // 创建关闭按钮
    const closeEpisodesBtn = document.createElement('button');
    closeEpisodesBtn.className = 'close-episodes';
    closeEpisodesBtn.innerHTML = '×';
    closeEpisodesBtn.addEventListener('click', function() {
        toggleEpisodes(false);
    });
    
    // 组装标题行
    episodesTitleRow.appendChild(episodesTitle);
    episodesTitleRow.appendChild(closeEpisodesBtn);
    
    const episodesList = document.createElement('div');
    episodesList.className = 'episodes-list';
    
    // 切换剧集列表显示/隐藏函数
    function toggleEpisodes(show) {
        if (show) {
            episodesContainer.classList.add('show');
        } else {
            episodesContainer.classList.remove('show');
        }
    }
    
    // 添加选集按钮点击事件
    selectEpisodesButton.addEventListener('click', function() {
        toggleEpisodes(true);
    });
    
    // 当前播放的剧集URL
    let currentEpisodeUrl = '';
    
    // 添加分享按钮事件
    shareButton.addEventListener('click', function() {
        if (currentEpisodeUrl) {
            copyToClipboard(currentEpisodeUrl, function(success) {
                if (success) {
                    // 显示复制成功提示
                    copyToast.classList.add('show');
                    setTimeout(() => {
                        copyToast.classList.remove('show');
                    }, 2000);
                } else {
                    alert('复制链接失败，请手动复制');
                }
            });
        }
    });
    
    // 获取当前电影实际索引
    const currentMovieActualIndex = localStorage.getItem('currentMovieActualIndex');
    
    // 添加收藏按钮事件
    collectButton.addEventListener('click', function() {
        if (currentMovieActualIndex) {
            // 发送收藏请求
            fetch(`https://api.sheep.com/sheep/videoPolymerization/api/collect/sheep_vod_info_${currentMovieActualIndex}`)
                .then(response => {
                    // 更改按钮样式表示已收藏
                    collectButton.classList.toggle('active');
                })
                .catch(error => {
                    console.error('收藏请求失败:', error);
                });
        }
    });
    
    // 添加剧集
    if (videoData.episodes && videoData.episodes.length > 0) {
        videoData.episodes.forEach((episode, index) => {
            // 解析剧集信息
            const epParts = episode.split(': ');
            const episodeName = epParts[0];
            const episodeUrl = epParts[1];
            
            if (!episodeUrl) return;
            
            const episodeItem = document.createElement('div');
            episodeItem.className = 'episode-item';
            episodeItem.textContent = episodeName || `第${index + 1}集`;
            
            // 添加点击播放功能 - 修改为使用play-container
            episodeItem.addEventListener('click', function() {
                // 高亮当前选中剧集
                document.querySelectorAll('.episode-item.active').forEach(item => {
                    item.classList.remove('active');
                });
                episodeItem.classList.add('active');
                
                // 显示播放器容器
                playerContainer.style.display = 'block';
                
                // 更新播放器标题
                playerTitle.textContent = `正在播放：${videoData.title} - ${episodeName || `第${index + 1}集`}`;
                
                // 创建或更新视频播放器
                const playerFrame = document.getElementById('player-frame');
                playerFrame.innerHTML = '';  // 清空播放器
                
                // 创建视频播放器iframe
                const videoPlayer = document.createElement('iframe');
                videoPlayer.className = 'video-player-iframe';
                videoPlayer.src = episodeUrl;
                videoPlayer.allowFullscreen = true;
                
                // 更新当前播放URL (用于分享)
                currentEpisodeUrl = episodeUrl;
                
                
                // 添加到播放器框架
                playerFrame.appendChild(videoPlayer);
                
                // 更新当前播放信息
                nowPlaying.textContent = `当前播放: ${episodeName || `第${index + 1}集`}`;
                nowPlayingContainer.style.display = 'flex';
                
                // 隐藏剧集列表
                toggleEpisodes(false);
                
                // 平滑滚动到播放器位置
                playerContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
            
            episodesList.appendChild(episodeItem);
        });
        
        // 默认选中第一集(如果有)
        if (videoData.episodes.length > 0) {
            const firstEpisode = episodesList.querySelector('.episode-item');
            if (firstEpisode) {
                // 模拟点击第一集
                setTimeout(() => {
                    firstEpisode.click();
                }, 100);
            }
        }
    } else {
        const noEpisodes = document.createElement('p');
        noEpisodes.className = 'no-episodes';
        noEpisodes.textContent = '暂无可播放剧集';
        episodesList.appendChild(noEpisodes);
        
        // 如果没有剧集，隐藏选集按钮
        selectEpisodesButton.style.display = 'none';
    }
    
    // 组装剧集容器
    episodesContainer.appendChild(episodesTitleRow);
    episodesContainer.appendChild(episodesList);
    
    // 将播放器和剧集控件添加到内容区域
    contentArea.appendChild(playerContainer);
    contentArea.appendChild(nowPlayingContainer);
    contentArea.appendChild(selectEpisodesButton);
    contentArea.appendChild(episodesContainer);
    
    // 组装页面 - 修改顺序：返回按钮，固定头部，可滚动内容区域
    detailPage.appendChild(backButton);
    detailPage.appendChild(header);
    detailPage.appendChild(contentArea);
    
    // 添加到播放容器
    playContainer.appendChild(detailPage);
}

// 修改视频播放器渲染函数
function renderVideoPlayer(url, title, episodeName) {
    // 获取播放容器
    const playContainer = document.getElementById('play-container');
    if (!playContainer) return;
    
    // 不完全清空播放容器，只确保播放容器可见
    playContainer.style.display = 'block';
    
    // 清空之前的播放器内容而不是整个容器
    // 查找之前的video-detail元素并移除
    const oldDetailPage = playContainer.querySelector('.video-detail');
    if (oldDetailPage) {
        playContainer.removeChild(oldDetailPage);
    }
    
    // 清空loading-results
    const loadingResults = document.getElementById('loading-results');
    if (loadingResults) loadingResults.innerHTML = '';

    // 创建详情页容器
    const detailPage = document.createElement('div');
    detailPage.className = 'video-detail';
    
    // 创建返回按钮 - 改为图标
    const backButton = document.createElement('button');
    backButton.className = 'back-button';
    backButton.innerHTML = '<i class="iconfont icon-fanhui"></i>';
    backButton.title = '返回详情';
    
    // 添加返回按钮点击事件，通过索引重新获取详情
    backButton.addEventListener('click', function() {
        // 显示加载动画
        if (loadingResults) loadAnimation(loadingResults);
        
        // 获取保存的索引值（列表位置）
        const currentMovieIndex = localStorage.getItem('currentMovieIndex');
        
        if (currentMovieIndex) {
            // 通过索引值重新请求详情API
            const detailUrl = `https://api.sheep.com/sheep/videoPolymerization/videolist/${currentMovieIndex}`;
            
            fetch(detailUrl)
                .then(res => res.json())
                .then(detailResponse => {
                    // 清除加载动画
                    if (loadingResults) loadingResults.innerHTML = "";
                    
                    // 如果存在实际索引，更新它
                    if (detailResponse.actual_index !== undefined) {
                        localStorage.setItem('currentMovieActualIndex', detailResponse.actual_index);
                    }
                    
                    // 渲染详情页面
                    if (detailResponse.success && detailResponse.data) {
                        renderVideoDetail(detailResponse.data);
                    } else {
                        // 如果API请求失败，尝试使用localStorage缓存的数据
                        const savedMovieData = localStorage.getItem('currentMovie');
                        if (savedMovieData) {
                            try {
                                const movieData = JSON.parse(savedMovieData);
                                renderVideoDetail(movieData);
                            } catch (e) {
                                console.error("解析保存的电影数据失败", e);
                                // 不清空播放容器，只隐藏它
                                if (playContainer) playContainer.style.display = 'none';
                            }
                        } else {
                            alert("获取影片详情失败，请稍后重试");
                            // 不清空播放容器，只隐藏它
                            if (playContainer) playContainer.style.display = 'none';
                        }
                    }
                })
                .catch(err => {
                    console.error("详情请求失败", err);
                    if (loadingResults) loadingResults.innerHTML = "";
                    
                    // 如果API请求出错，尝试使用localStorage缓存的数据
                    const savedMovieData = localStorage.getItem('currentMovie');
                    if (savedMovieData) {
                        try {
                            const movieData = JSON.parse(savedMovieData);
                            renderVideoDetail(movieData);
                        } catch (e) {
                            console.error("解析保存的电影数据失败", e);
                            // 不清空播放容器，只隐藏它
                            if (playContainer) playContainer.style.display = 'none';
                        }
                    } else {
                        alert("网络错误，请稍后重试");
                        // 不清空播放容器，只隐藏它
                        if (playContainer) playContainer.style.display = 'none';
                    }
                });
        } else {
            // 如果没有索引值，尝试使用localStorage缓存的数据
            const savedMovieData = localStorage.getItem('currentMovie');
            if (savedMovieData) {
                try {
                    const movieData = JSON.parse(savedMovieData);
                    renderVideoDetail(movieData);
                    if (loadingResults) loadingResults.innerHTML = "";
                } catch (e) {
                    console.error("解析保存的电影数据失败", e);
                    // 不清空播放容器，只隐藏它
                    if (playContainer) playContainer.style.display = 'none';
                }
            } else {
                alert("无法找到原页面信息");
                // 不清空播放容器，只隐藏它
                if (playContainer) playContainer.style.display = 'none';
            }
        }
    });
    
    // 创建可滚动的内容区域
    const contentArea = document.createElement('div');
    contentArea.className = 'video-content-area';
    contentArea.style.marginTop = '50px'; // 为固定返回按钮留出空间
    
    // 创建播放器容器
    const playerContainer = document.createElement('div');
    playerContainer.className = 'player-container';
    
    // 创建播放器标题
    const playerTitle = document.createElement('h2');
    playerTitle.className = 'player-title';
    playerTitle.textContent = `正在播放：${title} ${episodeName ? '- ' + episodeName : ''}`;
    
    // 创建视频播放器
    const videoPlayer = document.createElement('iframe');
    videoPlayer.className = 'video-player-iframe';
    videoPlayer.src = url;
    videoPlayer.allowFullscreen = true;
    
    // 创建播放器iframe容器
    const playerFrame = document.createElement('div');
    playerFrame.className = 'player-frame';
    playerFrame.appendChild(videoPlayer);
    
    // 创建加载提示
    const playerLoading = document.createElement('div');
    playerLoading.className = 'player-loading';
    playerLoading.innerHTML = '<div class="loading-spinner"></div><div>视频加载中...</div>';
    
    // 视频加载完成时隐藏加载提示
    videoPlayer.addEventListener('load', function() {
        playerLoading.style.display = 'none';
    });
    
    // 创建播放信息和分享按钮容器
    const nowPlayingContainer = document.createElement('div');
    nowPlayingContainer.className = 'now-playing-container';
    
    // 创建当前播放信息
    const nowPlaying = document.createElement('div');
    nowPlaying.className = 'now-playing';
    nowPlaying.textContent = `当前播放: ${title} ${episodeName ? '- ' + episodeName : ''}`;
    
    // 创建分享按钮
    const shareButton = document.createElement('button');
    shareButton.className = 'share-button';
    shareButton.innerHTML = '<i class="iconfont icon-fenxiang"></i>';
    shareButton.title = '复制播放地址';
    
    // 创建收藏按钮
    const collectButton = document.createElement('button');
    collectButton.className = 'collect-button';
    collectButton.innerHTML = '<i class="iconfont icon-shoucang"></i>';
    collectButton.title = '收藏视频';
    
    // 创建外部播放按钮
    const externalPlayButton = document.createElement('button');
    externalPlayButton.className = 'external-play-button';
    externalPlayButton.innerHTML = '<i class="iconfont icon-sanfangxieyi"></i>';
    externalPlayButton.title = '使用SenPlayer播放';
    
    // 添加外部播放按钮点击事件
    externalPlayButton.addEventListener('click', function() {
        if (url) {
            // 构建SenPlayer URL方案
            const senPlayerUrl = `SenPlayer://x-callback-url/play?url=${encodeURIComponent(url)}`;
            
            // 跳转到SenPlayer
            window.location.href = senPlayerUrl;
        } else {
            alert('无法获取当前播放资源链接');
        }
    });
    
    // 创建复制成功提示
    const copyToast = document.createElement('div');
    copyToast.className = 'copy-toast';
    copyToast.textContent = '已复制到剪贴板';
    document.body.appendChild(copyToast);
    
    // 添加分享按钮事件
    shareButton.addEventListener('click', function() {
        if (url) {
            copyToClipboard(url, function(success) {
                if (success) {
                    // 显示复制成功提示
                    copyToast.classList.add('show');
                    setTimeout(() => {
                        copyToast.classList.remove('show');
                    }, 2000);
                } else {
                    alert('复制链接失败，请手动复制');
                }
            });
        }
    });
    
    // 获取当前电影实际索引
    const currentMovieActualIndex = localStorage.getItem('currentMovieActualIndex');
    
    // 添加收藏按钮事件
    collectButton.addEventListener('click', function() {
        if (currentMovieActualIndex) {
            // 发送收藏请求
            fetch(`https://api.sheep.com/sheep/videoPolymerization/api/collect/sheep_vod_info_${currentMovieActualIndex}`)
                .then(response => {
                    // 更改按钮样式表示已收藏
                    collectButton.classList.toggle('active');
                })
                .catch(error => {
                    console.error('收藏请求失败:', error);
                });
        }
    });
    
    // 添加到播放信息容器
    nowPlayingContainer.appendChild(nowPlaying);
    nowPlayingContainer.appendChild(shareButton);
    nowPlayingContainer.appendChild(collectButton);
    nowPlayingContainer.appendChild(externalPlayButton);
    
    // 将播放器添加到内容区域
    contentArea.appendChild(playerContainer);
    contentArea.appendChild(nowPlayingContainer);
    
    // 组装页面
    detailPage.appendChild(backButton);
    detailPage.appendChild(contentArea);
    
    // 添加到播放容器
    playContainer.appendChild(detailPage);
}

// 添加容器样式操作函数
function addContainersStyle() {
    // 检查是否已存在样式
    if (document.getElementById('containers-style')) return;
    
    // 创建style元素
    const style = document.createElement('style');
    style.id = 'containers-style';
    style.textContent = `
        #play-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1000;
            background-color: rgba(0, 0, 0, 0.95);
            overflow-y: auto;
            display: none;
        }
        
        #play-container.visible {
            display: block;
        }
        
        #main-container {
            min-height: calc(100vh - 60px);
            padding-bottom: 60px;
        }
    `;
    
    // 添加到文档头部
    document.head.appendChild(style);
}

// 初始化函数，在DOMContentLoaded时执行
function initializeApp() {
    // 添加容器样式
    addContainersStyle();
    
    // 设置导航栏按钮点击事件
    const navButtons = document.querySelectorAll('#bottom-nav .nav-button');
    navButtons.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            // 移除所有按钮的active类
            navButtons.forEach(b => b.classList.remove('nav-active'));
            // 添加active类到当前按钮
            btn.classList.add('nav-active');
        });
    });
    
    // 确保播放容器初始为空并隐藏
    const playContainer = document.getElementById('play-container');
    if (playContainer) {
        playContainer.innerHTML = '';
        playContainer.style.display = 'none';
    }
    
    // 清空loading-results容器
    const loadingResults = document.getElementById('loading-results');
    if (loadingResults) {
        loadingResults.innerHTML = '';
    }
    
    // 设置通用事件委托
    setupEventDelegation();
    
    // 默认显示个人资料页
    disCover();
}

// 设置事件委托
function setupEventDelegation() {
    // 主容器事件委托
    document.getElementById('main-container').addEventListener('click', function(event) {
        const target = event.target;
        
        // 处理折叠面板点击
        if (target.closest('.user-collapsible-header')) {
            toggleCollapsible(target.closest('.user-collapsible-header'));
        }
        
        // 处理修改用户名按钮点击
        if (target.closest('.xiuGaiUserName')) {
            showUsernamePopup();
        }
        
        // 处理搜索按钮点击
        if (target.closest('.search-button')) {
            search();
        }
    });
    
    // 弹出窗口事件委托
    document.getElementById('PopUpWindow').addEventListener('click', function(event) {
        const target = event.target;
        
        // 处理点击弹窗外部关闭
        if (target.classList.contains('popup-overlay')) {
            closeUsernamePopup();
        }
        
        // 处理取消按钮
        if (target.classList.contains('cancel-button')) {
            closeUsernamePopup();
        }
        
        // 处理确认按钮
        if (target.classList.contains('confirm-button')) {
            confirmUsernameEdit();
        }
    });
}

// 显示用户名修改弹窗
function showUsernamePopup() {
    const popUpWindow = document.getElementById('PopUpWindow');
    popUpWindow.innerHTML = `
        <div class="popup-overlay">
            <div class="popup-content">
                <h3 class="popup-title">修改用户名</h3>
                <input type="text" id="newUsername" class="popup-input" value="${username}" placeholder="请输入新的用户名">
                <div class="popup-buttons">
                    <button class="popup-button cancel-button">取消</button>
                    <button class="popup-button confirm-button">确认</button>
                </div>
            </div>
        </div>
    `;
    popUpWindow.style.display = 'block';
}

// 页面加载完成后执行初始化
document.addEventListener('DOMContentLoaded', initializeApp);


// 最近
function showList() {
    // 隐藏播放容器
    const playContainer = document.getElementById('play-container');
    if (playContainer) {
        playContainer.style.display = 'none';
        playContainer.innerHTML = '';
    }
    
    // 隐藏用户容器
    const userContainer = document.getElementById('user-container');
    if (userContainer) {
        userContainer.style.display = 'none';
    }
    
    // 隐藏发现容器
    const discoverContainer = document.getElementById('discover-container');
    if (discoverContainer) {
        discoverContainer.style.display = 'none';
    }
    
    // 直接隐藏主容器，而不是调整不透明度
    const mainContainer = document.getElementById("main-container");
    if (mainContainer) {
        mainContainer.style.display = 'none';
    }
    
    
    // 获取最近观看容器
    const recentContainer = document.getElementById('recent-container');
    if (!recentContainer) return;
    
    // 清空容器并创建基本结构（简单的标题）
    recentContainer.innerHTML = `
        <h2 class="recent-simple-title">最近观看</h2>
        <div class="recent-content" id="recent-content">
            <div class="loading-all">
                <div class="loading-animation"></div>
                <div class="loading-text">加载中...</div>
            </div>
        </div>
    `;
    
    // 显示最近观看容器
    recentContainer.style.display = 'block';
    // 强制回流并添加可见性类
    setTimeout(() => {
        recentContainer.classList.add('visible');
    }, 10);
    
    // 给底部导航栏的"最近"按钮添加激活样式
    const navButtons = document.querySelectorAll('#bottom-nav .nav-button');
    navButtons.forEach(button => {
        button.classList.remove('nav-active');
    });
    const listBtn = document.getElementById('listBtn');
    if (listBtn) {
        listBtn.classList.add('nav-active');
    }
    
    // 发送请求获取所有影片信息
    fetch('https://api.sheep.com/sheep/videoPolymerization/videolist/999')
        .then(res => res.json())
        .then(response => {
            const recentContent = document.getElementById('recent-content');
            
            // 如果没有找到容器或请求失败，显示错误信息
            if (!recentContent || !response.success || response.total === 0 || !response.data) {
                if (recentContent) {
                    recentContent.innerHTML = '<div class="no-recent">还没有观看记录~</div>';
                }
                return;
            }
            
            // 创建结果容器
            const resultsContainer = document.createElement('div');
            resultsContainer.className = 'results-grid';
            
            // 获取所有条目并转换为数组
            const entries = Object.entries(response.data);
            
            // 反向排序，使最新的记录显示在前面（假设索引越大表示越新）
            const sortedEntries = entries.sort((a, b) => {
                // 从键名中提取索引值
                const indexA = parseInt(a[0].split('_').pop());
                const indexB = parseInt(b[0].split('_').pop());
                // 降序排序
                return indexB - indexA;
            });
            
            // 遍历返回的数据
            sortedEntries.forEach(([key, value], index) => {
                // 使用通用函数解析数据
                const videoData = parseVideoData(value);
                
                // 跳过没有标题的数据
                if (!videoData.title || videoData.title === '未知标题') return;
                
                // 创建电影容器
                const container = document.createElement("div");
                container.className = "movie-container";
                
                // 创建图片
                const img = document.createElement("img");
                img.src = videoData.image;
                img.onerror = function() { 
                    this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTUwIiB2aWV3Qm94PSIwIDAgMTAwIDE1MCIgZmlsbD0iIzMzMyI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxNTAiIGZpbGw9IiMyMjIiLz48dGV4dCB4PSI1MCIgeT0iNzUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2FhYSI+无图片</dGV4dD48L3N2Zz4='; 
                };
                
                // 创建标题
                const title = document.createElement("div");
                title.className = "movie-title";
                title.textContent = videoData.title;
                
                // 获取实际存储索引值
                const actualIndex = parseInt(key.split('_').pop());
                
                // 添加点击事件 - 直接请求详情
                container.addEventListener('click', function() {
                    // 先隐藏最近观看容器，确保详情页正确显示
                    const recentContainer = document.getElementById('recent-container');
                    if (recentContainer) {
                        recentContainer.classList.remove('visible');
                        recentContainer.style.display = 'none';
                    }
                    
                    // 显示主容器，防止详情页无地方显示
                    const mainContainer = document.getElementById("main-container");
                    if (mainContainer) {
                        mainContainer.style.display = 'block';
                    }
                    
                    // 显示加载动画
                    const loadingResults = document.getElementById("loading-results");
                    if (loadingResults) loadAnimation(loadingResults);
                    
                    // 保存当前实际索引到localStorage
                    localStorage.setItem('currentMovieActualIndex', actualIndex);
                    
                    // 保存当前状态，表示是从最近观看列表进入的详情页
                    localStorage.setItem('fromRecentList', 'true');
                    
                    // 获取播放容器并显示它（不清空内容）
                    const playContainer = document.getElementById('play-container');
                    if (playContainer) {
                        playContainer.style.display = 'block';
                    }
                    
                    // 渲染详情页面
                    renderVideoDetail({ [key]: value });
                    
                    // 清除加载动画
                    if (loadingResults) loadingResults.innerHTML = "";
                });
                
                // 组装元素
                container.appendChild(img);
                container.appendChild(title);
                resultsContainer.appendChild(container);
            });
            
            // 如果没有有效数据，显示提示
            if (resultsContainer.children.length === 0) {
                recentContent.innerHTML = '<div class="no-recent">还没有观看记录~</div>';
                return;
            }
            
            // 替换加载动画为结果
            recentContent.innerHTML = '';
            recentContent.appendChild(resultsContainer);
            
            // 确保滚动位置重置到顶部
            recentContainer.scrollTop = 0;
        })
        .catch(err => {
            console.error("获取最近观看记录失败", err);
            const recentContent = document.getElementById('recent-content');
            if (recentContent) {
                recentContent.innerHTML = '<div class="no-recent">加载失败，请稍后重试</div>';
            }
        });
}

// 关闭最近观看容器
function closeRecentContainer() {
    const recentContainer = document.getElementById('recent-container');
    
    if (recentContainer) {
        // 移除可见性类，触发过渡效果
        recentContainer.classList.remove('visible');
        
        // 检查底部导航栏的激活按钮来决定显示哪个容器
        const activeNavButton = document.querySelector('#bottom-nav .nav-active');
        
        if (activeNavButton) {
            if (activeNavButton.id === 'profileBtn') {
                // 如果是"我的"按钮激活，显示用户容器
                const userContainer = document.getElementById('user-container');
                if (userContainer) {
                    userContainer.style.display = 'block';
                }
            } else if (activeNavButton.id === 'disCover') {
                // 如果是"发现"按钮激活，显示发现容器
                const discoverContainer = document.getElementById('discover-container');
                if (discoverContainer) {
                    discoverContainer.style.display = 'block';
                }
            } else {
                // 其他情况显示主容器
                const mainContainer = document.getElementById("main-container");
                if (mainContainer) {
                    mainContainer.style.display = 'block';
                }
            }
        } else {
            // 没有激活按钮时默认显示主容器
            const mainContainer = document.getElementById("main-container");
            if (mainContainer) {
                mainContainer.style.display = 'block';
            }
        }
        
        // 等待过渡完成后隐藏容器
        setTimeout(() => {
            recentContainer.style.display = 'none';
        }, 300); // 等待过渡完成
    }
}

// 加载动画函数
function loadAnimation(container) {
    container.innerHTML = `
     <div class="loading-all">
         <div class="loading-animation"></div>
         <div class="loading-text">加载中...</div>
     </div>
 `;
}

// 添加点击背景关闭最近观看容器的功能
document.addEventListener('DOMContentLoaded', function() {
    // 获取最近观看容器
    const recentContainer = document.getElementById('recent-container');
    
    if (recentContainer) {
        // 添加点击事件，如果点击的是容器本身（不是内部元素），则关闭容器
        recentContainer.addEventListener('click', function(event) {
            // 检查点击的是否是容器本身，而不是内部元素
            if (event.target === recentContainer) {
                closeRecentContainer();
            }
        });
    }
    
    // 为底部导航栏添加事件监听器
    document.querySelectorAll('#bottom-nav .nav-button').forEach(button => {
        button.addEventListener('click', function() {
            // 如果点击的不是最近按钮，则关闭最近观看容器
            if (button.id !== 'listBtn') {
                closeRecentContainer();
            }
        });
    });
});

// 发现功能相关代码

// 发现页面主函数 - 从main72.js移动过来
function disCover() {
    // 隐藏播放容器
    const playContainer = document.getElementById('play-container');
    if (playContainer) {
        playContainer.style.display = 'none';
        playContainer.innerHTML = '';
    }
    
    // 隐藏最近观看容器
    const recentContainer = document.getElementById('recent-container');
    if (recentContainer) {
        recentContainer.classList.remove('visible');
        recentContainer.style.display = 'none';
    }
    
    // 隐藏用户容器
    const userContainer = document.getElementById('user-container');
    if (userContainer) {
        userContainer.style.display = 'none';
    }
    
    // 隐藏主容器
    const mainContainer = document.getElementById("main-container");
    if (mainContainer) {
        mainContainer.style.display = 'none';
    }
    
    // 清空loading-results
    const loadingResults = document.getElementById("loading-results");
    if (loadingResults) {
        loadingResults.innerHTML = "";
    }
    
    // 使用发现容器
    const discoverContainer = document.getElementById('discover-container');
    if (!discoverContainer) return;
    
    // 显示发现容器
    discoverContainer.style.display = 'block';
    
    // 显示发现列表，隐藏内容区域
    const discoverList = document.getElementById('discover-list');
    const discoverContent = document.getElementById('discover-content');
    
    if (discoverList && discoverContent) {
        discoverList.style.display = 'block';
        discoverContent.style.display = 'none';
        
        // 初始化发现功能列表
        showDiscoverList();
    }
    
    // 给底部导航栏的"发现"按钮添加激活样式
    const navButtons = document.querySelectorAll('#bottom-nav .nav-button');
    navButtons.forEach(button => {
        button.classList.remove('nav-active');
    });
    const discoverBtn = document.getElementById('disCover');
    if (discoverBtn) {
        discoverBtn.classList.add('nav-active');
    }
}

// 显示发现功能列表
function showDiscoverList() {
    const discoverList = document.getElementById('discover-list');
    if (!discoverList) return;
    
    // 发现功能列表数据
    const discoverItems = [
        
        // 我的收藏
        { id: 'my-collection', title: '我的收藏', icon: 'icon-shoucang', handler: showMyCollection },

        // 修改壁纸
        { id: 'change-wallpaper', title: '修改壁纸', icon: 'icon-tupian', handler: showChangeWallpaper },
        // 选择默认源
        { id: 'select-default-source', title: '选择默认源', icon: 'icon-ziyuan', handler: showSelectDefaultSource },
        // 支持作者
        { id: 'support-author', title: '支持作者', icon: 'icon-zhichi', handler: showSupportAuthor },
        // 关于我们
        { id: 'about-us', title: '关于', icon: 'icon-guanyu', handler: showAboutUs }
    ];
    
    // 创建列表HTML
    let listHTML = '<h2 class="discover-title">发现</h2><div class="discover-items">';
    
    discoverItems.forEach(item => {
        listHTML += `
            <div class="discover-item" data-id="${item.id}">
                <div class="discover-icon">
                    <i class="iconfont ${item.icon}"></i>
                </div>
                <div class="discover-item-title">${item.title}</div>
                <div class="discover-arrow">
                    <i class="iconfont icon-youjiantou"></i>
                </div>
            </div>
        `;
    });
    
    listHTML += '</div>';
    discoverList.innerHTML = listHTML;
    
    // 添加点击事件
    discoverList.querySelectorAll('.discover-item').forEach((item, index) => {
        item.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const handler = discoverItems.find(item => item.id === id)?.handler;
            
            if (handler) {
                handler();
            }
        });
    });
}

// 返回到发现列表
function backToDiscoverList() {
    const discoverList = document.getElementById('discover-list');
    const discoverContent = document.getElementById('discover-content');
    
    if (discoverList && discoverContent) {
        discoverList.style.display = 'block';
        discoverContent.style.display = 'none';
    }
}

// 显示发现内容
function showDiscoverContent(title, content) {
    const discoverList = document.getElementById('discover-list');
    const discoverContent = document.getElementById('discover-content');
    
    if (!discoverList || !discoverContent) return;
    
    // 隐藏列表，显示内容
    discoverList.style.display = 'none';
    discoverContent.style.display = 'block';
    
    // 设置内容
    discoverContent.innerHTML = `
        <div class="discover-content-body">
            <div style="display: flex; align-items: center; margin-bottom: 15px; padding: 10px 0;">
                <button class="discover-back-button">
                    <i class="iconfont icon-fanhui"></i>
                </button>
                <h2 style="flex: 1; text-align: center; color: #f39c12; margin: 0; font-size: 18px; padding-right: 40px;">${title}</h2>
            </div>
            ${content}
        </div>
    `;
    
    // 添加返回按钮事件
    const backButton = discoverContent.querySelector('.discover-back-button');
    if (backButton) {
        backButton.addEventListener('click', backToDiscoverList);
    }
}

// 以下是各发现功能的处理函数

// 关于我们
function showAboutUs() {
    const content = `
        <div class="about-us-content">
            <div class="about-us-logo">
                <i class="iconfont icon-shipin" style="font-size: 48px; color: #f39c12;"></i>
                <h3>VidSheep</h3>
            </div>
            <div class="about-us-version">当前版本: 2.0.0</div>
            
            <div class="about-us-update-info">
                <h4 class="update-title">当前版本更新内容</h4>
                <ul class="update-list">
                    <li>兼容Shadowrocket、Surge自测</li>
                    <li>增加了一些个性化设置</li>
                    <li>自设壁纸或每日更换来自bing壁纸</li>
                    <li>剧集详情中增加收藏与分享</li>
                    <li>优化页面布局与操作逻辑</li>
                    <li>更新了大量源，支持设置默认选择源</li>
                    <li>...</li>

                </ul>
            </div>
            
            <div class="version-history-container">
                <h4 class="history-title">历史版本</h4>
                
                <div class="version-item">
                    <div class="version-header">
                        <span class="version-number">v1.0.0</span>
                        <span class="version-date">2025-03-31</span>
                    </div>
                    <ul class="version-changes">
                        <li>优化了页面布局</li>
                        <li>兼容Loon</li>

                    </ul>
                </div>
            </div>
            
            <div class="about-us-desc">
                <p>本工具仅供学习交流使用，请勿用于非法用途。所有内容均来自互联网，与开发者无关。</p>
            </div>
            
            <div class="about-us-links">
                <div class="about-us-link">
                    <i class="iconfont icon-github"></i>
                    <span>GitHub: <a href="https://github.com/SheepFJ" target="_blank"> SheepFJ</a></span>
                </div>
                <div class="about-us-link">
                    <i class="iconfont icon-telegram"></i>
                    <span>Telegram群组: <a href="https://t.me/sheep_007_xiaoyang" target="_blank"> sheep_007_xiaoyang</a></span>
                </div>
                <div class="about-us-link">
                    <i class="iconfont icon-telegram"></i>
                    <span>Telegram频道: <a href="https://t.me/sheep_007xiaoyang" target="_blank"> sheep_007_xiaoyang</a></span>
                </div>
            </div>
            
        </div>
    `;
    
    showDiscoverContent('关于我们', content);
}

// 支持作者
function showSupportAuthor() {
    const content = `
        <div class="about-us-content">
            <div class="about-us-logo">
                <i class="iconfont icon-zhichi" style="font-size: 48px; color: #f39c12;"></i>
                <h3>感谢您的支持</h3>
            </div>
            
            <div class="about-us-update-info">
                <h4 class="update-title">自述</h4>
                <p style="color: #ddd; margin-bottom: 10px;">当前版本还是有许多不便的地方，作者将持续更新调整</p>
                <p style="color: #ddd;">如果您喜欢VidSheep这个项目，欢迎通过以下方式支持我的开发工作</p>
            </div>
            
            <div class="version-history-container" style="background-color: rgba(255, 255, 255, 0.1); padding: 15px; border-radius: 8px;">
                <h4 class="history-title">赞赏码</h4>
                <div style="display: flex; flex-direction: column; align-items: center;">
                    <div style="width: 200px; height: 200px; overflow: hidden; border-radius: 8px; margin-bottom: 15px; box-shadow: 0 3px 15px rgba(0, 0, 0, 0.3);">
                        <img src="https://img.picgo.net/2025/04/13/d38d743ad92baf172119efa434ee8b1bb715a9edc0557147.jpeg" alt="收款码" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                    <p style="color: #ccc; font-size: 14px; margin: 5px 0;">扫描上方二维码加速作者更新</p>
                    <p style="color: #ccc; font-size: 14px; margin: 5px 0;">金额大于1块的扫码备注将出现在下方特别感谢中</p>
                </div>
            </div>
            
            <div class="about-us-links" style="margin-top: 20px;">
                <h4 style="color: #f39c12; margin-bottom: 15px; text-align: center;">其他支持方式</h4>
                <div class="about-us-link" style="background-color: rgba(255, 255, 255, 0.05); border-radius: 8px; margin-bottom: 10px;">
                    <i class="iconfont icon-yaoqinghaoyoupengyou" style="color: #f39c12;"></i>
                    <span style="color: #ddd;">向朋友推荐VidSheep</span>
                </div>
                <div class="about-us-link" style="background-color: rgba(255, 255, 255, 0.05); border-radius: 8px; margin-bottom: 10px;">
                    <i class="iconfont icon-star" style="color: #f39c12;"></i>
                    <span style="color: #ddd;">在GitHub上为项目点亮<a href="https://github.com/SheepFJ/VidSheep" target="_blank">Star</a></span>
                </div>
                <div class="about-us-link" style="background-color: rgba(255, 255, 255, 0.05); border-radius: 8px; margin-bottom: 10px;">
                    <i class="iconfont icon-fankuixinxi" style="color: #f39c12;"></i>
                    <span style="color: #ddd;">提供宝贵的使用反馈和建议</span>
                </div>
            </div>
            
            <div class="about-us-update-info" style="margin-top: 20px;">
                <h4 class="update-title">特别感谢</h4>
                <p style="color: #ddd; margin-bottom: 10px;"><i class="iconfont icon-bg-label" style="color: #f39c12;"></i>增加自动跳过开头结尾的功能吧开头都是广告</p>               
            </div>
        </div>
    `;
    
    showDiscoverContent('支持作者', content);
}

// 修改壁纸
function showChangeWallpaper() {
    const content = `
        <div class="about-us-content">
            <div class="about-us-logo">
                <i class="iconfont icon-bi" style="font-size: 48px; color: #f39c12;"></i>
                <h3>壁纸设置</h3>
            </div>
            
            <div class="about-us-update-info">
                <h4 class="update-title">自定义壁纸</h4>
                <p style="color: #ddd; margin-bottom: 10px;">您可以通过以下设置更改壁纸、调整亮度和模糊度</p>
                <h4 class="update-title">推荐图床来获取url</h4>
                <p style="color: #ddd; margin-bottom: 10px;">请勿上传涉及个人信息的图片以保护安全:<a href="https://www.picgo.net/login" target="_blank">picgo图床</a> </p>
                
                <div class="wallpaper-settings">
                    <div class="wallpaper-form">
                        <div class="wallpaper-input-group">
                            <label class="wallpaper-label">壁纸链接：</label>
                            <input id="wallpaper-url" class="wallpaper-url-input" type="text" placeholder="请输入壁纸图片URL" value="${backgroundImage}">
                        </div>
                        
                        <div class="wallpaper-input-group">
                            <label class="wallpaper-label">亮度调整 (0-1)：</label>
                            <div class="adjust-controls">
                                <button id="brightness-down" class="adjust-btn">-</button>
                                <input id="brightness-value" class="adjust-input" type="text" value="${brightness}">
                                <button id="brightness-up" class="adjust-btn right">+</button>
                            </div>
                        </div>
                        
                        <div class="wallpaper-input-group">
                            <label class="wallpaper-label">模糊度 (0-10)：</label>
                            <div class="adjust-controls">
                                <button id="blur-down" class="adjust-btn">-</button>
                                <input id="blur-value" class="adjust-input" type="text" value="${vague}">
                                <button id="blur-up" class="adjust-btn right">+</button>
                            </div>
                        </div>
                        
                        <button id="save-wallpaper" class="save-wallpaper-btn">保存设置</button>
                    </div>
                </div>
            </div>
            
            <div class="about-us-update-info" style="margin-top: 20px;">
                <h4 class="update-title">精选壁纸</h4>
                <p style="color: #ddd; margin-bottom: 15px;">点击下方"应用"按钮使用预设壁纸</p>
                
                <div class="preset-wallpapers-grid">
                    <div class="preset-wallpaper-item" data-url="https://img.picgo.net/2025/04/11/vUIRPuYLKHeW_1700122638919535b1c4b7a7a4ba6.jpeg" data-brightness="${brightness}" data-blur="${vague}">
                        <img src="https://img.picgo.net/2025/04/11/vUIRPuYLKHeW_1700122638919535b1c4b7a7a4ba6.jpeg" class="preset-wallpaper-img">
                        <div class="preset-wallpaper-caption">壁纸1</div>
                        <button class="preset-wallpaper-apply">应用</button>
                    </div>
                    <div class="preset-wallpaper-item" data-url="https://img.picgo.net/2025/04/11/GsWwJ8qQUAqD_1740639963384332315e3baafa765.jpeg" data-brightness="${brightness}" data-blur="${vague}">
                        <img src="https://img.picgo.net/2025/04/11/GsWwJ8qQUAqD_1740639963384332315e3baafa765.jpeg" class="preset-wallpaper-img">
                        <div class="preset-wallpaper-caption">壁纸2</div>
                        <button class="preset-wallpaper-apply">应用</button>
                    </div>
                    <div class="preset-wallpaper-item" data-url="https://img.picgo.net/2025/04/11/i3pVGxLKGO1c_170684191840469d4113f72f0add2.jpeg" data-brightness="${brightness}" data-blur="${vague}">
                        <img src="https://img.picgo.net/2025/04/11/i3pVGxLKGO1c_170684191840469d4113f72f0add2.jpeg" class="preset-wallpaper-img">
                        <div class="preset-wallpaper-caption">壁纸3</div>
                        <button class="preset-wallpaper-apply">应用</button>
                    </div>
                    <div class="preset-wallpaper-item" data-url="https://img.picgo.net/2025/04/11/PkKNT35Ufzvy_17070318020985ee9b67a8ea96c77.jpeg" data-brightness="${brightness}" data-blur="${vague}">
                        <img src="https://img.picgo.net/2025/04/11/PkKNT35Ufzvy_17070318020985ee9b67a8ea96c77.jpeg" class="preset-wallpaper-img">
                        <div class="preset-wallpaper-caption">壁纸4</div>
                        <button class="preset-wallpaper-apply">应用</button>
                    </div>
                    <div class="preset-wallpaper-item" data-url="https://img.picgo.net/2025/04/11/HHbTWSI8EKdG_16560606983974b7c14937c5f3d5a.jpeg" data-brightness="${brightness}" data-blur="${vague}">
                        <img src="https://img.picgo.net/2025/04/11/HHbTWSI8EKdG_16560606983974b7c14937c5f3d5a.jpeg" class="preset-wallpaper-img">
                        <div class="preset-wallpaper-caption">壁纸5</div>
                        <button class="preset-wallpaper-apply">应用</button>
                    </div>
                    <div class="preset-wallpaper-item" data-url="https://img.picgo.net/2025/04/11/da4YEBlDgsE5_17261284268934912e319fe1e7bd3.jpeg" data-brightness="${brightness}" data-blur="${vague}">
                        <img src="https://img.picgo.net/2025/04/11/da4YEBlDgsE5_17261284268934912e319fe1e7bd3.jpeg" class="preset-wallpaper-img">
                        <div class="preset-wallpaper-caption">壁纸6</div>
                        <button class="preset-wallpaper-apply">应用</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    showDiscoverContent('修改壁纸', content);
    
    // 在DOM完全加载后添加事件监听器
    setTimeout(() => {
        // 亮度调整按钮
        const brightnessDown = document.getElementById('brightness-down');
        const brightnessUp = document.getElementById('brightness-up');
        const brightnessValue = document.getElementById('brightness-value');
        
        if (brightnessDown && brightnessUp && brightnessValue) {
            brightnessDown.addEventListener('click', () => {
                let value = parseFloat(brightnessValue.value);
                value = Math.max(0, value - 0.1).toFixed(1);
                brightnessValue.value = value;
            });
            
            brightnessUp.addEventListener('click', () => {
                let value = parseFloat(brightnessValue.value);
                value = Math.min(1, value + 0.1).toFixed(1);
                brightnessValue.value = value;
            });
        }
        
        // 模糊度调整按钮
        const blurDown = document.getElementById('blur-down');
        const blurUp = document.getElementById('blur-up');
        const blurValue = document.getElementById('blur-value');
        
        if (blurDown && blurUp && blurValue) {
            blurDown.addEventListener('click', () => {
                let value = parseInt(blurValue.value);
                value = Math.max(0, value - 1);
                blurValue.value = value;
            });
            
            blurUp.addEventListener('click', () => {
                let value = parseInt(blurValue.value);
                value = Math.min(10, value + 1);
                blurValue.value = value;
            });
        }
        
        // 保存壁纸设置按钮
        const saveWallpaperBtn = document.getElementById('save-wallpaper');
        if (saveWallpaperBtn) {
            saveWallpaperBtn.addEventListener('click', () => {
                const url = document.getElementById('wallpaper-url').value;
                const brightness = document.getElementById('brightness-value').value;
                const blur = document.getElementById('blur-value').value;
                
                if (!url) {
                    alert('请输入壁纸URL');
                    return;
                }
                
                saveWallpaperSettings(url, brightness, blur);
            });
        }
        
        // 预设壁纸应用按钮点击事件
        const presetApplyBtns = document.querySelectorAll('.preset-wallpaper-apply');
        presetApplyBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const parent = btn.closest('.preset-wallpaper-item');
                const url = parent.getAttribute('data-url');
                const brightness = parent.getAttribute('data-brightness');
                const blur = parent.getAttribute('data-blur');
                
                // 更新输入框的值
                document.getElementById('wallpaper-url').value = url;
                document.getElementById('brightness-value').value = brightness;
                document.getElementById('blur-value').value = blur;
                
                // 预览效果（设置预览的背景样式）
                updateWallpaperPreview(url);
                
                // 保存设置
                saveWallpaperSettings(url, brightness, blur);
            });
        });
    }, 100);
}

// 更新壁纸预览
function updateWallpaperPreview(url) {
    document.documentElement.style.setProperty('--preview-bg-image', `url(${url})`);
}

// 保存壁纸设置 - 发送API请求
function saveWallpaperSettings(url, brightness, blur) {
    // 显示加载状态
    const saveBtn = document.getElementById('save-wallpaper');
    if (saveBtn) {
        saveBtn.innerText = '保存中...';
        saveBtn.disabled = true;
    }
    
    // 构造API请求URL
    const apiUrl = `https://api.sheep.com/sheep/videoPolymerization/api/backimage/?url=${encodeURIComponent(url)}&mingdu=${brightness}&mohu=${blur}`;
    
    // 发送请求
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // 立即更新页面背景
                document.body.style.setProperty('--bg-image', `url(${url})`);
                document.body.style.setProperty('--bg-brightness', brightness);
                document.body.style.setProperty('--bg-blur', `${blur}px`);
                
                // 显示成功消息
                alert('壁纸设置已保存');
            } else {
                alert('保存失败: ' + (data.error || '未知错误'));
            }
        })
        .catch(error => {
            console.error('保存壁纸设置失败:', error);
            alert('保存失败，请稍后重试');
        })
        .finally(() => {
            // 恢复按钮状态
            if (saveBtn) {
                saveBtn.innerText = '保存设置';
                saveBtn.disabled = false;
            }
        });
}

// 我的收藏页面
function showMyCollection() {
    // 首先显示一个加载中的内容
    const loadingContent = `
        <div class="collection-content">
            <div class="loading-container">
                <div class="loading-spinner"></div>
                <p>正在加载收藏内容...</p>
            </div>
        </div>
    `;
    
    showDiscoverContent('我的收藏', loadingContent);
    
    // 发送请求获取所有收藏数据
    fetch('https://api.sheep.com/sheep/videoPolymerization/api/exhibit')
        .then(response => response.json())
        .then(data => {
            if (!data.success) {
                throw new Error(data.error || '获取收藏失败');
            }
            
            // 检查是否有收藏
            if (data.total === 0) {
                renderEmptyCollection();
                return;
            }
            
            // 渲染收藏列表 - 直接使用类似zuijin18.js的方式
            renderCollectionList(data.data);
        })
        .catch(error => {
            console.error('加载收藏失败:', error);
            renderCollectionError(error.message);
        });
}

// 渲染空收藏页面
function renderEmptyCollection() {
    const emptyContent = `
        <div class="collection-content">
            <div class="empty-collection">
                <i class="iconfont icon-shoucang" style="font-size: 48px; color: #666;"></i>
                <p>您还没有收藏任何内容</p>
                <button id="go-search-btn" class="go-search-btn">去搜索内容</button>
            </div>
        </div>
    `;
    
    const discoverContent = document.getElementById('discover-content');
    if (discoverContent) {
        const contentBody = discoverContent.querySelector('.discover-content-body');
        if (contentBody) {
            contentBody.innerHTML = contentBody.innerHTML.replace(/<div class="collection-content">.*?<\/div>/s, emptyContent);
            
            // 添加搜索按钮点击事件
            setTimeout(() => {
                const goSearchBtn = document.getElementById('go-search-btn');
                if (goSearchBtn) {
                    goSearchBtn.addEventListener('click', () => {
                        // 切换到搜索页面
                        document.getElementById('searchBtn')?.click();
                    });
                }
            }, 100);
        }
    }
}

// 渲染收藏错误页面
function renderCollectionError(errorMessage) {
    const errorContent = `
        <div class="collection-content">
            <div class="collection-error">
                <i class="iconfont icon-error" style="font-size: 48px; color: #f44336;"></i>
                <p>加载收藏失败</p>
                <p class="error-message">${errorMessage || '未知错误'}</p>
                <button id="retry-collection-btn" class="retry-btn">重试</button>
            </div>
        </div>
    `;
    
    const discoverContent = document.getElementById('discover-content');
    if (discoverContent) {
        const contentBody = discoverContent.querySelector('.discover-content-body');
        if (contentBody) {
            contentBody.innerHTML = contentBody.innerHTML.replace(/<div class="collection-content">.*?<\/div>/s, errorContent);
            
            // 添加重试按钮点击事件
            setTimeout(() => {
                const retryBtn = document.getElementById('retry-collection-btn');
                if (retryBtn) {
                    retryBtn.addEventListener('click', showMyCollection);
                }
            }, 100);
        }
    }
}

// 渲染收藏列表 - 修改为类似zuijin18.js的方式
function renderCollectionList(collectionData) {
    // 创建收藏列表容器
    const resultsContainer = document.createElement('div');
    resultsContainer.className = 'results-grid';
    
    // 获取所有条目并转换为数组，并排序（最新添加的排在前面）
    const entries = Object.entries(collectionData);
    const sortedEntries = entries.sort((a, b) => {
        // 从键名中提取索引值
        const indexA = parseInt(a[0].split('_').pop());
        const indexB = parseInt(b[0].split('_').pop());
        // 降序排序，使最新添加的在前面
        return indexB - indexA;
    });
    
    // 遍历收藏数据
    let hasValidItems = false;
    
    sortedEntries.forEach(([key, value], index) => {
        try {
            // 使用通用函数解析数据
            const videoData = parseVideoData(value);
            
            // 跳过没有标题的数据
            if (!videoData.title || videoData.title === '未知标题') return;
            
            hasValidItems = true;
            
            // 创建电影容器
            const container = document.createElement("div");
            container.className = "movie-container";
            container.setAttribute('data-key', key);

            // 创建图片
            const img = document.createElement("img");
            img.src = videoData.image;
            img.onerror = function() { 
                this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTUwIiB2aWV3Qm94PSIwIDAgMTAwIDE1MCIgZmlsbD0iIzMzMyI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxNTAiIGZpbGw9IiMyMjIiLz48dGV4dCB4PSI1MCIgeT0iNzUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2FhYSI+无图片</dGV4dD48L3N2Zz4='; 
            };
            
            // 创建标题和操作区域容器
            const infoContainer = document.createElement("div");
            infoContainer.className = "movie-info-container";

            // 创建标题
            const title = document.createElement("div");
            title.className = "movie-title";
            title.textContent = videoData.title;

            // 创建取消收藏按钮
            const uncollectBtn = document.createElement("button");
            uncollectBtn.className = "uncollect-button";
            uncollectBtn.innerHTML = '<i class="iconfont icon-shoucang1" style="color: #f39c12;"></i>';
            uncollectBtn.title = "取消收藏";

            // 阻止点击取消收藏按钮时触发容器的点击事件
            uncollectBtn.addEventListener('click', function(event) {
                event.stopPropagation();
                const key = container.getAttribute('data-key');
                const confirmRemove = confirm('确定要取消收藏该视频吗？');
                
                if (confirmRemove) {
                    // 移除此影片的DOM元素
                    container.style.opacity = '0.3';
                    container.style.pointerEvents = 'none';
                    
                    setTimeout(() => {
                        container.remove();
                        
                        // 检查是否还有其他收藏项
                        const remainingItems = document.querySelectorAll('.movie-container');
                        if (remainingItems.length === 0) {
                            // 如果没有收藏项了，显示空收藏提示
                            renderEmptyCollection();
                        }
                        
                        // 显示成功消息
                        alert('已取消收藏');
                    }, 500);
                }
            });

            // 添加电影容器的点击事件
            container.addEventListener('click', function() {
                try {
                    // 隐藏发现容器
                    const discoverContainer = document.getElementById('discover-container');
                    if (discoverContainer) {
                        discoverContainer.style.display = 'none';
                    }
                    
                    // 获取播放容器并显示它
                    const playContainer = document.getElementById('play-container');
                    if (playContainer) {
                        playContainer.style.display = 'block';
                    }
                    
                    // 显示加载动画
                    const loadingResults = document.getElementById('loading-results');
                    if (loadingResults) {
                        loadingResults.innerHTML = `
                            <div class="loading-all">
                                <div class="loading-animation"></div>
                                <div class="loading-text">加载中...</div>
                            </div>
                        `;
                    }
                    
                    // 从key中提取索引
                    const collectIndex = key.split('_').pop();
                    
                    // 保存当前实际索引到localStorage，用于收藏功能
                    const videoIdMatch = key.match(/sheep_collect_(\d+)/);
                    if (videoIdMatch && videoIdMatch[1]) {
                        localStorage.setItem('currentMovieActualIndex', collectIndex);
                    }
                    
                    // 简单处理数据并直接使用main80.js中的renderVideoDetail函数
                    if (typeof renderVideoDetail === 'function') {
                        // 清除加载动画
                        if (loadingResults) {
                            loadingResults.innerHTML = '';
                        }
                        
                        // 调用main80.js中的renderVideoDetail函数处理数据
                        renderVideoDetail({ [key]: value });
                    } else {
                        console.error('renderVideoDetail函数不存在');
                        
                        // 判断是否有剧集信息
                        if (videoData.episodes && videoData.episodes.length > 0) {
                            // 使用第一集信息
                            const firstEpisode = videoData.episodes[0].split(': ');
                            const episodeTitle = firstEpisode[0];
                            const episodeUrl = firstEpisode[1];
                            
                            if (episodeUrl && typeof renderVideoPlayer === 'function') {
                                renderVideoPlayer(episodeUrl, videoData.title, episodeTitle);
                            } else {
                                alert('无法播放该视频，请稍后重试');
                            }
                        } else {
                            alert('该视频没有可播放的内容');
                        }
                    }
                } catch (e) {
                    console.error('播放视频时出错:', e);
                    alert('播放视频时出错，请稍后重试');
                }
            });

            // 组装元素
            infoContainer.appendChild(title);
            infoContainer.appendChild(uncollectBtn);
            container.appendChild(img);
            container.appendChild(infoContainer);
            resultsContainer.appendChild(container);
        } catch (e) {
            console.error(`解析收藏项 ${key} 失败:`, e);
        }
    });
    
    // 创建完整的收藏内容
    const collectionContent = document.createElement('div');
    collectionContent.className = 'collection-content';
    
    // 如果没有有效数据，显示提示
    if (!hasValidItems) {
        collectionContent.innerHTML = '<div class="no-recent">没有有效的收藏记录</div>';
    } else {
        collectionContent.appendChild(resultsContainer);
    }
    
    // 更新内容
    const discoverContent = document.getElementById('discover-content');
    if (discoverContent) {
        const contentBody = discoverContent.querySelector('.discover-content-body');
        if (contentBody) {
            // 替换加载动画为结果
            const oldCollectionContent = contentBody.querySelector('.collection-content');
            if (oldCollectionContent) {
                oldCollectionContent.replaceWith(collectionContent);
            } else {
                contentBody.appendChild(collectionContent);
            }
        }
    }
}

// 解析收藏项数据 - 与zuijin18.js保持一致的解析方式
function parseVideoData(dataString) {
    if (!dataString) {
        return {
            title: '未知标题',
            image: '',
            description: '暂无简介',
            episodes: []
        };
    }
    
    try {
        const parts = dataString.split(',');
        return {
            title: parts[0] || '未知标题',
            image: parts[1] || '',
            description: parts[2] || '暂无简介',
            episodes: parts.slice(3) || []
        };
    } catch (error) {
        console.error('解析视频数据失败:', error);
        return {
            title: '解析错误',
            image: '',
            description: '数据解析失败',
            episodes: []
        };
    }
}

// 选择默认源
function showSelectDefaultSource() {
    // 获取当前默认源
    let currentSource = "1"; // 默认值
    try {
        const userData = localStorage.getItem("sheep_userdata");
        if (userData) {
            const userDataObj = JSON.parse(userData);
            if (userDataObj.source) {
                currentSource = userDataObj.source;
            }
        }
    } catch (e) {
        console.error("获取默认源失败:", e);
    }
    
    // 源数据数组
    const sourceOptions = [
        { id: "1", name: "急速资源" },
        { id: "2", name: "魔都资源" },
        { id: "3", name: "索尼资源" },
        { id: "4", name: "速播资源" },
        { id: "5", name: "量子资源" },
        { id: "6", name: "量子资源1" },
        { id: "7", name: "飘零资源" },
        { id: "8", name: "苹果资源" },
        { id: "9", name: "360资源" },
        { id: "10", name: "光束资源" },
        { id: "11", name: "卧龙资源" },
        { id: "12", name: "暴风资源" },
        { id: "13", name: "最大资源" }
    ];

    // 生成源选择界面
    let sourceOptionsHTML = "";
    sourceOptions.forEach(source => {
        const isChecked = source.id === currentSource ? 'checked' : '';
        sourceOptionsHTML += `
            <div class="source-option">
                <input type="radio" name="default-source" id="source-${source.id}" value="${source.id}" ${isChecked}>
                <label for="source-${source.id}">${source.name}</label>
            </div>
        `;
    });

    const content = `
        <div class="about-us-content">
            <div class="about-us-logo">
                <i class="iconfont icon-ziyuan" style="font-size: 48px; color: #f39c12;"></i>
                <h3>选择默认源</h3>
            </div>
            
            <div class="about-us-update-info">
                <h4 class="update-title">说明</h4>
                <p style="color: #ddd; margin-bottom: 15px;">请选择您喜欢的默认视频源。搜索时将优先使用此源搜索内容。</p>
                
                <style>
                    .source-options-container {
                        display: flex;
                        flex-direction: column;
                        gap: 12px;
                        margin-bottom: 20px;
                        padding: 15px;
                        border-radius: 8px;
                        background-color: rgba(255, 255, 255, 0.05);
                    }
                    .source-option {
                        display: flex;
                        align-items: center;
                        padding: 8px 10px;
                        border-radius: 6px;
                        background-color: rgba(255, 255, 255, 0.02);
                        transition: background-color 0.2s;
                    }
                    .source-option:hover {
                        background-color: rgba(255, 255, 255, 0.08);
                    }
                    .source-option input[type="radio"] {
                        margin-right: 10px;
                        accent-color: #f39c12;
                    }
                    .source-option label {
                        color: #eee;
                        cursor: pointer;
                    }
                    .save-source-btn {
                        width: 100%;
                        padding: 12px;
                        background-color: #f39c12;
                        color: #fff;
                        border: none;
                        border-radius: 6px;
                        font-size: 16px;
                        font-weight: bold;
                        cursor: pointer;
                        transition: background-color 0.2s;
                    }
                    .save-source-btn:hover {
                        background-color: #e67e22;
                    }
                    .save-source-btn:disabled {
                        background-color: #95a5a6;
                        cursor: not-allowed;
                    }
                    .save-result {
                        text-align: center;
                        background-color: rgba(46, 204, 113, 0.2);
                        padding: 10px;
                        border-radius: 6px;
                        margin-top: 15px;
                    }
                </style>
                
                <div class="source-options-container">
                    ${sourceOptionsHTML}
                </div>
                
                <button id="save-source-setting" class="save-source-btn">保存设置</button>
                
                <div id="save-result" class="save-result" style="margin-top: 10px; color: #4cd964; display: none;">
                    <i class="iconfont icon-success"></i> 设置已保存
                </div>
            </div>
        </div>
    `;
    
    showDiscoverContent('选择默认源', content);
    
    // 添加保存按钮事件监听
    setTimeout(() => {
        const saveButton = document.getElementById('save-source-setting');
        if (saveButton) {
            saveButton.addEventListener('click', function() {
                const selectedSource = document.querySelector('input[name="default-source"]:checked');
                if (selectedSource) {
                    const sourceId = selectedSource.value;
                    
                    // 显示保存按钮为加载状态
                    saveButton.textContent = '保存中...';
                    saveButton.disabled = true;
                    
                    // 发送请求保存默认源设置
                    fetch(`https://api.sheep.com/sheep/videoPolymerization/api/source/${sourceId}`)
                        .then(response => response.json())
                        .then(data => {
                            if (data.success) {
                                // 显示成功消息
                                const saveResult = document.getElementById('save-result');
                                if (saveResult) {
                                    saveResult.style.display = 'block';
                                    setTimeout(() => {
                                        saveResult.style.display = 'none';
                                    }, 3000);
                                }
                                
                                // 更新本地存储中的默认源
                                try {
                                    const userData = localStorage.getItem("sheep_userdata");
                                    if (userData) {
                                        const userDataObj = JSON.parse(userData);
                                        userDataObj.source = sourceId;
                                        localStorage.setItem("sheep_userdata", JSON.stringify(userDataObj));
                                    }
                                } catch (e) {
                                    console.error("更新本地默认源设置失败:", e);
                                }
                                
                                // 更新搜索页面的下拉选择框
                                const sourceSelect = document.getElementById('sourceSelect');
                                if (sourceSelect) {
                                    sourceSelect.value = sourceId;
                                }
                            } else {
                                alert('设置失败: ' + (data.error || '未知错误'));
                            }
                        })
                        .catch(error => {
                            console.error('保存默认源设置失败:', error);
                            alert('保存失败，请稍后重试');
                        })
                        .finally(() => {
                            // 恢复按钮状态
                            saveButton.textContent = '保存设置';
                            saveButton.disabled = false;
                        });
                } else {
                    alert('请选择一个默认源');
                }
            });
        }
        
        // 添加点击整个选项行选择源的功能
        const sourceOptions = document.querySelectorAll('.source-option');
        sourceOptions.forEach(option => {
            const radio = option.querySelector('input[type="radio"]');
            const label = option.querySelector('label');
            
            // 点击整个选项行时，选中对应的单选按钮
            option.addEventListener('click', function(e) {
                // 如果点击的是单选按钮本身，不需要额外处理
                if (e.target === radio) return;
                
                // 将对应的单选按钮设为选中
                radio.checked = true;
            });
        });
    }, 100);
}

// user2.js - 用户页面相关的样式和交互逻辑

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化事件监听器
    initUserEvents();
});

// 初始化用户页面事件
function initUserEvents() {
    // 事件委托处理折叠面板点击
    document.addEventListener('click', function(event) {
        const target = event.target;
        
        // 处理折叠面板点击
        if (target.closest('.user-collapsible-header')) {
            toggleCollapsible(target.closest('.user-collapsible-header'));
        }
        
        // 处理修改用户名按钮点击
        if (target.closest('.xiuGaiUserName')) {
            showUsernamePopup();
        }
    });
    
    // 底部导航栏用户按钮点击事件
    const profileBtn = document.getElementById('profileBtn');
    if (profileBtn) {
        profileBtn.addEventListener('click', function() {
            // 激活导航按钮
            document.querySelectorAll('#bottom-nav .nav-button').forEach(btn => {
                btn.classList.remove('nav-active');
            });
            profileBtn.classList.add('nav-active');
            
            // 显示用户页面
            showProfile();
        });
    }
}

// 当其他导航按钮被点击时，确保隐藏用户容器
function hideUserContainer() {
    const userContainer = document.getElementById('user-container');
    if (userContainer) {
        userContainer.style.display = 'none';
    }
}





