<template>
 <div  class="header" title="北航线海洋气象预报">
  <span>
    <mu-icon-button icon="menu" iconClass="menu-botton" @click="toggle()"/>
    <div class="logo">
        北航线海洋气象预报
    </div>
    <div class="head-nav">
        <mu-tabs :value="activeTab" @change="handleTabChange" class="tab">
          <mu-tab title="预报制作" value="createfc"/>
          <mu-tab title="预报查看" value="showfc"/>
        </mu-tabs>
      </div>
    </span>
    <mu-drawer :open="isLeftOpen" :docked="docked" @close="toggle()">
      <mu-list @itemClick="docked ? '' : toggle()">
        <mu-list-item title="本地解析文件" @click.native="emitLocalResolve">
          <mu-icon slot="left" value="import_export" />
        </mu-list-item>
        <mu-list-item title="wiki帮助" target="_blank" href="http://wiki.gdmo.gq/index.php?title=%E5%8C%97%E8%88%AA%E7%BA%BF%E6%B5%B7%E6%B4%8B%E6%B0%94%E8%B1%A1%E9%A2%84%E6%8A%A5%E5%8F%91%E5%B8%83%E7%B3%BB%E7%BB%9F">
          <mu-icon slot="left" value="help" />
        </mu-list-item>
        <mu-list-item title="代码仓库" target="_blank" href="https://github.com/hanchyhill/shipline">
          <mu-icon slot="left" value="store"/>
        </mu-list-item>
        <mu-list-item title="错误回报" target="_blank" href="http://bug.gdmo.gq/">
          <mu-icon slot="left" value="bug_report"/>
        </mu-list-item>
        <mu-list-item title="相关页面" toggleNested>
          <mu-icon slot="left" value="inbox"/>
          <mu-list-item slot="nested" title="12121" target="_blank" href="http://10.12.12.221:8080/special/fcst/show_bh.htm">
            <mu-icon slot="left" value="grade"/>
          </mu-list-item>
          <mu-list-item slot="nested" title="海洋共享" toggleNested>
            <mu-icon slot="left" value="inbox"/>
            <mu-list-item title="近海" slot="nested" target="_blank" href="http://10.1.64.146/sea/seaReport/report/ocean/index.jsp?class_id=030201">
              <mu-icon slot="left" value="link"/>
            </mu-list-item>
            <mu-list-item title="远海" slot="nested" target="_blank" href="http://10.1.64.146/sea/seaReport/report/opensea/index.jsp?class_id=030301">
              <mu-icon slot="left" value="link"/>
            </mu-list-item>
          </mu-list-item>
        </mu-list-item>
        <mu-list-item @click.native="isLeftOpen = false" title="Close">
          <mu-icon slot="left" value="close"/>
        </mu-list-item>
      </mu-list>
    </mu-drawer>
 </div>
</template>

<script>
export default {
  name: 'mainHeader',
  data () {
    // console.log(this.$route.name);
    return {
      activeTab:this.$route.name,
      isLeftOpen:false,
      docked:true,
    }
  }, // data end
  methods:{
    handleTabChange(value){
      this.activeTab = value;
      this.$router.push(value);
    },
    toggle (flag) {
      this.isLeftOpen = !this.isLeftOpen;
    },
    emitLocalResolve(){
      this.$emit('emitInfo');
      this.isLeftOpen = false;
    }
  }, // methods end
  watch: {
    '$route' (to, from) {
       // console.log(this.$route.name);
      if(this.$route.name!==this.activeTab) this.activeTab = this.$route.name;
       // 对路由变化作出响应...
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.header{
  background-color: #7e57c2;
}

.logo{
  font-size: 24px;
  color: white;
  display: inline-block;
  padding: 10px 20px;
}

.head-nav{
  display: inline-block;
  width: 20%;
  min-width:350px;
  margin: 0 auto;
}

.tab{
  margin: 0 auto;
  width: 400px;
  background-color: rgba(0, 0, 0, 0);
}

</style>
