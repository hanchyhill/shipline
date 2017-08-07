const ejs = require('ejs');
const util = require('util');
const fs = require('fs');

const readFileP = util.promisify(fs.readFile);

const ejsPath = __dirname + '/bhx.ejs';
const jsonPath = __dirname + '/fc_data.json';

async function convertHTMLasync(fcArray){
  try{
    let ejsTempl = await readFileP(ejsPath,'utf-8');
    //let jsonRaw = await readFileP(jsonPath,'utf-8');
    //let fcArray = JSON.parse(jsonRaw);
    let html = ejs.render(ejsTempl,{fcArray:fcArray.fc,pushTime:fcArray.pushTime});
    fs.writeFile(__dirname + '/bhx.html',html,(err)=>{
      if (err) throw err;
      console.log('It\'s saved!');
    });
    return html;
  } 
  catch(err){
    throw err;
  }
}

/*
convertHTMLasync()
  .then(html=>{
    console.log(html)
  })
  .catch(err=>{
    console.log(err.message);
  })
  */

exports.ejsHTML = convertHTMLasync;

/*
fs.readFile(__dirname + '/bhx.ejs','utf-8',(err,ejsData)=>{
  if(err) throw err;
  //console.log(typeof data);
  fs.readFile(__dirname + '/fc_data.json','utf-8',(error,jsonRaw)=>{
    if(error) throw err;
    let fcArray = JSON.parse(jsonRaw);
    //console.log(fcArray);
    let html = ejs.render(ejsData,{fcArray:fcArray});
    console.log(html);
    fs.writeFile(__dirname + '/bhx.html',html,(err)=>{
      if (err) throw err;
      console.log('It\'s saved!');
    })
  });
});
*/


