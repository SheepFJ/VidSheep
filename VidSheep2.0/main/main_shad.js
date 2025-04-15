#!url=
#!name=VidSheep2  
#!desc=VidSheep   
[MITM]  
hostname =%APPEND% api.sheep.com  
  
[Script]  
VidSheep=type=http-response,pattern=https:\/\/api\.sheep\.com\/sheep\/videoPolymerization\/?$,requires-body=1,script-path= https://raw.githubusercontent.com/SheepFJ/VidSheep/refs/heads/main/VidSheep2.0/main/mainlogic.js
VidSheepapi=type=http-response,pattern=https:\/\/api\.sheep\.com\/sheep\/videoPolymerization\/(api|userinfo\/username\/([^\/]+)|videoword\/([^\/]+)\/\?wd=([^\/]+)|videolist\/([^\/]+)),requires-body=1,script-path= https://raw.githubusercontent.com/SheepFJ/VidSheep/refs/heads/main/VidSheep2.0/main/api.js