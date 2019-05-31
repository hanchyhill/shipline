////api服务器
const express = require('express');
const apiServer = express();
const bodyParser = require('body-parser');
const getAllData = require("./shipline/testApi.js").getAllData;
const getFtpData = require("./shipline/ftpTest.js").getFtpData;
const ejsHTML = require("./shipline/ejs-generator-promise.js").ejsHTML;
const writeSMB2 = require("./shipline/smb2write.js").writeSMB2;
const readRemoteFc = require("./shipline/smb2readFc.js").readRemoteFc;
const convert121 = require("./shipline/convert121json.js").convertJSON;
const fs = require('fs');

apiServer.use(bodyParser.urlencoded({ extended: true }));
apiServer.use(bodyParser.json());
var apiRouter = express.Router();

apiRouter.route('/:apiName')
.get((req, res)=>{
  //console.log([req.query.time,req.query.fc]);
  //req.params.apiName
  console.log('get:'+req.params.apiName);
  res.set('Access-Control-Allow-Origin', '*');
  switch (req.params.apiName){
    case 'getNorthLineFc': // 获取制作的北航线预报
      readRemoteFc()
        .then(data=>{
          res.set('Content-Type', 'text/html');

          res.send(data);
          //console.log(data);
        })
        .catch(err=>{
          console.log('line33: Err'+err);
          res.status(500).send('获取北航线预报错误!');
        })
      break;
    case 'getData': // 获取原始报文
      let method = req.query.method;
      switch (method){
        case 'http':
          getAllData(req.query.time,req.query.fc)
          .then(resData=>{
            let isAllEmpty = resData.every(item=>item.empty);
            if(isAllEmpty){
              throw {"error":true,
                empty:true,
                "errorInfo":"micaps站点信息全部缺失",
                "errorText":"micaps站点信息全部缺失"};
            }
            let isMissing =resData.includes(item=>item.missing);
            if(isMissing){
              resData.warning = true;
              resData.errorInfo="部分站点缺失";
              resData.errorText="部分站点缺失";
            }
            res.send(JSON.stringify(resData));
          })
          .catch(error=>{
            console.log('line59: Err');
            console.log(JSON.stringify(error));
            res.send(JSON.stringify(error));
          })
          break;

        case 'ftp':
          //console.log('server');
           getFtpData(req.query.time,req.query.fc)
          .then(resData=>{
            res.send(JSON.stringify(resData));
            return;
          })
          .catch(error=>{
            console.error(JSON.stringify(error));
            res.send(JSON.stringify(error));
          })
          break;
        case 'local':
          getAllData(req.query.time,req.query.fc,'local')
          .then(resData=>{
            let isAllEmpty = resData.every(item=>item.empty);
            if(isAllEmpty){
              throw {"error":true,
                empty:true,
                "errorInfo":"micaps站点信息全部缺失",
                "errorText":"micaps站点信息全部缺失"};
            }
            let isMissing =resData.includes(item=>item.missing);
            if(isMissing){
              resData.warning = true;
              resData.errorInfo="部分站点缺失";
              resData.errorText="部分站点缺失";
            }
            res.send(JSON.stringify(resData));
          })
          .catch(error=>{
            console.error(error);
            res.send(JSON.stringify(error));
          })
          break;
        default:
          next();
      }
      break;
    default:
      next();

  }

});

apiRouter.route('/:apiName') //post数据
.post((req, res)=>{
  console.log('post:'+req.params.apiName);
  //console.log([req.query.time,req.query.fc]);
  //console.log(req.url);
  //console.log(req.body);
  let fcdata = req.body.fcdata;
  let fileTime = fcdata.fileNameTime;


  let resData = {
    info:'OK'
  };

  try{
    let json121 = convert121(fcdata);
    writeSMB2(json121,['bh.json'].concat(`bh${fileTime}.json`));
    fs.writeFile('../bhx/bh.json', json121, (err)=>{if (err) {
       return console.error(err);
    }});
  }
  catch(err){
    console.log('line132: Err'+err);
  }


  ejsHTML(fcdata)
  .then(html=>{
    fs.writeFile('../bhx/bhx.html', html, (err)=>{if (err) {
       return console.error(err);
    }});
    return writeSMB2(html,['bh.html'].concat(`bh${fileTime}.html`));
  }
  )
  .then(info=>{
    console.log('line145: Err'+info);
    res.send(JSON.stringify(resData));
  })
  .catch(err=>{
    console.error(err.message);
    res.send(JSON.stringify(err));
  })

});


apiServer.use('/api', apiRouter);
apiServer.listen(10072, function (err) {
  if (err) {
    console.error(err)
    return
  }
  console.log('Listening at http://localhost:' + (10072) + '\n')
})
////////////////////
