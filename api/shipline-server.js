////api服务器
const express = require('express');
const apiServer = express();
const bodyParser = require('body-parser');
const getAllData = require("./shipline/testApi.js").getAllData;
const getFtpData = require("./shipline/ftpTest.js").getFtpData;
const ejsHTML = require("./shipline/ejs-generator-promise.js").ejsHTML;
const writeSMB2 = require("./shipline/smb2write.js").writeSMB2;


apiServer.use(bodyParser.urlencoded({ extended: true }));
apiServer.use(bodyParser.json());
var apiRouter = express.Router();
var fs = require('fs');
apiRouter.route('/:apiName')
.get((req, res)=>{
  //console.log([req.query.time,req.query.fc]);
  //req.params.apiName
  console.log('get:'+req.params.apiName);
  let method = req.query.method;
  switch (method){
    case 'http':
      getAllData(req.query.time,req.query.fc)
      .then(resData=>{
        res.send(JSON.stringify(resData));
      })
      .catch(error=>{
        console.log(error);
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
        console.log(error);
        res.send(JSON.stringify(error));
      })
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

  let resData = {
    info:'OK'
  };

  ejsHTML(fcdata)
  .then(html=>{
    return writeSMB2(html)
  }
  )
  .then(info=>{
    console.log(info);
    res.send(JSON.stringify(resData));
  })
  .catch(err=>{
    console.log(err.message);
    res.send(JSON.stringify(err));
  })
  
});


apiServer.use('/api', apiRouter);
apiServer.listen(10072, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:' + (10072) + '\n')
})
////////////////////