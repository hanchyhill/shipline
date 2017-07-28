<template>
   <mu-dialog :open="isShow" title="发布成功">
    点击查看：
    <div>
      12121地址:<a href="http://10.12.12.221:8080/special/Fcst/bh.html" target="_blank" rel="noopener noreferrer">发布地址</a>
    </div>
    <br>
    <div>
      本地地址firefox, chrome, edge:<mu-text-field fullWidth v-model="localURL"/>
      <a :href="localURL2">发布地址</a>
    </div>
    <div>
      本地地址IE:<mu-text-field fullWidth v-model="localURL2"/>
    </div>
    
    <mu-flat-button slot="actions" primary @click="changeShow(false)" label="确定"></mu-flat-button>
    </mu-dialog>

</template>
<script>
// http://10.12.12.221:8080/special/Fcst/bh.html
export default {
  name: 'postFcDialog',
  props: {
      'triggerDialog': Boolean,
    },
  data () {
    
    return {
      isShow:false,
      localURL:'file://///10.148.16.32/e/special/gdjz/node/bhx.html',
      localURL2:'file://localhost/\\\\10.148.16.32\\e\\special\\gdjz\\bh.html',
    }
  },
  watch:{
    triggerDialog(){
      this.isShow = !this.isShow;
    },
  },
  methods:{
    changeShow(show){
      this.isShow = show;
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

