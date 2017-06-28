<template>
<div>
  <main-header></main-header>
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
      <!--<mu-menu-item value="remoteDB" title="远程数据库"/>
      <mu-menu-item value="localDB" title="本地数据库"/>-->
    </mu-select-field>
    <mu-date-picker class="shift-date-picker" autoOk container="inline" hintText="选择日期" v-model="selectedDate"></mu-date-picker>
    <mu-dropDown-menu :value="hourUTC" @change="hourChange">
      <mu-menu-item value="00" title="00 UTC"></mu-menu-item>
      <!--<mu-menu-item value="06" title="06 UTC"/>-->
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
    <mu-raised-button class="demo-raised-button" label="发布预报" icon="cloud_upload" secondary
    @click="convertPushData"></mu-raised-button>
  </div>

  <mu-tabs class="time-view-tabs" :value="activeTab" @change="handleTabChange">
    <mu-tab value="tab1" color="red"><mu-icon value="filter_1" color="red"></mu-icon>时次1</mu-tab>
    <mu-tab value="tab2"><mu-icon value="filter_2" color="red"></mu-icon>时次2</mu-tab>
    <mu-tab value="tab3"><mu-icon value="filter_3" color="red"></mu-icon>时次3</mu-tab>
  </mu-tabs>

  <fc-list :fc-code="text" v-show="activeTab === 'tab1'" :fc-time="fcTime[0]" ref="fc0"></fc-list>
  <div v-show="activeTab === 'tab2'" >
    <fc-list :fc-code="text2" :fc-time="fcTime[1]" ref="fc1"></fc-list>
  </div>
  <div v-show="activeTab === 'tab3'">
    <fc-list :fc-code="text3" :fc-time="fcTime[2]" ref="fc2"></fc-list>
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
</div>
</template>

<script>
import axios from 'axios';
//import { stationID, wCode, wDir, wScale } from './util.js';
import FcList from './components/fcList.vue';
import MainHeader from './components/header.vue';
//var promisePolyfill = require('es6-promise').Promise;
//console.log(stationID.keys());
//console.log(Promise);


export default {
  name: 'app',
  components:{MainHeader,FcList,},
  data:function(){
    let fitTime = new Date();
    let fitHour = 5<fitTime.getHours()&&fitTime.getHours()<16 ? '00':'12';//05时至16时取世界时00时，16时之后取12时
    let iniTime = new Date();
    let selectedDate = iniTime.getFullYear().toString() + '-' +
                       (Array(2).join('0') + (iniTime.getMonth()+1)).slice(-2) + '-' +
                       (Array(2).join('0') + iniTime.getDate()).slice(-2);
    return {
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
    getData:function(){
      let fullURL = '/api/testData';
      // this.getBasicInfo(fullURL,'text');
      // this.getBasicInfo(fullURL,'text2');
      // this.getBasicInfo(fullURL,'text3');
    },
    getBasicInfo:function(fullURL,text){
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
          this.popUpText = '获取成功';
          this.topPopup = true;
          this.posterList = res.data;
          
          if(this.posterList.length== 3){
            [this.text,this.text2,this.text3] = this.posterList.map(v=>v.fcCode);
            this.fcTime = this.posterList.map(v=>v.time);
          }
          else{
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
      let baseURL = '/api/testData';
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
          this.fcTime[eIndex] = this.posterList[ele].time;
        }
      });
    },
    convertPushData(){
      /* 获取需要上传的数据 */
      const listName = ['fc0','fc1','fc2'];
      let dataArray = listName.map(v=>{
        let list = this.$refs[v].transList;
        return {
          time:this.$refs[v].timeFormat,
          fc:list
        }
      });
      //console.log(dataArray);
      this.pushData(dataArray)
    },
    pushData(data){
      /* 上传预报数据 */
      axios.post('/api/upload-shipline', {
        fcdata: data,
        info: '上传北航线预报'
      })
      .then( (res)=>{
        this.popUpText = '上传成功，页面已生成';
        this.topPopup = true;
        console.log(res.data);
      })
      .catch((error)=>{
        console.log(error);
      });
    },
  },//method结束

  watch: {
    topPopup (val) {
      if (val) {
        setTimeout(() => {
          this.topPopup = false
        }, 2500)
      }
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
  },//计算属性结束
}
</script>
<style >
  .mu-icon{
  vertical-align: middle;
  }
  .shift-date-picker.mu-date-picker{
    vertical-align: middle;
    
  }
  .mu-tabs.time-view-tabs{
    background-color: transparent;
    
    margin-bottom: 16px;
  }
  .time-view-tabs div{
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