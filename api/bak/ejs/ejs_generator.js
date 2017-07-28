let ejs = require('ejs');
let fs = require('fs');


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

