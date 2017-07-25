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
    let html = ejs.render(ejsTempl,{fcArray:fcArray});
    fs.writeFile(__dirname + '/bhx.html',html,(err)=>{
      if (err) throw err;
      console.log('It\'s saved! via ejs');
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




