var basicInfo = require('./resource/infoConfig.json');
let selectedID = basicInfo.selectedID;

let stationID = new Map(selectedID.map(v=>[v[0],v[2]]));
let wCode = new Map(basicInfo.wCode);
let wDir = new Map(basicInfo.wDir);
let wScale = new Map(basicInfo.wScale);

export {
  selectedID,
  stationID,
  wCode,
  wDir,
  wScale
};

