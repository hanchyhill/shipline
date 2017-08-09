function convertJSON(data){
  let fc = data.fc;
  let pushTime = data.pushTime;
  let array121 = fc.map(list=>{
    //console.log(list);
    // console.log(list.fc);
    return list.fc.map(v=>{
      
      return {
        visibility: v.infoV,
        seaarea_name: v.loc,
        ddatetime: list.time,
        waveheight: v.infoWave,
        wind_direction: v.infoD,
        weather_phenomena: v.infoW,
        wind_power: v.infoKTS,
        gust: v.infoGust,
        w:[v.w1,v.w2],
        // v:[v.v1,v.v2],
        d:[v.d1,v.d2],
        s:[v.s1,v.s2]
      }
    })}
  );
  let format121={
    status:1,
//    error:false,
    createTime:(new Date()).toISOString(),
    data:{
      postTime:pushTime, // 发布日期
      fcList:array121,
    }
  }
  return JSON.stringify(format121);
}
 
exports.convertJSON = convertJSON;