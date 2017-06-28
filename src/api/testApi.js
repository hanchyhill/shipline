var axios = require('axios');
var http=require('http');

let selectedSID = ['02001','02002','02003','02004','02005','02006','02007','02009','03005','03003'];
let expURL = ['http://10.1.64.146/sea/seaReport/inshore/download.jsp?format=micaps&type=2&data_id=SEVP_NMC_ROFC_SFER_EME_ACES_L89_P9_',
              'http://10.1.64.146/sea/seaReport/ocean/download.jsp?format=micaps&type=2&data_id=SEVP_NMC_ROFC_SFER_EME_ACWP_L89_P9_',
              'http://10.1.64.146/sea/seaReport/opensea/download.jsp?format=micaps&type=2&data_id=SEVP_NMC_ROFC_SFER_EME_AESA_L89_P9_'];
let timeFormat = 'yyyymmddhh000HH00';

function getTestData(time){
  
  return new Promise((resolve,reject) =>{
  //let testURL1 = 'http://localhost:2333/static/SEVP_NMC_ROFC_SFER_EME_ACWP_L89_P9_20170502120002400.txt';
  //let testURL2 = 'http://localhost:2333/static/SEVP_NMC_ROFC_SFER_EME_AESA_L89_P9_20170502120002400.txt';
  //let testURL3 = 'http://localhost:2333/static/SEVP_NMC_ROFC_SFER_EME_ACES_L89_P9_20150104000002400.txt';
  let fullURL = expURL.map(url=>{
    return url + time;
  })
  //console.log(fullURL);
/*  let testURL = ['http://localhost:2333/static/SEVP_NMC_ROFC_SFER_EME_ACWP_L89_P9_20170502120002400.txt',
                 'http://localhost:2333/static/SEVP_NMC_ROFC_SFER_EME_AESA_L89_P9_20170502120002400.txt',
                 'http://localhost:2333/static/SEVP_NMC_ROFC_SFER_EME_ACES_L89_P9_20150104000002400.txt']*/
  let returnData = ({});
  //axios.all(testURL.map(url=>axios.get(url)))
  axios.all(fullURL.map(url=>axios.get(url)))
  .then(
    axios.spread(
    (res1,res2,res3) =>{
      let totalFc = [];
      //console.log(res1.data);
      //console.log(res2.data);
      //totalFc = micapsViewer(res1.data).fcInfo;
      //totalFc.push(micapsViewer(res1.data).fcInfo);
      //console.log(totalFc);
      try{
        [res1.data,res2.data,res3.data].map(data =>micapsViewer(data).fcInfo)//错误处理
        .forEach(data=>{totalFc.push(...data)});

        let selectedFc = totalFc.filter(filterSID);
        let enoughElements = selectedFc.every(ele=>ele.length>9);
        if(enoughElements){
          resolve({
            time,
            fcCode:selectedFc
          });
        }
        else{
          reject({
            "error":true,
            "errorInfo":"部分站点缺失",
            "errorText":"部分站点缺失，获取中断"
          })
        }

        
      
      }
      catch(err){
        reject(err);
      }
      //console.log(totalFc);
      
    })
  )
  .catch(error=>{
    if(error.response){
      //存在请求，但是服务器的返回一个状态码
      //他们都在2xx之外
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
      reject({
        "error":true,
        "errorInfo":error,
        "errorText":"后台获取文件错误"
      })
    }
    else{
          //一些错误是在设置请求时触发的
      console.log('Error',error.message);
      reject({
        "error":true,
        "errorInfo":error.message,
        "errorText":"后台获取文件时设置请求时触发错误"
      })
      }
    console.log(error.config);
  })
  })
}

function micapsViewer(rawText,timeStamp){//解析micaps数据
  let rawLine = rawText.split('\r\n');
  //console.log(rawLine);
  let poster = [];
  let timeArray = [];
  if(rawLine.length&&rawLine.length>10){
    rawLine.shift();
    rawLine.pop();
    timeArray = rawLine.shift().split(/\s+/);
    poster = rawLine.map(line=>line.split(/\s+/).map((x,index)=> index==0 ? x:Number(x)));
    //console.log(poster);
  }
  else{
    //处理错误
    console.log("数据缺失");
    throw {
        "error":true,
        "errorInfo":"micaps站点信息缺失",
        "errorText":"micaps站点信息缺失"
    };
    
  }
  return {time:timeArray,fcInfo:poster};
}

function filterSID(item){
  return selectedSID.includes(item[0]);
}


async function getData(time) {
  let a = getTestData(time);
  return await a;
}

function getAllData(time='2017060600',fc='24-48-72') {

  let timeList = fc.split('-').map(t=>time+'000'+t+'00');
  //console.log(timeList);
  return Promise.all(timeList.map(t=>getData(t)))
}

exports.getData = getData;
exports.getAllData = getAllData;
