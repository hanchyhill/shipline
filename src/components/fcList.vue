<template>
  <div class="hello">
    <div class="forcaster-time">
    时效
    <mu-date-picker class="shift-date-picker list-date-picker" underlineClass="list-date-underline"
    inputClass="list-date-input" autoOk container="inline"
    hintText="选择日期" format="YYYY年MM月DD日"  v-model="sTime"></mu-date-picker>

    <mu-text-field :underlineShow="false" class="list-hour" v-model="selectDate[0][1]"/>时

    <span>至</span>
    <mu-date-picker class="shift-date-picker list-date-picker" underlineClass="list-date-underline"
    inputClass="list-date-input" autoOk container="inline"
    hintText="选择日期" format="YYYY年MM月DD日"
    :underlineShow="true" v-model="eTime"></mu-date-picker>
    <mu-text-field :underlineShow="false" class="list-hour" v-model="selectDate[1][1]"/>时
    <!--<br><span>时效: {{timeFormat}}</span>-->
    </div>
    <mu-table :showCheckbox="false" class="fc-table">
      <mu-thead slot="header">
        <mu-tr>
          <mu-th tooltip="站点">站点</mu-th>
          <mu-th tooltip="天气">天气现象</mu-th>
          <mu-th tooltip="天气2">风向</mu-th>
          <mu-th tooltip="天气2">风速(KTS)</mu-th>
          <mu-th tooltip="天气2">阵风(KTS)</mu-th>
          <mu-th tooltip="天气2">浪高(M)</mu-th>
          <mu-th tooltip="天气2">能见度（KM）</mu-th>
        </mu-tr>
      </mu-thead>
      <mu-tbody>
        <mu-tr v-for="(station,index) of transList"  :key="index" @click.native="toggleDrawer(index)">
          <mu-td>{{station.loc}}</mu-td>
          <mu-td>{{station.infoW}}</mu-td>
          <mu-td>{{station.infoD}}</mu-td>
          <mu-td>{{station.infoKTS}}</mu-td>
          <mu-td>{{station.infoGust}}</mu-td>
          <mu-td>{{station.infoWave}}</mu-td>
          <mu-td>{{station.infoV}}</mu-td>
        </mu-tr>
      </mu-tbody>
    </mu-table>
    <mu-drawer right :open="open" @close="toggle()" :docked="false" width="30%">
    <mu-appbar :title="stationID.get(selectedCode[0])"></mu-appbar>
    <mu-list>
      <mu-list-item title="天气现象" :disableRipple="true">
        <mu-select-field :maxHeight="300" v-model="selectedCode[4]"
        hintText="天气1" :underlineShow="true" :fullWidth="false" :autoWidth="true">
          <mu-menu-item v-for="x of wCodeList" :key="x[0]" :value="x[0]" :title="x[1].cn"></mu-menu-item>
        </mu-select-field>
        <mu-select-field :fullWidth="false" :maxHeight="300" v-model="selectedCode[9]"
        hintText="天气2" :underlineShow="true" :autoWidth="true" >
          <mu-menu-item v-for="x of wCodeList" :key="x[0]" :value="x[0]" :title="x[1].cn"></mu-menu-item>
        </mu-select-field>
      </mu-list-item>
      <mu-list-item title="风向" :disableRipple="true">
        <mu-select-field :maxHeight="300" v-model="selectedCode[5]"
        hintText="风向1" :underlineShow="true" :fullWidth="false">
          <mu-menu-item v-for="x of wDirList" :key="x[0]" :value="x[0]" :title="x[1].cn"></mu-menu-item>
        </mu-select-field>
        <mu-select-field :fullWidth="false" :maxHeight="300" v-model="selectedCode[10]"
        hintText="风向2" :underlineShow="true" :autoWidth="true" >
          <mu-menu-item v-for="x of wDirList" :key="x[0]" :value="x[0]" :title="x[1].cn"></mu-menu-item>
        </mu-select-field>
      </mu-list-item>
      <mu-list-item title="风速">
        <mu-select-field :maxHeight="300" v-model="selectedCode[6]"
        hintText="风速1" :underlineShow="true" :fullWidth="false">
          <mu-menu-item v-for="x of wScaleList" :key="x[0]" :value="x[0]" :title="x[1].cn"></mu-menu-item>
        </mu-select-field>
        <mu-select-field :fullWidth="false" :maxHeight="300" v-model="selectedCode[11]"
        hintText="风速2" :underlineShow="true" :autoWidth="true" >
          <mu-menu-item v-for="x of wScaleList" :key="x[0]" :value="x[0]" :title="x[1].cn"></mu-menu-item>
        </mu-select-field>
      </mu-list-item>
      <!--
      <mu-list-item title="能见度" :disableRipple="true">
        <mu-text-field hintText="能见度1" type="number" v-model="selectedCode[7]"></mu-text-field>
        <mu-text-field hintText="能见度2" type="number" v-model="selectedCode[8]"></mu-text-field>
      </mu-list-item>
      -->
      <mu-list-item @click.native="open = false" title="关闭"></mu-list-item>
    </mu-list>
  </mu-drawer>
  </div>
</template>

<script>
import { stationID, wCode, wDir, wScale, selectedID } from '../util.js';

function canItMap(item, map, defaultV){
  const hasKey = map.has(item);
  return hasKey? [item, true] : [defaultV, false];
}
// TODO,默认配置写入config
let emptyCode = [[ "02001", 119.7, 38.7,0,99,998,0,10,20,99,998,0],
  [ "02002", 121.33, 38.12,0,99,998,0,10,20,99,998,0],
  [ "02003", 123.27, 38.62,0,99,998,0,10,20,99,998,0],
  [ "02004", 123.7, 36.3,0,99,998,0,10,20,99,998,0],
  [ "02005", 123.5, 33.7,0,99,998,0,10,20,99,998,0],
  [ "02006", 125.77, 30.78,0,99,998,0,10,20,99,998,0],
  [ "02007", 123.75, 26.93,0,99,998,0,10,20,99,998,0],
  [ "020072", 123.75, 26.93,0,99,998,0,10,20,99,998,0],
  [ "02009", 122.62, 23.47,0,99,998,0,10,20,99,998,0],
  [ "03005", 128, 24,0,99,998,0,10,20,99,998,0],
  [ "030052", 128, 24,0,99,998,0,10,20,99,998,0],
  [ "020062", 125.77, 30.78,0,99,998,0,10,20,99,998,0],
  [ "03003", 129.3, 34.5,0,99,998,0,10,20,99,998,0]];

export default {
  name: 'fcList',
  props: {
      'fcTime':String,
      'oriCode': Array,
    },
  data(){
    let selectDate = this.formatDate();

    return {
      stationID,
      wCode,
      wDir,
      wScale,
      open:false,
      selectedIndex:0,
      selectedCode:this.length?this.fcCode[0]:["03005", 128, 24, 0, 12, 45, 6, 1, 3, 10, 45, 5],
      selectDate,
      sTime:'',
      eTime:'',
      fcCode:this.transOri2Fc(),

    }
  },
  computed:{

    transList:function(){
      if(!this.fcCode) return ({});
      function initStatus(){
        return {status:true, childstatus:[true, true]}
      }

      const isAllTrue = (a, b)=> a && b;

      let list = this.fcCode.map(item=>{
        let errorCollector = {
          wCode: initStatus(),
          wDir: initStatus(),
          wScale: initStatus(),
          stationID: {status:true},
        };

        // 判断key是否正确

         [item[4], errorCollector.wCode.childstatus[0]] =
        canItMap(item[4], this.wCode, 99);

        [item[9], errorCollector.wCode.childstatus[1]] =
        canItMap(item[9], this.wCode, 99);

        [item[5], errorCollector.wDir.childstatus[0]] =
        canItMap(item[5], this.wDir, 998);
        [item[10], errorCollector.wDir.childstatus[1]] =
        canItMap(item[10], this.wDir, 998);

        [item[6], errorCollector.wScale.childstatus[0]] =
        canItMap(item[6], this.wScale, 0);
        [item[11], errorCollector.wScale.childstatus[1]] =
        canItMap(item[11], this.wScale, 0);

        errorCollector.wCode.status = isAllTrue(...errorCollector.wCode.childstatus);
        errorCollector.wDir.status = isAllTrue(...errorCollector.wDir.childstatus);
        errorCollector.wScale.status = isAllTrue(...errorCollector.wScale.childstatus);
        // [item[0], errorCollector.stationID.status] =
        // canItMap(item[0], this.stationID, "999999");
        // TODO 错误时提示警告

        item[7] = Math.min(this.wCode.get(item[4]).v1,this.wCode.get(item[9]).v1);
        item[8] = Math.max(this.wCode.get(item[4]).v2,this.wCode.get(item[9]).v2);
        let infoW = item[4]===item[9]?this.wCode.get(item[4]).cn:this.wCode.get(item[4]).cn+'转'+this.wCode.get(item[9]).cn;
        let infoD = item[5]===item[10]?this.wDir.get(item[5]).cn:this.wDir.get(item[5]).cn+'转'+this.wDir.get(item[10]).cn;
        //一旦有不在范围内的item数值，将会抛出错误
        let infoV = item[7]===item[8]?item[7]:item[7]+'-'+item[8];
        let infoKTS = item[6]===item[11]?this.wScale.get(item[6]).KTS:this.wScale.get(item[6]).KTS+'转'+this.wScale.get(item[11]).KTS;
        let infoGust = item[6]===item[11]?this.wScale.get(item[6]).gust:this.wScale.get(item[6]).gust+'转'+this.wScale.get(item[11]).gust;
        let infoWave = item[6]===item[11]?this.wScale.get(item[6]).wave:this.wScale.get(item[6]).wave+'转'+this.wScale.get(item[11]).wave;
        return {
          SID:item[0],
          loc:this.stationID.get(item[0]),
          lon:item[1],
          lat:item[2],
          w1:this.wCode.get(item[4]),
          d1:this.wDir.get(item[5]),
          s1:this.wScale.get(item[6]),
          v1:item[7],
          v2:item[8],
          w2:this.wCode.get(item[9]),
          d2:this.wDir.get(item[10]),
          s2:this.wScale.get(item[11]),
          infoW,
          infoD,
          infoV,
          infoKTS,
          infoGust,
          infoWave,
        }
      });
        return list;
    },
    wCodeList(){
      return new Array(...this.wCode.entries());
    },
    wDirList(){
      return new Array(...this.wDir.entries());
    },
    wScaleList(){
      return new Array(...this.wScale.entries())
    },
    selectedData(){
      if(!this.selectedCode) return ({});
      console.log('test');
      let item = this.selectedCode;
      let infoW = item[4]===item[9]?this.wCode.get(item[4]).cn:this.wCode.get(item[4]).cn+'转'+this.wCode.get(item[9]).cn;
      let infoD = item[5]===item[10]?this.wDir.get(item[5]).cn:this.wDir.get(item[5]).cn+'转'+this.wDir.get(item[10]).cn;
        //一旦有不在范围内的item数值，将会抛出错误
      let infoV = item[7]===item[8]?item[7]:item[7]+'-'+item[8];
      let fcItem = {
          SID:item[0],
          loc:this.stationID.get(item[0]),
          lon:item[1],
          lat:item[2],
          w1:this.wCode.get(item[4]),
          d1:this.wDir.get(item[5]),
          s1:this.wScale.get(item[6]),
          v1:item[7],
          v2:item[8],
          w2:this.wCode.get(item[9]),
          d2:this.wDir.get(item[10]),
          s2:this.wScale.get(item[11]),
          infoW,
          infoD,
          infoV,
      };
      //this.popUpData();
      return fcItem;
    },

    startTime(){
      /* 转换时间fcTime */
      let fcTimeArray = [];
      let localTimeStart = null;
      let localTimeEnd = null;
      let fcTime = this.fcTime;
      //console.log(fcTime);
      let timeFormat = ['',''];
      if(fcTime.length>16){
        fcTimeArray = [fcTime.slice(0,4),fcTime.slice(4,6),fcTime.slice(6,8),fcTime.slice(8,10),fcTime.slice(13,15)]
                      .map(v=>Number(v));//年，月，日，世界时，预报时效
        //console.log(fcTimeArray);
        localTimeStart = new Date(fcTimeArray[0], fcTimeArray[1] - 1,
                    fcTimeArray[2], fcTimeArray[3] + fcTimeArray[4] - 24 + 8);
        localTimeEnd = new Date(fcTimeArray[0], fcTimeArray[1] - 1,
                    fcTimeArray[2], fcTimeArray[3] + fcTimeArray[4] + 8);
        timeFormat = [localTimeStart,localTimeEnd].map(time=>{
          let year = time.getFullYear();
          let month = time.getMonth()+1;
          let date = (Array(2).join('0') + time.getDate()).slice(-2);
          let hour = (Array(2).join('0') + time.getHours()).slice(-2);
          return year + '年' + month + '月' + date + '日' + hour + '时';
        });
      }
      return timeFormat;
    },
    timeFormat(){
      return `${this.sTime}${this.selectDate[0][1]}时至${this.eTime}${this.selectDate[1][1]}时`;
    },
  },//computed end
  methods: {
    toggle () {
      this.open = !this.open
    },
    toggleDrawer (index) {
      this.selectedIndex = index;
      this.selectedCode = this.fcCode[index];
      this.open = !this.open;
    },
    formatDate(){
      let fcTimeArray = [];
      let localTimeStart = null;
      let localTimeEnd = null;
      let fcTime = this.fcTime;
      //console.log(fcTime);
      let timeFormat = ['',''];
      if(fcTime.length>16){
        fcTimeArray = [fcTime.slice(0,4),fcTime.slice(4,6),fcTime.slice(6,8),fcTime.slice(8,10),fcTime.slice(13,15)]
                      .map(v=>Number(v));//年，月，日，世界时，预报时效
        //console.log(fcTimeArray);
        localTimeStart = new Date(fcTimeArray[0], fcTimeArray[1] - 1,
                    fcTimeArray[2], fcTimeArray[3] + fcTimeArray[4] - 24 + 8);
        localTimeEnd = new Date(fcTimeArray[0], fcTimeArray[1] - 1,
                    fcTimeArray[2], fcTimeArray[3] + fcTimeArray[4] + 8);
        timeFormat = [localTimeStart,localTimeEnd].map(time=>{
          let year = time.getFullYear();
          let month = (Array(2).join('0') + (time.getMonth()+1)).slice(-2);
          let date = (Array(2).join('0') + time.getDate()).slice(-2);
          let hour = (Array(2).join('0') + time.getHours()).slice(-2);
          return [year + '年' + month + '月' + date+'日',hour ];
        });
      }
      return timeFormat;
      //return [localTimeStart,localTimeEnd];
    },
    transOri2Fc(){
//let code = Array.from(this.oriCode);
      if(this.oriCode.length==0) return emptyCode.concat([]);
      let selectedCode = selectedID.reduce((a,v)=>{
        let item = this.oriCode.find(i=>{
            return i[0] == v[1];
        });
        if(item){
          item = item.concat([]);// concat深复制，防止引用。
          item[0] = v[0];

        }else{
          item = emptyCode.find(i=>{// 缺失数据则返回空数据集
            return i[0] == v[0];
          })
          item = item.concat([]);// concat深复制，防止引用。
        }
        a.push(item);

        return a;
      },[]);
      return selectedCode;
    },
  },//methods结束
  watch:{
    fcTime(){
      this.selectDate = this.formatDate();
    },
     selectDate(){
      this.sTime = this.selectDate[0][0];
      this.eTime = this.selectDate[1][0];
    },
    oriCode(){
      // console.log('test');
      this.fcCode = this.transOri2Fc();
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.mu-text-field{
  margin-bottom:0px;
  max-width:50%;
}
.mu-td{
  font-size:16px;
}

.forcaster-time{
  text-align: center;
}

.list-date-picker{
  width:120px;
}
.list-hour{
  width:30px;
  vertical-align:middle;
}

.list-date-picker{
    position: relative;
    top:8px;
    margin-left: 4px;
  }
  .list-hour{
    position: relative;
    top:4px;
    margin-left: 4px;
  }
  .list-hour .mu-text-field-input{
    color:#7E57C2;
  }
</style>
