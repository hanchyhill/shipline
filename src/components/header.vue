<template>
 <div  class="header" title="北航线海洋气象预报">
    <mu-icon-button icon="menu" iconClass="menu-botton"/>
    <div class="logo">
        北航线海洋气象预报
    </div>
    <div class="head-nav">
        <mu-tabs :value="activeTab" @change="handleTabChange" class="tab">
          <mu-tab title="预报制作" value="createfc"/>
          <mu-tab title="预报查看" value="showfc"/>
        </mu-tabs>
      </div>
 </div>
</template>

<script>
export default {
  name: 'mainHeader',
  data () {
    // console.log(this.$route.name);
    return {
      activeTab:this.$route.name,
    }
  }, // data end
  methods:{
    handleTabChange(value){
      this.activeTab = value;
      this.$router.push(value);
    },
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
