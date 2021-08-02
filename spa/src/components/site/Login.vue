<template>
   <div class="flex flex-col items-center">
      <div style="width: 650px;">
         <h1 class="text-primary w-full flex justify-center mt-xxl">
            Sign in
         </h1>
         <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px"
                  class="demo-ruleForm">
            <el-form-item label="Email" prop="email">
               <el-input v-model="ruleForm.username">
                  <template #prefix>
                     <i class="el-icon-user-solid"></i>
                  </template>
               </el-input>
            </el-form-item>
            <el-form-item label="Password" prop="password">
               <el-input v-model="ruleForm.password" type="password" show-password>
                  <template #prefix>
                     <i class="el-icon-lock"></i>
                  </template>
               </el-input>
            </el-form-item>
         </el-form>
         <el-row style="height: 2rem">
            <el-col :span="24" class="text-danger flex justify-center items-center"
                    v-show="message">
               {{ message }}
            </el-col>
         </el-row>
         <el-row class="mt-xl">
            <el-col :span="4">

            </el-col>
            <el-col :span="16">
               <el-button type="primary" :round="true" style="width: 100%" @click="onSubmit">Sign in</el-button>
            </el-col>
            <el-col :span="4">

            </el-col>
         </el-row>
         <el-row class="mt-xl">
            <el-col :span="4">

            </el-col>
            <el-col :span="16">
               <el-link :round="true" style="width: 100%" href="forgot-password">Forgot your password?</el-link>
            </el-col>
            <el-col :span="4">

            </el-col>
         </el-row>
      </div>
   </div>
</template>

<script>
import {ref} from "vue";
import agent from "@/agent";
import {LS_TOKEN} from "@/constants";

export default {
   name: "Login",
   setup() {
      const myForm = ref(null)

      return {
         myForm
      }
   },
   data() {
      return {
         ruleForm: {
            username: process.env.VUE_APP_USERNAME || '',
            password: process.env.VUE_APP_PASSWORD || '',
         },
         rules: {},
         message: null
      }
   },
   methods: {
      async onSubmit() {
         this.message = null
         let resp = await agent.account.login({
            username: this.ruleForm.username,
            password: this.ruleForm.password
         }).catch(error => {
            if (error.response && error.response.status === 400) {
               this.message = error.response.data
            }
         })
         localStorage.setItem(LS_TOKEN, resp.data)
         await this.$router.push({name: 'drive'})
      },
   }
}
</script>

<style lang="scss">
@import "../../assets/styles/customize";

.el-input {
   .el-input__inner {
      outline: none !important;
      border-left: 0 !important;
      border-right: 0 !important;
      border-top: 0 !important;
      border-radius: 0 !important;
      border-bottom: 1px solid $--border-color-base;

      &:focus, &:hover {
         border-bottom: 1px solid $--color-primary;
      }
   }

   i {
      font-size: 1.5em !important;
   }

   &:hover {
      i {
         //color: $--color-primary;
      }
   }
}

.form-panel {
   display: flex;
   flex-direction: column;
   align-items: center;
   position: relative;

   .login-form {
      width: 700px;
      top: calc(20%);
      position: absolute;
      border: 1px solid #ddd;
      padding: 1rem;
   }
}
</style>
