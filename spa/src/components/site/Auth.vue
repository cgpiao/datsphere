<template>
   <el-tabs v-model="activeTab" type="card">
      <el-tab-pane label="Sign in" name="login">
         <Login />
      </el-tab-pane>
      <el-tab-pane label="Sign up" name="register">
         <Register />
      </el-tab-pane>
   </el-tabs>
</template>

<script>
import Login from "@/components/site/Login";
import Register from "@/components/site/Register";
import {ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {LS_TOKEN} from "@/constants";
export default {
   name: "Auth",
   components: {Register, Login},
   setup() {
      const router = useRouter()
      let activeTab = ref('login')
      let route = useRoute()
      activeTab.value = route.name

      if (localStorage.getItem(LS_TOKEN)) {
         router.replace({name: 'drive'})
      }
      return {
         activeTab
      }
   }
}
</script>

<style scoped>

</style>
