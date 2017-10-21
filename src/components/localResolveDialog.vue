<template>
  <mu-dialog :open="isShow" title="本地解析Micaps">
    <div class="inlineBox drag01 input-wrap"  @drop.stop.prevent="dropEvent($event)"
    @dragover.prevent>
    拖拽文件至此框
    <input type="file" multiple title="" @change="dropEvent($event)">

    </div>
    <div class="fileList inlineBox">
      <div class="fileTime">
      <span>时次1</span>
        <ul>
          <li v-for="(file,index) of timeList[0]" :key="index">
            {{ file.name}}
          </li>
        </ul>
      </div>
      <div class="fileTime">
      <span>时次2</span>
        <ul>
          <li v-for="(file,index) of timeList[1]" :key="index">
            {{ file.name}}
          </li>
        </ul>
      </div>
      <div class="fileTime">
      <span>时次3</span>
        <ul>
          <li v-for="(file,index) of timeList[2]" :key="index">
            {{ file.name}}
          </li>
        </ul>
      </div>
    </div>

    <mu-flat-button slot="actions" primary @click="changeShow(false)" label="取消"></mu-flat-button>
    <mu-raised-button slot="actions"
       label="解析" secondary id="resolveBtn" @click="resolveData">
    </mu-raised-button>
  </mu-dialog>

</template>
<script>
let selectedSID = ['02001','02002','02003','02004','02005','02006','02007','02009','03005','03003'];

  function promiseRead(file){ // FileReader Promise化
    return new Promise((resolve,reject) =>{
      let reader = new FileReader();
      // 改成promise All
      reader.onload = function(event) {
        resolve(event.target.result);
      };
      reader.readAsText(file,'gbk');
    })
  }

  async function readContent(timeList){// 异步读取
    // console.log(timeList);
    let rawDataList = [];
    for (let list of timeList){
      if(list.length!==0){

        let chunkData = await Promise.all(list.map(file=>promiseRead(file)));
        rawDataList.push(chunkData);
      }
      else{
        rawDataList.push([]);
      }
    }
    return rawDataList;
  }

  function micapsViewer(rawText){//解析micaps数据
    let rawLine = rawText.split(/[(\r\n)\n]/);
    //console.log(rawLine);
    let poster = [];
    let timeArray = [];
    if(rawLine.length&&rawLine.length>10){
      rawLine.shift();
      rawLine.pop();
      timeArray = rawLine.shift().split(/\s+/);
      poster = rawLine.map(line=>line.split(/\s+/).map((x,index)=> index==0 ? x:Number(x)));
      //console.log(poster);
    }
    else{
      //处理错误
      console.error("数据缺失");
      throw {
        "error":true,
        "errorInfo":"micaps站点信息缺失",
        "errorText":"micaps站点信息缺失"
      };
    }
    return {time:timeArray,fcInfo:poster};
  }

  function filterSID(item){  // 过滤判断
    return selectedSID.includes(item[0]);
  }



export default {
  name: 'localResolveDialog',
  props: {
      'triggerDialog': Boolean,
      'initDate': Array,
    },
  data () {

    return {
      isShow:false,
      localURL:'file://///10.148.16.32/e/special/gdjz/node/bhx.html',
      localURL2:'file://localhost/\\\\10.148.16.32\\e\\special\\gdjz\\bh.html',
      timeList: [[],[],[]],
      finalList:[],
    }
  },
  watch:{
    triggerDialog(){
      this.isShow = !this.isShow;
    },
  },
  methods:{
    changeShow(show){
      this.timeList = [[],[],[]];
      this.isShow = show;
    },
    dropEvent(e){
      console.log(e);
      let files = null;
      if(e.type == "change"){// input触发
        files = e.target.files
      }
      else{// drag触发
        files = e.dataTransfer.files;
      }
      let nameList = '';
      // this.timeList = [[],[],[]];
      for (var file of files){
        let timeMatch = /\d{4}\./.exec(file.name);
        if(!timeMatch){
          throw Error('文件名错误')
        }
        else{
          let timeNumber = parseInt(timeMatch[0])
          // console.log(timeNumber)
          switch (timeNumber) {
          case 2400:
            this.timeList[0].push(file);
            break;
          case 4800:
            this.timeList[1].push(file);
            break;
          case 7200:
            this.timeList[2].push(file);
            break;
          default:
            throw Error('文件名错误:未知预报时次')
            break;
          }
        }
      }
      // console.log(files);
    },
    resolveData(timeList){
      timeList = this.timeList;
      readContent(timeList)
      .then(list=>{
        // console.log(list);
        let finalList = [];
        for (let rawData of list){
          let totalFc = [];
          if(rawData.length ==0){
            finalList.push([]);
            continue;
          }
          try{
            rawData.map(data =>micapsViewer(data).fcInfo)//错误处理
            .forEach(data=>{totalFc.push(...data)});
            let selectedFc = totalFc.filter(filterSID);
            let enoughElements = selectedFc.every(ele=>ele.length>9);
            if(enoughElements){
              finalList.push({
                time:'', // time是啥格式
                fcCode:selectedFc
              });
              finalList.forEach((fc,i)=>fc.time =
                this.initDate[0].replace(/-/g,'') + this.initDate[1] + '000' + ((i+1)*24).toString() + '00')
            }
            else{
              console.error({
                "error":true,
                "errorInfo":"部分站点缺失",
                "errorText":"部分站点缺失，获取中断"
              })
            }
          }
          catch(err){
            console.error(err);
          }
        }// for 循环结束
        // console.log(finalList);
        this.finalList = finalList;
        this.$emit('emitLocalData', this.finalList);
        this.timeList = [[],[],[]];
      })
      .catch(error=>
        console.error(error)
      )
    },
  },
  mounted(){

  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .drag01{
    width: 150px;
    height: 100%;
    text-align: center;
    transition: background-color .5s;
    vertical-align:middle;
  }

  .drag01 p{
    width:100%;
    height:100%;
    vertical-align:middle;
    text-align: center;
  }
  .inlineBox{
    display:table-cell;
  }
  .fileList{
    padding-left:10px;
  }

  .fileTime li{
    list-style:none;
    margin:0px;
  }

  .fileTime ul{
    list-style:none;
    padding:0px;
  }

  .fileTime span{
    color: #ff4081;
  }

  .input-wrap {
    position: relative;
    background: #D0EEFF;
    border: 1px solid #99D3F5;
    border-radius: 4px;
    padding: 4px 12px;
    overflow: hidden;
    color: #1E88C7;
    text-decoration: none;
    text-indent: 0;
    line-height: 20px;
    width: 150px;
    height: 150px;
  }
  .input-wrap input {
    position: absolute;
    font-size: 100px;
    right: 0;
    top: 0;
    opacity: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
  .input-wrap:hover {
    background: #AADFFD;
    border-color: #78C3F3;
    color: #004974;
    text-decoration: none;

  }

</style>

