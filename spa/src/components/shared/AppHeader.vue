<template>
   <div class="flex-row justify-between" :style="{height: appHeaderHeight+'px'}">
      <router-link :to="{name: 'drive'}">
         <img src="../../assets/images/logo.png" style="width: 32px"/>
      </router-link>
      <div class="flex-row">
         <router-link :to="{name: 'trash'}">
            <i class="el-icon-delete"></i>
         </router-link>
         <el-dropdown>
            <span class="el-dropdown-link">
            下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <template #dropdown>
               <el-dropdown-menu>
                  <el-dropdown-item>黄金糕</el-dropdown-item>
                  <el-dropdown-item>狮子头</el-dropdown-item>
                  <el-dropdown-item>螺蛳粉</el-dropdown-item>
                  <el-dropdown-item disabled>双皮奶</el-dropdown-item>
                  <el-dropdown-item divided>蚵仔煎</el-dropdown-item>
               </el-dropdown-menu>
            </template>
         </el-dropdown>
      </div>
   </div>
</template>

<script>
import AppMixin from "@/AppMixin";

export default {
   name: "AppHeader",
   mixins: [AppMixin]
}
</script>

<style scoped>

</style>
