var path = require('path');
var fs = require('fs');
var Client = require('ftp');
var iconv = require('iconv-lite'); 


var ftpProperties = {//FTP配置port 21
  host: "106.120.82.181",
  user: "guangzhouzone",
  password: "guangzhouzone",
  keepalive:100000
}

/*FILE FORMAT
BSEP_NMC_ROFC_SFER_EME_ACES_L89_P9_yyyymmddhh000FF00
BSEP_NMC_OCBU_SFER_EME_ACWP_L89_P9_yyyymmddhh000FF00
BSEP_NMC_ROFC_SFER_EME_AESA_L89_P9_yyyymmddhh000FF00
['BSEP_NMC_ROFC_SFER_EME_ACES_L89_P9_20170604000002400.MIC',
                    'BSEP_NMC_OCBU_SFER_EME_ACWP_L89_P9_20170604000002400.MIC',
                    'BSEP_NMC_ROFC_SFER_EME_ACES_L89_P9_20170604000002400.MIC'];
*/
// const selectedDate = '2017060400';
// const selectedFcHour = '24-48-72';
//const selectedFcHour = '24';

const fileFormat = ['BSEP_NMC_ROFC_SFER_EME_ACES_L89_P9_%s.MIC',
                    'BSEP_NMC_OCBU_SFER_EME_ACWP_L89_P9_%s.MIC',
                    'BSEP_NMC_ROFC_SFER_EME_AESA_L89_P9_%s.MIC'];

let selectedSID = ['02001','02002','02003','02004','02005','02006','02007','02009','03005','03003'];

// let arrayFcHour = selectedFcHour.split('-');
// let filesSelected = chooseFile(selectedDate,arrayFcHour);
//console.log(filesSelected);

function getFtpData(selectedDate='2017060600',fc='24-48-72'){
  console.log(selectedDate);
  let arrayFcHour = fc.split('-');
  let filesSelected = chooseFile(selectedDate,arrayFcHour);
  // console.log(filesSelected);
  let ftpCli = new Client();
  ftpCli.connect(ftpProperties);

  ftpCli.on('close',err=>{
  console.log('close');
  //console.log(err);
  });

  

  return new Promise((resolve,reject)=>{
    ftpCli.on('error',err=>{
      console.log('emit error');
      console.log(err);
      reject({
        "error":true,
        "errInfo":err,
        "errorText":"连接FTP时发生错误"
      });
    });
    
    ftpCli.on('ready',()=>{
      console.log('ready');
      ftpCli.cwd("down",()=>{//下载目录
        //console.log(new Date());
        ftpCli.list((err,list)=>{
          if(err){
            console.log(err);
            reject({
              "error":true,
              "errInfo":err,
              "errorText":"无法查询目录列表"
              });
          }
          //console.dir(list);
          let fileList = list.map(item=>item.name);//提取文件名列表
          let isFileExist = filesSelected.every(files=>
              files.every(file=>
              fileList.includes(file)));//各组文件都必须存在才获取
          if(isFileExist){
            awaitData(ftpCli,fileList,filesSelected)
            .then(totalList=>{
              //console.log('完成任务');
              //console.log('文件数'+totalList.length);
              let formmattedArray = totalList.map((part,index)=>{
                let transPart = [];
                part.map(data=>micapsViewer(data).fcInfo)
                .forEach(data=>transPart.push(...data));
                let selectedFc = transPart.filter(filterSID);
                //transPart.concat()
                return {
                  time:selectedDate+'000'+arrayFcHour[index]+'00',
                  fcCode:selectedFc
                };
              });
              resolve(formmattedArray);
              //console.dir(formmattedArray[1]);
              ftpCli.end();
            })
            .catch(err=>{
              reject({
              "error":true,
              "errInfo":err,
              "errorText":"获取文件时发生错误"
              });
            });
          }
          else{
            console.log("至少有一个文件无法找到，获取中断");
            reject({
              "error":true,
              "errInfo":"至少有一个文件无法找到，获取中断",
              "errorText":"至少有一个文件无法找到，获取中断"
              });
            ftpCli.end();
          };
        })
      })
    }
    )
  });
  
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
  return {time:timeArray,fcInfo:poster};
}

function filterSID(item){
  return selectedSID.includes(item[0]);
}

function chooseFile(date,hour){
  //let hourList = hour.split('-');
  return hour.map(item=>
    fileFormat.map(i=>i.replace('%s',date+'000'+item+'00'))
  );
  //console.log(hour);

}

function getAllData(ftp,files){//FTP一次只能读取一个文件，递归顺序下载
  //console.log(files.length);
  return new Promise((resolve,reject)=>{
    let nfile = files.length;
    let data = [];
    function getFile(index=0){//FTP一次只能读取一个文件，递归顺序下载
    
    //console.log(new Date());
    if(index>nfile-1){
      return resolve(data);

    };
    let file = files[index];
    //console.log(file);
    ftp.get(file, function(err, stream){//获取数据
      //console.log(file);
      if (err){
        reject({
          "error":true,
          "errInfo":err,
          "errText":"获取文件错误"
        })
      };
      let chunks=[];
      let size=0;
      stream.on('data',function(chunk){
          chunks.push(chunk);
          size+=chunk.length;
      });
      stream.on('end',function(){
          var buf=Buffer.concat(chunks,size);
          var str=iconv.decode(buf,'GBK');
          data.push(str);
          index++;
          getFile(index);
          //console.log(str);
      });
    });
  }
  getFile();
  });
  //console.log(data);
}

async function awaitData(ftp,fileList,filesSelected){
  let dataList = [];
  for (let files of filesSelected){
    //console.log(files);
    dataList.push(await getAllData(ftp,files));
  }
  return dataList;
}
//console.log(new Date());

/*getFtpData().then(
  data=>{console.log(...data)}
)
.catch(
  err=>console.log(err)
)*/

exports.getFtpData = getFtpData;




