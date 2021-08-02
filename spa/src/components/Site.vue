<template>
   <el-container class="h-screen" direction="vertical" style="max-width: 960px; margin: 0 auto;">
      <TheHeader/>
      <div class="flex-1">
         <router-view/>
      </div>

      <TheFooter/>
   </el-container>
</template>

<script>
import {ref} from 'vue'
import TheHeader from "@/components/shared/TheHeader";
import TheFooter from "@/components/shared/TheFooter";
import {LS_TOKEN} from "@/constants";

export default {
   name: 'Site',

   components: {
      TheFooter,
      TheHeader
   },

   setup() {
      if (localStorage.getItem(LS_TOKEN)) {
         //
      }
      return {
         leftDrawerOpen: ref(false)
      }
   }
}
</script>
