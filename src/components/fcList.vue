<template>
  <div class="hello">
    <div id="forcaster-time">时效: {{timeFormat}}</div>
    <mu-table :showCheckbox="false">
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
      <mu-list-item title="能见度" :disableRipple="true">
        <mu-text-field hintText="能见度1" type="number" v-model="selectedCode[7]"></mu-text-field>
        <mu-text-field hintText="能见度2" type="number" v-model="selectedCode[8]"></mu-text-field>
      </mu-list-item>
      <mu-list-item @click.native="open = false" title="关闭"></mu-list-item>
    </mu-list>
  </mu-drawer>
  </div>
</template>

<script>
import { stationID, wCode, wDir, wScale } from '../util.js';
export default {
  name: 'fcList',
  props: {
      'fcTime':String,
      'fcCode': Array,
    },
  data () {
//20170606120002400
    //console.log(this.fcCode);
    
    
    
    return {
      stationID,
      wCode,
      wDir,
      wScale,
      open:false,
      selectedIndex:0,
      selectedCode:this.length?this.fcCode[0]:["03005", 128, 24, 0, 12, 45, 6, 1, 3, 10, 45, 5],
      //localTimeStart,
      //localTimeEnd,
    }
  },
  computed:{
    transList:function(){
      //console.log(this.stationID.get("03021"));
      if(!this.fcCode) return ({});
      let list = this.fcCode.map(item=>{
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
      //console.log(JSON.stringify(list));
      //this.popUpData();
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
        })
      }
      return timeFormat;
    },
    timeFormat(){
      return this.startTime[0] + '至' + this.startTime[1]
    },
  },//computed
  methods: {
    toggle () {
      this.open = !this.open
    },
    toggleDrawer (index) {     
      this.selectedIndex = index;
      this.selectedCode = this.fcCode[index];
      //console.log(this.fcCode[index]);
      this.open = !this.open;
    },
    /*popUpData(){
      console.log('watch');
      this.$emit('popUpData', 'test');
    },*/
  },//methods结束
  watch:{
    /*transList:{
      deep:true,
      handler:function(){
      //console.log('watch');
      this.popUpData();
      //bus.$emit('id-selected', 1);
      }
    },*/
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

#forcaster-time{
  text-align: center;
}
</style>
