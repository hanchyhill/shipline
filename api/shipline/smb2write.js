const SMB2 = require('smb2');
const promisify = require('util').promisify;

const configSMB = {
  share:'\\\\10.148.16.32\\e',
  domain:'10.148.36.55',
  username:'qxt',
  password:'qxtqxt',
};

var smb2Client = new SMB2(configSMB);

const readDirP = util.promisify(smb2Client.readdir);

const writeFileP = util.promisify(smb2Client.writeFile);

const path2write = 'special\\gdjz\\node\\bhx.html';

async function writeSMB2(data){
  try{
    let k = await writeFileP(path2write,data);
      return {
      info:"success",
    }
  }
  catch(err){
    throw err;
  }
}

/*smb2Client.readdir('special\\gdjz', function(err, files){//读取目录
    //console.log("远程端口为："+ smb2Client.port);
    if(err) throw err;
    //console.log(files);
    smb2Client.writeFile('special\\gdjz\\node\\testSMB2.txt', 'Hello Node2', function (err) {//写文件
      if (err) throw err;
      console.log('It\'s saved!');
      smb2Client.close();
    });
});*/

