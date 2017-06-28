var getData = require("./testApi.js").getData;
var getAllData = require("./testApi.js").getAllData;
let date = '2017060600';
let validTime=['24','48','72'];
let timeJoin = validTime.join('-');
let timeList = timeJoin.split('-').map(time=>date+'000'+time+'00');

k= getAllData()
k.then(v=>console.log(v));

/*Promise.all(timeList.map(t=>getData(t)))
.then(dataList=>{
   console.log(dataList); 
})
.catch(err=>{
  throw err;
})*/
// getData('20150104000002400').then(v=>{
//     console.log(v);
// });