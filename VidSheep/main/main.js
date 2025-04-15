/*************************************
项目名称：VidSheep
更新日期：2025-04-01
脚本作者：@Sheepfj
使用声明：⚠️仅供参考，🈲转载与售卖！
TG频道：https://t.me/sheep_007xiaoyang
GitHub：https://github.com/SheepFJ/QuantumultX
脚本说明：用于PKC插件的视频与文本接口
============ Quantumult X ============

[rewrite_local]
^https:\/\/api\.sheep\.com\/sheep\/videoPolymerization\/?$ url script-response-body https://raw.githubusercontent.com/SheepFJ/VidSheep69/refs/heads/main/main/mainlogic.js
^https:\/\/api\.sheep\.com\/sheep\/videoPolymerization\/(api|userinfo\/username\/([^\/]+)|videoword\/([^\/]+)\/\?wd=([^\/]+)|videolist\/([^\/]+)) url script-response-body https://raw.githubusercontent.com/SheepFJ/VidSheep69/refs/heads/main/main/api.js

[mitm]
hostname = api.sheep.com

*************************************/