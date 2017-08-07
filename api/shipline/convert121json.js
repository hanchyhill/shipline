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
      }
    })}
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