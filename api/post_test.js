const axios = require('axios');
let option = {
  method: 'post',
  headers: { 'content-type': 'application/x-www-form-urlencoded' },
  data: 'data_id=SEVP_NMC_ROFC_SFER_EME_ACWP_L89_P9_20200819060002400&format=micaps&type=2',
  url: 'http://10.1.64.146/sea/seaReport/ocean/download.jsp'
}
axios(option)
  .then(
    (res)=>{
      console.log(res);
    }
  ).catch(err=>
    console.error(err)
    )
