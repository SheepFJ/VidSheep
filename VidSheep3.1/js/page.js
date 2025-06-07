/*版本更新--------当前20250608版本-----------------@000001*/
if (version != 20250608) {
    document.querySelector('.vidSheep-update-area-display').classList.remove('vidSheep-update-area-display');
}
const vidSheepUpdateButton = document.getElementById('vidSheep-update-button');
vidSheepUpdateButton.addEventListener('click', function () {
    fetch(`https://api.sheep.com/sheep/VidSheep/api/?update=20250608`)
        .then(response => response.json())
        .then(data => {
            console.log(data.data.information);
        })
        .catch(error => {
            console.error('获取更新信息失败:', error);
        });
    setTimeout(() => {
        window.location.reload();
    }, 1200);
});

//公告是否展示
if (announcement === 1) {
    document.querySelector(".announcement").classList.remove("announcement_active")
}


/*播放页面处理-------------------------@000002*/
// 分享按钮点击事件
const iframepopupiframe = document.getElementById('iframe-popup-iframe');
const iframepopupbutton = document.querySelector('.iframe-popup-button-share');
// 关闭按钮点击事件
document.getElementById('iframe-popup-close').addEventListener('click', function () {
    document.getElementById('iframe-popup-overlay').style.display = 'none';
    document.getElementById('iframe-popup').style.display = 'none';
    iframepopupbutton.innerHTML = '分享';
    //移除视频src防止关闭后继续播放
    iframepopupiframe.src = '';
});
// 分享按钮点击事件
iframepopupbutton.addEventListener('click', function () {
    const url = iframepopupiframe.src;
    if (url) {
        // 创建一个临时的textarea元素来复制文本
        const textarea = document.createElement('textarea');
        textarea.value = url;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        // 提示用户已复制
        iframepopupbutton.innerHTML = '已剪贴';
    } else {
        alert('没有视频信息');
    }
});
// SenPlayer按钮点击事件
const iframepopupbuttonthird = document.querySelector('.iframe-popup-button-third');
iframepopupbuttonthird.addEventListener('click', function () {
    if (iframepopupiframe.src) {
        const url = iframepopupiframe.src;
        if (url.toLowerCase().endsWith('m3u8')) {
            const senplayerurl = 'SenPlayer://x-callback-url/play?url=' + encodeURIComponent(url);
            window.open(senplayerurl, '_blank');
        } else {
            alert('当前源不支持，请更换源搜索');
        }
    } else {
        alert('没有视频信息');
    }
});


/*壁纸处理--------壁纸数据来自遥望APP------------------------@000003*/
// 壁纸选择逻辑
document.addEventListener('DOMContentLoaded', function () {
    // 为壁纸容器添加事件委托，处理所有按钮点击
    const modifyWallpaperContent = document.querySelector('.modify-wallpaper-content');
    modifyWallpaperContent.addEventListener('click', function (event) {
        // 检查点击的是否是选择按钮
        if (event.target.classList.contains('wallpaper-select-btn')) {
            const clickedBtn = event.target;

            // 先恢复所有按钮状态
            const allBtns = document.querySelectorAll('.wallpaper-select-btn');
            allBtns.forEach(btn => {
                btn.textContent = '选择';
                btn.classList.remove('selected');
                // 移除所有图片的select-btn-img类
                btn.parentElement.querySelector('img').classList.remove('select-btn-img');
            });
            // 设置当前按钮为选中状态
            clickedBtn.textContent = '请确认';
            clickedBtn.classList.add('selected');
            // 为选中的图片添加select-btn-img类
            clickedBtn.parentElement.querySelector('img').classList.add('select-btn-img');
        }
    });
});


/*选择源-------资源来自网络------------------------@000004*/
document.addEventListener('DOMContentLoaded', function () {
    const sourceContainer = document.getElementById('default-source');
    const sourceItems = sourceContainer.querySelectorAll('li');
    sourceItems.forEach(item => {
        item.addEventListener('click', function () {
            // 移除所有li的选中状态
            sourceItems.forEach(s => {
                s.classList.remove('selected');
            });
            // 为当前点击的li添加选中状态
            this.classList.add('selected');
            // 可以在这里获取选中的源的值
            const selectedSourceValue = this.getAttribute('value');
            console.log('选中的默认源:', selectedSourceValue);
        });
    });
});


/*公共弹出框处理------------------------@000005*/

// 设置标签选择效果-AI
document.addEventListener('DOMContentLoaded', function () {
    const genreItems = document.querySelectorAll('.genre-list li');
    let selectedCount = [];

    genreItems.forEach(item => {
        item.addEventListener('click', function () {
            if (this.classList.contains('selected')) {
                this.classList.remove('selected');
                const index = selectedCount.indexOf(this.textContent);
                if (index > -1) {
                    selectedCount.splice(index, 1);
                }
            } else if (selectedCount.length < 3) {
                this.classList.add('selected');
                selectedCount.push(this.textContent);
            } else {
                // 超过3个时，移除最早选择的并添加新选择的
                const firstSelected = selectedCount.shift();
                const firstSelectedElement = Array.from(genreItems).find(el => el.textContent === firstSelected);
                if (firstSelectedElement) {
                    firstSelectedElement.classList.remove('selected');
                }
                this.classList.add('selected');
                selectedCount.push(this.textContent);
            }
        });
    });
});

function showPopup(text) {
    // 隐藏所有内容区域
    document.querySelectorAll('.popup-content').forEach(item => {
        item.style.display = 'none';
    });

    // 显示弹出框与遮罩层
    document.getElementById('public-popup').style.display = 'block';
    document.getElementById('popup-overlay').style.display = 'block';

    // 显示对应内容区域
    const contentMap = {
        'clear-AI': 'clear-AI-popup',
        'play-popup': 'play-popup',
        'modify-wallpaper': 'modify-wallpaper',
        'default-source': 'default-source',
        'about': 'about'
    };

    if (contentMap[text]) {
        document.getElementById(contentMap[text]).style.display = 'block';
    }
}

// 关闭弹出框
const closePopup = document.querySelector('.close-popup');
closePopup.addEventListener('click', () => {
    document.getElementById('public-popup').style.display = 'none';
    document.getElementById('popup-overlay').style.display = 'none';
});

// 确认按钮
const confirmAI = document.querySelector('.confirm-popup');
confirmAI.addEventListener('click', () => {
    const actionHandlers = {
        'clear-AI': () => {
            console.log(selectedCount);

            fetch(`https://api.sheep.com/sheep/VidSheep/api/?clearAI=${selectedCount}`)
                .then(response => response.json())
                .then(data => {
                    console.log(data.data);
                    const searchHistory = document.querySelector('.recent-keywords');
                    data.data.array.forEach(keyword => {
                        searchHistory.innerHTML = `<span class="keyword-item">${keyword}</span>` + searchHistory.innerHTML;
                    });
                })
                .catch(() => {
                    alert('AI推荐失败,请设置omp7djvjwc5rouckyjz3q74nt40bgpgg.lambda-url.us-east-2.on.aws走代理然后重新尝试');
                });

            // 清空选中的标签
            selectedCount = [];
            document.querySelectorAll('.genre-list li').forEach(item => {
                item.classList.remove('selected');
            });
        },
        'play-popup': () => {
            console.log("关闭弹窗");
        },
        'modify-wallpaper': () => {
            console.log("修改壁纸");
            const selectedImg = document.querySelector('.modify-wallpaper-content .select-btn-img');

            if (selectedImg) {
                fetch(`https://api.sheep.com/sheep/VidSheep/api/?wallpaper=${selectedImg.src}`)
                    .then(response => response.json())
                    .then(data => {
                        console.log(data.data.information);
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });

                // 延迟刷新
                setTimeout(() => window.location.reload(), 1500);
            }
        },
        'default-source': () => {
            const selectedSourceElement = document.querySelector('#default-source li.selected');
            if (selectedSourceElement) {
                const selectedSourceValue = selectedSourceElement.getAttribute('value');
                console.log('选中的默认源:', selectedSourceValue);

                // 修改默认源
                defaultSource = selectedSourceValue;

                fetch(`https://api.sheep.com/sheep/VidSheep/api/?defaultSource=${selectedSourceValue}`)
                    .then(response => response.json())
                    .then(data => {
                        console.log(data.data.information);
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
            }
        }
    };

    // 执行对应处理函数
    if (actionHandlers[currentPopup]) {
        actionHandlers[currentPopup]();
    }

    // 关闭弹出框
    document.getElementById('public-popup').style.display = 'none';
    document.getElementById('popup-overlay').style.display = 'none';
});

// 定位搜索集数
const playToolbarButtonSearch = document.querySelector('.play-toolbar-button-search');
const playToolbarInput = document.querySelector('.play-toolbar-input');

playToolbarButtonSearch.addEventListener('click', () => {
    let playToolbarInputValue = playToolbarInput.value;
    const playLength = document.querySelector('#play-popup').dataset.playlength;

    if (playToolbarInputValue > parseInt(playLength)) {
        playToolbarInputValue = parseInt(playLength);
    }

    const playListItem = document.getElementById('play-list-item-' + playToolbarInputValue);
    if (playListItem) {
        // 移除所有已选中项
        document.querySelectorAll('.selectedClick').forEach(item => {
            item.classList.remove('selectedClick');
        });

        // 滚动到目标元素并高亮
        playListItem.scrollIntoView({ behavior: "smooth", block: "center" });
        playListItem.classList.add('selectedClick');
    }
});

// 动态添加点击样式
const playList = document.querySelector('.play-list');
playList.addEventListener('click', (e) => {
    // 确保点击的是列表项
    if (!e.target.closest('li')) return;

    const target = e.target.closest('li');

    // 移除所有已选中项并添加当前选中
    document.querySelectorAll('.selectedClick').forEach(item => {
        item.classList.remove('selectedClick');
    });
    target.classList.add('selectedClick');

    // 显示弹出框
    document.getElementById('iframe-popup-overlay').style.display = 'block';
    document.getElementById('iframe-popup').style.display = 'block';

    // 更新播放信息
    const playListItemText = target.innerText;
    const playListItemDataPlayurl = target.dataset.playurl;

    document.getElementById('iframe-popup-current-episode').innerText = playListItemText;
    document.getElementById('iframe-popup-iframe').src = playListItemDataPlayurl;
});

// 倒转列表顺序
const playToolbarButtonReverse = document.querySelector('.play-toolbar-button-reverse');
let isReversed = false;
playToolbarButtonReverse.addEventListener('click', function () {
    const PlayListOrder = document.querySelectorAll('.play-list li');

    if (!isReversed) {
        PlayListOrder.forEach((item, index) => {
            item.style.order = PlayListOrder.length - index;
        });
    } else {
        PlayListOrder.forEach((item) => {
            item.style.order = '';
        });
    }
    isReversed = !isReversed;
});

// 收藏功能
const playToolbarButtonCollect = document.querySelector('.play-toolbar-button-collect');
playToolbarButtonCollect.addEventListener('click', function () {
    const playPopupH2 = document.querySelector('#play-popup h2');
    const playPopupH2Text = playPopupH2.id;

    const searchDataItem = searchData.data.array.vidlist.find(item => item.vid_id == playPopupH2Text);

    if (searchDataItem) {
        // 添加到收藏列表
        collectData.data.array.vidlist.push(searchDataItem);

        // 更新UI
        const collectGridList = document.querySelector('.media-grid-collect-list');
        collectGridList.innerHTML += `
            <div class="media-card-collect-list player-card" data-id="${searchDataItem.vid_id}" data-record="${searchDataItem.vid_last_record}" data-source="${searchDataItem.vid_source}" data-update="${searchDataItem.vid_updata_status}">
                <div class="media-image-container" style="position: relative;">
                    <img src="${searchDataItem.vid_img}" alt="${searchDataItem.vid_name}" class="media-image">
                    <div class="collect-delete-button">×</div>
                </div>
                <div class="media-title">${searchDataItem.vid_name}</div>
            </div>
        `;

        // 发送收藏请求
        fetch(`https://api.sheep.com/sheep/VidSheep/api/?collect=${playPopupH2Text}&state=add`)
            .then(response => response.json())
            .then(data => {
                console.log(data.data.information);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
});


/*搜索历史处理------------------------@000006*/
// 获取历史搜索关键词,打开页面即执行
fetch('https://api.sheep.com/sheep/VidSheep/api/?keywords=all')
    .then(response => response.json())
    .then(data => {
        searchHistoryArray = data.data.array;
        // 将数据添加到搜索历史列表中
        const searchHistory = document.querySelector('.recent-keywords');
        data.data.array.forEach(keyword => {
            searchHistory.innerHTML += `<span class="keyword-item">${keyword}</span>`;
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
// 删除历史记录
const clearHistory = document.querySelector('.clear-history');
clearHistory.addEventListener('click', () => {
    fetch('https://api.sheep.com/sheep/VidSheep/api/?keywords=clear')
        .then(response => response.json())
        .then(data => {
            console.log(data.data.information);
            searchHistory.innerHTML = '';
        })
        .catch(error => {
            console.error('清除历史记录失败:', error);
        });
});
// 搜索
const searchInput = document.querySelector('.search-input');
const searchButton = document.querySelector('.search-button');
const sourceSelect = document.querySelector('.source-select');
const noResults = document.querySelector('.no-results');
const mediaGrid = document.querySelector('.media-grid');

function search(sourceValue, searchWord) {
    // 更新搜索历史
    if (sourceValue != '0') {
        const searchHistory = document.querySelector('.recent-keywords');
        // 检查关键词是否已存在
        const existingIndex = searchHistoryArray.indexOf(searchWord);
        if (existingIndex !== -1) {
            // 如果存在，从数组和UI中移除
            searchHistoryArray.splice(existingIndex, 1);
            const existingElements = searchHistory.querySelectorAll('.keyword-item');
            for (let i = 0; i < existingElements.length; i++) {
                if (existingElements[i].textContent === searchWord) {
                    existingElements[i].remove();
                    break;
                }
            }
        }
        // 将关键词添加到数组和UI的最前面
        searchHistoryArray.unshift(searchWord);
        searchHistory.innerHTML = `<span class="keyword-item">${searchWord}</span>` + searchHistory.innerHTML;
        // 清除搜索框内容和结果区域
        searchInput.value = '';
        mediaGrid.innerHTML = '';
        if (sourceValue === '999') {
            sourceValue = defaultSource;
        }
    }

    fetch(`https://api.sheep.com/sheep/VidSheep/api/?search=${sourceValue}&searchword=${encodeURIComponent(searchWord)}`)
        .then(response => response.json())
        .then(data => {
            noResults.style.display = 'none';

            if (data.data.array?.vidlist?.length > 0) {
                // 清空并更新搜索结果
                searchResult.data.array.vidlist = [];
                searchResult.data.array.vidlist.unshift(...data.data.array.vidlist);
                // 更新UI
                data.data.array.vidlist.forEach(item => {
                    mediaGrid.innerHTML += `
<div class="media-card player-card" data-id="${item.vid_id}">
<img src="${item.vid_img}" alt="${item.vid_name}" class="media-image">
   <div class="media-title">${item.vid_name}</div>
</div>`;
                });
            } else {
                noResults.style.display = 'block';
            }
        })
        .catch(error => {
            console.error('搜索请求出错:', error);
        });
}
searchButton.addEventListener('click', () => {
    const searchWord = searchInput.value.trim();
    let sourceValue = sourceSelect.value;

    if (searchWord !== '' && searchWord.length <= 20) {
        search(sourceValue, searchWord);
    }
});
// 点击搜索历史词加入搜索框
document.querySelector('.recent-keywords').addEventListener('click', (e) => {
    if (e.target.classList.contains('keyword-item')) {
        searchInput.value = e.target.textContent.trim();
    }
});
// 公共弹出框-AI推荐
document.querySelector('.clear-AI').addEventListener('click', () => {
    currentPopup = 'clear-AI';
    showPopup(currentPopup);
});
// 初始加载随机内容
const randomNumber = Math.floor(Math.random() * 2000) + 1;
search('0', randomNumber);
// 刷新随机剧集
document.querySelector('.refresh-history').addEventListener('click', () => {
    mediaGrid.innerHTML = '';
    const randomNumberRefresh = Math.floor(Math.random() * 2000) + 1;
    search('0', randomNumberRefresh);
});

/* 最近的收藏之间的切换-----------------------@000007*/
//处理最近与收藏的显示与隐藏
const MyCollectList = document.querySelector('.my-collect-list');
const searchResultsList = document.querySelector('.search-results-list');
const searchCollectList = document.querySelector('.search-collect-list');
const clearHistoryList = document.querySelector('.clear-history-list');
const searchResultsListTitle = document.querySelector('.search-results-list-title');
const mediaGridList = document.querySelector('.media-grid-list');
const playerUnity = document.querySelectorAll('.player-unity');

// 初始状态：显示最近，隐藏收藏
searchResultsList.style.display = 'block';
searchCollectList.style.display = 'none';

// 切换列表显示
MyCollectList.addEventListener('click', () => {
    const isShowingRecent = MyCollectList.textContent === '我的收藏';

    // 更新UI状态
    searchResultsList.style.display = isShowingRecent ? 'none' : 'block';
    searchCollectList.style.display = isShowingRecent ? 'block' : 'none';
    clearHistoryList.style.display = isShowingRecent ? 'none' : 'block';

    // 更新文本和类型
    MyCollectList.textContent = isShowingRecent ? '最近搜索' : '我的收藏';
    searchResultsListTitle.textContent = isShowingRecent ? '我的收藏' : '最近列表';
    playType = isShowingRecent ? 'collectlist' : 'resultslist';
});

// 清空最近
clearHistoryList.addEventListener('click', () => {
    mediaGridList.innerHTML = '';

    fetch('https://api.sheep.com/sheep/VidSheep/api/?deleteRecent=all')
        .then(response => response.json())
        .then(data => console.log(data.data.information))
        .catch(error => console.error('Error:', error));
});

// 获取最近数据加入前端对象中，防止多次请求，首次打开执行
fetch('https://api.sheep.com/sheep/VidSheep/api/?recent=all')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        searchData = data;

        const itemsHTML = data.data.array.vidlist.map(item => `
            <div class="media-card-list player-card" data-id="${item.vid_id}">
                <div class="media-image-container" style="position: relative;">
                    <img src="${item.vid_img}" alt="${item.vid_name}" class="media-image">
                    <div class="media-delete-button">×</div>
                </div>
                <div class="media-title">${item.vid_name}</div>
            </div>`
        ).join('');

        mediaGridList.innerHTML = itemsHTML;
    })
    .catch(error => console.error('Error:', error));



/* 剧集的点击处理------------------------@000008*/

const collectGridList = document.querySelector('.media-grid-collect-list');

// 获取收藏数据，首次打开执行
fetch('https://api.sheep.com/sheep/VidSheep/api/?collect=all')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        collectData = data;

        const collectHTML = data.data.array.vidlist.map(item => `
            <div class="media-card-collect-list player-card" data-id="${item.vid_id}" data-record="${item.vid_last_record}" data-source="${item.vid_source}" data-update="${item.vid_updata_status}">
                <div class="media-image-container" style="position: relative;">
                    <img src="${item.vid_img}" alt="${item.vid_name}" class="media-image">
                    <div class="collect-delete-button">×</div>
                </div>
                <div class="media-title">${item.vid_name}</div>
            </div>
        `).join('');

        collectGridList.innerHTML = collectHTML;
    })
    .catch(error => console.error('Error:', error));

// 为所有播放器区域添加事件委托
playerUnity.forEach(item => {
    item.addEventListener('click', (e) => {
        const target = e.target;
        const playerCard = target.closest('.player-card');

        if (!playerCard) return;

        const mediaId = playerCard.dataset.id;

        // 处理删除按钮点击
        if (target.classList.contains('media-delete-button')) {
            console.log('点击了最近删除按钮，ID:', mediaId);
            playerCard.classList.add('media-display-delete');

            fetch(`https://api.sheep.com/sheep/VidSheep/api/?deleteRecent=${mediaId}`)
                .then(response => response.json())
                .then(data => console.log(data.data.information));

            return;
        }

        if (target.classList.contains('collect-delete-button')) {
            console.log('点击了收藏删除按钮，ID:', mediaId);
            playerCard.classList.add('media-display-delete');

            fetch(`https://api.sheep.com/sheep/VidSheep/api/?collect=${mediaId}`)
                .then(response => response.json())
                .then(data => console.log(data.data.information));

            return;
        }

        // 处理图片或标题点击
        if (target.classList.contains('media-image') || target.classList.contains('media-title')) {
            console.log('点击了图片或者标题，ID:', mediaId);

            // 如果是从搜索结果点击，添加到最近
            if (mediaTag === 'locationsearch') {
                console.log("从搜索结果点击的");

                const item = searchResult.data.array.vidlist.find(item => item.vid_id == mediaId);

                if (item) {
                    const newItemHTML = `
                        <div class="media-card-list player-card" data-id="${item.vid_id}">
                            <div class="media-image-container" style="position: relative;">
                                <img src="${item.vid_img}" alt="${item.vid_name}" class="media-image">
                                <div class="media-delete-button">×</div>
                            </div>
                            <div class="media-title">${item.vid_name}</div>
                        </div>
                    `;

                    // 更新界面和数据
                    mediaGridList.innerHTML = newItemHTML + mediaGridList.innerHTML;
                    searchData.data.array.vidlist.unshift(item);
                }

                // 添加到最近记录
                fetch(`https://api.sheep.com/sheep/VidSheep/api/?recent=${mediaId}`)
                    .then(response => response.json())
                    .then(data => console.log(data.data.information));
            }

            // 展示播放弹窗
            currentPopup = 'play-popup';

            // 根据当前模式获取播放数据
            const playDataItem = (mediaTag === 'locationsearch' || playType === 'resultslist')
                ? searchData.data.array.vidlist.find(item => item.vid_id == mediaId)
                : collectData.data.array.vidlist.find(item => item.vid_id == mediaId);

            console.log(playDataItem);

            // 设置播放弹窗信息
            const playPopup = document.querySelector('#play-popup');
            playPopup.dataset.playlength = playDataItem.vid_play_name.length;
            playPopup.querySelector('h2').textContent = playDataItem.vid_name;
            playPopup.querySelector('h2').id = playDataItem.vid_id;
            playPopup.querySelector('img').src = playDataItem.vid_img;
            playPopup.querySelector('span').textContent = playDataItem.vid_content;

            // 生成播放列表
            const playListElement = playPopup.querySelector('.play-list');
            playListElement.innerHTML = playDataItem.vid_play_name.map((name, i) => `
                <li id="play-list-item-${i + 1}" data-playurl="${playDataItem.vid_play_url[i]}">
                    ${name}
                </li>
            `).join('');

            // 显示播放器弹窗
            showPopup(currentPopup);
        }
    });
});


/*发现页面处理------------------------@000009*/
// 为discover-section下面所有元素添加点击事件
const discoverSection = document.querySelector('#discover-section');
discoverSection.addEventListener('click', (e) => {
    const discoverItem = e.target.closest('.discover-item');

    if (!discoverItem) return;

    // 处理不同的发现项目
    const handleDiscoverItem = {
        'discover-wallpaper': () => {
            console.log('点击了壁纸');

            // 获取壁纸数据
            fetch('https://api.sheep.com/sheep/VidSheep/api/?wallpaper=get')
                .then(response => response.json())
                .then(data => {
                    console.log(data.data.array);
                    const modifyWallpaperContent = document.querySelector('.modify-wallpaper-content');
                    modifyWallpaperContent.innerHTML = ''; // 清空现有内容

                    // 使用map构建HTML字符串，避免频繁操作DOM
                    const wallpaperHTML = data.data.array.map(wallpaperUrl => `
                        <div class="modify-wallpaper-item">
                            <img src="${wallpaperUrl}" alt="壁纸">
                            <button class="wallpaper-select-btn">选择</button>
                        </div>
                    `).join('');

                    modifyWallpaperContent.innerHTML = wallpaperHTML;
                })
                .catch(error => console.error('获取壁纸数据失败:', error));

            currentPopup = 'modify-wallpaper';
        },

        'discover-default-source': () => {
            console.log('点击了默认源');

            // 移除所有选中状态并选中当前默认源
            const defaultSourceItems = document.querySelectorAll('#default-source li');
            defaultSourceItems.forEach(item => item.classList.remove('selected'));

            const defaultSourceItem = document.querySelector(`#default-source li[value="${defaultSource}"]`);
            if (defaultSourceItem) defaultSourceItem.classList.add('selected');

            currentPopup = 'default-source';
        },

        'discover-about': () => {
            console.log('点击了关于');
            currentPopup = 'about';
        }
    };

    // 获取类名并执行相应处理
    for (const className in handleDiscoverItem) {
        if (discoverItem.classList.contains(className)) {
            handleDiscoverItem[className]();
            showPopup(currentPopup);
            break;
        }
    }
});


/*状态栏切换------------------------@000010*/


let currentSection = 'search';
function showSection(section) {
    // 更新当前选中的导航按钮
    document.querySelectorAll('.nav-button').forEach(btn => {
        btn.classList.remove('nav-active');
    });
    document.getElementById(section + 'Btn').classList.add('nav-active');
    // 隐藏所有内容区域
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    // 显示选中的内容区域
    document.getElementById(section + '-section').classList.add('active');
    // 更新当前section
    currentSection = section;
    // 根据点击的选项更新mediaTag的值
    if (section === 'search') {
        mediaTag = 'locationsearch';
    } else {
        mediaTag = null;
    }
}
// 请求用户信息测试
function userinfo() {
    fetch('https://api.sheep.com/sheep/VidSheep/api/?userinfo=all')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            document.getElementById('userinfo').innerHTML = data.data.information;
        })
        .catch(error => {
            console.error('Error:', error);
        })
}
// 关闭公告
const announcementNO = document.querySelector("#announcementNO");
announcementNO.addEventListener("click", () => {
    document.querySelector(".announcement").classList.add("announcement_active")
    fetch('https://api.sheep.com/sheep/VidSheep/api/?announcement=1')
        .then(response => response.json())
        .then(data => {
            console.log(data.data.information);
        })
        .catch(error => {
            console.error('Error:', error);
        })
})
