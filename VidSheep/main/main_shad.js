#!url=
#!name=VidSheep  
#!desc=VidSheep   
[MITM]  
hostname =%APPEND% api.sheep.com  
  
[Script]  
VidSheep=type=http-response,pattern=https:\/\/api\.sheep\.com\/sheep\/videoPolymerization\/?$,requires-body=1,script-path= https://raw.githubusercontent.com/SheepFJ/VidSheep69/refs/heads/main/main/mainlogic.js
VidSheepapi=type=http-response,pattern=https:\/\/api\.sheep\.com\/sheep\/videoPolymerization\/(api|userinfo\/username\/([^\/]+)|videoword\/([^\/]+)\/\?wd=([^\/]+)|videolist\/([^\/]+)),requires-body=1,script-path= https://raw.githubusercontent.com/SheepFJ/VidSheep69/refs/heads/main/main/api.js