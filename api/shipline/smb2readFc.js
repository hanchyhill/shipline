const SMB2 = require('smb2');
//const promisify = require('util').promisify;

const configSMB = {
  share:'\\\\10.148.16.32\\e',
  domain:'10.148.36.55',
  username:'qxt',
  password:'qxtqxt',
};
const path2read = 'special\\gdjz\\node\\bh.html';

async function readRemoteFc(){
  try{
    var smb2Client = new SMB2(configSMB);
    var readFileP = function(){
      return new Promise((resolve,reject)=>{
        smb2Client.readFile(path2read,(err,data)=>{
          if(err) reject(err);
          if(!data.toString) reject('无法解析出字符串');
          resolve(data.toString('utf8'));
        })
      })
    }
    let data = await readFileP();
    smb2Client.close();
    //console.log('test');
    return data;
  }
  catch(err){
    console.log('err');
    throw err;
  }
}

exports.readRemoteFc = readRemoteFc;



