const SMB2 = require('smb2');
const promisify = require('util').promisify;

const configSMB = {
  share:'\\\\10.148.16.32\\e',
  domain:'10.148.36.55',
  username:'qxt',
  password:'qxtqxt',
};

const path = 'special\\gdjz\\node\\';




async function writeSMB2(data,files=['bhx.html']){
  try{
    var smb2Client = new SMB2(configSMB);
    var writeFileP = function(data,path){
      return new Promise((resolve,reject)=>{
        smb2Client.writeFile(path,data,(err)=>{
          if(err) reject(err);
          resolve({info:'写入远程计算机成功'})
        })
      })
    }

    // console.log(files);

    for(let file of files){
      let path2write = path + file;
      let k = await writeFileP(data,path2write);
    }

    smb2Client.close();
    //console.log('test');
      return {
      info:"success",
    }
  }
  catch(err){
    console.log('err');
    throw err;
  }
}

exports.writeSMB2 = writeSMB2;



