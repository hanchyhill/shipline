<template>
<div id="main-fc">
  <mu-popup position="top" :overlay="false" popupClass="popup-top" :open="topPopup">
    {{popUpText}}
  </mu-popup>
  <mu-row>
  <mu-col class="space-col"></mu-col>
  <mu-col width="100" tablet="95" desktop="95">
  <div class="serach-block">
    <mu-select-field v-model="methodGetData" label="数据获取方式">
      <mu-menu-item value="ftp" title="海洋共享FTP"></mu-menu-item>
      <mu-menu-item value="http" title="海洋共享HTTP"></mu-menu-item>
      <mu-menu-item value="local" title="远程数据仓库"/>
    </mu-select-field>
    <mu-date-picker class="shift-date-picker" autoOk container="inline" hintText="选择日期" v-model="selectedDate"></mu-date-picker>
    <mu-dropDown-menu :value="hourUTC" @change="hourChange">
      <mu-menu-item value="00" title="00 UTC"></mu-menu-item>
      <mu-menu-item value="06" title="06 UTC"/>
      <mu-menu-item value="12" title="12 UTC"></mu-menu-item>
      <!--<mu-menu-item value="18" title="18 UTC"/>-->
    </mu-dropDown-menu>
    <mu-select-field v-model="validTime" multiple label="时效">
      <mu-menu-item value="24" title="24h"></mu-menu-item>
      <mu-menu-item value="48" title="48h"></mu-menu-item>
      <mu-menu-item value="72" title="72h"></mu-menu-item>
    </mu-select-field>
    <mu-raised-button class="demo-raised-button"
    @click="searchData" label="查询" icon="search" primary></mu-raised-button>
    <span id="push-wrap">
      <mu-text-field label="发布时间" labelFloat class="pushDate" v-model="pushFcTime"/>
    </span>
    <mu-raised-button class="demo-raised-button" label="发布预报" icon="cloud_upload" secondary
      @click="checkPushData(openDialog=true)"></mu-raised-button>
  </div>

  <mu-tabs class="time-view-tabs" :value="activeTab" @change="handleTabChange">
    <mu-tab value="tab1" color="red"><mu-icon value="filter_1" color="red"></mu-icon>时次1</mu-tab>
    <mu-tab value="tab2"><mu-icon value="filter_2" color="red"></mu-icon>时次2</mu-tab>
    <mu-tab value="tab3"><mu-icon value="filter_3" color="red"></mu-icon>时次3</mu-tab>
  </mu-tabs>

  <fc-list :ori-code="text" v-show="activeTab === 'tab1'" :fc-time="fcTime[0]" ref="fc0"></fc-list>
  <div v-show="activeTab === 'tab2'" >
    <fc-list :ori-code="text2" :fc-time="fcTime[1]" ref="fc1"></fc-list>
  </div>
  <div v-show="activeTab === 'tab3'">
    <fc-list :ori-code="text3" :fc-time="fcTime[2]" ref="fc2"></fc-list>
  </div>
  </mu-col>
  <mu-col class="space-col"></mu-col>
  </mu-row>

  <mu-dialog :open="selectDialog" title="选择时次对应的数据">
    <div>时次1
      <mu-select-field :maxHeight="300" v-model="selectTime[0]"
        hintText="时次1" :underlineShow="true" :fullWidth="false">
          <mu-menu-item v-for="(p,pIndex) of dialogSelectTime" :key="p.time" :value="p.index" :title="p.time"></mu-menu-item>
      </mu-select-field>
    </div>
    <div>时次2
      <mu-select-field :maxHeight="300" v-model="selectTime[1]"
        hintText="时次2" :underlineShow="true" :fullWidth="false">
          <mu-menu-item v-for="(p,pIndex) of dialogSelectTime" :key="p.time" :value="p.index" :title="p.time"></mu-menu-item>
      </mu-select-field>
    </div>
    <div>时次3
      <mu-select-field :maxHeight="300" v-model="selectTime[2]"
        hintText="时次3" :underlineShow="true" :fullWidth="false">
          <mu-menu-item v-for="(p,pIndex) of dialogSelectTime" :key="p.time" :value="p.index" :title="p.time"></mu-menu-item>
      </mu-select-field>
    </div>
    <mu-flat-button slot="actions" @click="closeSelectDialog(false)" primary label="取消"></mu-flat-button>
    <mu-flat-button slot="actions" primary @click="closeSelectDialog(true)" label="确定"></mu-flat-button>
  </mu-dialog>
  <local-resolve-dialog :trigger-dialog="isResolveLocal" :initDate="initDate"
  v-on:emitLocalData="receiveLocalData"></local-resolve-dialog>
  <!-- 发布时检查异常数据弹窗 -->
  <mu-dialog :open="warningPushDialog" title="检查出异常值">
    <mu-card>
      <mu-card-header title="检测出以下异常数据">
      </mu-card-header>
      <mu-card-text class="warningData">
        {{this.warningErrorText}}
      </mu-card-text>
    </mu-card>

    <mu-raised-button slot="actions" @click="checkPushData(openDialog=false,isPush=false)" primary
      label="取消发送，再检查一遍">
    </mu-raised-button>
    <mu-flat-button slot="actions" @click="checkPushData(openDialog=false,isPush=true)" color="gray"
          label="跳过检查继续发布">
    </mu-flat-button>
  </mu-dialog>
</div>
</template>
<script>
import axios from 'axios';
import FcList from './fcList.vue';
import PostFcDialog from './postFcDialog.vue';
import LocalResolveDialog from './localResolveDialog.vue';

export default {
  name: 'fcApp',
  components:{FcList,PostFcDialog,LocalResolveDialog,},
  props: {
      'showLocal': Boolean,
    },
  data:function(){
    let fitTime = new Date();
    // console.log(fitTime.getHours());
    let fitHour = 0<=fitTime.getHours()&&fitTime.getHours()<15 ? '00':'12';//05时至15时取世界时00时，15时之后取12时
    let iniTime = new Date();
    let selectedDate = iniTime.getFullYear().toString() + '-' +
                       (Array(2).join('0') + (iniTime.getMonth()+1)).slice(-2) + '-' +
                       (Array(2).join('0') + iniTime.getDate()).slice(-2);
    let pushDate = iniTime.getFullYear().toString() + '/' +
                       (Array(2).join('0') + (iniTime.getMonth()+1)).slice(-2) + '/' +
                       (Array(2).join('0') + iniTime.getDate()).slice(-2);
    let pushHour = 0<=fitTime.getHours()&&fitTime.getHours()<15 ? '6:00:00':'16:00:00';
    return {
      initDate:[selectedDate,fitHour],
      text:[],
      text2:[],
      text3:[],
      fcTime:['','',''],
      methodGetData:'http',
      hourUTC:fitHour,
      validTime:['24','48','72'],
      activeTab:'tab1',
      selectedDate,
      popUpText:'',
      topPopup:false,
      selectDialog:false,
      posterList:[],
      selectTime:[-1,-1,-1],
      postFeedBackDialog:false,
      isResolveLocal:false,
      pushFcTime:`${selectedDate.replace(/-/g,'/')} ${pushHour}`,
      warningPushDialog:false,// 发布异常弹出开关
      warningErrorText:'',// 发布异常文本
      errorTextArr:['无持续风向','微风','未知天气'],// 需要检测的异常
      finalData:({}),// 最后发出的报文
    }
  },
  created(){
    if(!Promise){
      console.log("不支持Promise");
      //window.Promise = promisePolyfill;
    };
    this.searchData();

  },

  methods:{
    /*
    getData:function(){// 废弃
      let fullURL = '/api/getData';
      // this.getBasicInfo(fullURL,'text');
      // this.getBasicInfo(fullURL,'text2');
      // this.getBasicInfo(fullURL,'text3');
    },
    */
    getBasicInfo:function(fullURL,text){// 获取数据
      //let fullURL = '/api/testData';
      this.popUpText = '正在获取数据';
      this.topPopup = true;

      axios.get(fullURL)
      .then(res => {
        if(res.data.error){
          console.error(res.data);
          this.popUpText = res.data.errorText;
          this.topPopup = true;
          return;
        }
        else{
          if(res.data.warning){// 警告
            this.popUpText = res.data.errorText;
            this.topPopup = true;
          }else{
            this.popUpText = '获取成功';
            this.topPopup = true;
          }
          this.posterList = res.data;
          let canImportMissing = false;
          let isMissing = false;
          for(let iCode of this.posterList){// 缺失数据判断
            // console.log(iCode.fcCode.length);
            if(iCode.fcCode.length<10){
              isMissing = true;
              let canImport = window.confirm('检测到数据缺失，您确认需要导入不完整的数据吗？');
              if(canImport){
                canImportMissing = true;
                break;
              }else{
                canImportMissing = false;
                break;
              }
            }
          }
          if(isMissing&&!canImportMissing) return;// 如果数据缺失并且不能导入则返回取消

          if(this.posterList.length== 3){
            [this.text,this.text2,this.text3] = this.posterList.map(v=>v.fcCode);
            this.fcTime = this.posterList.map(v=>v.time);
          }
          else{// 如果少于3个时次则触发时次选择选项框
            //console.log(posterList.length);
            this.selectTime=[-1,-1,-1];
            this.selectDialog = true;
          }
        }
      })
      .catch(error => {
        console.log(error);
      });
    },
    hourChange(value){
      this.hourUTC = value;
    },
    handleTabChange(value){
      this.activeTab = value;
    },
    searchData(){
      /*methodGetData:'http',
      hours:'20',
      validTime:['24','48','72'],
      activeTab:'tab1',
      selectedDate:'2017-05-14',*/
      let sDate = this.selectedDate.replace(/-/g,'');
      let timeList = this.validTime.map(fcHour=>sDate+this.hourUTC+'000'+fcHour+'00');
      let timeJoin = this.validTime.join('-');//预报时效数组转为字符串，后台再转换。
      //console.log(timeList);
      let baseURL = '/api/getData';
      let fullURL = baseURL + '?time=' + sDate+this.hourUTC + '&fc=' + timeJoin
                    +'&method='+this.methodGetData;
      this.getBasicInfo(fullURL);


      /////let fullURL = baseURL + '?time=' +  timeList[0];
      /////this.getBasicInfo(fullURL,'text');
      /////fullURL = baseURL + '?time=' +  timeList[1];
      /////this.getBasicInfo(fullURL,'text2');
      /////fullURL = baseURL + '?time=' +  timeList[2];
      /////this.getBasicInfo(fullURL,'text3');
    },
    closeSelectDialog(isChange){
      this.selectDialog = false;
      if(!isChange) return;//取消改变则直接返回
      let dataTimeName = ['text','text2','text3'];
      this.selectTime.forEach((ele,eIndex)=>{
        if(ele!=-1){
          this[dataTimeName[eIndex]] = this.posterList[ele].fcCode;
          // this.fcTime[eIndex] = this.posterList[ele].time;
          // this.fcTime[eIndex] = this.initDate[0].replace(/-/g,'') + this.initDate[1] +
          //                       '000' + ((eIndex + 1) * 24).toString() + '00';
        }
      });
    },
    convertPushData(){ /* 转换、获取需要上传的数据 */

      const listName = ['fc0','fc1','fc2'];
      let dataArray = listName.map(v=>{
        let list = this.$refs[v].transList;
        return {
          time:this.$refs[v].timeFormat,
          fc:list
        }
      });
      // console.log(dataArray);

      this.finalData = {fc:dataArray,
          pushTime:this.pushFcTime,
          fileNameTime:this.fileNameTime}

      return this.finalData; // 未使用到返回值
    },
    checkErrorData(data){// 检查字符串是否有错误
       this.warningErrorText = '';
       let isPassCheck = true;
       for(let text of this.errorTextArr){
         if(data.indexOf(text) !== -1){
           this.warningErrorText +='['+text+']';
           isPassCheck = false;
         }
       }
       return isPassCheck;
    },
    pushData(data){/* 上传预报数据 */

      axios.post('/api/upload-shipline', {
        fcdata: data,
        info: '上传北航线预报'
      })
      .then( (res)=>{
        this.popUpText = '上传成功，页面已生成';
        this.topPopup = true;
        // console.log(res.data);
        // this.postFeedBackDialog = !this.postFeedBackDialog; // 打开弹窗
        // window.open("http://10.12.12.221:8080/special/Fcst/bh.html");
        this.$router.push('showfc');
      })
      .catch((error)=>{
        console.error(error);
      });
    },
    checkPushData(openDialog,isPush){// 发布数据检查，警告对话框
      if(openDialog){
        this.convertPushData();// 转换数据
        let isPassCheck = this.checkErrorData(JSON.stringify(this.finalData.fc)); // 检查是否有错
        if(isPassCheck){
          this.pushData(this.finalData); // 通过检测直接发送
        }else{
          this.warningPushDialog = true; // 弹出错误对话框
        }
        // TODO 检查数据是否正确，异常时弹窗
      }
      else{
        if(isPush){// 发送预报
          this.pushData(this.finalData);
        }
        else{ // 不发送预报
          // 直接返回
        }
        this.warningPushDialog = false;
      }
    },
    trigerLocalResolve(){// 本地解析数据弹窗
      this.isResolveLocal = !this.isResolveLocal
    },
    receiveLocalData(localData){
      // console.log('localData');
      console.log(localData);
      [this.text,this.text2,this.text3] = localData.map(v=>v.fcCode);
      this.fcTime = localData.map(v=>v.time);
      this.trigerLocalResolve();
      this.popUpText = '解析完成';
      this.topPopup = true;
    }
  },//method结束

  watch: {
    topPopup (val) {
      if (val) {
        setTimeout(() => {
          this.topPopup = false
        }, 2500)
      }
    },
    showLocal(){
      this.trigerLocalResolve();
    }
  },// watch 结束
  computed:{
    dialogSelectTime(){//选项框时次数据
      let list = this.posterList.map((v,vIndex)=>{
        return {
          index:vIndex,
          time:v.time,
        };
      });
      let emptyData = {index:-1,time:'不变 Not Modified'};
      list.push(emptyData);
      return list;
    },//
    fileNameTime(){
      let fcTime = this.pushFcTime.replace(/\//g,'');
      // console.log(fcTime);
      let fileName = fcTime.substring(2,8) + (fcTime.charAt(9)=='6'?'08':'20');
      return fileName;
    },//
  },//计算属性结束
}
</script>
<style >

.serach-block{
  display:flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
}
.serach-block > .shift-date-picker{
  margin-bottom: -24px;
  width:120px;
  margin-left:5px;
}
.serach-block > .shift-date-picker .mu-text-field-line{
  width:120px;
}

.serach-block > .mu-dropDown-menu{
  margin-bottom :6px ;
}

.serach-block .mu-text-field{
  width:180px;
}
#push-wrap{
    margin-left:50px;
  }

.forcaster-time{
    display: flex;
    align-items: center;
    justify-content: center;
  }

.shift-date-picker.mu-date-picker{
    vertical-align: middle;
  }

/*
  .mu-icon{
  vertical-align: middle;
  }
  .shift-date-picker.mu-date-picker{
    vertical-align: middle;
  }
  .pushDate{
    vertical-align: top;
  }

  #push-wrap{
    margin-left:20px;
  }
*/
  .mu-tabs.time-view-tabs{
    background-color: transparent;

    margin-bottom: 16px;
  }
  .time-view-tabs div{
    color: red;
  }
  .warningData{
    color: red;
  }
  .popup-top {
  width: 100%;
  opacity: .8;
  height: 48px;
  line-height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 375px;
  }


</style>

