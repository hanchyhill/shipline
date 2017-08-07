function convertJSON(data){
  let fc = data.fc;
  let pushTime = data.pushTime;
  let array121 = fc.map(list=>list.map(v=>{
      return {
        visibility: infoV,
        seaarea_name: v.loc,
        ddatetime: v.time,
        waveheight: v.infoWave,
        wind_direction: v.infoD,
        weather_phenomena: v.infoW,
        wind_power: v.infoKTS,
        gust: v.infoGust,
      }
    })
  );
  let format121={
    error:false,
    data:{
      postTime:pushTime, // 发布日期
      fcList:array121,
    }
  }
  return JSON.stringify(format121);
}
 
exports.convertJSON = convertJSON;