<template>
   <el-row type="flex" class="row-bg items-center" justify="space-between" style="height: 64px">
      <div>
         <router-link :to="{name: 'drive'}">
            <img src="../../assets/images/logo.png" style="width: 32px" alt=""/>
         </router-link>
      </div>
      <div class="flex-row" v-if="isLogin">
         <el-button type="primary" @click.stop="()=>$router.push({name: 'drive'})">Back to Drive</el-button>
      </div>
      <div class="flex-row" v-else>
         <el-link href="sign-in">Sign in</el-link>
         <el-link href="sign-up" class="ml-lg">Sign up</el-link>
      </div>
   </el-row>
</template>

<script>
import {LS_TOKEN} from "@/constants";

export default {
   name: "TheHeader",
   setup() {
      return {
         isLogin: localStorage.getItem(LS_TOKEN)
      }
   }
}
</script>

<style>

</style>
