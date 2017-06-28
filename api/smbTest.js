var SMB2 = require('smb2');

var smb2Client = new SMB2({
  share:'\\\\10.148.16.36\\zxt'
, domain:'10.148.36.55'
, username:'dq'
, password:'',
});

smb2Client.readdir('', function(err, files){
    console.log("远程端口为："+ smb2Client.port);
    if(err) throw err;
    console.log(files);
});