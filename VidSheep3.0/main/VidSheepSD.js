#!url=https://github.com/SheepFJ/VidSheep
#!name=VidSheep3.0 
#!desc=VidSheep
[MITM]
hostname =% APPEND % api.sheep.com

[Script]
Rewrite: VidSheep3.0 = type = http - response, pattern = https ?: \/\/api\.sheep\.com\/sheep\/VidSheep\/,script-path= https:/ / raw.githubusercontent.com / SheepFJ / VidSheep / refs / heads / main / VidSheep3.0 / main / mainlogic.js, requires - body=true, timeout = 120
