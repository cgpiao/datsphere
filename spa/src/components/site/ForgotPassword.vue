<template>
   <div class="flex flex-col items-center">
      <div style="width: 650px;">
         <h1 class="text-primary w-full flex justify-center mt-xxl">
            Forgot your password?
         </h1>
         <hr class="mt-md"/>
         <span class="mt-md flex-row justify-center" style="color: #777777;">
            Enter your account email, we'll send you a link to reset your password
         </span>
         <el-form :model="ruleForm" :rules="rules" ref="formRef" label-width="150px"
                  class="demo-ruleForm mt-xl">
            <el-form-item label="Email" prop="email">
               <el-input v-model="ruleForm.email">
                  <template #prefix>
                     <i class="el-icon-user"></i>
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
               <el-button type="primary" :round="true" style="width: 100%"
                          @click="()=>onSubmit('formRef')">Send
               </el-button>
            </el-col>
            <el-col :span="4">

            </el-col>
         </el-row>
      </div>
   </div>
</template>

<script>
import {ref, reactive} from "vue";
import agent from "@/agent";

export default {
   name: "ForgotPassword",
   setup() {
      const seconds = ref(0)
      const textSend = ref('Send')
      const key = ref('key')
      const ruleForm = reactive({
         email: process.env.VUE_APP_USERNAME || '',
      })
      const rules = reactive({
         email: [
            {type: 'email', required: true, message: 'Please type your email', trigger: 'submit'},
         ],
      })
      const message = ref()

      return {
         ruleForm,
         rules,
         textSend,
         message,
         seconds,
         key
      }
   },
   data() {
      return {
      }
   },
   methods: {
      onSubmit(formName) {
         this.$refs[formName].validate((valid) => {
            if (!valid)
               return
            let params = {
               username: this.ruleForm.email,
            }
            agent.account.forgotPassword(params).then(() => {
               this.$alert(`<div>We've sent an email to ${params.username}.</div><div>If you don't see the email, check other places it might be, like your junk, spam, social, or other folders.</div>`, 'Check your email', {
                  dangerouslyUseHTMLString: true
               });
            }).catch(error => {
               this.message = error.request.response
            })
         })
      },

   }
}
</script>

<style scoped lang="scss">
.form-panel {
   display: flex;
   flex-direction: column;
   align-items: center;
   position: relative;

   .register-form {
      width: 700px;
      top: calc(20%);
      position: absolute;
      border: 1px solid #ddd;
      padding: 1rem;
   }
}
</style>
