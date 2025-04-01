/*************************************
项目名称：VidSheep
更新日期：2025-04-01
脚本作者：@Sheepfj
使用声明：⚠️仅供参考，🈲转载与售卖！
TG频道：https://t.me/sheep_007xiaoyang
GitHub：https://github.com/SheepFJ/QuantumultX
脚本说明：用于PKC插件的视频与文本接口
================ Loon==============

[Script]
http-response ^https:\/\/api\.sheep\.com\/sheep\/videoPolymerization\/(?:zhanshi\/sheep_vod_info_(\d+)|videoword\/([^\/]+)|) script-path=https://raw.githubusercontent.com/SheepFJ/VidSheep/main/VidSheep/main/mainlogic.js,requires-body=false,tag=VidSheep
[mitm]
hostname = api.sheep.com

*************************************/

