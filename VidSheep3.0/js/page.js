//定义一个全局变量记录展示的弹窗
let currentPopup = null;
// 定义一个全局变量记录选中的标签列表
let selectedCount = [];
// 定义一个全局变量记录搜索数据
let searchData = {};
// 定义一个全局变量记录壁纸数据
let wallpaperData = [];
// 定义一个全局变量记录收藏数据
let collectData = [];
//定义一个全局变量记录play打开于收藏还是最近
let playType = 'resultslist';





//公告是否展示
if (announcement === 1) {
    document.querySelector(".announcement").classList.remove("announcement_active")
}




// 分享按钮点击事件
const iframepopupiframe = document.getElementById('iframe-popup-iframe');
const iframepopupbutton = document.querySelector('.iframe-popup-button-share');
// 关闭按钮点击事件
document.getElementById('iframe-popup-close').addEventListener('click', function () {
    document.getElementById('iframe-popup-overlay').style.display = 'none';
    document.getElementById('iframe-popup').style.display = 'none';
    iframepopupbutton.innerHTML = '分享';
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

// 设置标签选择效果-AI
document.addEventListener('DOMContentLoaded', function () {
    const genreItems = document.querySelectorAll('.genre-list li');


    genreItems.forEach(item => {
        item.addEventListener('click', function () {
            // 如果已经选中，则取消选中
            if (this.classList.contains('selected')) {
                this.classList.remove('selected');
                // 从数组中移除当前选中的标签
                const index = selectedCount.indexOf(this.textContent);
                // 如果存在，则移除
                if (index > -1) {
                    selectedCount.splice(index, 1);
                }
            } else {
                // 如果未选中且选中数量小于3，则选中
                if (selectedCount.length < 3) {
                    this.classList.add('selected');
                    selectedCount.push(this.textContent);
                } else {
                    // 如果已经选了3个，取消第一个最早的选中
                    //获取删除的第一个值
                    const firstSelected = selectedCount.shift();
                    const firstSelectedElement = Array.from(genreItems).find(el => el.textContent === firstSelected);
                    if (firstSelectedElement) {
                        firstSelectedElement.classList.remove('selected');
                    }
                    // 选中当前点击的
                    this.classList.add('selected');
                    selectedCount.push(this.textContent);
                }
            }
        });
    });


});


function showPopup(text) {
    // 所有类名popup-content的div隐藏
    document.querySelectorAll('.popup-content').forEach(item => {
        item.style.display = 'none';
    });

    // 显示弹出框与遮罩层
    document.getElementById('public-popup').style.display = 'block';
    document.getElementById('popup-overlay').style.display = 'block';
    // 根据按钮显示对应内容
    if (text == 'clear-AI') {
        // 显示AI推荐弹窗
        document.getElementById('clear-AI-popup').style.display = 'block';
    } else if (text == 'play-popup') {
        // 显示播放器展开弹窗
        document.getElementById('play-popup').style.display = 'block';
    } else if (text == 'modify-wallpaper') {
        // 显示修改壁纸弹窗
        document.getElementById('modify-wallpaper').style.display = 'block';
    } else if (text == 'default-source') {
        // 显示选择默认源弹窗
        document.getElementById('default-source').style.display = 'block';
    } else if (text == 'about') {
        // 显示关于弹窗
        document.getElementById('about').style.display = 'block';
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

    console.log(currentPopup);
    if (currentPopup == 'clear-AI') {
        console.log(selectedCount);


        // 发送请求
        fetch(`https://api.sheep.com/sheep/VidSheep/api/?clearAI=${selectedCount}`)
            .then(response => response.json())
            .then(data => {
                console.log(data.data);
                const searchHistory = document.querySelector('.recent-keywords');
                data.data.array.forEach(keyword => {
                    searchHistory.innerHTML = `<span class="keyword-item">${keyword}</span>` + searchHistory.innerHTML;
                });
            })
            .catch(error => {
                alert('AI推荐失败,请重新尝试，或联系作者');
            });

        //清空选中的标签
        selectedCount = [];
        // 清空选中的标签的样式
        document.querySelectorAll('.genre-list li').forEach(item => {
            item.classList.remove('selected');
        });
    }

    if (currentPopup == 'play-popup') {
        // 显示播放器展开弹窗
        console.log("关闭弹窗");
    }

    if (currentPopup == 'modify-wallpaper') {
        // 显示修改壁纸弹窗
        console.log("修改壁纸");

        // 获取modify-wallpaper-content下面带select-btn-img类的元素
        const modifyWallpaperContent = document.querySelector('.modify-wallpaper-content');
        const modifyWallpaperContentSelectBtnImg = modifyWallpaperContent.querySelector('.select-btn-img');


        // 获取modifyWallpaperContentSelectBtnImg的src
        const modifyWallpaperContentSelectBtnImgSrc = modifyWallpaperContentSelectBtnImg.src;


        //发送请求
        fetch(`https://api.sheep.com/sheep/VidSheep/api/?wallpaper=${modifyWallpaperContentSelectBtnImgSrc}`)
            .then(response => response.json())
            .then(data => {
                console.log(data.data.information);
            })
            .catch(error => {
                console.error('Error:', error);
            });





        //等待1秒后刷新
        setTimeout(() => {
            window.location.reload();
        }, 1000);

    }

    // 关闭弹出框
    document.getElementById('public-popup').style.display = 'none';
    document.getElementById('popup-overlay').style.display = 'none';

});




//定位搜索集数

const playToolbarButtonSearch = document.querySelector('.play-toolbar-button-search');
const playToolbarInput = document.querySelector('.play-toolbar-input');


playToolbarButtonSearch.addEventListener('click', (e) => {
    //获取playToolbarInput的值
    let playToolbarInputValue = playToolbarInput.value;

    const playLength = document.querySelector('#play-popup').dataset.playlength;

    if (playToolbarInputValue > parseInt(playLength)) {
        playToolbarInputValue = parseInt(playLength);
    }


    //获取play-list-item-99的元素
    const playListItem99 = document.getElementById('play-list-item-' + playToolbarInputValue);
    console.log(playListItem99);

    //跳转
    playListItem99.scrollIntoView({ behavior: "smooth", block: "center" });

    //高亮显示找到的元素
    playListItem99.classList.add('selectedClick');



})


// 动态添加点击样式
const playList = document.querySelector('.play-list');
playList.addEventListener('click', (e) => {
    //移除所有的selectedClick
    document.querySelectorAll('.selectedClick').forEach(item => {
        item.classList.remove('selectedClick');
    });

    //添加当前点击的元素
    e.target.classList.add('selectedClick');


    //显示iframe-popup-overlay
    document.getElementById('iframe-popup-overlay').style.display = 'block';
    //显示iframe-popup
    document.getElementById('iframe-popup').style.display = 'block';

    //获取当前点击的元素的innerText
    const playListItemText = e.target.innerText;
    console.log(playListItemText);

    //获取当前元素的data-playurl
    const playListItemDataPlayurl = e.target.dataset.playurl;
    console.log(playListItemDataPlayurl);

    //获取iframe-popup-current-episode的元素
    const iframePopupCurrentEpisode = document.getElementById('iframe-popup-current-episode');
    iframePopupCurrentEpisode.innerText = playListItemText;

    //获取iframe-popup-iframe的元素
    const iframePopupIframe = document.getElementById('iframe-popup-iframe');
    iframePopupIframe.src = playListItemDataPlayurl;



})

//倒转
const playToolbarButtonReverse = document.querySelector('.play-toolbar-button-reverse');
let isReversed = false;
playToolbarButtonReverse.addEventListener('click', function () {
    //获取iframe-popup-iframe的元素
    const PlayListOrder = document.querySelectorAll('.play-list li');

    if (!isReversed) {
        //调整顺序为倒序
        PlayListOrder.forEach((item, index) => {
            item.style.order = PlayListOrder.length - index;
        });
        isReversed = true;
    } else {
        //恢复原来的顺序
        PlayListOrder.forEach((item) => {
            item.style.order = '';
        });
        isReversed = false;
    }
});

//收藏


const playToolbarButtonCollect = document.querySelector('.play-toolbar-button-collect');
playToolbarButtonCollect.addEventListener('click', function () {
    //获取视频id
    const playPopupH2 = document.querySelector('#play-popup h2');
    const playPopupH2Text = playPopupH2.id;
    console.log(playPopupH2Text);

    //从searchData中找到playPopupH2Text的元素
    const searchDataItem = searchData.data.array.vidlist.find(item => item.vid_id == playPopupH2Text);

    console.log(searchDataItem);

    if (searchDataItem) {
        //将剧集添加到收藏列表
        collectData.data.array.vidlist.push(searchDataItem);

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

        //发送请求传递playPopupH2Text
        fetch(`https://api.sheep.com/sheep/VidSheep/api/?collect=${playPopupH2Text}&state=add`)
            .then(response => response.json())
            .then(data => {
                console.log(data.data.information);
            })
            .catch(error => {
                console.error('Error:', error);
            });


    }

})


// 获取历史搜索关键词,打开页面即执行
fetch('https://api.sheep.com/sheep/VidSheep/api/?keywords=all')
    .then(response => response.json())
    .then(data => {

        // 将data.data.array中的数据添加到搜索历史列表中
        const searchHistory = document.querySelector('.recent-keywords');
        data.data.array.forEach(keyword => {
            searchHistory.innerHTML += `<span class="keyword-item">${keyword}</span>`;
        });
    })
    .catch(error => {
        console.error('Error:', error);
    })






// 删除历史记录
const clearHistory = document.querySelector('.clear-history');
clearHistory.addEventListener('click', () => {
    fetch('https://api.sheep.com/sheep/VidSheep/api/?keywords=clear')
        .then(response => response.json())
        .then(data => {
            console.log(data.data.information);
            // 清空搜索历史UI
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
searchButton.addEventListener('click', () => {
    const searchWord = searchInput.value;
    const sourceValue = sourceSelect.value;


    if (searchWord.trim() !== '' && searchWord.trim().length <= 20) {
        // 将搜索历史添加到搜索历史列表中最前
        const searchHistory = document.querySelector('.recent-keywords');
        const mediaGrid = document.querySelector('.media-grid');
        searchHistory.innerHTML = `<span class="keyword-item">${searchWord}</span>` + searchHistory.innerHTML;

        //清除搜索框内容
        searchInput.value = '';
        mediaGrid.innerHTML = ''; // 清空现有内容

        // 发送搜索请求
        fetch(`https://api.sheep.com/sheep/VidSheep/api/?search=${sourceValue}&searchword=${encodeURIComponent(searchWord)}`)
            .then(response => response.json())
            .then(data => {

                noResults.style.display = 'none';

                if (data.data.array && data.data.array.vidlist && data.data.array.vidlist.length > 0) {

                    // 使用unshift将新数据添加到数组前面
                    searchData.data.array.vidlist.unshift(...data.data.array.vidlist);

                    // 创建临时HTML字符串，用于存储新的搜索结果
                    let newMediaGridHTML = '';
                    let newMediaGridListHTML = '';

                    data.data.array.vidlist.forEach(item => {

                        mediaGrid.innerHTML += `
<div class="media-card player-card" data-id="${item.vid_id}" >
    <img src="${item.vid_img}" alt="${item.vid_name}" class="media-image">
        <div class="media-title">${item.vid_name}</div>
    </div>
`;

                        newMediaGridListHTML += `
<div class="media-card-list player-card" data-id="${item.vid_id}" >
    <div class="media-image-container" style="position: relative;">
        <img src="${item.vid_img}" alt="${item.vid_name}" class="media-image">
        <div class="media-delete-button">×</div>
    </div>
        <div class="media-title">${item.vid_name}</div>
    </div>
`;
                    });

                    // 更新mediaGridList，保留原有内容并在前面添加新内容
                    mediaGridList.innerHTML = newMediaGridListHTML + mediaGridList.innerHTML;


                } else {
                    noResults.style.display = 'block';
                }
                // 这里可以处理搜索结果
            })
            .catch(error => {
                console.error('搜索请求出错:', error);
            });
    }
});

//点击搜索历史词加入搜索框
const searchHistory = document.querySelector('.recent-keywords');
searchHistory.addEventListener('click', (e) => {
    // 只有当点击的是关键词元素时才将其添加到搜索框
    if (e.target.classList.contains('keyword-item')) {
        searchInput.value = e.target.textContent;
    }
});


// 公共弹出框-AI推荐
const aiRecommend = document.querySelector('.clear-AI');
aiRecommend.addEventListener('click', () => {
    currentPopup = 'clear-AI';
    showPopup(currentPopup);
});



//处理最近与收藏的显示与隐藏
const MyCollectList = document.querySelector('.my-collect-list');
const searchResultsList = document.querySelector('.search-results-list');
const searchCollectList = document.querySelector('.search-collect-list');
const clearHistoryList = document.querySelector('.clear-history-list');
const searchResultsListTitle = document.querySelector('.search-results-list-title');

// 初始状态：显示最近，隐藏收藏
searchResultsList.style.display = 'block';
searchCollectList.style.display = 'none';

MyCollectList.addEventListener('click', () => {
    if (MyCollectList.textContent === '我的收藏') {
        // 切换到收藏列表
        searchResultsList.style.display = 'none';
        searchCollectList.style.display = 'block';
        clearHistoryList.style.display = 'none';
        MyCollectList.textContent = '最近搜索';
        searchResultsListTitle.textContent = '我的收藏';
        playType = 'collectlist';
    } else {
        // 切换到最近列表
        searchResultsList.style.display = 'block';
        searchCollectList.style.display = 'none';
        clearHistoryList.style.display = 'block';
        MyCollectList.textContent = '我的收藏';
        searchResultsListTitle.textContent = '最近列表';
        playType = 'resultslist';
    }
});




// 清空最近

clearHistoryList.addEventListener('click', () => {
    //清空media-grid-list下面的所有media-card-list
    const mediaGridList = document.querySelector('.media-grid-list');
    mediaGridList.innerHTML = '';

    fetch('https://api.sheep.com/sheep/VidSheep/api/?deleteRecent=all')
        .then(response => response.json())
        .then(data => {
            console.log(data.data.information);
        })
        .catch(error => {
            console.error('Error:', error);
        })
});

const mediaGridList = document.querySelector('.media-grid-list');

//获取播放器统一处理
const playerUnity = document.querySelectorAll('.player-unity');

// 获取最近搜索数据加入前端对象中，防止多次请求，首次打开执行
fetch('https://api.sheep.com/sheep/VidSheep/api/?recent=all')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        searchData = data;
        data.data.array.vidlist.forEach(item => {
            mediaGridList.innerHTML += `
            <div class="media-card-list player-card" data-id="${item.vid_id}">
                <div class="media-image-container" style="position: relative;">
            <img src="${item.vid_img}" alt="${item.vid_name}" class="media-image">
        <div class="media-delete-button">×</div>
            </div>
            <div class="media-title">${item.vid_name}</div>
        </div>`;
        })

    })
    .catch(error => {
        console.error('Error:', error);
    })



const collectGridList = document.querySelector('.media-grid-collect-list');

// 获取收藏数据加入前端对象中，防止多次请求，首次打开执行
fetch('https://api.sheep.com/sheep/VidSheep/api/?collect=all')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        collectData = data;
        data.data.array.vidlist.forEach(item => {
            collectGridList.innerHTML += `
            <div class="media-card-collect-list player-card" data-id="${item.vid_id}" data-record="${item.vid_last_record}" data-source="${item.vid_source}" data-update="${item.vid_updata_status}">
                <div class="media-image-container" style="position: relative;">
            <img src="${item.vid_img}" alt="${item.vid_name}" class="media-image">
            <div class="collect-delete-button">×</div>
            </div>
            <div class="media-title">${item.vid_name}</div>
        </div>
        `;
        })
    })
    .catch(error => {
        console.error('Error:', error);
    })


// 在父元素上添加事件监听，处理搜索影视的点击事件
playerUnity.forEach(Item => {
    Item.addEventListener('click', (e) => {


        // 检查点击的是否是删除按钮
        if (e.target.classList.contains('media-delete-button')) {
            // 获取对应的媒体卡片
            const mediaCard = e.target.closest('.media-card-list');
            const mediaId = mediaCard.dataset.id;
            console.log('点击了删除按钮，ID:', mediaId);

            // 这里可以添加删除逻辑
            mediaCard.classList.add('media-display-delete');
            // 删除对应的最近搜索数据
            fetch('https://api.sheep.com/sheep/VidSheep/api/?deleteRecent=' + mediaId)
                .then(response => response.json())
                .then(data => {
                    console.log(data.data.information);
                })

        }

        if (e.target.classList.contains('collect-delete-button')) {
            console.log('点击了收藏删除按钮');
            const mediaCard = e.target.closest('.media-card-collect-list');
            const mediaId = mediaCard.dataset.id;
            const mediaRecord = mediaCard.dataset.record;
            const mediaSource = mediaCard.dataset.source;
            const mediaUpdate = mediaCard.dataset.update;
            console.log('点击了收藏删除按钮，ID:', mediaId, '记录:', mediaRecord, '源:', mediaSource, '更新:', mediaUpdate);

            // 删除对应的收藏数据
            mediaCard.classList.add('media-display-delete');

            // 删除对应的收藏数据api
            fetch('https://api.sheep.com/sheep/VidSheep/api/?collect=' + mediaId)
                .then(response => response.json())
                .then(data => {
                    console.log(data.data.information);
                })

        }

        //检查点击的是图片或者标题
        if (e.target.classList.contains('media-image') || e.target.classList.contains('media-title')) {
            // 获取对应的媒体卡片
            const playerCard = e.target.closest('.player-card');
            const mediaId = playerCard.dataset.id;
            console.log('点击了图片或者标题，ID:', mediaId);

            currentPopup = 'play-popup';
            //处理播放器展开弹窗内容
            // 从collectData中找到对应的mediaId获取collectItem数据

            let playDataItem = null;
            if (playType == 'collectlist') {
                playDataItem = collectData.data.array.vidlist.find(item => item.vid_id == mediaId);
            } else {
                playDataItem = searchData.data.array.vidlist.find(item => item.vid_id == mediaId);
            }

            console.log(playDataItem);



            const playPopup = document.querySelector('#play-popup');
            playPopup.dataset.playlength = playDataItem.vid_play_name.length;
            playPopup.querySelector('h2').textContent = playDataItem.vid_name;
            playPopup.querySelector('h2').id = playDataItem.vid_id;
            playPopup.querySelector('img').src = playDataItem.vid_img;
            playPopup.querySelector('span').textContent = playDataItem.vid_content;


            // 获取播放列表
            const playList = playDataItem.vid_play_name;


            // 获取播放列表的播放链接
            const playUrl = playDataItem.vid_play_url;


            // 清空播放列表
            const playListElement = playPopup.querySelector('.play-list');
            playListElement.innerHTML = '';

            // 遍历播放列表和播放链接，生成播放列表项
            for (let i = 0; i < playList.length; i++) {
                const listItem = document.createElement('li');
                listItem.id = `play-list-item-${i + 1}`;
                listItem.textContent = playList[i];
                listItem.dataset.playurl = playUrl[i];

                playListElement.appendChild(listItem);
            }




            // 显示播放器展开弹窗
            showPopup(currentPopup);
        }
    });


})



// 为discover-section下面所有元素添加点击事件
const discoverSection = document.querySelector('#discover-section');
discoverSection.addEventListener('click', (e) => {
    const discoverItem = e.target.closest('.discover-item');



    if (discoverItem.classList.contains('discover-wallpaper')) {
        console.log('点击了壁纸');

        // 获取壁纸数据
        fetch('https://api.sheep.com/sheep/VidSheep/api/?wallpaper=get')
            .then(response => response.json())
            .then(data => {
                console.log(data.data.array);
                //将数组中的数据加入modify-wallpaper-content下面
                const modifyWallpaperContent = document.querySelector('.modify-wallpaper-content');

                modifyWallpaperContent.innerHTML = ''; // 清空现有内容


                // 遍历壁纸数据并添加到容器中
                data.data.array.forEach(wallpaperUrl => {
                    modifyWallpaperContent.innerHTML += `
                        <div class="modify-wallpaper-item">
                            <img src="${wallpaperUrl}" alt="壁纸">
                            <button class="wallpaper-select-btn">选择</button>
                        </div>
                        `;
                });
            })

        //更新值
        currentPopup = 'modify-wallpaper';

        showPopup(currentPopup);
    } else if (discoverItem.classList.contains('discover-default-source')) {
        console.log('点击了默认源');
        showPopup('default-source');
    } else if (discoverItem.classList.contains('discover-about')) {
        console.log('点击了关于');
        showPopup('about');
    }
});




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

    console.log(currentSection);

}

// 请求用户信息测试
function userinfo() {
    // 向https://api.sheep.com/sheep/VidSheep/api/userinfo=all发送请求
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
