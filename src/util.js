var basicInfo = require('./resource/infoConfig.json');
var stationID = new Map(basicInfo.stationID);
var wCode = new Map(basicInfo.wCode);
var wDir = new Map(basicInfo.wDir);
var wScale = new Map(basicInfo.wScale);

export {
  stationID,
  wCode,
  wDir,
  wScale
};

