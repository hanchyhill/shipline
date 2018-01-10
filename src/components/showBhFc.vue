<template>
<div>
  <mu-raised-button label="12121页面(延迟10分钟)" secondary target="_blank" rel="noopener noreferrer"
  href="http://10.12.12.221:8080/special/fcst/show_bh.htm"></mu-raised-button>
  <!--
  <mu-raised-button label="图1" secondary target="_blank" rel="noopener noreferrer"
  href="http://10.12.12.221:8080/special/Fcst/bhnewyb.htm#"></mu-raised-button>
  <mu-raised-button label="图2" secondary target="_blank" rel="noopener noreferrer"
  href="http://www.gd12121.com/specht/seaareaprediction/load.do"></mu-raised-button>
  -->
  <mu-raised-button label="海洋共享" secondary target="_blank" rel="noopener noreferrer"
  href="http://10.1.64.146/sea/seaReport/report/ocean/index.jsp?class_id=030201"></mu-raised-button>
  <iframe class="show-iframe" :src="url">test</iframe>
</div>
</template>

<script>
export default {
  name: 'bhFc',
  data () {
    return {
      url:'/api/getNorthLineFc',
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.show-iframe{
  width:100%;
  height:850px;
}
</style>
