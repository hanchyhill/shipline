var SMB2 = require('smb2');

let configSMB = {
  share:'\\\\10.148.16.32\\e',
  domain:'10.148.36.55',
  username:'qxt',
  password:'qxtqxt',
};

var smb2Client = new SMB2(configSMB);

/*smb2Client.readdir('special\\gdjz', function(err, files){//读取目录
    //console.log("远程端口为："+ smb2Client.port);
    if(err) throw err;
    //console.log(files);*/
    smb2Client.writeFile('special\\gdjz\\node\\testSMB2.txt', 'Hello Node', function (err) {//写文件
      if (err) throw err;
      console.log('It\'s saved!');
      smb2Client.close();
    });
/*});*/

