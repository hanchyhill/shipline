var getFtpData = require("./ftpTest.js").getFtpData;
let date = '2017060700';
let validTime=['24','48','72'];
let timeJoin = validTime.join('-');
let timeList = timeJoin.split('-').map(time=>date+'000'+time+'00');

k= getFtpData(date,timeJoin);
k.then(v=>console.log(v));