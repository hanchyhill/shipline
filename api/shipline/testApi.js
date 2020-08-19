const axios = require('axios');
//var http=require('http');
const fs = require('fs');
const path = require('path');
const util = require('util');
// const pReadFile = util.promisify(fs.readFile);

let selectedSID = ['02001','02002','02003','02004','02005','02006','02007','02009','03005','03003'];
let expURL = [//'http://10.1.64.146/sea/seaReport/inshore/download.jsp?format=micaps&type=2&data_id=SEVP_NMC_ROFC_SFER_EME_ACES_L89_P9_',
              'http://10.1.64.146/sea/seaReport/ocean/download.jsp?format=micaps&type=2&data_id=SEVP_NMC_ROFC_SFER_EME_ACWP_L89_P9_',
              'http://10.1.64.146/sea/seaReport/opensea/download.jsp?format=micaps&type=2&data_id=SEVP_NMC_ROFC_SFER_EME_AESA_L89_P9_'];
let filesPrefix = [//'SEVP_NMC_ROFC_SFER_EME_ACES_L89_P9_',
                'SEVP_NMC_ROFC_SFER_EME_ACWP_L89_P9_',
                'SEVP_NMC_ROFC_SFER_EME_AESA_L89_P9_'];

const pReadFile = async (file)=>{
  return new Promise(resolve=>{
    fs.readFile(file,(err,data)=>{
      if(err){
        resolve('');
      }else{
        resolve(data.toString());
      }
    })
  })
}
// let timeFormat = 'yyyymmddhh000HH00';

// function getTestData(time,method='remote'){

//   return new Promise((resolve,reject) =>{
//   let fullURL = expURL.map(url=>{
//     return url + time;
//   })
//   let fileList = filesPrefix.map(prefix=>path.resolve(__dirname,'../../bhx/',prefix+time));
//   if(method=='local'){
//     readLocal(fileList)
//       .then(dataList=>{

//       })
//       .catch(err=>{

//       })
//   }
//   //console.log(fullURL);
// /*  let testURL = ['http://localhost:2333/static/SEVP_NMC_ROFC_SFER_EME_ACWP_L89_P9_20170502120002400.txt',
//                  'http://localhost:2333/static/SEVP_NMC_ROFC_SFER_EME_AESA_L89_P9_20170502120002400.txt',
//                  'http://localhost:2333/static/SEVP_NMC_ROFC_SFER_EME_ACES_L89_P9_20150104000002400.txt']*/

//   axios.all(fullURL.map(url=>axios.get(url)))
//   .then(
//     axios.spread(
//     (res1,res2,res3) =>{
//       let totalFc = [];
//       let dataList = [res1.data,res2.data,res3.data];
//       for(let i=0; i<3; i++){
//         fs.writeFile(fileList[i],dataList[i],err=>{
//           console.error(err);
//         });
//       }
//       try{
//         [res1.data,res2.data,res3.data].map(data =>micapsViewer(data).fcInfo)//错误处理
//         .forEach(data=>{totalFc.push(...data)});

//         let selectedFc = totalFc.filter(filterSID);
//         let enoughElements = selectedFc.every(ele=>ele.length>9);
//         let isEmpty = selectedFc.every(ele=>ele.length<1);

//         if(!isEmpty){// 不空
//           if(enoughElements){// 完整
//             resolve({
//               time,
//               fcCode:selectedFc
//             });
//           }
//           else{ // 不空但是完整
//             resolve({
//               // "error":true,
//               "missing":true,
//               "errorInfo":"部分站点缺失",
//               "errorText":"部分站点缺失",
//               time,
//               fcCode:selectedFc,
//             })
//           }
//         }
//         else{
//           resolve({ // 全空
//             "error":true,
//             empty:true,
//             "missing":true,
//             "errorInfo":"micaps站点信息全部缺失",
//             "errorText":"micaps站点信息全部缺失"
//           })
//         }
//       }
//       catch(err){
//         reject(err);
//       }
//       //console.log(totalFc);

//     })
//   )
//   .catch(error=>{
//     if(error.response){
//       //存在请求，但是服务器的返回一个状态码
//       //他们都在2xx之外
//       console.log(error.response.data);
//       console.log(error.response.status);
//       console.log(error.response.headers);
//       reject({
//         "error":true,
//         "errorInfo":error,
//         "errorText":"后台获取文件错误"
//       })
//     }
//     else{
//           //一些错误是在设置请求时触发的
//       console.log('Error',error.message);
//       reject({
//         "error":true,
//         "errorInfo":error.message,
//         "errorText":"后台获取文件时设置请求时触发错误"
//       })
//       }
//     console.log(error.config);
//   })
//   })
// }

function micapsViewer(rawText,timeStamp){//解析micaps数据
  let rawLine = rawText.split('\r\n');
  //console.log(rawLine);
  let poster = [];
  let timeArray = [];
  if(rawLine.length&&rawLine.length>3){
    rawLine.shift();
    rawLine.pop();
    timeArray = rawLine.shift().split(/\s+/);
    poster = rawLine.map(line=>line.split(/\s+/).map((x,index)=> index==0 ? x:Number(x)));
    //console.log(poster);
  }
  else{
    //处理错误
    // console.log("数据缺失");
    // throw {
    //     "error":true,
    //     "errorInfo":"micaps站点信息缺失",
    //     "errorText":"micaps站点信息缺失"
    // };
    // 错误也返回空数据
  }
  return {time:timeArray,fcInfo:poster};
}

function filterSID(item){
  return selectedSID.includes(item[0]);
}

function url2postOption(url='http://10.1.64.146/sea/seaReport/ocean/download.jsp?data_id=SEVP_NMC_ROFC_SFER_EME_ACWP_L89_P9_20200819060002400&format=micaps&type=2'){
  let matchArr = url.match(/(^.*?)\?(.*?$)/);
  if(matchArr){
    let originUrl = matchArr[1];
    let postBody = matchArr[2];
    let option = {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: postBody,   // 用 qs 将js对象转换为字符串 'name=edward&age=25'
      url: originUrl,
    };
    // console.log(option);
    return option;
  }else{
    throw new TypeError('无法匹配的URL'+url);
  }
}

function axiosAll(urlList=[]){
  return new Promise((resolve,reject)=>{
    axios.all(urlList.map(url=>axios(url2postOption(url))))
    .then(
      axios.spread(
      //(res1,res2,res3)=>{
      (res1,res2)=>{
        resolve([res1.data,res2.data])
      }
    ))
    .catch(error=>{
      if(error.response){
        //存在请求，但是服务器的返回一个状态码
        //他们都在2xx之外
        console.error('获取URL错误');
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
      console.error('axios配置');
      console.log(error.config);
    })
  })
}

async function getData(time,method='remote') {
  //let a = getTestData(time,method);
  //return await a;
  let totalFc = [];
  let dataList;
  let fullURL = expURL.map(url=>{
    return url + time;
  });
  let fileList = filesPrefix.map(prefix=>path.resolve(__dirname,'../../../data/oceanShare/',prefix+time+'.txt'));
  if(method=='local'){// 本地仓库
    try{
      dataList = await readLocal(fileList)
    }catch(err){
      throw err;
    }
  }else{
    try{
      // console.log(fullURL);
      dataList = await axiosAll(fullURL).catch(err=>{throw err});
    }catch(err){
      throw err;
    }
  }
  //console.log(fullURL);
/*  let testURL = ['http://localhost:2333/static/SEVP_NMC_ROFC_SFER_EME_ACWP_L89_P9_20170502120002400.txt',
                 'http://localhost:2333/static/SEVP_NMC_ROFC_SFER_EME_AESA_L89_P9_20170502120002400.txt',
                 'http://localhost:2333/static/SEVP_NMC_ROFC_SFER_EME_ACES_L89_P9_20150104000002400.txt']*/
  //
  // let resList;


  // dataList = resList.map(resList.data);
  if(method=='remote'){
    for(let i=0; i<dataList.length; i++){
      fs.writeFile(fileList[i],dataList[i],err=>{
        if(err){
          console.error('写入错误');
          console.error(err);
        }
      });
    }
  }
  try{
    // console.log(dataList);
    dataList.map(data =>micapsViewer(data).fcInfo)//错误处理
    .forEach(data=>{totalFc.push(...data)});
  }
  catch(err){
    throw err;
  }
  let selectedFc = totalFc.filter(filterSID);
  let enoughElements = selectedFc.every(ele=>ele.length>9);
  let isEmpty = selectedFc.every(ele=>ele.length<1);
  if(!isEmpty){// 不空
    if(enoughElements){// 完整
      return {
        time,
        fcCode:selectedFc
      };
    }
    else{ // 不空但是完整
      return {
        // "error":true,
        "missing":true,
        "errorInfo":"部分站点缺失",
        "errorText":"部分站点缺失",
        time,
        fcCode:selectedFc,
      }
    }
  }
  else{
    return { // 全空
      "error":true,
      empty:true,
      "missing":true,
      "errorInfo":"micaps站点信息全部缺失",
      "errorText":"micaps站点信息全部缺失"
    };
  }
}

function getAllData(time='2017060600',fc='24-48-72',method='remote') {

  let timeList = fc.split('-').map(t=>time+'000'+t+'00');
  //console.log(timeList);
  return Promise.all(timeList.map(t=>getData(t,method)))
}

async function readLocal(fileList=[]){
  try{
    let dataList = await Promise.all(fileList.map(file=>pReadFile(file)));
    return dataList;
  }catch(err){
    throw err;
  }
}

exports.getData = getData;
exports.getAllData = getAllData;
