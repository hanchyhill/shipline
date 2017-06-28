<template>
  <div class="hello">
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
        <mu-tr v-for="station,index in fcCode"  :key="index">
          <mu-td>{{stationID.get(station[0])}}</mu-td>
          <mu-td>
          <mu-select-field :maxHeight="300" v-model="station[4]"
            hintText="天气1" :underlineShow="true" :fullWidth="false" :autoWidth="true">
              <mu-menu-item v-for="x of wCodeList" :key="x[0]" :value="x[0]" :title="x[1].cn" />
            </mu-select-field>
            <mu-select-field :fullWidth="false" :maxHeight="300" v-model="station[9]"  
            hintText="天气2" :underlineShow="true" :autoWidth="true">
              <mu-menu-item v-for="x of wCodeList" :key="x[0]" :value="x[0]" :title="x[1].cn" />
            </mu-select-field>
          </mu-td>
          <mu-td>
          <mu-select-field :maxHeight="300" v-model="station[5]"
            hintText="风向1" :underlineShow="true" :fullWidth="false" :autoWidth="true">
              <mu-menu-item v-for="x of wDirList" :key="x[0]" :value="x[0]" :title="x[1].cn" />
            </mu-select-field>
            <mu-select-field :fullWidth="false" :maxHeight="300" v-model="station[10]"  
            hintText="风向2" :underlineShow="true" :autoWidth="true">
              <mu-menu-item v-for="x of wDirList" :key="x[0]" :value="x[0]" :title="x[1].cn" />
            </mu-select-field>
          </mu-td>
          <mu-td>风速(KTS)</mu-td>
          <mu-td>阵风(KTS)</mu-td>
          <mu-td>浪高(M)</mu-td>
          <mu-td>
            <mu-text-field v-model="station[7]" hintText="能见度1"/>
            <mu-text-field v-model="station[8]" hintText="能见度2"/>
          </mu-td>
        </mu-tr>
      </mu-tbody>
    </mu-table>
  </div>
</template>

<script>
import { stationID, wCode, wDir, wScale } from '../util.js';
export default {
  name: 'fcList',
  props: {
      'fcCode': Array,
    },
  data () {
    return {
      stationID,
      wCode,
      wDir,
      wScale,
    }
  },
  computed:{
    transList:function(){
      //console.log(this.stationID.get("03021"));
      if(!this.text) return ({});
      let list = this.text.map(item=>{
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
        }
      });
      return list;
    },
    wCodeList(){
      return new Array(...this.wCode.entries());
    },
    wDirList(){
      return new Array(...this.wDir.entries());
    }

  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.mu-text-field{
  margin-bottom:0px;
  width:50% !important;
}

</style>
