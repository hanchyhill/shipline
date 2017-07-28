const readRemoteFc = require("./shipline/smb2readFc.js").readRemoteFc;

readRemoteFc()
  .then(data=>{
    console.log(data);
  })
  .catch(err=>{
    console.log(err);
  })