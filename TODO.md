# primary
* 缺省code,URL地址等参数转入config
* 报文错误时提示警告
* 本地文件解析功能容错能力

# secondary
* 完善bhx.json,bhxYYYYMMDDhh.json
* 完善本地
* 异常值时高亮显示
* 完善查看预报组件
* server整合预报查看SMB请求
* 限制发布时间(小时)的人工输入导致的不可预知错误
* 生成文件下载功能
* 复制时次

```
await fetch("http://10.1.64.146/sea/seaReport/ocean/download.jsp", {
    "credentials": "include",
    "headers": {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:79.0) Gecko/20100101 Firefox/79.0",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "zh-CN,en-US;q=0.7,en;q=0.3",
        "Content-Type": "application/x-www-form-urlencoded",
        "Upgrade-Insecure-Requests": "1"
    },
    "referrer": "http://10.1.64.146/sea/seaReport/ocean/downloadSelect.jsp?data_id=SEVP_NMC_ROFC_SFER_EME_ACWP_L89_P9_20200819060002400",
    "body": "data_id=SEVP_NMC_ROFC_SFER_EME_ACWP_L89_P9_20200819060002400&format=micaps&type=2",
    "method": "POST",
    "mode": "cors"
});

http://10.1.64.146/sea/seaReport/ocean/downloadSelect.jsp?data_id=SEVP_NMC_ROFC_SFER_EME_ACWP_L89_P9_20200819060002400
```
