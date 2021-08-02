<template>
   <div class="flex flex-col items-center">
      <div style="width: 650px;">
         <h1 class="text-primary w-full flex justify-center mt-xxl">
            Change your password
         </h1>
         <el-form :model="ruleForm" :rules="rules" ref="formRef" label-width="150px"
                  class="demo-ruleForm mt-xl">
            <el-form-item label="Password" prop="password">
               <el-input v-model="ruleForm.password">
               </el-input>
            </el-form-item>
            <el-form-item label="Password Confirmation" prop="passwordConfirmation">
               <el-input v-model="ruleForm.passwordConfirmation">
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
                          @click="()=>onSubmit('formRef')">Change
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
import { ElMessageBox} from 'element-plus';
import {LS_TOKEN} from "@/constants";

export default {
   name: "ResetPassword",
   setup() {
      const seconds = ref(0)
      const textSend = ref('Send')
      const key = ref('key')
      const ruleForm = reactive({
         password: '',
         passwordConfirmation: '',
      })
      const rules = reactive({
         password: [
            {
               required: true, message: 'Please type 8-50 characters', min: 8, max: 50, trigger: 'submit'
            },
         ],
         passwordConfirmation: [
            {
               trigger: 'submit', validator(_, value) {
                  const errors = [];
                  if (value !== ruleForm.password) {
                     errors.push('The password confirmation does not match.')
                  }
                  return errors;
               },
            },
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
               token: this.$route.query.id,
               password: this.ruleForm.password
            }
            agent.account.resetPassword(params).then(resp => {
               ElMessageBox.alert('You have successfully reset the password for your account and are signed in.', 'Success', {
                  confirmButtonText: 'OK',
                  callback: () => {
                     localStorage.setItem(LS_TOKEN, resp.data)
                     this.$router.replace({name: 'drive'})
                  },
               });
            })
         })
      },
   },
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
